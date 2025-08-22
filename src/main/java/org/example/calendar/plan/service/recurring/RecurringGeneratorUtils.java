package org.example.calendar.plan.service.recurring;

import org.example.calendar.plan.dto.response.PlanResponse;
import org.example.calendar.plan.entity.Plan;
import org.example.calendar.plan.mapper.PlanMapper;

import java.time.LocalDate;

/**
 * 반복 일정 생성기 공통 유틸리티 클래스
 * 
 * <h3>제공 기능</h3>
 * <ul>
 *   <li>PlanResponse 인스턴스 생성</li>
 *   <li>인스턴스 유효성 검증</li>
 *   <li>공통 날짜 계산 로직</li>
 * </ul>
 * 
 * <p>이 클래스는 정적 메서드만 제공하며, 모든 반복 Generator에서 공통으로 사용됩니다.</p>
 *
 * @author Calendar Team
 * @since 2025-08-22
 */
public final class RecurringGeneratorUtils {

    private RecurringGeneratorUtils() {
        // 유틸리티 클래스 - 인스턴스 생성 방지
    }

    /**
     * 기본 PlanResponse 인스턴스 생성
     * 
     * @param originalPlan 원본 계획
     * @param instanceDate 인스턴스 날짜
     * @param planMapper PlanMapper 인스턴스
     * @return 생성된 PlanResponse 인스턴스
     */
    public static PlanResponse createPlanInstance(Plan originalPlan, LocalDate instanceDate, PlanMapper planMapper) {
        PlanResponse instance = planMapper.toPlanResponse(originalPlan);
        
        // 시작 날짜를 인스턴스 날짜로 설정
        instance.setStartDate(instanceDate);
        
        // 종료 날짜 계산 (원본 계획의 기간만큼 유지)
        long daysBetween = originalPlan.getEndDate().toEpochDay() - originalPlan.getStartDate().toEpochDay();
        instance.setEndDate(instanceDate.plusDays(daysBetween));
        
        return instance;
    }

    /**
     * 인스턴스 생성 가능 여부 검증
     * 
     * @param plan 원본 계획
     * @param instanceDate 인스턴스 날짜
     * @param monthStart 조회 월 시작일
     * @param monthEnd 조회 월 종료일
     * @return 생성 가능 여부
     */
    public static boolean isValidInstance(Plan plan, LocalDate instanceDate, LocalDate monthStart, LocalDate monthEnd) {
        // null 체크
        if (plan == null || instanceDate == null || monthStart == null || monthEnd == null) {
            return false;
        }
        
        // 계획 시작일 이후여야 함
        if (instanceDate.isBefore(plan.getStartDate())) {
            return false;
        }
        
        // 조회 월 범위 내에 있어야 함
        if (instanceDate.isBefore(monthStart) || instanceDate.isAfter(monthEnd)) {
            return false;
        }
        
        // 반복 종료일 확인
        if (plan.getRecurringInfo() != null && plan.getRecurringInfo().getEndDate() != null) {
            if (instanceDate.isAfter(plan.getRecurringInfo().getEndDate())) {
                return false;
            }
        }
        
        // 예외 날짜 확인
        if (plan.getRecurringInfo() != null && 
            plan.getRecurringInfo().getExceptionDates() != null &&
            plan.getRecurringInfo().getExceptionDates().contains(instanceDate)) {
            return false;
        }
        
        return true;
    }

    /**
     * 두 날짜 사이의 기간(일 수) 계산
     * 
     * @param startDate 시작 날짜
     * @param endDate 종료 날짜
     * @return 기간(일 수)
     */
    public static long calculateDaysBetween(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            return 0;
        }
        return endDate.toEpochDay() - startDate.toEpochDay();
    }

    /**
     * 월의 유효한 일수로 조정
     * 
     * @param year 년도
     * @param month 월
     * @param day 일
     * @return 조정된 일 (해당 월의 최대 일수 이내)
     */
    public static int adjustDayOfMonth(int year, int month, int day) {
        try {
            LocalDate firstDayOfMonth = LocalDate.of(year, month, 1);
            int maxDay = firstDayOfMonth.lengthOfMonth();
            return Math.min(day, maxDay);
        } catch (Exception e) {
            return 1; // 기본값
        }
    }

    /**
     * 유효한 날짜 생성 (예외 처리 포함)
     * 
     * @param year 년도
     * @param month 월
     * @param day 일
     * @return 생성된 날짜 (유효하지 않으면 null)
     */
    public static LocalDate createSafeDate(int year, int month, int day) {
        try {
            int adjustedDay = adjustDayOfMonth(year, month, day);
            return LocalDate.of(year, month, adjustedDay);
        } catch (Exception e) {
            return null;
        }
    }
}
