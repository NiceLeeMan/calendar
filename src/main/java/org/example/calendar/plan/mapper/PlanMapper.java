package org.example.calendar.plan.mapper;

import lombok.extern.slf4j.Slf4j;
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
     * Plan의 startDate와 endDate를 반복 기간으로 사용
     */
    public RecurringInfo toRecurringInfo(RecurringReqInfo request, LocalDate planStartDate, LocalDate planEndDate) {
        return RecurringInfo.builder()
                .repeatUnit(request.getRepeatUnit())
                .repeatInterval(request.getRepeatInterval())
                .repeatWeekdays(request.getRepeatWeekdays() != null ? new HashSet<>(request.getRepeatWeekdays()) : new HashSet<>())
                .repeatDayOfMonth(request.getRepeatDayOfMonth())
                .repeatWeeksOfMonth(request.getRepeatWeeksOfMonth() != null ? new HashSet<>(request.getRepeatWeeksOfMonth()) : new HashSet<>())
                .repeatMonth(request.getRepeatMonth())
                .repeatDayOfYear(request.getRepeatDayOfYear())
                .startDate(planStartDate)  // Plan의 startDate를 반복 시작일로 사용
                .endDate(planEndDate)      // Plan의 endDate를 반복 종료일로 사용
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
                .startDate(recurringInfo.getStartDate() != null ? recurringInfo.getStartDate().toString() : null)
                .endDate(recurringInfo.getEndDate() != null ? recurringInfo.getEndDate().toString() : null)
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
     * 컬렉션 재생성 후 새 데이터 직접 설정 (JPA 더티체킹 문제 해결)
     */
    public void updateRecurringInfo(RecurringInfo existing, RecurringReqInfo request, LocalDate planStartDate, LocalDate planEndDate) {
        existing.setRepeatUnit(request.getRepeatUnit());
        existing.setRepeatInterval(request.getRepeatInterval());

        // repeatWeekdays 업데이트 - 새로운 HashSet으로 직접 교체
        if (request.getRepeatWeekdays() != null) {
            existing.setRepeatWeekdays(new HashSet<>(request.getRepeatWeekdays()));
        }

        existing.setRepeatDayOfMonth(request.getRepeatDayOfMonth());

        // repeatWeeksOfMonth 업데이트 - 새로운 HashSet으로 직접 교체
        if (request.getRepeatWeeksOfMonth() != null) {
            existing.setRepeatWeeksOfMonth(new HashSet<>(request.getRepeatWeeksOfMonth()));
        }

        existing.setRepeatMonth(request.getRepeatMonth());
        existing.setRepeatDayOfYear(request.getRepeatDayOfYear());
        existing.setStartDate(planStartDate);  // Plan의 startDate를 반복 시작일로 사용
        existing.setEndDate(planEndDate);      // Plan의 endDate를 반복 종료일로 사용
    }
}
