// RecurringPlanRequest.java
package org.example.calendar.plan.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import org.example.calendar.plan.enums.RepeatUnit;

import java.time.DayOfWeek;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecurringPlanReq {

    @NotNull(message = "반복 단위는 필수입니다")
    private RepeatUnit repeatUnit;

    @Min(value = 1, message = "반복 간격은 1 이상이어야 합니다")
    @Max(value = 20, message = "반복 간격은 20 이하여야 합니다")
    private Integer repeatInterval = 1;

    // 주간 반복: 요일 선택
    private Set<DayOfWeek> repeatWeekdays;

    // 월간 반복: 특정 날짜
    @Min(1) @Max(31)
    private Integer repeatDayOfMonth;

    // 월간 반복: N번째 주
    private Set<Integer> repeatWeeksOfMonth; // 1~4, -1(마지막)

    // 월간 반복: N번째 주의 특정 요일
    @Min(-1) @Max(4)
    private Integer repeatWeekOfMonth;

    // 연간 반복: 특정 월
    @Min(1) @Max(12)
    private Integer repeatMonth;

    // 연간 반복: 특정 일
    @Min(1) @Max(31)
    private Integer repeatDayOfYear;

    @AssertTrue(message = "주간 반복은 요일을 선택해야 합니다")
    private boolean isValidWeeklyRepeat() {
        if (repeatUnit != RepeatUnit.WEEKLY) return true;
        return repeatWeekdays != null && !repeatWeekdays.isEmpty();
    }

    @AssertTrue(message = "연간 반복은 월과 일을 모두 지정해야 합니다")
    private boolean isValidYearlyRepeat() {
        if (repeatUnit != RepeatUnit.YEARLY) return true;
        return repeatMonth != null && repeatDayOfYear != null;
    }
}