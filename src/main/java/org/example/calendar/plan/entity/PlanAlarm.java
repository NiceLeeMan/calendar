package org.example.calendar.plan.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * 일정 알림 엔티티
 *
 * @author Calendar Team
 * @since 2025-07-21
 */
@Entity
@Table(name = "plan_alarms", indexes = {
        @Index(name = "idx_plan_id", columnList = "plan_id"),
        @Index(name = "idx_alarm_datetime", columnList = "alarm_date, alarm_time"),
        @Index(name = "idx_alarm_status", columnList = "alarm_status")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PlanAlarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_alarm_plan"))
    @NotNull(message = "일정은 필수입니다")
    private Plan plan;

    @Column(name = "alarm_date", nullable = false)
    @NotNull(message = "알림 날짜는 필수입니다")
    private LocalDate alarmDate;

    @Column(name = "alarm_time", nullable = false)
    @NotNull(message = "알림 시간은 필수입니다")
    private LocalTime alarmTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "alarm_status", nullable = false, length = 20)
    @Builder.Default
    private AlarmStatus alarmStatus = AlarmStatus.PENDING;



    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Size(max = 500, message = "실패 사유는 500자 이하여야 합니다")
    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    @Column(name = "retry_count")
    @Builder.Default
    private Integer retryCount = 0;

    /**
     * 알림 상태 열거형
     */
    public enum AlarmStatus {
        PENDING("대기중"),
        SENT("발송완료"),
        FAILED("발송실패"),
        CANCELLED("취소됨");

        private final String description;

        AlarmStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // 간단한 상태 체크 메서드만 유지
    public boolean isSent() {
        return AlarmStatus.SENT.equals(this.alarmStatus);
    }

    public boolean isPending() {
        return AlarmStatus.PENDING.equals(this.alarmStatus);
    }

    public boolean isFailed() {
        return AlarmStatus.FAILED.equals(this.alarmStatus);
    }

    public boolean isCancelled() {
        return AlarmStatus.CANCELLED.equals(this.alarmStatus);
    }

    public LocalDateTime getAlarmDateTime() {
        return LocalDateTime.of(alarmDate, alarmTime);
    }

}