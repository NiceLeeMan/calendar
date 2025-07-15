package org.example.calendar.plan.entity;

import jakarta.persistence.Entity;


import org.example.calendar.user.entity.User;
import org.example.calendar.plan.enums.PlanType;
import org.example.calendar.plan.enums.RepeatUnit;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import lombok.*;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.*;
import java.util.HashSet;
import java.util.Set;

/**
 * 일정(계획) 엔티티
 *
 * <h3>주요 기능</h3>
 * <ul>
 *   <li>단일/반복 일정 관리</li>
 *   <li>다양한 반복 패턴 지원 (주간, 월간, 연간)</li>
 *   <li>예외 날짜 관리</li>
 *   <li>알림 시간 설정</li>
 *   <li>위치 정보 저장</li>
 * </ul>
 *
 * <h3>반복 일정 로직</h3>
 * <ul>
 *   <li><strong>SINGLE</strong>: 단일 일정</li>
 *   <li><strong>RECURRING</strong>: 반복 일정 (repeatUnit, repeatInterval 필수)</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
@Entity
@Table(name = "plans", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_start_date", columnList = "start_date"),
        @Index(name = "idx_plan_type", columnList = "plan_type")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Plan {

    private static final Logger log = LoggerFactory.getLogger(Plan.class);

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 일정 제목
     */
    @NotBlank(message = "일정 제목은 필수입니다")
    @Column(name = "plan_name", nullable = false, length = 50)
    private String planName;

    /**
     * 일정 내용
     */
    @Column(name = "plan_content", columnDefinition = "TEXT", length = 1000)
    private String planContent;

    /**
     * 시작 날짜
     */
    @NotNull(message = "시작 날짜는 필수입니다")
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    /**
     * 종료 날짜
     */
    @NotNull(message = "종료 날짜는 필수입니다")
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    /**
     * 시작 시간
     */
    @NotNull(message = "시작 시간은 필수입니다")
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    /**
     * 종료 시간
     */
    @NotNull(message = "종료 시간은 필수입니다")
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    /**
     * 위치 정보
     */
    @Column(name = "location", length = 200)
    private String location;

    /**
     * 알림 시간
     */
    @Column(name = "alarm_time")
    private LocalTime alarmTime;

    /**
     * 일정 생성 일시
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 일정 수정 일시
     */
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * 일정 유형: SINGLE(단일) 또는 RECURRING(반복)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type", nullable = false, length = 20)
    private PlanType planType;

    /**
     * 반복 단위: WEEKLY, MONTHLY, YEARLY (반복 일정인 경우에만 사용)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "repeat_unit", length = 20)
    private RepeatUnit repeatUnit;

    /**
     * 반복 간격: N주, N개월, N년 간격
     */
    @Column(name = "repeat_interval")
    private Integer repeatInterval;

    /**
     * 월 단위 반복 시 특정 일자 (예: 매월 15일)
     */
    @Column(name = "repeat_day_of_month")
    private Integer repeatDayOfMonth;

    /**
     * 반복되는 요일들 (주간 반복 시 사용)
     */
    @ElementCollection(targetClass = DayOfWeek.class)
    @CollectionTable(name = "plan_repeat_weekdays",
            joinColumns = @JoinColumn(name = "plan_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "repeat_weekday")
    @Builder.Default
    private Set<DayOfWeek> repeatWeekdays = new HashSet<>();

    /**
     * 반복 일정 중 제외할 날짜들
     */
    @ElementCollection
    @CollectionTable(name = "plan_exceptions",
            joinColumns = @JoinColumn(name = "plan_id"))
    @Column(name = "exception_date")
    @Builder.Default
    private Set<LocalDate> exceptionDates = new HashSet<>();

    /**
     * 일정 소유자 (N:1 관계)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_plan_user"))
    private User user;

    /**
     * 낙관적 락을 위한 버전 필드
     */
    @Version
    @Column(name = "version")
    private Long version;

    // 비즈니스 메서드

    /**
     * 단일 일정인지 확인
     */
    public boolean isSinglePlan() {
        return PlanType.SINGLE.equals(this.planType);
    }

    /**
     * 반복 일정인지 확인
     */
    public boolean isRecurringPlan() {
        return PlanType.RECURRING.equals(this.planType);
    }

    /**
     * 특정 날짜가 예외 날짜인지 확인
     */
    public boolean isExceptionDate(LocalDate date) {
        return exceptionDates.contains(date);
    }

    /**
     * 예외 날짜 추가
     */
    public void addExceptionDate(LocalDate date) {
        this.exceptionDates.add(date);
    }

    /**
     * 반복 요일 추가
     */
    public void addRepeatWeekday(DayOfWeek dayOfWeek) {
        this.repeatWeekdays.add(dayOfWeek);
    }

    // equals and hashCode (ID 기반)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Plan)) return false;
        Plan plan = (Plan) o;
        return id != null && id.equals(plan.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Plan{" +
                "id=" + id +
                ", planName='" + planName + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", planType=" + planType +
                '}';
    }
}