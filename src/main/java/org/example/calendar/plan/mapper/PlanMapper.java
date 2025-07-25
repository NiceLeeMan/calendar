package org.example.calendar.plan.mapper;

import org.example.calendar.plan.dto.common.AlarmReqInfo;
import org.example.calendar.plan.dto.common.AlarmResInfo;
import org.example.calendar.plan.dto.common.RecurringReqInfo;
import org.example.calendar.plan.dto.common.RecurringResInfo;
import org.example.calendar.plan.dto.response.PlanResponse;
import org.example.calendar.plan.entity.Plan;
import org.example.calendar.plan.entity.PlanAlarm;
import org.example.calendar.plan.entity.RecurringInfo;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Plan 관련 엔티티와 DTO 변환 매퍼
 * 
 * <h3>역할</h3>
 * <ul>
 *   <li>Plan ↔ PlanResponse 변환</li>
 *   <li>RecurringInfo ↔ RecurringResInfo 변환</li>
 *   <li>PlanAlarm ↔ AlarmResInfo 변환</li>
 *   <li>Request DTO → Entity 변환</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-25
 */
@Component
public class PlanMapper {

    /**
     * Plan 엔티티를 PlanResponse로 변환
     */
    public PlanResponse toPlanResponse(Plan plan) {
        return PlanResponse.builder()
                .id(plan.getId())
                .planName(plan.getPlanName())
                .planContent(plan.getPlanContent())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .startTime(plan.getStartTime())
                .endTime(plan.getEndTime())
                .isRecurring(plan.getIsRecurring())
                .recurringResInfo(toRecurringResInfo(plan.getRecurringInfo()))
                .alarms(toAlarmResInfos(plan.getAlarms()))
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .userId(plan.getUser().getId())
                .userName(plan.getUser().getName())
                .build();
    }

    /**
     * RecurringReqInfo를 RecurringInfo 엔티티로 변환
     */
    public RecurringInfo toRecurringInfo(RecurringReqInfo request) {
        return RecurringInfo.builder()
                .repeatUnit(request.getRepeatUnit())
                .repeatInterval(request.getRepeatInterval())
                .repeatWeekdays(request.getRepeatWeekdays() != null ? new HashSet<>(request.getRepeatWeekdays()) : new HashSet<>())
                .repeatDayOfMonth(request.getRepeatDayOfMonth())
                .repeatWeeksOfMonth(request.getRepeatWeeksOfMonth() != null ? new HashSet<>(request.getRepeatWeeksOfMonth()) : new HashSet<>())
                .repeatMonth(request.getRepeatMonth())
                .repeatDayOfYear(request.getRepeatDayOfYear())
                .exceptionDates(new HashSet<>())
                .build();
    }

    /**
     * AlarmReqInfo 리스트를 PlanAlarm Set으로 변환
     */
    public Set<PlanAlarm> toPlanAlarms(Plan plan, List<AlarmReqInfo> alarmReqs) {
        return alarmReqs.stream()
                .filter(req -> req.getAlarmTime() != null)
                .map(req -> PlanAlarm.builder()
                        .plan(plan)
                        .alarmDate(req.getAlarmDate() != null ? req.getAlarmDate() : plan.getStartDate())
                        .alarmTime(req.getAlarmTime())
                        .build())
                .collect(Collectors.toSet());
    }

    /**
     * RecurringInfo를 RecurringResInfo로 변환
     */
    private RecurringResInfo toRecurringResInfo(RecurringInfo recurringInfo) {
        if (recurringInfo == null) return null;

        return RecurringResInfo.builder()
                .repeatUnit(recurringInfo.getRepeatUnit().name())
                .repeatInterval(recurringInfo.getRepeatInterval())
                .repeatWeekdays(recurringInfo.getRepeatWeekdays().stream().map(Enum::name).toList())
                .repeatDayOfMonth(recurringInfo.getRepeatDayOfMonth())
                .repeatWeeksOfMonth(recurringInfo.getRepeatWeeksOfMonth().stream().toList())
                .repeatMonth(recurringInfo.getRepeatMonth())
                .repeatDayOfYear(recurringInfo.getRepeatDayOfYear())
                .exceptionDates(recurringInfo.getExceptionDates().stream().map(LocalDate::toString).toList())
                .build();
    }

    /**
     * PlanAlarm Set을 AlarmResInfo 리스트로 변환
     */
    private List<AlarmResInfo> toAlarmResInfos(Set<PlanAlarm> alarms) {
        if (alarms == null || alarms.isEmpty()) return List.of();

        return alarms.stream()
                .map(alarm -> AlarmResInfo.builder()
                        .id(alarm.getId())
                        .alarmDate(alarm.getAlarmDate())
                        .alarmTime(alarm.getAlarmTime())
                        .alarmStatus(alarm.getAlarmStatus().name())
                        .build())
                .toList();
    }

    /**
     * 기존 RecurringInfo 업데이트
     */
    public void updateRecurringInfo(RecurringInfo existing, RecurringReqInfo request) {
        existing.setRepeatUnit(request.getRepeatUnit());
        existing.setRepeatInterval(request.getRepeatInterval());
        existing.setRepeatWeekdays(request.getRepeatWeekdays() != null ? new HashSet<>(request.getRepeatWeekdays()) : new HashSet<>());
        existing.setRepeatDayOfMonth(request.getRepeatDayOfMonth());
        existing.setRepeatWeeksOfMonth(request.getRepeatWeeksOfMonth() != null ? new HashSet<>(request.getRepeatWeeksOfMonth()) : new HashSet<>());
        existing.setRepeatMonth(request.getRepeatMonth());
        existing.setRepeatDayOfYear(request.getRepeatDayOfYear());
    }
}
