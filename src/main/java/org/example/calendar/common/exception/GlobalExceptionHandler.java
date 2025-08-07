package org.example.calendar.common.exception;

import org.example.calendar.common.dto.ErrorResponse;
import org.example.calendar.user.exception.DuplicateEmailException;
import org.example.calendar.user.exception.DuplicateUserIdException;
import org.example.calendar.user.exception.DuplicatePhoneException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 전역 예외 처리기
 *
 * <h3>목적</h3>
 * 애플리케이션에서 발생하는 모든 예외를 일관된 형태로 처리하고,
 * 환경별로 적절한 수준의 에러 정보를 제공합니다.
 *
 * <h3>처리하는 예외 유형</h3>
 * <ul>
 *   <li>404 Not Found - 존재하지 않는 API 경로</li>
 *   <li>400 Bad Request - 유효성 검증 실패</li>
 *   <li>500 Internal Server Error - 서버 내부 오류</li>
 *   <li>커스텀 비즈니스 예외</li>
 * </ul>
 *
 * <h3>환경별 동작</h3>
 * <ul>
 *   <li><strong>개발환경</strong>: 상세한 스택 트레이스 포함</li>
 *   <li><strong>운영환경</strong>: 사용자 친화적인 메시지만 제공</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @Value("${spring.profiles.active:local}")
    private String activeProfile;

    /**
     * 404 Not Found 처리 - 존재하지 않는 API 경로
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoHandlerFound(
            NoHandlerFoundException ex, HttpServletRequest request) {

        logger.warn("404 Not Found: {} {}", ex.getHttpMethod(), ex.getRequestURL());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                request.getRequestURI(),
                "NOT_FOUND"
        );

        // 개발환경에서는 추가 디버그 정보 제공
        if ("local".equals(activeProfile)) {
            errorResponse.setDebugMessage(
                    String.format("HTTP Method: %s, URL: %s",
                            ex.getHttpMethod(), ex.getRequestURL())
            );
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    /**
     * 400 Bad Request 처리 - 유효성 검증 실패
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        logger.warn("Validation failed: {}", ex.getMessage());

        // 유효성 검증 실패 메시지 수집
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> String.format("%s: %s", error.getField(), error.getDefaultMessage()))
                .collect(Collectors.toList());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                request.getRequestURI(),
                "VALIDATION_FAILED",
                errors
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * 500 Internal Server Error 처리 - 서버 내부 오류
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, HttpServletRequest request) {

        logger.error("Unexpected error occurred", ex);

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                request.getRequestURI(),
                "INTERNAL_SERVER_ERROR"
        );

        // 개발환경에서는 상세한 에러 메시지 제공
        if ("local".equals(activeProfile)) {
            errorResponse.setDebugMessage(ex.getMessage());
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    /**
     * DuplicateEmailException 처리 - 이메일 중복
     */
    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateEmailException(
            DuplicateEmailException ex, HttpServletRequest request) {

        logger.warn("Duplicate email: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                request.getRequestURI(),
                "DUPLICATE_EMAIL",
                "email"
        );

        if ("local".equals(activeProfile)) {
            errorResponse.setDebugMessage(ex.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    /**
     * DuplicateUserIdException 처리 - 사용자 ID 중복
     */
    @ExceptionHandler(DuplicateUserIdException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateUserIdException(
            DuplicateUserIdException ex, HttpServletRequest request) {

        logger.warn("Duplicate user ID: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                request.getRequestURI(),
                "DUPLICATE_USER_ID",
                "userId"
        );

        if ("local".equals(activeProfile)) {
            errorResponse.setDebugMessage(ex.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    /**
     * DuplicatePhoneException 처리 - 전화번호 중복
     */
    @ExceptionHandler(DuplicatePhoneException.class)
    public ResponseEntity<ErrorResponse> handleDuplicatePhoneException(
            DuplicatePhoneException ex, HttpServletRequest request) {

        logger.warn("Duplicate phone: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                request.getRequestURI(),
                "DUPLICATE_PHONE",
                "phoneNumber"
        );

        if ("local".equals(activeProfile)) {
            errorResponse.setDebugMessage(ex.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    /**
     * IllegalArgumentException 처리 - 잘못된 인수
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException ex, HttpServletRequest request) {

        logger.warn("Illegal argument: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                request.getRequestURI()
        );

        if ("local".equals(activeProfile)) {
            errorResponse.setDebugMessage(ex.getMessage());
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}