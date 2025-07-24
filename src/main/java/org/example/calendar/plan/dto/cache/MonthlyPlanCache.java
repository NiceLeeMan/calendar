package org.example.calendar.plan.dto.cache;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

/**
 * 월별 계획 캐시 DTO
 * 
 * <p>특정 사용자의 한 달간 계획 데이터를 캐시하기 위한 최적화된 클래스입니다.</p>
 * 
 * <h3>캐시 구조</h3>
 * <ul>
 *   <li><strong>날짜별 그루핑</strong>: Map<LocalDate, List<PlanSummary>>로 날짜별 계획 구성</li>
 *   <li><strong>요약 정보</strong>: 캘린더 표시에 필요한 최소 정보만 포함</li>
 *   <li><strong>캐시 유효성</strong>: lastUpdated로 캐시 신선도 관리</li>
 * </ul>
 * 
 * <h3>사용 시나리오</h3>
 * <ul>
 *   <li><strong>월별 캘린더 뷰</strong>: 빠른 월별 계획 표시</li>
 *   <li><strong>날짜 선택</strong>: 특정 날짜의 계획 목록 즉시 표시</li>
 *   <li><strong>개요 표시</strong>: 계획 제목과 시간대만 필요한 경우</li>
 * </ul>
 * 
 * <h3>캐시 전략</h3>
 * <ul>
 *   <li><strong>미리 계산</strong>: 반복 계획의 월별 인스턴스를 미리 생성하여 저장</li>
 *   <li><strong>빠른 접근</strong>: 날짜를 키로 O(1) 접근</li>
 *   <li><strong>메모리 효율</strong>: 상세 정보 제외, 표시용 정보만 캐시</li>
 * </ul>
 * 
 * <h3>캐시 무효화</h3>
 * <ul>
 *   <li>해당 월의 계획 생성/수정/삭제 시</li>
 *   <li>반복 계획의 설정 변경 시</li>
 *   <li>일정 시간 경과 후 (TTL)</li>
 * </ul>
 * 
 * @author Calendar Team
 * @since 2025-07-24
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyPlanCache implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long userId;
    private YearMonth yearMonth;
    private Map<LocalDate, List<PlanSummary>> dailyPlans;
    private long lastUpdated;

    /**
     * 계획 요약 정보 내부 클래스
     * 
     * <p>월별 캐시에서 사용하는 경량화된 계획 정보입니다.</p>
     * 
     * <h3>포함 정보</h3>
     * <ul>
     *   <li><strong>식별 정보</strong>: ID, 제목</li>
     *   <li><strong>시간 정보</strong>: 시작/종료 시간</li>
     *   <li><strong>타입 정보</strong>: 반복 여부, 알람 여부</li>
     * </ul>
     * 
     * <h3>UI 표시 용도</h3>
     * <ul>
     *   <li>캘린더 그리드의 계획 블록 표시</li>
     *   <li>계획 제목과 시간대 표시</li>
     *   <li>반복/알람 아이콘 표시 여부</li>
     * </ul>
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PlanSummary implements Serializable {
        private Long id;
        private String planName;
        private LocalTime startTime;
        private LocalTime endTime;
        private boolean isRecurring;
        private boolean hasAlarm;
    }
}