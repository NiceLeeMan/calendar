package org.example.calendar.plan.repository;

import org.example.calendar.plan.entity.PlanAlarm;
import org.example.calendar.plan.entity.PlanAlarm.AlarmStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * PlanAlarm 엔티티에 대한 데이터 접근 계층
 * 
 * 핵심 기능:
 * - 알람 발송 처리 (배치/스케줄러용)
 * - 기본 CRUD (Plan과 함께 자동 처리)
 *
 * @author Calendar Team
 * @since 2025-07-22
 */
@Repository
public interface PlanAlarmRepository extends JpaRepository<PlanAlarm, Long> {

    // ========== 알람 발송용 (배치/스케줄러) ==========
    
    /**
     * 발송 대상 알람 조회 (배치 처리용)
     * 현재 시간 기준으로 발송해야 할 대기중인 알람
     */
    @Query("SELECT a FROM PlanAlarm a " +
           "JOIN FETCH a.plan p " +
           "JOIN FETCH p.user u " +
           "WHERE a.alarmStatus = 'PENDING' " +
           "AND a.alarmDate = :currentDate " +
           "AND a.alarmTime <= :currentTime " +
           "ORDER BY a.alarmTime")
    List<PlanAlarm> findReadyToSendAlarms(@Param("currentDate") LocalDate currentDate,
                                          @Param("currentTime") LocalTime currentTime);

    // ========== 상태 업데이트 ==========
    
    /**
     * 알람 발송 완료 처리
     */
    @Modifying
    @Query("UPDATE PlanAlarm a SET a.alarmStatus = 'SENT', a.sentAt = :sentAt " +
           "WHERE a.id = :alarmId")
    int markAsSent(@Param("alarmId") Long alarmId, @Param("sentAt") LocalDateTime sentAt);

    /**
     * 알람 발송 실패 처리
     */
    @Modifying
    @Query("UPDATE PlanAlarm a SET a.alarmStatus = 'FAILED', " +
           "a.failureReason = :failureReason " +
           "WHERE a.id = :alarmId")
    int markAsFailed(@Param("alarmId") Long alarmId, 
                     @Param("failureReason") String failureReason);

    /**
     * 특정 계획의 모든 알람 취소
     */
    @Modifying
    @Query("UPDATE PlanAlarm a SET a.alarmStatus = 'CANCELLED' " +
           "WHERE a.plan.id = :planId AND a.alarmStatus = 'PENDING'")
    int cancelAlarmsByPlan(@Param("planId") Long planId);

    /*
     * 기본 CRUD 메서드는 JpaRepository가 자동 제공:
     * - save(PlanAlarm)         : 저장/수정 (실제로는 Plan과 함께 처리)
     * - findById(Long id)       : ID로 조회
     * - deleteById(Long id)     : 삭제 (실제로는 Plan과 함께 처리)
     * 
     * 나머지 복잡한 조회 기능들은 필요할 때 추가
     * Plan 엔티티의 cascade 설정으로 대부분 작업이 자동 처리됨
     */

}
