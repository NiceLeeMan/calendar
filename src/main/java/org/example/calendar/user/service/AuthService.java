package org.example.calendar.user.service;

import org.example.calendar.user.dto.request.SigninReq;
import org.example.calendar.user.dto.response.UserResponse;
import org.example.calendar.user.entity.User;
import org.example.calendar.user.exception.InvalidPasswordException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.example.calendar.user.exception.UserNotFoundException;
import org.springframework.transaction.annotation.Transactional;

/**
 * 인증 관련 서비스
 *
 * <h3>주요 책임</h3>
 * <ul>
 *   <li>로그인 인증 처리</li>
 *   <li>비밀번호 검증</li>
 *   <li>로그아웃 처리</li>
 * </ul>
 *
 * <h3>로그인 플로우</h3>
 * <ol>
 *   <li>사용자 ID로 사용자 조회</li>
 *   <li>비밀번호 검증</li>
 *   <li>인증 성공 시 사용자 정보 반환</li>
 * </ol>
 *
 * <h3>현재 단계</h3>
 * JWT 토큰 생성은 추후 구현하며, 현재는 순수 인증 로직만 처리
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
@Service
@Transactional(readOnly = true)
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 로그인 인증 처리
     *
     * @param request 로그인 요청 정보
     * @return UserResponse 인증된 사용자 정보 (비밀번호 제외)
     * @throws UserNotFoundException    사용자를 찾을 수 없는 경우
     * @throws InvalidPasswordException 비밀번호가 일치하지 않는 경우
     */
    public UserResponse login(SigninReq request) {
        logger.info("로그인 시도: userId={}", request.getUserId());

        // 1. 사용자 존재 여부 확인 (UserService 위임)
        User user = userService.getUserByUserId(request.getUserId());

        // 2. 비밀번호 검증
        validatePassword(request.getUserPassword(), user.getPassword(), request.getUserId());

        // 3. 로그인 성공 로깅
        logger.info("로그인 성공: userId={}, name={}", user.getUserId(), user.getName());

        // 4. 사용자 정보 반환 (비밀번호 제외)
        return convertToUserResponse(user);
    }

    /**
     * 로그아웃 처리
     *
     * <p>현재는 단순 로깅만 처리</p>
     * <p>추후 JWT 구현 시 토큰 무효화, 블랙리스트 등 확장 예정</p>
     *
     * @param userId 로그아웃할 사용자 ID
     * @return String 로그아웃 완료 메시지
     */
    public String logout(String userId) {
        logger.info("로그아웃 처리: userId={}", userId);

        // TODO: 추후 JWT 구현 시 확장 가능
        // - JWT 토큰 블랙리스트 추가
        // - 리프레시 토큰 무효화
        // - 로그아웃 이력 저장
        // - 다중 디바이스 로그아웃 처리

        logger.info("로그아웃 완료: userId={}", userId);
        return "로그아웃이 완료되었습니다.";
    }

    /**
     * 인증된 사용자 정보 조회 (JWT 토큰에서 사용자 ID 추출 후 사용 예정)
     *
     * @param userId 조회할 사용자 ID
     * @return UserResponse 사용자 정보
     */
    public UserResponse getAuthenticatedUser(String userId) {
        logger.debug("인증된 사용자 정보 조회: userId={}", userId);
        return userService.findByUserId(userId);
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
            logger.warn("비밀번호 불일치: userId={}", userId);
            throw new InvalidPasswordException("비밀번호가 일치하지 않습니다");
        }
        logger.debug("비밀번호 검증 성공: userId={}", userId);
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

    /**
     * 비밀번호 변경 (추후 확장용)
     *
     * @param userId          사용자 ID
     * @param currentPassword 현재 비밀번호
     * @param newPassword     새 비밀번호
     * @return String 성공 메시지
     */
    @Transactional
    public String changePassword(String userId, String currentPassword, String newPassword) {
        logger.info("비밀번호 변경 요청: userId={}", userId);

        // 1. 사용자 조회
        User user = userService.getUserByUserId(userId);

        // 2. 현재 비밀번호 검증
        validatePassword(currentPassword, user.getPassword(), userId);

        // 3. 새 비밀번호 암호화 및 변경
        String encodedNewPassword = passwordEncoder.encode(newPassword);
        user.changePassword(encodedNewPassword);

        logger.info("비밀번호 변경 완료: userId={}", userId);
        return "비밀번호가 성공적으로 변경되었습니다.";
    }
}