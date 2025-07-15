package org.example.calendar.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * 회원가입 요청 DTO
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
@Getter @Setter
@Schema(description = "회원가입 요청")
public class SignupReq {

    @Schema(description = "사용자 실명", example = "홍길동")
    @NotBlank(message = "사용자 이름은 필수입니다")
    @Size(min = 2, max = 10, message = "사용자 이름은 2-10자 사이여야 합니다")
    private String userName;

    @Schema(description = "사용자 아이디", example = "user123")
    @NotBlank(message = "사용자 아이디는 필수입니다")
    @Size(min = 4, max = 20, message = "사용자 아이디는 4-20자 사이여야 합니다")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "아이디는 영문, 숫자, 언더스코어만 사용 가능합니다")
    private String userId;

    @Schema(description = "비밀번호", example = "password123!")
    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, max = 20, message = "비밀번호는 8-20자 사이여야 합니다")
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
            message = "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다")
    private String userPassword;

    @Schema(description = "이메일 주소", example = "user@example.com")
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String userEmail;

    @Schema(description = "휴대폰 번호", example = "010-1234-5678")
    @NotBlank(message = "휴대폰 번호는 필수입니다")
    @Pattern(regexp = "^010-\\d{4}-\\d{4}$", message = "휴대폰 번호 형식이 올바르지 않습니다 (010-0000-0000)")
    private String userPhoneNumber;

    // 기본 생성자
    public SignupReq() {}

    // 전체 생성자
    public SignupReq(String userName, String userId, String userPassword,
                             String userEmail, String userPhoneNumber) {
        this.userName = userName;
        this.userId = userId;
        this.userPassword = userPassword;
        this.userEmail = userEmail;
        this.userPhoneNumber = userPhoneNumber;
    }

}