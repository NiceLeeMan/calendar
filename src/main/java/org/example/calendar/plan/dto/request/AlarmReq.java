// AlarmRequest.java
package org.example.calendar.plan.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlarmReq {

    @NotNull(message = "알람 시간은 필수입니다")
    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$",
            message = "알람 시간은 HH:MM 형식이어야 합니다")
    private String alarmTime;

    // 알람을 울릴 날짜들 (반복 일정의 경우 특정 날짜만 선택 가능)
    private List<LocalDate> alarmDates;

    // 일정 시작 N분 전 알람
    @Min(0) @Max(1440) // 최대 24시간 전
    private Integer minutesBefore;
}