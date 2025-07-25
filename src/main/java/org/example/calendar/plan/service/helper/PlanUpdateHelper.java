package org.example.calendar.plan.service.helper;

import lombok.RequiredArgsConstructor;
import org.example.calendar.plan.dto.request.PlanUpdateReq;
import org.example.calendar.plan.entity.Plan;
import org.example.calendar.plan.entity.PlanAlarm;
import org.example.calendar.plan.mapper.PlanMapper;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Plan 업데이트 헬퍼 클래스
 * 
 * <h3>역할</h3>
 * <ul>
 *   <li>계획 기본 필드 업데이트</li>
 *   <li>반복 설정 업데이트</li>
 *   <li>알람 설정 업데이트</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-25
 */
@Component
@RequiredArgsConstructor
public class PlanUpdateHelper {

    private final PlanMapper planMapper;

    /**
     * 기본 필드 업데이트
     */
    public void updateBasicFields(Plan plan, PlanUpdateReq request) {
        if (request.getPlanName() != null) plan.setPlanName(request.getPlanName());
        if (request.getPlanContent() != null) plan.setPlanContent(request.getPlanContent());
        if (request.getStartDate() != null) plan.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) plan.setEndDate(request.getEndDate());
        if (request.getStartTime() != null) plan.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) plan.setEndTime(request.getEndTime());
        if (request.getLocation() != null) plan.setLocation(request.getLocation());
        if (request.getIsRecurring() != null) plan.setIsRecurring(request.getIsRecurring());
    }

    /**
     * 반복 정보 업데이트
     */
    public void updateRecurringInfo(Plan plan, PlanUpdateReq request) {
        if (Boolean.TRUE.equals(request.getIsRecurring()) && request.getRecurringPlan() != null) {
            if (plan.getRecurringInfo() == null) {
                plan.setRecurringInfo(planMapper.toRecurringInfo(request.getRecurringPlan()));
            } else {
                planMapper.updateRecurringInfo(plan.getRecurringInfo(), request.getRecurringPlan());
            }
        } else if (Boolean.FALSE.equals(request.getIsRecurring())) {
            plan.setRecurringInfo(null);
        }
    }

    /**
     * 알람 업데이트
     */
    public void updateAlarms(Plan plan, PlanUpdateReq request) {
        if (request.getAlarms() != null) {
            plan.getAlarms().clear();
            if (!request.getAlarms().isEmpty()) {
                Set<PlanAlarm> newAlarms = planMapper.toPlanAlarms(plan, request.getAlarms());
                plan.setAlarms(newAlarms);
            }
        }
    }
}
