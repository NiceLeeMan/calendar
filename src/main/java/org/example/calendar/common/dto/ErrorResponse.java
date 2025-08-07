package org.example.calendar.common.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

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
@Getter @Setter
public class ErrorResponse {

    /**
     * 에러 코드 (구체적인 에러 유형 식별용)
     */
    private String errorCode;

    /**
     * 에러 발생 필드명 (중복 검사 등에서 사용)
     */
    private String field;

    /**
     * HTTP 상태 코드 (예: 400, 404, 500)
     */
    private int status;

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

    // 에러 코드와 필드 포함 생성자 (중복 에러용)
    public ErrorResponse(int status, String path, String errorCode, String field) {
        this();
        this.status = status;
        this.path = path;
        this.errorCode = errorCode;
        this.field = field;
    }

    // 에러 코드만 포함 생성자

    // 기본 에러 응답 생성자
    public ErrorResponse(int status, String path) {
        this();
        this.status = status;
        this.path = path;
    }

    // 상세 에러 포함 생성자 (유효성 검증용)
    public ErrorResponse(int status, String path, String errorCode, List<String> errors) {
        this(status, path, errorCode);
        this.errors = errors;
    }

    // 개발용 디버그 정보 포함 생성자
    public ErrorResponse(int status, String path, String debugMessage) {
        this(status, path);
        this.debugMessage = debugMessage;
    }
}