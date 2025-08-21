package org.example.calendar.plan.service.helper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.calendar.plan.dto.request.PlanUpdateReq;
import org.example.calendar.plan.entity.Plan;
import org.example.calendar.plan.entity.PlanAlarm;
import org.example.calendar.plan.mapper.PlanMapper;
import org.example.calendar.plan.repository.RecurringInfoRepository;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Objects;
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
@Slf4j
@Component
@RequiredArgsConstructor
public class PlanUpdateHelper {

    private final PlanMapper planMapper;
    private final RecurringInfoRepository recurringInfoRepository;

    /**
     * 변경사항에 따라 필요한 업데이트만 실행
     */
    public void updatePlan(Plan plan, PlanUpdateReq request) {
        // 기본 필드 변경사항이 있으면 업데이트
        if (hasBasicFieldChanges(request)) {
            updateBasicFields(plan, request);
        }
        
        // 반복 필드 변경사항이 있으면 업데이트
        if (hasRecurringFieldChanges(plan, request)) {
            updateRecurringFields(plan, request);
        }
        
        // 알람 필드 변경사항이 있으면 업데이트
        if (hasAlarmFieldChanges(request)) {
            updateAlarmFields(plan, request);
        }
    }

    // ========== 변경사항 감지 ==========
    
    /**
     * 기본 필드 변경사항 확인
     */
    private boolean hasBasicFieldChanges(PlanUpdateReq request) {
        return request.getPlanName() != null ||
               request.getPlanContent() != null ||
               request.getStartDate() != null ||
               request.getEndDate() != null ||
               request.getStartTime() != null ||
               request.getEndTime() != null ||
               request.getIsRecurring() != null;
    }
    
    /**
     * 반복 필드 변경사항 확인
     */
    private boolean hasRecurringFieldChanges(Plan plan, PlanUpdateReq request) {
        // 반복 해제하는 경우
        if (Boolean.FALSE.equals(request.getIsRecurring())) {
            log.info("반복계획 해제 요청");
            return true;
        }
        
        // 반복 설정이 없으면 변경사항 없음
        if (!Boolean.TRUE.equals(request.getIsRecurring()) || request.getRecurringPlan() == null) {
            log.info("반복 필드 변경사항 없음");
            return false;
        }
        
        // 새로운 반복정보 생성하는 경우
        if (plan.getRecurringInfo() == null) {
            log.info("새로운 반복정보 생성 필요");
            return true;
        }
        
        // 기존 반복정보와 비교
        boolean changed = isRecurringInfoChanged(plan.getRecurringInfo(), request.getRecurringPlan());
        if (changed) {
            log.info("반복정보 변경 감지");
        } else {
            log.info("반복정보 변경 없음");
        }
        return changed;
    }
    
    /**
     * 알람 필드 변경사항 확인
     */
    private boolean hasAlarmFieldChanges(PlanUpdateReq request) {
        return request.getAlarms() != null;
    }

    // ========== 업데이트 실행 ==========
    
    /**
     * 기본 필드 업데이트
     */
    private void updateBasicFields(Plan plan, PlanUpdateReq request) {
        log.info("기본 필드 업데이트 실행");
        if (request.getPlanName() != null) plan.setPlanName(request.getPlanName());
        if (request.getPlanContent() != null) plan.setPlanContent(request.getPlanContent());
        if (request.getStartDate() != null) plan.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) plan.setEndDate(request.getEndDate());
        if (request.getStartTime() != null) plan.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) plan.setEndTime(request.getEndTime());
        if (request.getIsRecurring() != null) plan.setIsRecurring(request.getIsRecurring());
    }

    /**
     * 반복 필드 업데이트
     */
    private void updateRecurringFields(Plan plan, PlanUpdateReq request) {
        log.info("반복 필드 업데이트 실행");
        
        // 반복 해제
        if (Boolean.FALSE.equals(request.getIsRecurring())) {
            plan.setRecurringInfo(null);
            log.info("반복계획 해제 완료");
            return;
        }
        
        // 반복 설정
        if (Boolean.TRUE.equals(request.getIsRecurring()) && request.getRecurringPlan() != null) {
            if (plan.getRecurringInfo() == null) {
                // 새로운 반복정보 생성
                createNewRecurringInfo(plan, request);
            } else {
                // 기존 반복정보 업데이트
                updateExistingRecurringInfo(plan, request);
            }
        }
    }
    
    /**
     * 알람 필드 업데이트
     */
    private void updateAlarmFields(Plan plan, PlanUpdateReq request) {
        log.info("알람 필드 업데이트 실행");
        Set<PlanAlarm> newAlarms = planMapper.toPlanAlarms(plan, request.getAlarms());
        plan.updateAlarms(newAlarms);
    }

    // ========== 반복정보 처리 헬퍼 ==========
    
    /**
     * 새로운 반복정보 생성
     */
    private void createNewRecurringInfo(Plan plan, PlanUpdateReq request) {
        log.info("새로운 반복정보 생성");
        plan.setRecurringInfo(planMapper.toRecurringInfo(request.getRecurringPlan(), request.getEndDate()));
    }
    
    /**
     * 기존 반복정보 업데이트
     */
    private void updateExistingRecurringInfo(Plan plan, PlanUpdateReq request) {
        log.info("기존 반복정보 업데이트");
        var existing = plan.getRecurringInfo();
        var requestInfo = request.getRecurringPlan();
        
        // 기존 데이터 삭제
        deleteExistingRecurringData(existing.getId(), requestInfo.getRepeatUnit());
        
        // 컬렉션을 완전히 새로운 HashSet으로 교체 (JPA 더티체킹 문제 해결)
        recreateCollectionInPersistenceContext(existing, requestInfo.getRepeatUnit());
        
        // 새 데이터 적용
        planMapper.updateRecurringInfo(existing, requestInfo, request.getEndDate());

    }
    
    /**
     * 기존 반복 데이터 삭제
     */
    private void deleteExistingRecurringData(Long recurringInfoId, org.example.calendar.plan.enums.RepeatUnit repeatUnit) {
        switch (repeatUnit) {
            case WEEKLY:
                log.info("기존 요일 데이터 삭제");
                recurringInfoRepository.deleteWeekdaysByRecurringInfoId(recurringInfoId);
                break;
            case MONTHLY:
                log.info("기존 월간 반복 데이터 삭제");
                recurringInfoRepository.deleteWeeksOfMonthByRecurringInfoId(recurringInfoId);
                break;
            // DAILY, YEARLY는 ElementCollection 사용 안함
        }
    }
    
    /**
     * 영속성 컨텍스트의 컬렉션을 완전히 새로운 HashSet으로 교체
     * JPA 더티체킹 문제 해결: 기존 컬렉션 참조를 끊고 새로운 컬렉션으로 교체
     */
    private void recreateCollectionInPersistenceContext(org.example.calendar.plan.entity.RecurringInfo existing, 
                                                       org.example.calendar.plan.enums.RepeatUnit repeatUnit) {
        switch (repeatUnit) {
            case WEEKLY:
                // 기존 컬렉션 참조를 끊고 새로운 HashSet으로 교체
                existing.setRepeatWeekdays(new HashSet<>());
                log.info("새로운 weekdays 컬렉션으로 교체");
                break;
            case MONTHLY:
                // 기존 컬렉션 참조를 끊고 새로운 HashSet으로 교체
                existing.setRepeatWeeksOfMonth(new HashSet<>());
                log.info("새로운 weeksOfMonth 컬렉션으로 교체");
                break;
        }
    }


    
    /**
     * 반복정보가 실제로 변경되었는지 확인
     */
    private boolean isRecurringInfoChanged(org.example.calendar.plan.entity.RecurringInfo existing, 
                                         org.example.calendar.plan.dto.common.RecurringReqInfo request) {
        // 반복 단위 변경 확인
        if (!existing.getRepeatUnit().equals(request.getRepeatUnit())) {
            log.info("반복 단위 변경: {} -> {}", existing.getRepeatUnit(), request.getRepeatUnit());
            return true;
        }
        
        // 반복 간격 변경 확인
        if (!existing.getRepeatInterval().equals(request.getRepeatInterval())) {
            log.info("반복 간격 변경: {} -> {}", existing.getRepeatInterval(), request.getRepeatInterval());
            return true;
        }
        
        // 반복 타입별 세부 설정 변경 확인
        return isDetailedSettingsChanged(existing, request);
    }
    
    /**
     * 반복 타입별 세부 설정 변경 확인
     */
    private boolean isDetailedSettingsChanged(org.example.calendar.plan.entity.RecurringInfo existing, 
                                            org.example.calendar.plan.dto.common.RecurringReqInfo request) {
        switch (request.getRepeatUnit()) {
            case WEEKLY:
                if (request.getRepeatWeekdays() != null) {
                    boolean changed = !existing.getRepeatWeekdays().equals(request.getRepeatWeekdays());
                    if (changed) {
                        log.info("주간 요일 변경: {} -> {}", existing.getRepeatWeekdays(), request.getRepeatWeekdays());
                    }
                    return changed;
                }
                break;
            case MONTHLY:
                // 특정 날짜 방식
                if (request.getRepeatDayOfMonth() != null) {
                    boolean changed = !Objects.equals(existing.getRepeatDayOfMonth(), request.getRepeatDayOfMonth());
                    if (changed) {
                        log.info("월간 날짜 변경: {} -> {}", existing.getRepeatDayOfMonth(), request.getRepeatDayOfMonth());
                    }
                    return changed;
                }
                // 주차 방식
                if (request.getRepeatWeeksOfMonth() != null) {
                    boolean changed = !existing.getRepeatWeeksOfMonth().equals(request.getRepeatWeeksOfMonth());
                    if (changed) {
                        log.info("월간 주차 변경: {} -> {}", existing.getRepeatWeeksOfMonth(), request.getRepeatWeeksOfMonth());
                    }
                    return changed;
                }
                break;
            case YEARLY:
                boolean monthChanged = !Objects.equals(existing.getRepeatMonth(), request.getRepeatMonth());
                boolean dayChanged = !Objects.equals(existing.getRepeatDayOfYear(), request.getRepeatDayOfYear());
                if (monthChanged || dayChanged) {
                    log.info("연간 설정 변경 - 월: {} -> {}, 일: {} -> {}", 
                            existing.getRepeatMonth(), request.getRepeatMonth(),
                            existing.getRepeatDayOfYear(), request.getRepeatDayOfYear());
                }
                return monthChanged || dayChanged;
        }
        
        return false;
    }
}