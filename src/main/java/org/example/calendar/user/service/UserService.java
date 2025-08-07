package org.example.calendar.user.service;

import org.example.calendar.user.dto.request.SignupReq;
import org.example.calendar.user.dto.response.UserResponse;
import org.example.calendar.user.entity.User;
import org.example.calendar.user.repository.UserRepository;
import org.example.calendar.user.exception.DuplicateUserIdException;
import org.example.calendar.user.exception.DuplicateEmailException;
import org.example.calendar.user.exception.DuplicatePhoneException;
import org.example.calendar.user.exception.UserNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 사용자 관리 서비스
 *
 * <h3>주요 책임</h3>
 * <ul>
 *   <li>2단계 회원가입 처리 (이메일 인증 → 회원가입)</li>
 *   <li>사용자 정보 조회 및 수정</li>
 *   <li>중복 검증 로직</li>
 *   <li>비밀번호 암호화</li>
 * </ul>
 *
 * <h3>회원가입 플로우</h3>
 * <ol>
 *   <li>이메일 인증번호 발송 (EmailVerificationService)</li>
 *   <li>인증번호 확인 (EmailVerificationService)</li>
 *   <li>회원가입 처리 (UserService.signup)</li>
 * </ol>
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
@Service
@Transactional(readOnly = true)
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       EmailVerificationService emailVerificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationService = emailVerificationService;
    }


    /**
     * 이메일 인증번호 발송 (회원가입 1단계)
     *
     * @param email 인증받을 이메일 주소
     * @return String 성공 메시지
     * @throws DuplicateEmailException 이메일 중복 시
     */
    public String sendVerificationCode(String email) {
        logger.info("이메일 인증번호 발송 요청: email={}", email);

        // 1. 이메일 중복 검증
        validateEmailNotDuplicate(email);

        // 2. 인증번호 발송
        emailVerificationService.sendVerificationCode(email);

        logger.info("이메일 인증번호 발송 완료: email={}", email);
        return "인증번호가 이메일로 발송되었습니다. 5분 이내에 입력해주세요.";
    }

    /**
     * 이메일 인증번호 확인 (회원가입 2단계)
     *
     * @param email 이메일 주소
     * @param verificationCode 인증번호
     * @return String 성공 메시지
     */
    public String verifyEmailCode(String email, String verificationCode) {
        logger.info("이메일 인증번호 확인 요청: email={}", email);

        // 인증번호 검증 (성공 시 Redis에서 자동 삭제)
        emailVerificationService.verifyCode(email, verificationCode);

        logger.info("이메일 인증 완료: email={}", email);
        return "이메일 인증이 완료되었습니다. 이제 회원가입을 진행해주세요.";
    }

    /**
     * 회원가입 처리 (회원가입 3단계)
     *
     * @param req 회원가입 요청 정보
     * @return UserResponse 생성된 사용자 정보 (비밀번호 제외)
     * @throws DuplicateUserIdException 아이디 중복 시
     * @throws DuplicateEmailException 이메일 중복 시
     */
    @Transactional
    public UserResponse signup(SignupReq req) {
        logger.info("회원가입 처리 시작: userId={}, email={}", req.getUserId(), req.getUserEmail());

        // 1. 중복 검증 (이중 체크)
        validateUserIdNotDuplicate(req.getUserId());
        validateEmailNotDuplicate(req.getUserEmail());
        validatePhoneNotDuplicate(req.getUserPhoneNumber());

        // 2. 비밀번호 암호화
        String encodedPassword = encodePassword(req.getUserPassword());

        // 3. 사용자 엔티티 생성
        User user = createUserEntity(req, encodedPassword);

        // 4. 데이터베이스 저장
        User savedUser = userRepository.save(user);

        logger.info("회원가입 완료: userId={}, id={}", savedUser.getUserId(), savedUser.getId());

        // 5. 응답 DTO 변환
        return convertToUserResponse(savedUser);
    }

    /**
     * 사용자 ID로 사용자 조회
     *
     * @param userId 사용자 ID
     * @return UserResponse 사용자 정보
     * @throws UserNotFoundException 사용자를 찾을 수 없는 경우
     */
    public UserResponse findByUserId(String userId) {
        User user = getUserByUserId(userId);
        return convertToUserResponse(user);
    }

    /**
     * 사용자 ID로 User 엔티티 조회 (내부 사용)
     *
     * @param userId 사용자 ID
     * @return User 엔티티
     * @throws UserNotFoundException 사용자를 찾을 수 없는 경우
     */
    User getUserByUserId(String userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다: " + userId));
    }

    // ==================== Private Helper Methods ====================

    /**
     * 사용자 ID 중복 검증
     *
     * @param userId 검증할 사용자 ID
     * @throws DuplicateUserIdException 중복 시 예외 발생
     */
    private void validateUserIdNotDuplicate(String userId) {
        if (userRepository.existsByUserId(userId)) {
            logger.warn("사용자 ID 중복: {}", userId);
            throw new DuplicateUserIdException("이미 사용 중인 아이디입니다: " + userId);
        }
    }

    /**
     * 이메일 중복 검증
     *
     * @param email 검증할 이메일
     * @throws DuplicateEmailException 중복 시 예외 발생
     */
    private void validateEmailNotDuplicate(String email) {
        if (userRepository.existsByEmail(email)) {
            logger.warn("이메일 중복: {}", email);
            throw new DuplicateEmailException("이미 사용 중인 이메일입니다: " + email);
        }
    }

    /**
     * 전화번호 중복 검증
     *
     * @param phoneNumber 검증할 전화번호
     * @throws DuplicatePhoneException 중복 시 예외 발생
     */
    private void validatePhoneNotDuplicate(String phoneNumber) {
        if (userRepository.existsByPhoneNumber(phoneNumber)) {
            logger.warn("전화번호 중복: {}", phoneNumber);
            throw new DuplicatePhoneException("이미 사용 중인 전화번호입니다: " + phoneNumber);
        }
    }

    /**
     * 비밀번호 암호화
     *
     * @param rawPassword 평문 비밀번호
     * @return String 암호화된 비밀번호
     */
    private String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    /**
     * 회원가입 요청으로부터 User 엔티티 생성
     *
     * @param req 회원가입 요청
     * @param encodedPassword 암호화된 비밀번호
     * @return User 엔티티
     */
    private User createUserEntity(SignupReq req, String encodedPassword) {
        return User.builder()
                .name(req.getUserName())
                .userId(req.getUserId())
                .password(encodedPassword)
                .email(req.getUserEmail())
                .phoneNumber(req.getUserPhoneNumber())
                .build();
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