package org.example.calendar.user.service;

import org.example.calendar.user.exception.EmailVerificationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

/**
 * 이메일 인증 서비스 (Redis 기반)
 *
 * <h3>주요 기능</h3>
 * <ul>
 *   <li>6자리 랜덤 인증번호 생성</li>
 *   <li>Redis에 TTL 5분으로 저장</li>
 *   <li>SMTP를 통한 이메일 전송</li>
 *   <li>인증번호 검증</li>
 * </ul>
 *
 * <h3>Redis Key 패턴</h3>
 * <code>verification:{email}</code> → <code>{6자리숫자}</code>
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
@Service
public class EmailVerificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailVerificationService.class);
    private static final String REDIS_KEY_PREFIX = "verification:";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final RedisTemplate<String, String> redisTemplate;

    private final JavaMailSender mailSender;

    @Value("${app.email.verification.expiration-minutes:3}")
    private int expirationMinutes;

    @Value("${app.email.verification.code-length:4}")
    private int codeLength;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailVerificationService(RedisTemplate<String, String> redisTemplate,
                                    JavaMailSender mailSender) {
        this.redisTemplate = redisTemplate;
        this.mailSender = mailSender;
    }

    /**
     * 이메일 인증번호 발송
     *
     * @param email 인증받을 이메일 주소
     * @return String 생성된 인증번호 (로깅용)
     */
    public String sendVerificationCode(String email) {

        try {
            // 1. 4자리 랜덤 인증번호 생성
            String verificationCode = generateVerificationCode();

            // 2. Redis에 저장 (TTL: 3분)
            String redisKey = REDIS_KEY_PREFIX + email;
            redisTemplate.opsForValue().set(redisKey, verificationCode, expirationMinutes, TimeUnit.MINUTES);

            // 3. 이메일 전송
            sendVerificationEmail(email, verificationCode);

            return verificationCode;

        } catch (Exception e) {
            logger.error("이메일 인증번호 발송 실패: email={}, error={}", email, e.getMessage());
            throw new EmailVerificationException("이메일 전송에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 인증번호 검증
     *
     * @param email 이메일 주소
     * @param inputCode 사용자가 입력한 인증번호
     * @return boolean 인증 성공 여부
     * @throws EmailVerificationException 인증 실패 시
     */
    public boolean verifyCode(String email, String inputCode) {

        // 1. Redis에서 저장된 인증번호 조회
        String redisKey = REDIS_KEY_PREFIX + email;
        String storedCode = redisTemplate.opsForValue().get(redisKey);

        // 2. 인증번호가 없거나 만료된 경우
        if (storedCode == null) {
            logger.warn("인증번호 만료 또는 존재하지 않음: email={}", email);
            throw new EmailVerificationException("인증번호가 만료되었거나 존재하지 않습니다. 다시 요청해주세요.");
        }
        // 3. 인증번호 일치 여부 확인
        if (!storedCode.equals(inputCode)) {
            throw new EmailVerificationException("인증번호가 일치하지 않습니다.");
        }
        // 4. 인증 성공 시 Redis에서 삭제 (일회성)
        redisTemplate.delete(redisKey);

        return true;
    }

    /**
     * 4자리 랜덤 인증번호 생성
     *
     * @return String 6자리 숫자 문자열
     */
    private String generateVerificationCode() {
        int code = RANDOM.nextInt(9000) + 1000; // 1000 ~ 9999
        return String.valueOf(code);
    }

    /**
     * SMTP를 통한 인증 이메일 전송
     *
     * @param toEmail 수신자 이메일
     * @param verificationCode 인증번호
     */
    private void sendVerificationEmail(String toEmail, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setFrom(fromEmail);
        message.setSubject("[Calendar] 이메일 인증번호");
        message.setText(createEmailContent(verificationCode));

        mailSender.send(message);
    }

    /**
     * 인증 이메일 내용 생성
     *
     * @param verificationCode 인증번호
     * @return String 이메일 본문
     */
    private String createEmailContent(String verificationCode) {
        return String.format(
                "Calendar 서비스 이메일 인증\n\n" +
                        "인증번호: %s\n\n" +
                        "이 인증번호는 %d분간 유효합니다.\n" +
                        "본인이 요청하지 않았다면 이 이메일을 무시해주세요.\n\n" +
                        "감사합니다.\n" +
                        "Calendar 팀",
                verificationCode, expirationMinutes
        );
    }

}