// MonthlyPlanCache.java
package org.example.calendar.plan.dto.cache;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyPlanCache implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long userId;
    private YearMonth yearMonth;
    private Map<LocalDate, List<PlanSummary>> dailyPlans;
    private long lastUpdated;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PlanSummary implements Serializable {
        private Long id;
        private String planName;
        private LocalTime startTime;
        private LocalTime endTime;
        private boolean isRecurring;
        private boolean hasAlarm;
    }
}