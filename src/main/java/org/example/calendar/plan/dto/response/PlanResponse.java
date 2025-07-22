// PlanResponse.java
package org.example.calendar.plan.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.example.calendar.plan.enums.PlanType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanResponse {

    private Long id;
    private String planName;
    private String planContent;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;

    private String location;
    private PlanType planType;

    // 반복 정보
    private RecurringInfo recurringInfo;

    // 알람 정보
    private List<AlarmResponse> alarms;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    // 사용자 정보
    private Long userId;
    private String userName;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecurringInfo {
        private String repeatUnit;
        private Integer repeatInterval;
        private List<String> repeatWeekdays;
        private Integer repeatDayOfMonth;
        private List<Integer> repeatWeeksOfMonth;
        private Integer repeatMonth;
        private Integer repeatDayOfYear;
        private String repeatDescription; // "매주 월,수,금" 같은 설명
    }
}