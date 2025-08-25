package org.example.calendar.plan.service.recurring;

import lombok.extern.slf4j.Slf4j;
import org.example.calendar.plan.dto.response.PlanResponse;
import org.example.calendar.plan.entity.Plan;
import org.example.calendar.plan.entity.RecurringInfo;
import org.example.calendar.plan.mapper.PlanMapper;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 연간 반복 일정 전용 생성기
 * 
 * <h3>지원 기능</h3>
 * <ul>
 *   <li>매년 특정 월의 특정 일 반복 (예: 매년 12월 25일)</li>
 *   <li>N년 간격 반복 (예: 격년, 3년마다)</li>
 *   <li>윤년 처리 (2월 29일 등)</li>
 *   <li>예외 날짜 처리</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-08-22
 */
@Component
@Slf4j
public class YearlyRecurringGenerator implements RecurringGenerator {

    private final PlanMapper planMapper;

    public YearlyRecurringGenerator(PlanMapper planMapper) {
        this.planMapper = planMapper;
    }

    @Override
    public List<PlanResponse> generateInstances(Plan plan, LocalDate monthStart, LocalDate monthEnd) {
        List<PlanResponse> instances = new ArrayList<>();
        RecurringInfo recurring = plan.getRecurringInfo();
        
        if (recurring == null || recurring.getRepeatMonth() == null || recurring.getRepeatDayOfYear() == null) {
            log.warn("연간 반복 설정이 올바르지 않습니다. planId: {}", plan.getId());
            return instances;
        }
        
        // 조회 월이 반복 대상 월과 일치하는 경우만 처리
        if (monthStart.getMonthValue() <= recurring.getRepeatMonth() && 
            monthEnd.getMonthValue() >= recurring.getRepeatMonth()) {
            
            generateYearlyInstance(plan, monthStart, monthEnd, instances);
        }

        return instances;
    }

    /**
     * 연간 반복 인스턴스 생성
     */
    private void generateYearlyInstance(Plan plan, LocalDate monthStart, LocalDate monthEnd, 
                                      List<PlanResponse> instances) {
        RecurringInfo recurring = plan.getRecurringInfo();
        LocalDate planStart = plan.getStartDate();
        int targetMonth = recurring.getRepeatMonth();
        int targetDay = recurring.getRepeatDayOfYear();

        // 계획 시작 연도부터 현재 조회 연도까지 해당하는 연도들을 찾기
        int currentYear = planStart.getYear();
        int queryYear = monthStart.getYear();

        // 조회 범위 이전 연도들을 건너뛰기
        while (currentYear < queryYear) {
            currentYear += recurring.getRepeatInterval();
        }

        // 조회 범위 내 연도에서 인스턴스 생성
        if (currentYear == queryYear) {
            LocalDate instanceDate = RecurringGeneratorUtils.createSafeDate(currentYear, targetMonth, targetDay);

            if (instanceDate != null && RecurringGeneratorUtils.isValidInstance(plan, instanceDate, monthStart, monthEnd)) {
                PlanResponse instance = RecurringGeneratorUtils.createPlanInstance(plan, instanceDate, planMapper);
                instances.add(instance);
            }
        }
    }
}
