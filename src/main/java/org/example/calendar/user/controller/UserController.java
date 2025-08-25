package org.example.calendar.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.calendar.common.security.CustomUserDetails;
import org.example.calendar.common.security.jwt.JwtProperties;
import org.example.calendar.user.dto.request.SigninReq;
import org.example.calendar.user.dto.request.SignupReq;
import org.example.calendar.user.dto.response.UserResponse;
import org.example.calendar.user.service.AuthService;
import org.example.calendar.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 사용자 관리 API 컨트롤러 (JWT 통합)
 *
 * <h3>실무 기준 JWT 인증 플로우</h3>
 * <ul>
 *   <li>로그인 시: JWT 토큰 생성 → HttpOnly 쿠키 설정</li>
 *   <li>인증 API 호출 시: 쿠키에서 JWT 추출 → 사용자 인증</li>
 *   <li>로그아웃 시: JWT 쿠키 삭제</li>
 * </ul>
 *
 * <h3>보안 고려사항</h3>
 * <ul>
 *   <li>HttpOnly 쿠키: XSS 공격 방어</li>
 *   <li>Secure 쿠키: HTTPS 환경에서만 전송 (운영환경)</li>
 *   <li>SameSite 쿠키: CSRF 공격 방어</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/users")
@Tag(name = "User", description = "사용자 관리 API")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final AuthService authService;
    private final JwtProperties jwtProperties;


    /**
     * 이메일 인증번호 발송 (회원가입 1단계)
     */
    @PostMapping("/send-verification")
    @Operation(
            summary = "이메일 인증번호 발송",
            description = "회원가입을 위한 이메일 인증번호를 발송합니다. 6자리 숫자가 Redis에 5분간 저장됩니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "인증번호 발송 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 이메일 형식"),
            @ApiResponse(responseCode = "409", description = "이미 사용 중인 이메일")
    })
    public ResponseEntity<String> sendVerificationCode(@RequestParam String email) {

        String message = userService.sendVerificationCode(email);
        return ResponseEntity.ok(message);
    }

    /**
     * 이메일 인증번호 확인 (회원가입 2단계)
     */
    @PostMapping("/verify-email")
    @Operation(
            summary = "이메일 인증번호 확인",
            description = "발송된 6자리 인증번호를 확인합니다. 인증 성공 시 회원가입이 가능합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "인증 성공"),
            @ApiResponse(responseCode = "400", description = "인증번호 불일치 또는 만료")
    })
    public ResponseEntity<String> verifyEmailCode(
            @RequestParam String email,
            @RequestParam String code) {

        String message = userService.verifyEmailCode(email, code);
        return ResponseEntity.ok(message);
    }

    /**
     * 회원가입 (회원가입 3단계)
     */
    @PostMapping("/signup")
    @Operation(
            summary = "회원가입",
            description = "이메일 인증 완료 후 새로운 사용자 계정을 생성합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "회원가입 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 입력값"),
            @ApiResponse(responseCode = "409", description = "아이디 또는 이메일 중복")
    })
    public ResponseEntity<UserResponse> signup(@Valid @RequestBody SignupReq request) {

        UserResponse userResponse = userService.signup(request);
        return ResponseEntity.status(201).body(userResponse);
    }

    /**
     * 로그인 (JWT 토큰 발급)
     */
    @PostMapping("/login")
    @Operation(
            summary = "로그인",
            description = "사용자 ID와 비밀번호로 로그인합니다. 성공 시 JWT 토큰이 HttpOnly 쿠키로 설정됩니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그인 성공, JWT 쿠키 설정"),
            @ApiResponse(responseCode = "400", description = "잘못된 입력값"),
            @ApiResponse(responseCode = "401", description = "사용자 ID 또는 비밀번호 불일치")
    })
    public ResponseEntity<UserResponse> login(
            @Valid @RequestBody SigninReq request,
            HttpServletResponse response) {

        // 1. 사용자 인증 및 정보 조회
        UserResponse userResponse = authService.authenticateUser(request);

        // 2. JWT 토큰 생성 (실제 User 엔티티 필요 - AuthService에서 반환)
        String jwtToken = authService.generateJwtToken(request);

        // 3. JWT를 HttpOnly 쿠키로 설정
        Cookie jwtCookie = createJwtCookie(jwtToken);
        response.addCookie(jwtCookie);
        return ResponseEntity.ok(userResponse);
    }

    /**
     * 로그아웃 (JWT 쿠키 삭제)
     */
    @PostMapping("/logout")
    @Operation(
            summary = "로그아웃",
            description = "현재 로그인된 사용자를 로그아웃합니다. JWT 쿠키가 삭제됩니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그아웃 성공, JWT 쿠키 삭제")
    })
    public ResponseEntity<String> logout(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            HttpServletResponse response) {

        String userId = userDetails.getUserId();
        // 1. 서버 측 로그아웃 처리 (필요 시 토큰 블랙리스트 등)
        String message = authService.logoutUser(userId);

        // 2. JWT 쿠키 삭제
        Cookie jwtCookie = clearJwtCookie();
        response.addCookie(jwtCookie);
        return ResponseEntity.ok(message);
    }

    /**
     * 내 정보 조회 (JWT 인증 기반)
     */
    @GetMapping("/me")
    @Operation(
            summary = "내 정보 조회",
            description = "JWT 토큰을 통해 현재 로그인된 사용자의 정보를 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패 (JWT 토큰 없음 또는 만료)"),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음")
    })
    public ResponseEntity<UserResponse> getMyInfo(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        String userId = userDetails.getUserId();
        // JWT에서 추출한 사용자 ID로 정보 조회
        UserResponse userResponse = authService.getUserInfo(userId);
        return ResponseEntity.ok(userResponse);
    }

    /**
     * JWT 쿠키 생성 (실무 보안 기준)
     *
     * @param token JWT 토큰
     * @return 보안이 적용된 쿠키
     */
    private Cookie createJwtCookie(String token) {
        Cookie cookie = new Cookie(jwtProperties.getCookieName(), token);

        // 보안 설정
        cookie.setHttpOnly(true);           // XSS 공격 방어
        cookie.setSecure(false);            // 개발환경: false, 운영환경: true (HTTPS)
        cookie.setPath("/");                // 전체 경로에서 접근 가능
        cookie.setMaxAge(24 * 60 * 60);     // 24시간 (초 단위)

        // SameSite 설정 (CSRF 방어) - 스프링 부트에서는 별도 설정 필요
        // cookie.setSameSite(Cookie.SameSite.STRICT); // Spring Boot 3.0+에서 사용 가능
        return cookie;
    }

    /**
     * JWT 쿠키 삭제
     *
     * @return 삭제용 쿠키 (maxAge=0)
     */
    private Cookie clearJwtCookie() {
        Cookie cookie = new Cookie(jwtProperties.getCookieName(), null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);            // 개발환경: false, 운영환경: true
        cookie.setPath("/");
        cookie.setMaxAge(0);                // 즉시 삭제
        return cookie;
    }
}