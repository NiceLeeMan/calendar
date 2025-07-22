package org.example.calendar.plan.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.example.calendar.plan.enums.PlanType;
import org.example.calendar.plan.enums.RepeatUnit;
import org.example.calendar.user.entity.User;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.*;
import java.util.HashSet;
import java.util.Set;

/**
 * 일정(계획) 엔티티
 *
 * @author Calendar Team
 * @since 2025-07-21
 */
@Entity
@Table(name = "plans", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_start_date", columnList = "start_date"),
        @Index(name = "idx_end_date", columnList = "end_date"),
        @Index(name = "idx_plan_type", columnList = "plan_type"),
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

    @Column(name = "location", length = 200)
    private String location;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type", nullable = false, length = 20)
    private PlanType planType;

    @Enumerated(EnumType.STRING)
    @Column(name = "repeat_unit", length = 20)
    private RepeatUnit repeatUnit;

    @Column(name = "repeat_interval")
    private Integer repeatInterval;

    @Column(name = "repeat_day_of_month")
    private Integer repeatDayOfMonth;

    // "매월 첫째/둘째/셋째/넷째/마지막 주" 표현용
    // 값: 1(첫째주), 2(둘째주), 3(셋째주), 4(넷째주), -1(마지막주)
    @Column(name = "repeat_week_of_month")
    private Integer repeatWeekOfMonth;

    // "매년 특정 월" 표현용 (1~12)
    @Column(name = "repeat_month")
    private Integer repeatMonth;

    // "매년 특정 일" 표현용 (1~31)
    @Column(name = "repeat_day_of_year")
    private Integer repeatDayOfYear;

    // 복수의 주차 선택 가능 (예: "매월 둘째, 넷째 화요일")
    @ElementCollection
    @CollectionTable(name = "plan_repeat_weeks_of_month",
            joinColumns = @JoinColumn(name = "plan_id"),
            foreignKey = @ForeignKey(name = "fk_plan_week_of_month"))
    @Column(name = "week_of_month")
    @BatchSize(size = 10)
    @Builder.Default
    private Set<Integer> repeatWeeksOfMonth = new HashSet<>();

    @ElementCollection(targetClass = DayOfWeek.class)
    @CollectionTable(name = "plan_repeat_weekdays",
            joinColumns = @JoinColumn(name = "plan_id"),
            foreignKey = @ForeignKey(name = "fk_plan_weekday"))
    @Enumerated(EnumType.STRING)
    @Column(name = "repeat_weekday")
    @BatchSize(size = 10)
    @Builder.Default
    private Set<DayOfWeek> repeatWeekdays = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "plan_exceptions",
            joinColumns = @JoinColumn(name = "plan_id"),
            foreignKey = @ForeignKey(name = "fk_plan_exception"))
    @Column(name = "exception_date")
    @BatchSize(size = 10)
    @Builder.Default
    private Set<LocalDate> exceptionDates = new HashSet<>();

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
        return PlanType.SINGLE.equals(this.planType);
    }

    public boolean isRecurringPlan() {
        return PlanType.RECURRING.equals(this.planType);
    }

    public boolean isMultiDayPlan() {
        return !startDate.equals(endDate);
    }

}