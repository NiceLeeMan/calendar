package org.example.calendar.user.entity;

import org.example.calendar.plan.entity.Plan;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import lombok.*;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 사용자 엔티티
 *
 * <h3>주요 기능</h3>
 * <ul>
 *   <li>사용자 기본 정보 관리</li>
 *   <li>인증 정보 저장 (아이디, 비밀번호)</li>
 *   <li>연락처 정보 관리</li>
 *   <li>Plan 엔티티와 1:N 관계</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_email", columnList = "email")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /**
     * 사용자 실명
     */
    @NotBlank(message = "사용자 이름은 필수입니다")
    @Size(min = 2, max = 10, message = "사용자 이름은 2-10자 사이여야 합니다")
    @Column(name = "name", nullable = false, length = 10)
    private String name;

    /**
     * 로그인 아이디 (고유값)
     */
    @NotBlank(message = "사용자 아이디는 필수입니다")
    @Size(min = 4, max = 20, message = "사용자 아이디는 4-20자 사이여야 합니다")
    @Column(name = "user_id", nullable = false, unique = true, length = 20)
    private String userId;

    /**
     * 암호화된 비밀번호
     */
    @NotBlank(message = "비밀번호는 필수입니다")
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    /**
     * 이메일 주소 (고유값)
     */
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    /**
     * 휴대폰 번호
     */
    @NotBlank(message = "휴대폰 번호는 필수입니다")
    @Column(name = "phone_number", nullable = false, length = 15)
    private String phoneNumber;

    /**
     * 계정 생성 일시
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 사용자의 일정 목록 (1:N 관계)
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Plan> plans = new ArrayList<>();

    /**
     * 개인정보 수정
     */
    public void updateProfile(String name, String phoneNumber) {
        if (name != null && !name.trim().isEmpty()) {
            this.name = name.trim();
        }
        if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
            this.phoneNumber = phoneNumber.trim();
        }
    }
}