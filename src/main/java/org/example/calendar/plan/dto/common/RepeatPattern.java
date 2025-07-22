// RepeatPattern.java
package org.example.calendar.plan.dto.common;

import lombok.*;
import org.example.calendar.plan.enums.RepeatUnit;

import java.time.DayOfWeek;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepeatPattern {

    private RepeatUnit unit;
    private Integer interval;
    private Set<DayOfWeek> weekdays;
    private Integer dayOfMonth;
    private Set<Integer> weeksOfMonth;
    private Integer month;
    private Integer dayOfYear;

    public String toDescription() {
        // 반복 패턴을 사람이 읽을 수 있는 설명으로 변환
        // 예: "매주 월,수,금", "매월 15일", "매년 3월 3일"
        return ""; // 구현 필요
    }
}