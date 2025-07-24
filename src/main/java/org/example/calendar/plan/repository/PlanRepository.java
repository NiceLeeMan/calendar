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
 * @author Calendar Team
 * @since 2025-07-22
 */
@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {

    /**
     * 사용자 ID와 계획 ID로 계획 조회
     * 수정/삭제 시 권한 검증용
     */
    Optional<Plan> findByIdAndUserId(Long id, Long userId);

    /**
     * 특정 월의 사용자 계획 조회
     * 캘린더 월별 뷰에서 사용
     */
    @Query("SELECT p FROM Plan p WHERE p.user.id = :userId " +
            "AND ((YEAR(p.startDate) = :year AND MONTH(p.startDate) = :month) " +
            "OR (YEAR(p.endDate) = :year AND MONTH(p.endDate) = :month) " +
            "OR (p.startDate < :monthStart AND p.endDate > :monthEnd) " +
            "OR (p.isRecurring = true AND p.startDate <= :monthEnd))")
    List<Plan> findByUserIdAndMonth(@Param("userId") Long userId,
                                    @Param("year") int year,
                                    @Param("month") int month,
                                    @Param("monthStart") LocalDate monthStart,
                                    @Param("monthEnd") LocalDate monthEnd);

    /**
     * 사용자의 반복 계획만 조회
     */
    List<Plan> findByUserIdAndIsRecurring(Long userId, Boolean isRecurring);

    /**
     * 사용자의 활성화된 반복 계획 조회
     * 반복 인스턴스 생성용
     */
    @Query("SELECT p FROM Plan p WHERE p.user.id = :userId " +
            "AND p.isRecurring = true " +
            "AND (p.endDate IS NULL OR p.endDate >= :currentDate)")
    List<Plan> findActiveRecurringPlans(@Param("userId") Long userId,
                                        @Param("currentDate") LocalDate currentDate);
}