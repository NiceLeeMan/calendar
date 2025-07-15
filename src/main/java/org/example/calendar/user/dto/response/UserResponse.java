package org.example.calendar.user.dto.response;


import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 사용자 정보 응답 DTO
 *
 * <h3>사용 용도</h3>
 * <ul>
 *   <li>회원가입 성공 응답</li>
 *   <li>로그인 성공 응답</li>
 *   <li>내 정보 조회 응답</li>
 *   <li>내 정보 수정 응답</li>
 * </ul>
 *
 * <p><strong>주의:</strong> 보안상 비밀번호는 절대 포함하지 않습니다.</p>
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
@Getter @Setter
@Schema(description = "사용자 정보 응답")
public class UserResponse {

    @Schema(description = "사용자 아이디", example = "user123")
    private String userId;

    @Schema(description = "사용자 실명", example = "홍길동")
    private String userName;

    @Schema(description = "이메일 주소", example = "user@example.com")
    private String userEmail;

    @Schema(description = "휴대폰 번호", example = "010-1234-5678")
    private String userPhoneNumber;

    @Schema(description = "회원가입 일시", example = "2025-07-14T15:30:45")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    // 기본 생성자
    public UserResponse() {}

    // 전체 생성자
    public UserResponse(String userId, String userName, String userEmail,
                        String userPhoneNumber, LocalDateTime createdAt) {
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userPhoneNumber = userPhoneNumber;
        this.createdAt = createdAt;
    }


}