package org.example.calendar.plan.service.recurring;

import org.example.calendar.plan.dto.response.PlanResponse;
import org.example.calendar.plan.entity.Plan;

import java.time.LocalDate;
import java.util.List;

/**
 * 반복 일정 생성기 인터페이스
 * 
 * <h3>역할</h3>
 * <ul>
 *   <li>각 반복 단위별 Generator의 공통 인터페이스 정의</li>
 *   <li>일관된 API 제공</li>
 *   <li>확장성 및 테스트 용이성 보장</li>
 * </ul>
 * 
 * <h3>구현체</h3>
 * <ul>
 *   <li>{@link WeeklyRecurringGenerator} - 주간 반복</li>
 *   <li>{@link MonthlyRecurringGenerator} - 월간 반복</li>
 *   <li>{@link YearlyRecurringGenerator} - 연간 반복</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-08-22
 */
public interface RecurringGenerator {

    /**
     * 반복 일정의 월별 인스턴스 생성
     * 
     * @param plan 원본 반복 계획
     * @param monthStart 조회 월 시작일
     * @param monthEnd 조회 월 종료일
     * @return 생성된 인스턴스 목록
     */
    List<PlanResponse> generateInstances(Plan plan, LocalDate monthStart, LocalDate monthEnd);
}
