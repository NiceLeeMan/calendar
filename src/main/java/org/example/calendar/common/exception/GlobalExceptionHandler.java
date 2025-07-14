package org.example.calendar.common.exception;

import org.example.calendar.common.dto.ErrorResponse;
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
                "요청한 페이지를 찾을 수 없습니다.",
                request.getRequestURI()
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
                "입력값이 올바르지 않습니다.",
                request.getRequestURI(),
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
                "서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
                request.getRequestURI()
        );

        // 개발환경에서는 상세한 에러 메시지 제공
        if ("local".equals(activeProfile)) {
            errorResponse.setDebugMessage(ex.getMessage());
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
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
                "잘못된 요청입니다.",
                request.getRequestURI()
        );

        if ("local".equals(activeProfile)) {
            errorResponse.setDebugMessage(ex.getMessage());
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}