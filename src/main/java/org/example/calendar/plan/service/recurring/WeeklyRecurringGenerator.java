package org.example.calendar.plan.service.recurring;

import lombok.extern.slf4j.Slf4j;
import org.example.calendar.plan.dto.response.PlanResponse;
import org.example.calendar.plan.entity.Plan;
import org.example.calendar.plan.entity.RecurringInfo;
import org.example.calendar.plan.mapper.PlanMapper;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 주간 반복 일정 전용 생성기
 * 
 * <h3>지원 기능</h3>
 * <ul>
 *   <li>매주 특정 요일들 반복 (예: 매주 월, 수, 금)</li>
 *   <li>N주 간격 반복 (예: 격주, 3주마다)</li>
 *   <li>복수 요일 동시 지원</li>
 *   <li>예외 날짜 처리</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-08-22
 */
@Component
@Slf4j
public class WeeklyRecurringGenerator implements RecurringGenerator {

    private final PlanMapper planMapper;

    public WeeklyRecurringGenerator(PlanMapper planMapper) {
        this.planMapper = planMapper;
    }

    @Override
    public List<PlanResponse> generateInstances(Plan plan, LocalDate monthStart, LocalDate monthEnd) {
        List<PlanResponse> instances = new ArrayList<>();
        RecurringInfo recurring = plan.getRecurringInfo();
        
        if (recurring == null || recurring.getRepeatWeekdays() == null || recurring.getRepeatWeekdays().isEmpty()) {
            log.warn("주간 반복 설정이 올바르지 않습니다. planId: {}", plan.getId());
            return instances;
        }
        
        for (DayOfWeek targetDayOfWeek : recurring.getRepeatWeekdays()) {
            generateInstancesForDayOfWeek(plan, monthStart, monthEnd, targetDayOfWeek, instances);
        }
        
        log.info("🏁 주간 반복 인스턴스 생성 완료: 총 {}개 인스턴스 생성 (planId: {})", instances.size(), plan.getId());
        return instances;
    }

    /**
     * 특정 요일에 대한 주간 반복 인스턴스 생성
     */
    private void generateInstancesForDayOfWeek(Plan plan, LocalDate monthStart, LocalDate monthEnd, 
                                               DayOfWeek targetDayOfWeek, List<PlanResponse> instances) {
        RecurringInfo recurring = plan.getRecurringInfo();
        LocalDate planStart = plan.getStartDate();
        
        // 원래 계획 시작일부터 해당 요일의 첫 번째 발생일 찾기
        LocalDate firstOccurrence = findFirstOccurrenceOfDayOfWeek(planStart, targetDayOfWeek);
        
        // 첫 발생일부터 반복 간격으로 계산하여 해당 월에 포함되는 날짜들 찾기
        LocalDate current = firstOccurrence;
        
        // 현재 월 이전의 발생들을 건너뛰어 현재 월에 가까운 발생일 찾기
        while (current.isBefore(monthStart)) {
            current = current.plusWeeks(recurring.getRepeatInterval());
        }
        
        // 해당 월 범위 내에서 반복 인스턴스 생성
        while (!current.isAfter(monthEnd)) {
            if (RecurringGeneratorUtils.isValidInstance(plan, current, monthStart, monthEnd)) {
                PlanResponse instance = RecurringGeneratorUtils.createPlanInstance(plan, current, planMapper);
                instances.add(instance);
                log.debug("주간 반복 인스턴스 생성: {} ({})", current, targetDayOfWeek);
            }
            
            current = current.plusWeeks(recurring.getRepeatInterval());
        }
    }
    
    /**
     * 주어진 시작일부터 특정 요일의 첫 번째 발생일 찾기
     */
    private LocalDate findFirstOccurrenceOfDayOfWeek(LocalDate startDate, DayOfWeek targetDayOfWeek) {
        LocalDate current = startDate;
        
        // 시작일이 이미 목표 요일인 경우
        if (current.getDayOfWeek() == targetDayOfWeek) {
            return current;
        }
        
        // 시작일부터 목표 요일까지 날짜 이동
        while (current.getDayOfWeek() != targetDayOfWeek) {
            current = current.plusDays(1);
        }
        
        return current;
    }
}
