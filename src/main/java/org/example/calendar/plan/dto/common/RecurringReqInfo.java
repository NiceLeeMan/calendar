package org.example.calendar.plan.dto.common;

import jakarta.validation.constraints.*;
import lombok.*;
import org.example.calendar.plan.enums.RepeatUnit;

import java.time.DayOfWeek;
import java.util.Set;

/**
 * 반복 계획 요청 정보 DTO
 * 
 * <p>반복 계획 생성/수정 시 반복 규칙을 설정하기 위한 요청 데이터를 담는 공통 클래스입니다.</p>
 * 
 * <h3>지원하는 반복 패턴</h3>
 * <ul>
 *   <li><strong>주간 반복</strong>: 매주 특정 요일들 (예: 매주 월, 수, 금)</li>
 *   <li><strong>월간 반복</strong>: 매월 특정 날짜 또는 특정 주차의 요일</li>
 *   <li><strong>연간 반복</strong>: 매년 특정 월의 특정 일</li>
 * </ul>
 * 
 * <h3>월간 반복 세부 방식</h3>
 * <ul>
 *   <li><strong>특정 날짜</strong>: repeatDayOfMonth (예: 매월 15일)</li>
 *   <li><strong>특정 주차 + 요일</strong>: repeatWeekOfMonth + repeatWeekdays (예: 매월 둘째 화요일)</li>
 * </ul>
 * 
 * <h3>validation 규칙</h3>
 * <ul>
 *   <li><strong>주간</strong>: repeatWeekdays 필수, 다른 필드 금지</li>
 *   <li><strong>월간</strong>: 날짜 OR (주차+요일) 중 정확히 하나만 선택</li>
 *   <li><strong>연간</strong>: repeatMonth + repeatDayOfYear 모두 필수</li>
 *   <li><strong>간격</strong>: 1~20 범위 (기본값: 1)</li>
 * </ul>
 * 
 * <h3>사용 예시</h3>
 * <pre>
 * // 매주 월, 수, 금 반복
 * RecurringReqInfo weekly = RecurringReqInfo.builder()
 *     .repeatUnit(RepeatUnit.WEEKLY)
 *     .repeatInterval(1)
 *     .repeatWeekdays(Set.of(MONDAY, WEDNESDAY, FRIDAY))
 *     .build();
 * 
 * // 매월 15일 반복
 * RecurringReqInfo monthlyDate = RecurringReqInfo.builder()
 *     .repeatUnit(RepeatUnit.MONTHLY)
 *     .repeatDayOfMonth(15)
 *     .build();
 * 
 * // 매월 둘째 화요일 반복
 * RecurringReqInfo monthlyWeek = RecurringReqInfo.builder()
 *     .repeatUnit(RepeatUnit.MONTHLY)
 *     .repeatWeekOfMonth(2)
 *     .repeatWeekdays(Set.of(TUESDAY))
 *     .build();
 * </pre>
 * 
 * @author Calendar Team
 * @since 2025-07-24
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecurringReqInfo {

    @NotNull(message = "반복 단위는 필수입니다")
    private RepeatUnit repeatUnit;

    @Min(value = 1, message = "반복 간격은 1 이상이어야 합니다")
    @Max(value = 20, message = "반복 간격은 20 이하여야 합니다")
    private Integer repeatInterval = 1;

    // === 주간 반복 ===
    private Set<DayOfWeek> repeatWeekdays;

    // === 월간 반복 ===
    // 방식 1: 특정 날짜 (예: 매월 15일)
    @Min(1) @Max(31)
    private Integer repeatDayOfMonth;

    // 방식 2: 주차 선택 (예: 매월 둘째 화요일=[2], 매월 둘째,넷째 화요일=[2,4])
    private Set<Integer> repeatWeeksOfMonth;

    // === 연간 반복 ===
    @Min(1) @Max(12)
    private Integer repeatMonth;

    @Min(1) @Max(366)  // 윤년 고려
    private Integer repeatDayOfYear;

    // === Validation Methods ===
    
    @AssertTrue(message = "주간 반복은 요일을 선택해야 합니다")
    private boolean isValidWeeklyRepeat() {
        if (repeatUnit != RepeatUnit.WEEKLY) return true;
        
        // 요일은 필수, 다른 설정은 불필요
        return repeatWeekdays != null && !repeatWeekdays.isEmpty() &&
               repeatDayOfMonth == null && 
               repeatWeeksOfMonth == null &&
               repeatMonth == null && 
               repeatDayOfYear == null;
    }

    @AssertTrue(message = "월간 반복은 날짜 또는 주차+요일 중 하나만 지정해야 합니다")
    private boolean isValidMonthlyRepeat() {
        if (repeatUnit != RepeatUnit.MONTHLY) return true;
        
        // 방식 1: 특정 날짜
        boolean hasDayOfMonth = repeatDayOfMonth != null;
        
        // 방식 2: 주차 + 요일
        boolean hasWeeksAndDay = repeatWeeksOfMonth != null && 
                                !repeatWeeksOfMonth.isEmpty() &&
                                repeatWeekdays != null && 
                                !repeatWeekdays.isEmpty();
        
        // 정확히 하나만 선택, 연간 설정은 불필요
        return (hasDayOfMonth ^ hasWeeksAndDay) &&  // XOR: 둘 중 정확히 하나만
               repeatMonth == null && 
               repeatDayOfYear == null;
    }

    @AssertTrue(message = "연간 반복은 월과 일을 모두 지정해야 합니다")
    private boolean isValidYearlyRepeat() {
        if (repeatUnit != RepeatUnit.YEARLY) return true;
        
        // 월과 일은 필수, 다른 설정은 불필요
        return repeatMonth != null && 
               repeatDayOfYear != null &&
               repeatWeekdays == null && 
               repeatDayOfMonth == null && 
               repeatWeeksOfMonth == null;
    }
}