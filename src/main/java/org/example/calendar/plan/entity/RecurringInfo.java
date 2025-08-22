package org.example.calendar.plan.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.calendar.plan.enums.RepeatUnit;
import org.hibernate.annotations.BatchSize;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * 반복 일정 정보 엔티티
 *
 * @author Calendar Team
 * @since 2025-07-24
 */
@Entity
@Table(name = "recurring_info")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class RecurringInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "repeat_unit", nullable = false, length = 20)
    private RepeatUnit repeatUnit;

    @Column(name = "repeat_interval")
    private Integer repeatInterval;

    @Column(name = "repeat_day_of_month")
    private Integer repeatDayOfMonth;

    // "매년 특정 월" 표현용 (1~12)
    @Column(name = "repeat_month")
    private Integer repeatMonth;

    // "매년 특정 일" 표현용 (1~31)
    @Column(name = "repeat_day_of_year")
    private Integer repeatDayOfYear;

    // 단일& 복 수의 주차 선택 가능 (예: "매월 둘째, 넷째 화요일")
    @ElementCollection
    @CollectionTable(name = "recurring_repeat_weeks_of_month",
            joinColumns = @JoinColumn(name = "recurring_info_id"),
            foreignKey = @ForeignKey(name = "fk_recurring_week_of_month"))
    @Column(name = "week_of_month")
    @BatchSize(size = 10)
    @Builder.Default
    private Set<Integer> repeatWeeksOfMonth = new HashSet<>();

    @ElementCollection(targetClass = DayOfWeek.class)
    @CollectionTable(name = "recurring_repeat_weekdays",
            joinColumns = @JoinColumn(name = "recurring_info_id"),
            foreignKey = @ForeignKey(name = "fk_recurring_weekday"))
    @Enumerated(EnumType.STRING)
    @Column(name = "repeat_weekday")
    @BatchSize(size = 10)
    @Builder.Default
    private Set<DayOfWeek> repeatWeekdays = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "recurring_exceptions",
            joinColumns = @JoinColumn(name = "recurring_info_id"),
            foreignKey = @ForeignKey(name = "fk_recurring_exception"))
    @Column(name = "exception_date")
    @BatchSize(size = 10)
    @Builder.Default
    private Set<LocalDate> exceptionDates = new HashSet<>();

    // 반복 시작 날짜 (Plan.startDate와 동기화)
    @Column(name = "start_date")
    private LocalDate startDate;

    // 반복 종료 날짜 (Plan.endDate와 동기화)
    @Column(name = "end_date")
    private LocalDate endDate;

    @OneToOne(mappedBy = "recurringInfo")
    private Plan plan;
}
