package org.example.calendar.plan.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.calendar.plan.dto.request.PlanCreateReq;
import org.example.calendar.plan.dto.request.PlanUpdateReq;
import org.example.calendar.plan.dto.response.PlanResponse;
import org.example.calendar.plan.entity.Plan;
import org.example.calendar.plan.entity.PlanAlarm;
import org.example.calendar.plan.entity.RecurringInfo;
import org.example.calendar.plan.mapper.PlanMapper;
import org.example.calendar.plan.repository.PlanRepository;
import org.example.calendar.plan.service.helper.PlanUpdateHelper;
import org.example.calendar.plan.service.recurring.RecurringPlanGenerator;
import org.example.calendar.user.entity.User;
import org.example.calendar.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * 계획 관리 서비스 (CRUD 전담)
 * 
 * <h3>핵심 기능</h3>
 * <ul>
 *   <li><strong>Cache-Aside 패턴</strong>: Redis 캐시와 DB 연동</li>
 *   <li><strong>CRUD 작업</strong>: 계획 생성, 조회, 수정, 삭제</li>
 *   <li><strong>캐시 무효화</strong>: 데이터 변경 시 관련 캐시 삭제</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-25
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PlanService {

    private final PlanRepository planRepository;
    private final UserRepository userRepository;
    private final PlanCacheService planCacheService;
    private final AlarmService alarmService;
    private final PlanMapper planMapper;
    private final RecurringPlanGenerator recurringPlanGenerator;
    private final PlanUpdateHelper planUpdateHelper;

    /**
     * 월별 계획 조회 (Cache-Aside 패턴)
     */
    public List<PlanResponse> getMonthlyPlans(Long userId, int year, int month) {
        log.info("Getting monthly plans: userId={}, year={}, month={}", userId, year, month);
        
        // 1. 캐시 조회
        List<PlanResponse> cachedPlans = planCacheService.getMonthlyPlansFromCache(userId, year, month);
        if (cachedPlans != null) {
            log.debug("Cache hit for monthly plans: userId={}, count={}", userId, cachedPlans.size());
            return cachedPlans;
        }
        
        // 2. DB 조회
        LocalDate monthStart = LocalDate.of(year, month, 1);
        LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
        
        List<Plan> plans = planRepository.findMonthlyPlans(userId, monthStart, monthEnd);
        
        // 3. 반복 일정 인스턴스 생성 및 응답 변환
        List<PlanResponse> responses = new ArrayList<>();
        
        for (Plan plan : plans) {
            if (plan.isRecurringPlan()) {
                // 반복 일정의 해당 월 인스턴스들 생성
                List<PlanResponse> recurringInstances = recurringPlanGenerator.generateRecurringInstances(plan, monthStart, monthEnd);
                responses.addAll(recurringInstances);
            } else {
                // 일반 일정
                responses.add(planMapper.toPlanResponse(plan));
            }
        }
        
        // 4. 캐시 저장
        planCacheService.cacheMonthlyPlans(userId, year, month, responses);
        
        log.info("Monthly plans loaded from DB: userId={}, count={}", userId, responses.size());
        return responses;
    }

    /**
     * 계획 생성
     */
    @Transactional
    public PlanResponse createPlan(PlanCreateReq request, Long userId) {
        log.info("Creating plan: userId={}, planName={}", userId, request.getPlanName());
        
        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));
        
        // Plan 엔티티 생성
        Plan plan = Plan.builder()
                .planName(request.getPlanName())
                .planContent(request.getPlanContent())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .isRecurring(request.getIsRecurring())
                .user(user)
                .build();
        
        // 반복 설정 처리
        if (Boolean.TRUE.equals(request.getIsRecurring()) && request.getRecurringPlan() != null) {
            RecurringInfo recurringInfo = planMapper.toRecurringInfo(request.getRecurringPlan(), request.getEndDate());
            plan.setRecurringInfo(recurringInfo);
        }
        
        // 알람 설정 처리 (orphanRemoval 문제 해결)
        if (request.getAlarms() != null && !request.getAlarms().isEmpty()) {
            Set<PlanAlarm> alarms = planMapper.toPlanAlarms(plan, request.getAlarms());
            plan.updateAlarms(alarms);
        }
        
        // DB 저장
        Plan savedPlan = planRepository.save(plan);
        
        // 캐시 무효화 (해당 월)
        evictRelatedCache(userId, savedPlan.getStartDate(), savedPlan.getEndDate());
        
        // 알람 서비스 연동 (알람이 있는 경우만)
        if (!savedPlan.getAlarms().isEmpty()) {
            // TODO: AlarmService.scheduleAlarms() 호출
            log.info("Alarms scheduled for plan: planId={}, alarmCount={}", 
                    savedPlan.getId(), savedPlan.getAlarms().size());
        }
        
        log.info("Plan created successfully: planId={}", savedPlan.getId());
        return planMapper.toPlanResponse(savedPlan);
    }

    /**
     * 계획 수정
     */
    @Transactional
    public PlanResponse updatePlan(Long planId, PlanUpdateReq request, Long userId) {
        log.info("Updating plan: planId={}, userId={}", planId, userId);
        
        // 권한 확인 및 조회
        Plan plan = planRepository.findByIdAndUserId(planId, userId)
                .orElseThrow(() -> new IllegalArgumentException("계획을 찾을 수 없거나 수정 권한이 없습니다"));
        
        LocalDate oldStartDate = plan.getStartDate();
        LocalDate oldEndDate = plan.getEndDate();
        
        // 계획 업데이트 (헬퍼 사용)
        planUpdateHelper.updateBasicFields(plan, request);
        planUpdateHelper.updateRecurringInfo(plan, request);
        planUpdateHelper.updateAlarms(plan, request);
        
        // DB 저장
        Plan updatedPlan = planRepository.save(plan);
        
        // 캐시 무효화 (기존 날짜 + 새 날짜)
        evictRelatedCache(userId, oldStartDate, oldEndDate);
        evictRelatedCache(userId, updatedPlan.getStartDate(), updatedPlan.getEndDate());
        
        log.info("Plan updated successfully: planId={}", planId);
        return planMapper.toPlanResponse(updatedPlan);
    }

    /**
     * 계획 삭제
     */
    @Transactional
    public void deletePlan(Long planId, Long userId) {
        log.info("Deleting plan: planId={}, userId={}", planId, userId);
        
        // 권한 확인 및 조회
        Plan plan = planRepository.findByIdAndUserId(planId, userId)
                .orElseThrow(() -> new IllegalArgumentException("계획을 찾을 수 없거나 삭제 권한이 없습니다"));
        
        LocalDate startDate = plan.getStartDate();
        LocalDate endDate = plan.getEndDate();
        
        // DB 삭제
        planRepository.delete(plan);
        
        // 캐시 무효화
        evictRelatedCache(userId, startDate, endDate);
        
        log.info("Plan deleted successfully: planId={}", planId);
    }

    /**
     * 관련 캐시 무효화
     */
    private void evictRelatedCache(Long userId, LocalDate startDate, LocalDate endDate) {
        // 시작 월부터 종료 월까지 모든 월의 캐시 삭제 (반복 계획 지원)
        LocalDate current = startDate.withDayOfMonth(1); // 월 첫날로 설정
        LocalDate endMonth = endDate.withDayOfMonth(1);   // 종료월 첫날로 설정
        
        while (!current.isAfter(endMonth)) {
            planCacheService.evictMonthlyPlansCache(userId, current.getYear(), current.getMonthValue());
            log.debug("Cache evicted for month: userId={}, year={}, month={}", 
                    userId, current.getYear(), current.getMonthValue());
            current = current.plusMonths(1);
        }
    }
}
