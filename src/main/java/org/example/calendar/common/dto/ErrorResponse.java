package org.example.calendar.common.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 표준화된 에러 응답 DTO
 *
 * <h3>목적</h3>
 * 모든 API 에러를 일관된 형태로 응답하기 위한 표준 응답 객체입니다.
 *
 * <h3>사용 예시</h3>
 * <pre>
 * {
 *   "status": 404,
 *   "message": "요청한 리소스를 찾을 수 없습니다.",
 *   "timestamp": "2025-07-14T12:30:45",
 *   "path": "/api/users/123",
 *   "errors": ["사용자 ID가 존재하지 않습니다."]
 * }
 * </pre>
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    /**
     * HTTP 상태 코드 (예: 400, 404, 500)
     */
    private int status;

    /**
     * 에러 메시지 (사용자에게 표시될 내용)
     */
    private String message;

    /**
     * 에러 발생 시간
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    /**
     * 에러가 발생한 API 경로
     */
    private String path;

    /**
     * 상세 에러 목록 (유효성 검증 실패 시 사용)
     */
    private List<String> errors;

    /**
     * 개발환경에서만 표시되는 상세 정보
     */
    private String debugMessage;

    // 기본 생성자
    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }

    // 기본 에러 응답 생성자
    public ErrorResponse(int status, String message, String path) {
        this();
        this.status = status;
        this.message = message;
        this.path = path;
    }

    // 상세 에러 포함 생성자
    public ErrorResponse(int status, String message, String path, List<String> errors) {
        this(status, message, path);
        this.errors = errors;
    }

    // 개발용 디버그 정보 포함 생성자
    public ErrorResponse(int status, String message, String path, String debugMessage) {
        this(status, message, path);
        this.debugMessage = debugMessage;
    }

    // Getter and Setter
    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public String getDebugMessage() {
        return debugMessage;
    }

    public void setDebugMessage(String debugMessage) {
        this.debugMessage = debugMessage;
    }
}