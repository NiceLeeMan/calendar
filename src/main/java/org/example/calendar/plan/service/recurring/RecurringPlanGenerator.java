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
        
        log.info("🔍 generateWeeklyInstances: 계획={}, 월범위={} ~ {}, 반복종료일={}", 
                plan.getPlanName(), monthStart, monthEnd, recurringEnd);
        log.info("    계획기간: {} ~ {}, 반복간격: {}주, 요일들: {}", 
                planStart, plan.getEndDate(), recurring.getRepeatInterval(), recurring.getRepeatWeekdays());
        
        // 반복 종료일이 설정된 경우, 조회 범위를 종료일까지로 제한
        LocalDate effectiveEnd = monthEnd;
        if (recurringEnd != null && recurringEnd.isBefore(monthEnd)) {
            effectiveEnd = recurringEnd;
        }
        
        for (DayOfWeek targetDayOfWeek : recurring.getRepeatWeekdays()) {
            log.info("  📅 {} 요일 처리 시작", targetDayOfWeek);
            
            // 원래 계획 시작일부터 해당 요일의 첫 번째 발생일 찾기
            LocalDate firstOccurrence = findFirstOccurrenceOfDayOfWeek(planStart, targetDayOfWeek);
            log.info("    첫 발생일: {}", firstOccurrence);
            
            // 첫 발생일부터 반복 간격으로 계산하여 해당 월에 포함되는 날짜들 찾기
            LocalDate current = firstOccurrence;
            
            // 현재 월 이전의 발생들을 건너뛰어 현재 월에 가까운 발생일 찾기
            while (current.isBefore(monthStart)) {
                current = current.plusWeeks(recurring.getRepeatInterval());
                log.info("    건너뛰기: {} (월 시작 이전)", current.minusWeeks(recurring.getRepeatInterval()));
            }
            log.info("    처리 시작점: {}", current);
            
            // 해당 월 범위 내에서 반복 인스턴스 생성
            while (!current.isAfter(effectiveEnd)) {
                log.info("    검토 중: {} (월범위: {} ~ {}, 효과적종료: {})", 
                        current, monthStart, monthEnd, effectiveEnd);
                
                // 현재 월 범위에 포함되고 예외 날짜가 아닌 경우만 추가
                if (!current.isBefore(monthStart) && !current.isAfter(monthEnd) && 
                    !recurring.getExceptionDates().contains(current)) {
                    
                    PlanResponse instance = planMapper.toPlanResponse(plan);
                    instance.setStartDate(current);
                    instance.setEndDate(plan.getEndDate());
                    instances.add(instance);
                    log.info("    ✅ 인스턴스 생성: {} ~ {}", instance.getStartDate(), instance.getEndDate());
                } else {
                    log.info("    ❌ 조건 불만족: 월범위({} ~ {}) 벗어남 또는 예외날짜", monthStart, monthEnd);
                }

                current = current.plusWeeks(recurring.getRepeatInterval());
            }
            log.info("  📅 {} 요일 처리 완료", targetDayOfWeek);
        }
        
        log.info("🏁 generateWeeklyInstances 완료: 총 {}개 인스턴스 생성", instances.size());
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
