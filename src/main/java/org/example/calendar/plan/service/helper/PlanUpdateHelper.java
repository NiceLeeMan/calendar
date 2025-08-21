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
     * 반복 설정 전환 타입
     */
    private enum RecurringTransitionType {
        SINGLE_TO_SINGLE,       // 단일 → 단일 (기본 필드만 수정)
        SINGLE_TO_RECURRING,    // 단일 → 반복
        RECURRING_TO_SINGLE,    // 반복 → 단일  
        RECURRING_TO_RECURRING, // 반복 → 반복 (수정)
        NO_CHANGE              // 변경 없음
    }

    /**
     * 변경사항에 따라 필요한 업데이트만 실행
     */
    public void updatePlan(Plan plan, PlanUpdateReq request) {
        // 원본 상태 보존 (기본 필드 업데이트 전에 저장)
        boolean originalIsRecurring = plan.getIsRecurring();
        
        // 기본 필드 변경사항이 있으면 업데이트
        if (hasBasicFieldChanges(request)) {
            updateBasicFields(plan, request);
        }
        
        // 반복 필드 변경사항이 있으면 업데이트 (원본 상태 기준으로 판단)
        if (hasRecurringFieldChanges(originalIsRecurring, request)) {
            updateRecurringFields(plan, request, originalIsRecurring);
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
    private boolean hasRecurringFieldChanges(boolean originalIsRecurring, PlanUpdateReq request) {
        // isRecurring 필드 변경이 있거나, 반복 설정 내용이 변경된 경우
        return request.getIsRecurring() != null || 
               (originalIsRecurring && request.getRecurringPlan() != null);
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
    private void updateRecurringFields(Plan plan, PlanUpdateReq request, boolean originalIsRecurring) {
        log.info("반복 필드 업데이트 실행");
        
        // 전환 타입 결정 (원본 상태 기준)
        RecurringTransitionType transitionType = determineTransitionType(originalIsRecurring, request);
        log.info("반복 설정 전환 타입: {}", transitionType);
        
        switch (transitionType) {
            case SINGLE_TO_SINGLE:
                log.info("단일 계획 유지 (반복 관련 처리 없음)");
                break;
            case SINGLE_TO_RECURRING:
                handleSingleToRecurring(plan, request);
                break;
            case RECURRING_TO_SINGLE:
                handleRecurringToSingle(plan);
                break;
            case RECURRING_TO_RECURRING:
                handleRecurringUpdate(plan, request);
                break;
            case NO_CHANGE:
                log.info("반복 설정 변경 없음");
                break;
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
     * 반복 설정 전환 타입 결정 (원본 상태 기준)
     */
    private RecurringTransitionType determineTransitionType(boolean originalIsRecurring, PlanUpdateReq request) {
        Boolean newRecurringStatus = request.getIsRecurring();
        
        log.info("전환 타입 결정 - 원본 상태: {}, 요청 상태: {}", originalIsRecurring, newRecurringStatus);
        
        // isRecurring 필드 변경이 없으면 현재 상태 유지
        if (newRecurringStatus == null) {
            return RecurringTransitionType.NO_CHANGE;
        }
        
        if (!originalIsRecurring && !newRecurringStatus) {
            return RecurringTransitionType.SINGLE_TO_SINGLE;        // 단일 → 단일
        } else if (!originalIsRecurring && newRecurringStatus) {
            return RecurringTransitionType.SINGLE_TO_RECURRING;     // 단일 → 반복
        } else if (originalIsRecurring && !newRecurringStatus) {
            return RecurringTransitionType.RECURRING_TO_SINGLE;     // 반복 → 단일
        } else {
            return RecurringTransitionType.RECURRING_TO_RECURRING;  // 반복 → 반복
        }
    }
    
    /**
     * 단일 → 반복 전환 처리
     */
    private void handleSingleToRecurring(Plan plan, PlanUpdateReq request) {
        log.info("단일 → 반복 전환 처리");
        if (request.getRecurringPlan() != null) {
            plan.setRecurringInfo(planMapper.toRecurringInfo(request.getRecurringPlan(), request.getEndDate()));
            log.info("새로운 반복정보 생성 완료");
        } else {
            log.warn("반복 설정 요청이지만 recurringPlan 데이터가 없음");
        }
    }
    
    /**
     * 반복 → 단일 전환 처리
     */
    private void handleRecurringToSingle(Plan plan) {
        log.info("반복 → 단일 전환 처리");
        
        if (plan.getRecurringInfo() != null) {
            Long recurringInfoId = plan.getRecurringInfo().getId();
            log.info("RecurringInfo ID: {} 관련 데이터 완전 삭제 시작", recurringInfoId);
            
            // 1. @ElementCollection 데이터 명시적 삭제 (FK 참조 제거)
            deleteAllElementCollectionData(recurringInfoId);
            
            // 2. Plan의 recurringInfo 참조 제거 (orphanRemoval 동작)
            plan.setRecurringInfo(null);
            
            log.info("RecurringInfo ID: {} 완전 삭제 완료", recurringInfoId);
        } else {
            log.info("RecurringInfo가 이미 null - 삭제할 데이터 없음");
        }
        
        log.info("반복 → 단일 전환 처리 완료");
    }
    
    /**
     * 반복 → 반복 수정 처리
     */
    private void handleRecurringUpdate(Plan plan, PlanUpdateReq request) {
        log.info("반복 → 반복 수정 처리");
        if (request.getRecurringPlan() != null) {
            // 기존 반복정보와 비교하여 실제 변경사항이 있는지 확인
            if (isRecurringInfoChanged(plan.getRecurringInfo(), request.getRecurringPlan())) {
                updateExistingRecurringInfo(plan, request);
            } else {
                log.info("반복정보 변경사항 없음");
            }
        } else {
            log.warn("반복 계획 수정 요청이지만 recurringPlan 데이터가 없음");
        }
    }
    
    /**
     * 기존 반복정보 업데이트
     */
    private void updateExistingRecurringInfo(Plan plan, PlanUpdateReq request) {
        log.info("기존 반복정보 업데이트");
        var existing = plan.getRecurringInfo();
        var requestInfo = request.getRecurringPlan();
        
        // RepeatUnit 변경 여부 확인
        boolean repeatUnitChanged = !existing.getRepeatUnit().equals(requestInfo.getRepeatUnit());
        
        if (repeatUnitChanged) {
            log.info("RepeatUnit 변경: {} -> {}", existing.getRepeatUnit(), requestInfo.getRepeatUnit());
            // 기존 RepeatUnit의 데이터 삭제 후 새로운 RepeatUnit으로 재생성
            deleteExistingRecurringData(existing.getId(), existing.getRepeatUnit());
            recreateCollectionInPersistenceContext(existing, requestInfo.getRepeatUnit());
        } else {
            log.info("RepeatUnit 동일 - {} 타입 내에서 데이터 변경", existing.getRepeatUnit());
            // 같은 RepeatUnit 내에서 데이터만 변경
            deleteExistingRecurringData(existing.getId(), existing.getRepeatUnit());
            recreateCollectionInPersistenceContext(existing, existing.getRepeatUnit());
        }
        
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
     * 모든 @ElementCollection 데이터 삭제
     */
    private void deleteAllElementCollectionData(Long recurringInfoId) {
        log.info("@ElementCollection 데이터 전체 삭제 시작");
        
        // 각 삭제 쿼리 후 즉시 flush
        recurringInfoRepository.deleteWeekdaysByRecurringInfoId(recurringInfoId);
        log.info("weekdays 삭제 완료 - recurringInfoId: {}", recurringInfoId);
        
        recurringInfoRepository.deleteWeeksOfMonthByRecurringInfoId(recurringInfoId);
        log.info("weeksOfMonth 삭제 완료 - recurringInfoId: {}", recurringInfoId);
        
        recurringInfoRepository.deleteExceptionsByRecurringInfoId(recurringInfoId);
        log.info("exceptions 삭제 완료 - recurringInfoId: {}", recurringInfoId);
        
        log.info("@ElementCollection 데이터 전체 삭제 완료");
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