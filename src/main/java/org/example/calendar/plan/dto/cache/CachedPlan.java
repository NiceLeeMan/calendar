// CachedPlan.java
package org.example.calendar.plan.dto.cache;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;


/**
 * 캐시용 계획 DTO
 * 
 * <p>Redis 캐시에 저장하기 위한 최적화된 계획 데이터를 담는 클래스입니다.</p>
 * 
 * <h3>캐시 최적화 특징</h3>
 * <ul>
 *   <li><strong>직렬화 지원</strong>: Serializable 구현으로 Redis 저장 가능</li>
 *   <li><strong>데이터 경량화</strong>: 필수 정보만 포함하여 메모리 효율성 증대</li>
 *   <li><strong>관계 단순화</strong>: ID 참조로 복잡한 객체 관계 제거</li>
 *   <li><strong>버전 관리</strong>: serialVersionUID로 구조 변경 추적</li>
 * </ul>
 * 
 * <h3>경량화 전략</h3>
 * <ul>
 *   <li><strong>반복 정보</strong>: 상세 객체 대신 ID와 간단한 설명만 저장</li>
 *   <li><strong>알람 정보</strong>: 알람 상세 대신 ID 목록만 저장</li>
 *   <li><strong>사용자 정보</strong>: 사용자 객체 대신 userId만 저장</li>
 * </ul>
 * 
 * <h3>용도</h3>
 * <ul>
 *   <li><strong>월별 계획 캐시</strong>: 빠른 월별 조회를 위한 임시 저장</li>
 *   <li><strong>자주 조회되는 계획</strong>: DB 부하 감소를 위한 캐싱</li>
 *   <li><strong>계획 목록 표시</strong>: 간단한 정보만 필요한 경우</li>
 * </ul>
 * 
 * <h3>주의사항</h3>
 * <ul>
 *   <li>상세 정보가 필요한 경우 DB에서 재조회 필요</li>
 *   <li>캐시 무효화 시점을 정확히 관리해야 함</li>
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
public class CachedPlan implements Serializable {

    private static final long serialVersionUID = 2L; // 구조 변경으로 버전 업

    private Long id;
    private String planName;
    private String planContent;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isRecurring;

    // 반복 정보 ID (RecurringInfo와의 관계)
    private Long recurringInfoId;
    
    // 반복 정보 간소화 (캐시 성능을 위해)
    private String repeatPattern; // "매주 월,수,금" 같은 요약 설명
    private Set<LocalDate> exceptionDates;

    // 알람 ID만 저장
    private Set<Long> alarmIds;

    private Long userId;
    private Long version;
}