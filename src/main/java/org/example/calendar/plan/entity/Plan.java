package org.example.calendar.plan.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.example.calendar.user.entity.User;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.*;
import java.util.HashSet;
import java.util.Set;

/**
 * 일정(계획) 엔티티
 *sd
 * @author Calendar Team
 * @since 2025-07-21
 */
@Entity
@Table(name = "plans", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_start_date", columnList = "start_date"),
        @Index(name = "idx_end_date", columnList = "end_date"),
        @Index(name = "idx_is_recurring", columnList = "is_recurring"),
        @Index(name = "idx_user_date_range", columnList = "user_id, start_date, end_date")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "일정 제목은 필수입니다")
    @Size(max = 30, message = "일정 제목은 30자 이하여야 합니다")
    @Column(name = "plan_name", nullable = false, length = 30)
    private String planName;

    @Size(max = 100, message = "일정 내용은 300자 이하여야 합니다")
    @Column(name = "plan_content", length = 300)
    private String planContent;

    @NotNull(message = "시작 날짜는 필수입니다")
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull(message = "종료 날짜는 필수입니다")
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @NotNull(message = "시작 시간은 필수입니다")
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @NotNull(message = "종료 시간은 필수입니다")
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "is_recurring", nullable = false)
    @Builder.Default
    private Boolean isRecurring = false;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "recurring_info_id", 
               foreignKey = @ForeignKey(name = "fk_plan_recurring_info"))
    private RecurringInfo recurringInfo;

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 10)
    @Builder.Default
    private Set<PlanAlarm> alarms = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_plan_user"))
    private User user;

    @Version
    @Column(name = "version")
    private Long version;

    // 간단한 편의 메서드만 유지
    public boolean isSinglePlan() {
        return !Boolean.TRUE.equals(this.isRecurring);
    }

    public boolean isRecurringPlan() {
        return Boolean.TRUE.equals(this.isRecurring);
    }

    public boolean isMultiDayPlan() {
        return !startDate.equals(endDate);
    }

    // 알람 업데이트 메서드 (orphanRemoval 문제 해결)
    public void updateAlarms(Set<PlanAlarm> newAlarms) {
        this.alarms.clear();
        if (newAlarms != null) {
            newAlarms.forEach(alarm -> alarm.setPlan(this));
            this.alarms.addAll(newAlarms);
        }
    }

}