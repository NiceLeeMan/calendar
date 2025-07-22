package org.example.calendar.plan.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import org.example.calendar.plan.enums.PlanType;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanCreateReq {

    @NotBlank(message = "계획 제목은 필수입니다")
    @Size(max = 30, message = "계획 제목은 30자 이하여야 합니다")
    private String planName;

    @Size(max = 300, message = "상세 내용은 300자 이하여야 합니다")
    private String planContent;

    @NotNull(message = "시작 날짜는 필수입니다")
    @FutureOrPresent(message = "시작 날짜는 현재 또는 미래여야 합니다")
    private LocalDate startDate;

    @NotNull(message = "종료 날짜는 필수입니다")
    private LocalDate endDate;

    @NotNull(message = "시작 시간은 필수입니다")
    private LocalTime startTime;

    @NotNull(message = "종료 시간은 필수입니다")
    private LocalTime endTime;

    private String location;

    @NotNull(message = "계획 타입은 필수입니다")
    private PlanType planType;

    // 반복 설정 (선택)
    private RecurringPlanReq recurringPlan;

    // 알람 설정 (선택)
    private List<AlarmReq> alarms;

    @AssertTrue(message = "종료 날짜는 시작 날짜 이후여야 합니다")
    private boolean isValidDateRange() {
        if (startDate == null || endDate == null) return true;
        return !endDate.isBefore(startDate);
    }

    @AssertTrue(message = "같은 날짜인 경우 종료 시간은 시작 시간 이후여야 합니다")
    private boolean isValidTimeRange() {
        if (startDate == null || endDate == null ||
                startTime == null || endTime == null) return true;
        if (startDate.equals(endDate)) {
            return !endTime.isBefore(startTime);
        }
        return true;
    }
}