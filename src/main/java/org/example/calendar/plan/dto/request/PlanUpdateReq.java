// PlanUpdateRequest.java
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
public class PlanUpdateReq {

    @Size(max = 30, message = "계획 제목은 30자 이하여야 합니다")
    private String planName;

    @Size(max = 300, message = "상세 내용은 300자 이하여야 합니다")
    private String planContent;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String location;

    // 계획 타입 변경 (반복 → 단일)
    private PlanType planType;

    // 반복 설정 수정
    private RecurringPlanReq recurringPlan;

    // 알람 설정 수정
    private List<AlarmReq> alarms;

    // 반복 계획을 단일 계획으로 변경 시 옵션
    private Boolean convertToSinglePlan;

    @AssertTrue(message = "종료 날짜는 시작 날짜 이후여야 합니다")
    private boolean isValidDateRange() {
        if (startDate == null || endDate == null) return true;
        return !endDate.isBefore(startDate);
    }
}