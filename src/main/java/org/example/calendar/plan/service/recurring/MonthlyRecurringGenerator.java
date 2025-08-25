package org.example.calendar.plan.service.recurring;

import lombok.extern.slf4j.Slf4j;
import org.example.calendar.plan.dto.response.PlanResponse;
import org.example.calendar.plan.entity.Plan;
import org.example.calendar.plan.entity.RecurringInfo;
import org.example.calendar.plan.mapper.PlanMapper;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

/**
 * 월간 반복 일정 전용 생성기
 * 
 * <h3>지원 기능</h3>
 * <ul>
 *   <li><strong>방식 1:</strong> 특정 날짜 반복 (예: 매월 15일)</li>
 *   <li><strong>방식 2:</strong> 특정 주차의 특정 요일 반복 (예: 매월 둘째 화요일)</li>
 *   <li><strong>방식 3:</strong> 복수 주차 지원 (예: 매월 둘째, 넷째 화요일)</li>
 *   <li><strong>방식 4:</strong> 마지막 주 지원 (예: 매월 마지막 주 금요일)</li>
 *   <li>N개월 간격 반복 (예: 격월, 분기별)</li>
 *   <li>예외 날짜 처리</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-08-22
 */
@Component
@Slf4j
public class MonthlyRecurringGenerator implements RecurringGenerator {

    private final PlanMapper planMapper;

    public MonthlyRecurringGenerator(PlanMapper planMapper) {
        this.planMapper = planMapper;
    }

    @Override
    public List<PlanResponse> generateInstances(Plan plan, LocalDate monthStart, LocalDate monthEnd) {
        List<PlanResponse> instances = new ArrayList<>();
        RecurringInfo recurring = plan.getRecurringInfo();
        
        if (recurring == null) {
            log.warn("월간 반복 설정이 없습니다. planId: {}", plan.getId());
            return instances;
        }
        
        // 방식 1: 특정 날짜 기준 (예: 매월 15일)
        if (recurring.getRepeatDayOfMonth() != null) {
            generateDayOfMonthInstances(plan, monthStart, monthEnd, instances);
        }
        // 방식 2: 주차 + 요일 기준 (예: 매월 둘째 화요일)
        else if (recurring.getRepeatWeeksOfMonth() != null && !recurring.getRepeatWeeksOfMonth().isEmpty() &&
                 recurring.getRepeatWeekdays() != null && !recurring.getRepeatWeekdays().isEmpty()) {
            generateWeekOfMonthInstances(plan, monthStart, monthEnd, instances);
        }
        else {
            log.warn("월간 반복 설정이 올바르지 않습니다. planId: {}", plan.getId());
        }

        return instances;
    }

    /**
     * 방식 1: 매월 특정 날짜 반복 (예: 매월 15일)
     */
    private void generateDayOfMonthInstances(Plan plan, LocalDate monthStart, LocalDate monthEnd, 
                                           List<PlanResponse> instances) {
        RecurringInfo recurring = plan.getRecurringInfo();
        LocalDate planStart = plan.getStartDate();
        int targetDay = recurring.getRepeatDayOfMonth();
        
        // 계획 시작 월부터 현재 조회 월까지 해당하는 월들을 찾기
        LocalDate currentMonth = planStart.withDayOfMonth(1);
        
        // 조회 범위 이전 월들을 건너뛰기
        while (currentMonth.isBefore(monthStart.withDayOfMonth(1))) {
            currentMonth = currentMonth.plusMonths(recurring.getRepeatInterval());
        }
        
        // 조회 범위 내 월들에서 인스턴스 생성
        while (!currentMonth.isAfter(monthEnd.withDayOfMonth(1))) {
            // 해당 월의 실제 일수에 맞춰 날짜 조정
            int actualDay = Math.min(targetDay, currentMonth.lengthOfMonth());
            LocalDate instanceDate = currentMonth.withDayOfMonth(actualDay);
            
            if (RecurringGeneratorUtils.isValidInstance(plan, instanceDate, monthStart, monthEnd)) {
                PlanResponse instance = RecurringGeneratorUtils.createPlanInstance(plan, instanceDate, planMapper);
                instances.add(instance);
            }
            
            currentMonth = currentMonth.plusMonths(recurring.getRepeatInterval());
        }
    }

    /**
     * 방식 2: 매월 특정 주차의 특정 요일 반복 (예: 매월 둘째 화요일, 매월 둘째,넷째 화요일)
     */
    private void generateWeekOfMonthInstances(Plan plan, LocalDate monthStart, LocalDate monthEnd, 
                                            List<PlanResponse> instances) {
        RecurringInfo recurring = plan.getRecurringInfo();
        LocalDate planStart = plan.getStartDate();
        
        // 계획 시작 월부터 현재 조회 월까지 해당하는 월들을 찾기
        LocalDate currentMonth = planStart.withDayOfMonth(1);
        
        // 조회 범위 이전 월들을 건너뛰기
        while (currentMonth.isBefore(monthStart.withDayOfMonth(1))) {
            currentMonth = currentMonth.plusMonths(recurring.getRepeatInterval());
        }
        
        // 조회 범위 내 월들에서 인스턴스 생성
        while (!currentMonth.isAfter(monthEnd.withDayOfMonth(1))) {
            
            // 각 주차에 대해 처리
            for (Integer weekOfMonth : recurring.getRepeatWeeksOfMonth()) {
                // 각 요일에 대해 처리
                for (DayOfWeek dayOfWeek : recurring.getRepeatWeekdays()) {
                    LocalDate instanceDate = findDateByWeekAndDay(currentMonth, weekOfMonth, dayOfWeek);
                    
                    if (instanceDate != null && RecurringGeneratorUtils.isValidInstance(plan, instanceDate, monthStart, monthEnd)) {
                        PlanResponse instance = RecurringGeneratorUtils.createPlanInstance(plan, instanceDate, planMapper);
                        instances.add(instance);
                    }
                }
            }
            
            currentMonth = currentMonth.plusMonths(recurring.getRepeatInterval());
        }
    }

    /**
     * 특정 월의 특정 주차에서 특정 요일 찾기
     * 
     * @param month 대상 월 (1일 기준)
     * @param weekOfMonth 주차 (1=첫째주, 2=둘째주, ..., -1=마지막주)
     * @param dayOfWeek 요일
     * @return 해당 날짜 (없으면 null)
     */
    private LocalDate findDateByWeekAndDay(LocalDate month, Integer weekOfMonth, DayOfWeek dayOfWeek) {
        // 마지막 주 처리 (-1 또는 5 이상)
        if (weekOfMonth == -1 || weekOfMonth >= 5) {
            return findLastOccurrenceInMonth(month, dayOfWeek);
        }
        
        // 첫째~넷째 주 처리
        if (weekOfMonth < 1 || weekOfMonth > 4) {
            log.warn("잘못된 주차 설정: {}", weekOfMonth);
            return null;
        }
        
        // 해당 월의 첫 번째 해당 요일 찾기
        LocalDate firstDayOfMonth = month.withDayOfMonth(1);
        LocalDate firstOccurrence = firstDayOfMonth.with(TemporalAdjusters.firstInMonth(dayOfWeek));
        
        // 목표 주차까지 이동
        LocalDate targetDate = firstOccurrence.plusWeeks(weekOfMonth - 1);
        
        // 해당 월 내에 있는지 확인
        if (targetDate.getMonthValue() != month.getMonthValue()) {
            return null;
        }
        
        return targetDate;
    }

    /**
     * 특정 월의 마지막 해당 요일 찾기
     * 
     * @param month 대상 월
     * @param dayOfWeek 요일
     * @return 해당 월의 마지막 해당 요일
     */
    private LocalDate findLastOccurrenceInMonth(LocalDate month, DayOfWeek dayOfWeek) {
        return month.with(TemporalAdjusters.lastInMonth(dayOfWeek));
    }
}
