package org.example.calendar.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.calendar.common.security.jwt.JwtTokenProvider;
import org.example.calendar.user.dto.request.SigninReq;
import org.example.calendar.user.dto.response.UserResponse;
import org.example.calendar.user.entity.User;
import org.example.calendar.user.exception.InvalidPasswordException;
import org.example.calendar.user.exception.UserNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 인증 관련 서비스 (JWT 통합)
 *
 * <h3>주요 책임</h3>
 * <ul>
 *   <li>로그인 인증 처리 및 JWT 토큰 생성</li>
 *   <li>비밀번호 검증</li>
 *   <li>로그아웃 처리</li>
 *   <li>JWT 기반 사용자 정보 조회</li>
 * </ul>
 *
 * <h3>실무 기준 인증 플로우</h3>
 * <ol>
 *   <li>사용자 ID로 사용자 조회</li>
 *   <li>비밀번호 검증</li>
 *   <li>JWT 토큰 생성</li>
 *   <li>인증 성공 시 사용자 정보 반환</li>
 * </ol>
 *
 * <h3>JWT 통합 기능</h3>
 * <ul>
 *   <li>로그인 시 JWT 토큰 자동 생성</li>
 *   <li>토큰 기반 사용자 정보 조회</li>
 *   <li>로그아웃 시 토큰 관련 처리 (향후 확장)</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-15
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 로그인 인증 처리 (UserController.login에서 호출)
     *
     * @param request 로그인 요청 정보 (userId, password)
     * @return UserResponse 인증된 사용자 정보 (비밀번호 제외)
     * @throws UserNotFoundException    사용자를 찾을 수 없는 경우
     * @throws InvalidPasswordException 비밀번호가 일치하지 않는 경우
     */
    public UserResponse authenticateUser(SigninReq request) {
        // 1. 사용자 존재 여부 확인 (UserService 위임)
        User user = userService.getUserByUserId(request.getUserId());

        // 2. 비밀번호 검증
        validatePassword(request.getUserPassword(), user.getPassword(), request.getUserId());

        // 4. 사용자 정보 반환 (비밀번호 제외)
        return convertToUserResponse(user);
    }

    /**
     * JWT 토큰 생성 (UserController.login에서 호출)
     *
     * @param request 로그인 요청 정보
     * @return String 생성된 JWT 토큰
     */
    public String generateJwtToken(SigninReq request) {
        // 사용자 정보 조회 (토큰 생성을 위해 필요)
        User user = userService.getUserByUserId(request.getUserId());

        // JWT 토큰 생성
        return jwtTokenProvider.generateToken(user);
    }

    /**
     * 로그아웃 처리 (UserController.logout에서 호출)
     *
     * <p>현재는 단순 로깅 처리, 실제 토큰 무효화는 쿠키 삭제로 처리</p>
     * <p>향후 확장 가능: 토큰 블랙리스트, 리프레시 토큰 무효화 등</p>
     *
     * @param userId 로그아웃할 사용자 ID
     * @return String 로그아웃 완료 메시지
     */
    public String logoutUser(String userId) {
        return "로그아웃이 완료되었습니다.";
    }

    /**
     * JWT 기반 사용자 정보 조회 (UserController.getMyInfo에서 호출)
     *
     * @param userId JWT에서 추출된 사용자 ID
     * @return UserResponse 사용자 정보 (비밀번호 제외)
     * @throws UserNotFoundException 사용자를 찾을 수 없는 경우
     */
    public UserResponse getUserInfo(String userId) {
        // UserService를 통해 사용자 정보 조회
        return userService.findByUserId(userId);
    }

    // ==================== Legacy Methods (기존 호환성) ====================

    /**
     * 레거시 로그인 메서드 (기존 코드 호환성)
     *
     * @deprecated authenticateUser() 사용 권장
     */
    @Deprecated
    public UserResponse signIn(SigninReq request) {
        return authenticateUser(request);
    }

    /**
     * 레거시 로그아웃 메서드 (기존 코드 호환성)
     *
     * @deprecated logoutUser() 사용 권장
     */
    @Deprecated
    public String logout(String userId) {
        return logoutUser(userId);
    }

    /**
     * 레거시 사용자 조회 메서드 (기존 코드 호환성)
     *
     * @deprecated getUserInfo() 사용 권장
     */
    @Deprecated
    public UserResponse getAuthenticatedUser(String userId) {
        return getUserInfo(userId);
    }

    // ==================== Private Helper Methods ====================

    /**
     * 비밀번호 검증
     *
     * @param rawPassword     입력된 평문 비밀번호
     * @param encodedPassword 저장된 암호화된 비밀번호
     * @param userId          로그용 사용자 ID
     * @throws InvalidPasswordException 비밀번호 불일치 시
     */
    private void validatePassword(String rawPassword, String encodedPassword, String userId) {
        if (!passwordEncoder.matches(rawPassword, encodedPassword)) {
            throw new InvalidPasswordException("비밀번호가 일치하지 않습니다");
        }
    }

    /**
     * User 엔티티를 UserResponse DTO로 변환
     *
     * @param user User 엔티티
     * @return UserResponse DTO (비밀번호 제외)
     */
    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setUserName(user.getName());
        response.setUserEmail(user.getEmail());
        response.setUserPhoneNumber(user.getPhoneNumber());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}