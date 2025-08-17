package org.example.calendar.plan.repository;

import org.example.calendar.plan.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Plan 엔티티에 대한 데이터 접근 계층
 * 
 * 핵심 기능:
 * - 월별 계획 조회 (캘린더 메인 기능)
 * - 계획 CRUD (추가/수정/삭제)
 * - 권한 검증
 *
 * @author Calendar Team
 * @since 2025-07-22
 */
@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {

    // ========== 기본 CRUD ==========
    
    /**
     * 사용자 ID와 계획 ID로 계획 조회 (권한 검증용)
     * 계획 수정/삭제 시 사용자 권한 확인
     */
    Optional<Plan> findByIdAndUserId(Long id, Long userId);

    // ========== 월별 조회 (캘린더 메인 기능) ==========
    
    /**
     * 특정 월의 사용자 계획 조회
     * 
     * 조회 대상:
     * 1. 해당 월에 시작하는 계획
     * 2. 해당 월에 종료하는 계획  
     * 3. 해당 월을 걸쳐가는 장기 계획
     * 4. 해당 월에 발생하는 반복 계획 (반복 종료일까지)
     */
    @Query(value = """
        SELECT DISTINCT p.* FROM plans p 
        LEFT JOIN recurring_info ri ON p.recurring_info_id = ri.id
        WHERE p.user_id = :userId 
        AND (
            -- 일반 계획: 해당 월과 겹치는 모든 계획
            (p.start_date <= :monthEnd AND p.end_date >= :monthStart)
            OR 
            -- 반복 계획: 반복 패턴에 따라 해당 월에 인스턴스가 생성될 수 있는 계획
            (p.is_recurring = true AND p.start_date <= :monthEnd AND 
             (ri.end_date IS NULL OR 
              -- 주간반복: 반복종료일 + 6일(한주)까지 고려 (마지막 인스턴스가 다음주에 올 수 있음)
              (ri.repeat_unit = 'WEEKLY' AND DATE(ri.end_date + INTERVAL '6 days') >= :monthStart) OR
              -- 기타 반복: 기존 로직 유지
              (ri.repeat_unit != 'WEEKLY' AND ri.end_date >= :monthStart)))
        )
        ORDER BY p.start_date, p.start_time
        """, nativeQuery = true)
    List<Plan> findMonthlyPlans(@Param("userId") Long userId,
                                @Param("monthStart") LocalDate monthStart,
                                @Param("monthEnd") LocalDate monthEnd);

    /*
     * 기본 CRUD 메서드는 JpaRepository가 자동 제공:
     * - save(Plan plan)           : 계획 저장/수정 (연관 엔티티 자동 처리)
     * - findById(Long id)         : ID로 계획 조회
     * - deleteById(Long id)       : ID로 계획 삭제
     * - count()                   : 전체 계획 수
     * - existsById(Long id)       : ID 존재 여부 확인
     * 
     * cascade 설정으로 RecurringInfo, PlanAlarm 자동 처리
     */

}
