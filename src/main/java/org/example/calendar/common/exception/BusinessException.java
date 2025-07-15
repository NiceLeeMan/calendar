package org.example.calendar.common.exception;

/**
 * 비즈니스 로직 예외의 최상위 클래스
 *
 * <h3>목적</h3>
 * 모든 커스텀 비즈니스 예외의 부모 클래스로, 일관된 예외 처리를 위해 사용됩니다.
 *
 * <h3>특징</h3>
 * <ul>
 *   <li>RuntimeException을 상속하여 Unchecked Exception</li>
 *   <li>GlobalExceptionHandler에서 일괄 처리 가능</li>
 *   <li>HTTP 상태코드와 매핑하여 표준화된 응답 제공</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
public class BusinessException extends RuntimeException {

    /**
     * 기본 생성자
     */
    public BusinessException() {
        super();
    }

    /**
     * 메시지를 포함하는 생성자
     *
     * @param message 예외 메시지
     */
    public BusinessException(String message) {
        super(message);
    }

    /**
     * 메시지와 원인을 포함하는 생성자
     *
     * @param message 예외 메시지
     * @param cause 원인 예외
     */
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * 원인만 포함하는 생성자
     *
     * @param cause 원인 예외
     */
    public BusinessException(Throwable cause) {
        super(cause);
    }
}