
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
 * @author Calendar Team
 * @since 2025-07-22
 */
@Repository
public interface PlanAlarmRepository extends JpaRepository<PlanAlarm, Long> {

    /**
     * 특정 계획의 모든 알람 조회
     */
    List<PlanAlarm> findByPlanId(Long planId);

    /**
     * 특정 계획의 대기중인 알람 조회
     */
    List<PlanAlarm> findByPlanIdAndAlarmStatus(Long planId, AlarmStatus alarmStatus);

    /**
     * 발송 예정인 알람 조회
     * 현재 시간부터 지정된 시간까지의 대기중인 알람
     */
    @Query("SELECT a FROM PlanAlarm a " +
            "WHERE a.alarmStatus = 'PENDING' " +
            "AND a.alarmDate = :date " +
            "AND a.alarmTime BETWEEN :startTime AND :endTime " +
            "ORDER BY a.alarmTime")
    List<PlanAlarm> findPendingAlarmsByDateTimeRange(@Param("date") LocalDate date,
                                                     @Param("startTime") LocalTime startTime,
                                                     @Param("endTime") LocalTime endTime);

    /**
     * 오늘 발송 예정인 모든 알람 조회
     */
    @Query("SELECT a FROM PlanAlarm a " +
            "JOIN FETCH a.plan p " +
            "JOIN FETCH p.user " +
            "WHERE a.alarmStatus = 'PENDING' " +
            "AND a.alarmDate = :today " +
            "ORDER BY a.alarmTime")
    List<PlanAlarm> findTodayPendingAlarms(@Param("today") LocalDate today);

    /**
     * 특정 시간 이전의 대기중인 알람 조회
     * 놓친 알람 처리용
     */
    @Query("SELECT a FROM PlanAlarm a " +
            "WHERE a.alarmStatus = 'PENDING' " +
            "AND ((a.alarmDate < :date) OR (a.alarmDate = :date AND a.alarmTime < :time))")
    List<PlanAlarm> findOverdueAlarms(@Param("date") LocalDate date,
                                      @Param("time") LocalTime time);

    /**
     * 사용자의 특정 날짜 알람 개수 조회
     */
    @Query("SELECT COUNT(a) FROM PlanAlarm a " +
            "JOIN a.plan p " +
            "WHERE p.user.id = :userId " +
            "AND a.alarmDate = :date " +
            "AND a.alarmStatus = 'PENDING'")
    Long countUserAlarmsByDate(@Param("userId") Long userId,
                               @Param("date") LocalDate date);

    /**
     * 실패한 알람 중 재시도 가능한 알람 조회
     */
    @Query("SELECT a FROM PlanAlarm a " +
            "WHERE a.alarmStatus = 'FAILED' " +
            "AND a.retryCount < :maxRetry " +
            "ORDER BY a.alarmDate, a.alarmTime")
    List<PlanAlarm> findRetryableAlarms(@Param("maxRetry") int maxRetry);

    /**
     * 특정 기간의 알람 통계 조회
     */
    @Query("SELECT a.alarmStatus, COUNT(a) FROM PlanAlarm a " +
            "JOIN a.plan p " +
            "WHERE p.user.id = :userId " +
            "AND a.alarmDate BETWEEN :startDate AND :endDate " +
            "GROUP BY a.alarmStatus")
    List<Object[]> getAlarmStatisticsByDateRange(@Param("userId") Long userId,
                                                 @Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate);

    /**
     * 알람 상태 일괄 업데이트
     */
    @Modifying
    @Query("UPDATE PlanAlarm a SET a.alarmStatus = :newStatus " +
            "WHERE a.id IN :alarmIds AND a.alarmStatus = :currentStatus")
    int updateAlarmStatus(@Param("alarmIds") List<Long> alarmIds,
                          @Param("currentStatus") AlarmStatus currentStatus,
                          @Param("newStatus") AlarmStatus newStatus);

    /**
     * 특정 계획의 미래 알람 모두 취소
     */
    @Modifying
    @Query("UPDATE PlanAlarm a SET a.alarmStatus = 'CANCELLED' " +
            "WHERE a.plan.id = :planId " +
            "AND a.alarmStatus = 'PENDING' " +
            "AND (a.alarmDate > :date OR (a.alarmDate = :date AND a.alarmTime > :time))")
    int cancelFutureAlarms(@Param("planId") Long planId,
                           @Param("date") LocalDate date,
                           @Param("time") LocalTime time);
}