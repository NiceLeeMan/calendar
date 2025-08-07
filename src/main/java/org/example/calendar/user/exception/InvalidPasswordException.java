package org.example.calendar.user.exception;

import org.example.calendar.common.exception.BusinessException;

/**
 * 비밀번호가 일치하지 않을 때 발생하는 예외
 *
 * <h3>발생 상황</h3>
 * <ul>
 *   <li>로그인 시 잘못된 비밀번호 입력</li>
 *   <li>비밀번호 변경 시 현재 비밀번호 불일치</li>
 * </ul>
 *
 * <p><strong>HTTP 응답:</strong> 401 Unauthorized</p>
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
public class InvalidPasswordException extends BusinessException {

    public InvalidPasswordException(String message) {
        super(message);
    }

}