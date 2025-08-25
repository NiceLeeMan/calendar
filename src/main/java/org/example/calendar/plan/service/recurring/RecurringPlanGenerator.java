package org.example.calendar.plan.service.recurring;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.calendar.plan.dto.response.PlanResponse;
import org.example.calendar.plan.entity.Plan;
import org.example.calendar.plan.entity.RecurringInfo;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 반복 일정 인스턴스 생성기 (메인 컨트롤러)
 * 
 * <h3>역할</h3>
 * <ul>
 *   <li>반복 설정을 기반으로 구체적인 날짜 인스턴스 생성</li>
 *   <li>반복 단위별 전용 Generator에 작업 위임</li>
 *   <li>월별 조회 시 프론트엔드가 사용할 수 있는 형태로 변환</li>
 *   <li>예외 날짜 처리</li>
 * </ul>
 * 
 * <h3>지원하는 반복 패턴</h3>
 * <ul>
 *   <li><strong>주간 반복</strong>: 매주 특정 요일들, N주 간격</li>
 *   <li><strong>월간 반복</strong>: 특정 날짜 또는 주차+요일, N개월 간격</li>
 *   <li><strong>연간 반복</strong>: 특정 월의 특정 일, N년 간격</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-25
 * @updated 2025-08-22 - 반복 단위별 Generator 분할
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RecurringPlanGenerator {

    private final WeeklyRecurringGenerator weeklyGenerator;
    private final MonthlyRecurringGenerator monthlyGenerator;
    private final YearlyRecurringGenerator yearlyGenerator;

    /**
     * 반복 일정의 월별 인스턴스 생성 (메인 진입점)
     * 
     * @param plan 원본 반복 계획
     * @param monthStart 조회 월 시작일
     * @param monthEnd 조회 월 종료일
     * @return 생성된 인스턴스 목록
     */
    public List<PlanResponse> generateRecurringInstances(Plan plan, LocalDate monthStart, LocalDate monthEnd) {
        if (plan == null || !Boolean.TRUE.equals(plan.getIsRecurring())) {
            return new ArrayList<>();
        }
        
        RecurringInfo recurring = plan.getRecurringInfo();
        if (recurring == null || recurring.getRepeatUnit() == null) {
            log.warn("반복 설정이 없습니다. planId: {}", plan.getId());
            return new ArrayList<>();
        }
        
        List<PlanResponse> instances;
        
        try {
            // 반복 단위별로 해당 Generator에 위임
            instances = switch (recurring.getRepeatUnit()) {
                case WEEKLY -> weeklyGenerator.generateInstances(plan, monthStart, monthEnd);
                case MONTHLY -> monthlyGenerator.generateInstances(plan, monthStart, monthEnd);
                case YEARLY -> yearlyGenerator.generateInstances(plan, monthStart, monthEnd);
            };
            
        } catch (Exception e) {
            log.error("반복 인스턴스 생성 중 오류 발생 - planId: {}, repeatUnit: {}", 
                    plan.getId(), recurring.getRepeatUnit(), e);
            return new ArrayList<>();
        }
        return instances;
    }
}
