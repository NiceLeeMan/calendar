// MonthlyPlanResponse.java
package org.example.calendar.plan.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyPlanResponse {

    private YearMonth yearMonth;
    private int totalPlans;

    // 날짜별 일정 목록
    private Map<LocalDate, List<PlanSummaryResponse>> plansByDate;

    // 통계 정보
    private Statistics statistics;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Statistics {
        private int singlePlans;
        private int recurringPlans;
        private int plansWithAlarms;
        private Map<String, Integer> plansByWeekday; // 요일별 일정 수
    }
}