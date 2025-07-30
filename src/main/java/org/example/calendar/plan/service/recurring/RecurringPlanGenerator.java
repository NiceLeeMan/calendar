package org.example.calendar.plan.service.recurring;

import lombok.RequiredArgsConstructor;
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
 * 반복 일정 인스턴스 생성기
 * 
 * <h3>역할</h3>
 * <ul>
 *   <li>반복 설정을 기반으로 구체적인 날짜 인스턴스 생성</li>
 *   <li>월별 조회 시 프론트엔드가 사용할 수 있는 형태로 변환</li>
 *   <li>예외 날짜 처리</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-25
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RecurringPlanGenerator {

    private final PlanMapper planMapper;

    /**
     * 반복 일정의 월별 인스턴스 생성
     */
    public List<PlanResponse> generateRecurringInstances(Plan plan, LocalDate monthStart, LocalDate monthEnd) {
        List<PlanResponse> instances = new ArrayList<>();
        RecurringInfo recurring = plan.getRecurringInfo();
        
        if (recurring == null) {
            return instances;
        }
        
        switch (recurring.getRepeatUnit()) {
            case WEEKLY -> generateWeeklyInstances(plan, monthStart, monthEnd, instances);
            case MONTHLY -> generateMonthlyInstances(plan, monthStart, monthEnd, instances);
            case YEARLY -> generateYearlyInstances(plan, monthStart, monthEnd, instances);
        }
        
        return instances;
    }

    /**
     * 주간 반복 인스턴스 생성 (가장 일반적)
     */
    private void generateWeeklyInstances(Plan plan, LocalDate monthStart, LocalDate monthEnd, List<PlanResponse> instances) {
        RecurringInfo recurring = plan.getRecurringInfo();
        LocalDate planStart = plan.getStartDate();
        LocalDate recurringEnd = recurring.getEndDate(); // 반복 종료일 확인
        
        for (DayOfWeek targetDayOfWeek : recurring.getRepeatWeekdays()) {
            LocalDate current = monthStart.with(TemporalAdjusters.firstInMonth(targetDayOfWeek));
            
            // 계획 시작일 이전은 제외
            if (current.isBefore(planStart)) {
                current = current.plusWeeks(1);
            }
            
            while (!current.isAfter(monthEnd) && (recurringEnd == null || !current.isAfter(recurringEnd))) {
                // 예외 날짜가 아닌 경우만 추가
                if (!recurring.getExceptionDates().contains(current)) {
                    PlanResponse instance = planMapper.toPlanResponse(plan);
                    instance.setStartDate(current);
                    instance.setEndDate(current.plusDays(plan.getEndDate().toEpochDay() - plan.getStartDate().toEpochDay()));
                    instances.add(instance);
                }
                
                current = current.plusWeeks(recurring.getRepeatInterval());
            }
        }
    }

    /**
     * 월간 반복 인스턴스 생성
     */
    private void generateMonthlyInstances(Plan plan, LocalDate monthStart, LocalDate monthEnd, List<PlanResponse> instances) {
        RecurringInfo recurring = plan.getRecurringInfo();
        LocalDate recurringEnd = recurring.getEndDate(); // 반복 종료일 확인
        
        if (recurring.getRepeatDayOfMonth() != null) {
            // 매월 특정 일 (예: 매월 15일)
            LocalDate current = monthStart.withDayOfMonth(Math.min(recurring.getRepeatDayOfMonth(), monthStart.lengthOfMonth()));
            
            if (!current.isBefore(plan.getStartDate()) && !current.isAfter(monthEnd) && 
                (recurringEnd == null || !current.isAfter(recurringEnd)) &&
                !recurring.getExceptionDates().contains(current)) {
                
                PlanResponse instance = planMapper.toPlanResponse(plan);
                instance.setStartDate(current);
                instance.setEndDate(current.plusDays(plan.getEndDate().toEpochDay() - plan.getStartDate().toEpochDay()));
                instances.add(instance);
            }
        }
    }

    /**
     * 연간 반복 인스턴스 생성
     */
    private void generateYearlyInstances(Plan plan, LocalDate monthStart, LocalDate monthEnd, List<PlanResponse> instances) {
        RecurringInfo recurring = plan.getRecurringInfo();
        LocalDate recurringEnd = recurring.getEndDate(); // 반복 종료일 확인
        
        if (recurring.getRepeatMonth() != null && recurring.getRepeatDayOfYear() != null) {
            if (monthStart.getMonthValue() == recurring.getRepeatMonth()) {
                LocalDate current = LocalDate.of(monthStart.getYear(), recurring.getRepeatMonth(), 
                        Math.min(recurring.getRepeatDayOfYear(), monthStart.lengthOfMonth()));
                
                if (!current.isBefore(plan.getStartDate()) && !current.isAfter(monthEnd) && 
                    (recurringEnd == null || !current.isAfter(recurringEnd)) &&
                    !recurring.getExceptionDates().contains(current)) {
                    
                    PlanResponse instance = planMapper.toPlanResponse(plan);
                    instance.setStartDate(current);
                    instance.setEndDate(current.plusDays(plan.getEndDate().toEpochDay() - plan.getStartDate().toEpochDay()));
                    instances.add(instance);
                }
            }
        }
    }
}
