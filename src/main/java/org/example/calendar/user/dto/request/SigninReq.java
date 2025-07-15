package org.example.calendar.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * 로그인 요청 DTO
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
@Getter @Setter
@Schema(description = "로그인 요청")
public class SigninReq {

    @Schema(description = "사용자 아이디", example = "user123")
    @NotBlank(message = "사용자 아이디는 필수입니다")
    private String userId;

    @Schema(description = "비밀번호", example = "password123!")
    @NotBlank(message = "비밀번호는 필수입니다")
    private String userPassword;

    // 기본 생성자
    public SigninReq() {}

    // 전체 생성자
    public SigninReq(String userId, String userPassword) {
        this.userId = userId;
        this.userPassword = userPassword;
    }

}