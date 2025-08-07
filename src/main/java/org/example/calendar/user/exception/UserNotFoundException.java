package org.example.calendar.user.exception;

import org.example.calendar.common.exception.BusinessException;

/**
 * 사용자를 찾을 수 없을 때 발생하는 예외
 *
 * <h3>발생 상황</h3>
 * <ul>
 *   <li>로그인 시 존재하지 않는 사용자 ID로 시도</li>
 *   <li>사용자 정보 조회 시 해당 사용자가 없는 경우</li>
 * </ul>
 *
 * <p><strong>HTTP 응답:</strong> 401 Unauthorized</p>
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
public class UserNotFoundException extends BusinessException {

  public UserNotFoundException(String message) {
    super(message);
  }

}