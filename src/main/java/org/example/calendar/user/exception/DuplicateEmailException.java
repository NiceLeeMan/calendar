package org.example.calendar.user.exception;

import org.example.calendar.common.exception.BusinessException;

/**
 * 이메일이 중복될 때 발생하는 예외
 *
 * <h3>발생 상황</h3>
 * <ul>
 *   <li>회원가입 시 이미 존재하는 이메일로 가입 시도</li>
 * </ul>
 *
 * <p><strong>HTTP 응답:</strong> 409 Conflict</p>
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
public class DuplicateEmailException extends BusinessException {

  public DuplicateEmailException() {
    super("이미 사용 중인 이메일입니다");
  }

  public DuplicateEmailException(String message) {
    super(message);
  }

  public DuplicateEmailException(String message, Throwable cause) {
    super(message, cause);
  }
}