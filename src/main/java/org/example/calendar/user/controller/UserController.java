package org.example.calendar.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.calendar.user.dto.request.SigninReq;
import org.example.calendar.user.dto.request.SignupReq;
import org.example.calendar.user.dto.response.UserResponse;
import org.example.calendar.user.service.AuthService;
import org.example.calendar.user.service.EmailVerificationService;
import org.example.calendar.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

/**
 * 사용자 관련 API 컨트롤러
 *
 * <h3>주요 기능</h3>
 * <ul>
 *   <li>이메일 인증번호 발송 (POST /api/users/send-verification)</li>
 *   <li>이메일 인증번호 확인 (POST /api/users/verify-email)</li>
 *   <li>회원가입 (POST /api/users/signup)</li>
 *   <li>로그인 (POST /api/users/login)</li>
 *   <li>로그아웃 (POST /api/users/logout)</li>
 *   <li>내 정보 조회 (GET /api/users/me)</li>
 * </ul>
 *
 * <h3>현재 단계</h3>
 * JWT 토큰 없이 기본 인증 기능만 구현, 추후 JWT + Cookie 확장 예정
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
@RestController
@RequestMapping("/api/users")
//@Tag(name = "User", description = "사용자 관리 API")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final AuthService authService;
//    private final EmailVerificationService emailVerificationService;

    public UserController(UserService userService,
                          AuthService authService
                          ) {
        this.userService = userService;
        this.authService = authService;
//        this.emailVerificationService = emailVerificationService;
    }

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
        logger.info("이메일 인증번호 발송 요청: email={}", email);

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
        logger.info("이메일 인증번호 확인 요청: email={}", email);

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
        logger.info("회원가입 요청: userId={}, email={}", request.getUserId(), request.getUserEmail());

        UserResponse userResponse = userService.signup(request);

        return ResponseEntity.status(201).body(userResponse);
    }

    /**
     * 로그인
     */
    @PostMapping("/login")
    @Operation(
            summary = "로그인",
            description = "사용자 ID와 비밀번호로 로그인합니다. 현재는 사용자 정보만 반환하며, 추후 JWT 쿠키 설정 예정입니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 입력값"),
            @ApiResponse(responseCode = "401", description = "사용자 ID 또는 비밀번호 불일치")
    })
    public ResponseEntity<UserResponse> login(
            @Valid @RequestBody SigninReq request,
            HttpServletResponse response) {
        logger.info("로그인 요청: userId={}", request.getUserId());

        UserResponse userResponse = authService.login(request);

        // TODO: JWT 토큰 생성 및 HttpOnly 쿠키 설정

        return ResponseEntity.ok(userResponse);
    }

    /**
     * 로그아웃
     */
    @PostMapping("/logout")
    @Operation(
            summary = "로그아웃",
            description = "현재 로그인된 사용자를 로그아웃합니다. 추후 JWT 쿠키 삭제 기능이 추가됩니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그아웃 성공")
    })
    public ResponseEntity<String> logout(@RequestParam String userId) {
        logger.info("로그아웃 요청: userId={}", userId);

        String message = authService.logout(userId);

        // TODO: JWT 쿠키 삭제 처리

        return ResponseEntity.ok(message);
    }

    /**
     * 내 정보 조회 (임시 - 추후 JWT에서 사용자 ID 추출)
     */
    @GetMapping("/me")
    @Operation(
            summary = "내 정보 조회",
            description = "현재 로그인된 사용자의 정보를 조회합니다. 현재는 userId 파라미터로 전달하며, 추후 JWT에서 자동 추출 예정입니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음")
    })
    public ResponseEntity<UserResponse> getMyInfo(@RequestParam String userId) {
        logger.info("내 정보 조회 요청: userId={}", userId);

        // TODO: JWT에서 사용자 ID 추출하도록 변경
        UserResponse userResponse = authService.getAuthenticatedUser(userId);

        return ResponseEntity.ok(userResponse);
    }
}