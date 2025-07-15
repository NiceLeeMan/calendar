package org.example.calendar.user.exception;

import org.example.calendar.common.exception.BusinessException;

/**
 * 이메일 인증 과정에서 발생하는 예외
 *
 * <h3>발생 상황</h3>
 * <ul>
 *   <li>인증번호가 일치하지 않는 경우</li>
 *   <li>인증번호가 만료된 경우</li>
 *   <li>이메일 전송 실패</li>
 *   <li>이메일 인증이 완료되지 않은 상태에서 회원가입 시도</li>
 * </ul>
 *
 * <p><strong>HTTP 응답:</strong> 400 Bad Request</p>
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
public class EmailVerificationException extends BusinessException {

    public EmailVerificationException() {
        super("이메일 인증에 실패했습니다");
    }

    public EmailVerificationException(String message) {
        super(message);
    }

    public EmailVerificationException(String message, Throwable cause) {
        super(message, cause);
    }
}