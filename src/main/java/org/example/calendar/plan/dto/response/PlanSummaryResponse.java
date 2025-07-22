// PlanSummaryResponse.java
package org.example.calendar.plan.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanSummaryResponse {

    private Long id;
    private String planName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;

    private String location;
    private boolean isRecurring;
    private boolean hasAlarm;

    // 반복 일정의 경우 원본 ID
    private Long originalPlanId;

    // 캘린더 표시용 색상 또는 카테고리
    private String displayColor;
}