package org.example.calendar.common.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 표준 API 응답 DTO
 *
 * <h3>목적</h3>
 * 모든 API 성공 응답을 일관된 형태로 제공하기 위한 표준 응답 객체입니다.
 *
 * <h3>사용 예시</h3>
 * <pre>
 * {
 *   "statusCode": 200,
 *   "message": "회원가입이 완료되었습니다.",
 *   "data": { ... }
 * }
 * </pre>
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
@Schema(description = "표준 API 응답")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    @Schema(description = "상태 코드", example = "200")
    private int statusCode;

    @Schema(description = "결과 메시지", example = "성공적으로 처리되었습니다.")
    private String message;

    @Schema(description = "응답 데이터")
    private T data;

    // 기본 생성자
    public ApiResponse() {}

    // 메시지만 있는 응답 생성자
    public ApiResponse(int statusCode, String message) {
        this.statusCode = statusCode;
        this.message = message;
    }

    // 데이터 포함 응답 생성자
    public ApiResponse(int statusCode, String message, T data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    // 정적 팩토리 메서드들
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(200, message);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(200, message, data);
    }

    public static <T> ApiResponse<T> created(String message) {
        return new ApiResponse<>(201, message);
    }

    public static <T> ApiResponse<T> created(String message, T data) {
        return new ApiResponse<>(201, message, data);
    }

    // Getter and Setter
    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}