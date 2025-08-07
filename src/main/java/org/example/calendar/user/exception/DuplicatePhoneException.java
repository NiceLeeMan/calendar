package org.example.calendar.user.exception;

import org.example.calendar.common.exception.BusinessException;

/**
 * 전화번호가 중복될 때 발생하는 예외
 *
 * <h3>발생 상황</h3>
 * <ul>
 *   <li>회원가입 시 이미 존재하는 전화번호로 가입 시도</li>
 * </ul>
 *
 * <p><strong>HTTP 응답:</strong> 409 Conflict</p>
 *
 * @author Calendar Team
 * @since 2025-08-07
 */
public class DuplicatePhoneException extends BusinessException {

  public DuplicatePhoneException(String message) {
    super(message);
  }

}
