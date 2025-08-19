package org.example.calendar.plan.repository;

import org.example.calendar.plan.entity.RecurringInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * RecurringInfo 엔티티에 대한 데이터 접근 계층
 * 
 * @author Calendar Team
 * @since 2025-07-25
 */
@Repository
public interface RecurringInfoRepository extends JpaRepository<RecurringInfo, Long> {
    
    /**
     * RecurringInfo와 관련된 모든 ElementCollection 데이터 삭제
     * orphanRemoval이 제대로 작동하지 않을 때 사용
     */
    @Modifying
    @Query(value = "DELETE FROM recurring_repeat_weekdays WHERE recurring_info_id = :recurringInfoId", nativeQuery = true)
    void deleteWeekdaysByRecurringInfoId(@Param("recurringInfoId") Long recurringInfoId);
    
    @Modifying
    @Query(value = "DELETE FROM recurring_repeat_weeks_of_month WHERE recurring_info_id = :recurringInfoId", nativeQuery = true)
    void deleteWeeksOfMonthByRecurringInfoId(@Param("recurringInfoId") Long recurringInfoId);
    
    @Modifying
    @Query(value = "DELETE FROM recurring_exceptions WHERE recurring_info_id = :recurringInfoId", nativeQuery = true)
    void deleteExceptionsByRecurringInfoId(@Param("recurringInfoId") Long recurringInfoId);
}
