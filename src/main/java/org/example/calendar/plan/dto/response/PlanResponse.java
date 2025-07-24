package org.example.calendar.plan.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.example.calendar.plan.dto.common.AlarmResInfo;
import org.example.calendar.plan.dto.common.RecurringResInfo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * 계획 응답 DTO
 * 
 * <p>계획 조회, 생성, 수정 시 클라이언트에게 전달하는 통합 응답 데이터를 담는 클래스입니다.</p>
 * 
 * <h3>응답 데이터 구성</h3>
 * <ul>
 *   <li><strong>기본 정보</strong>: ID, 제목, 내용, 날짜/시간, 위치</li>
 *   <li><strong>반복 정보</strong>: 반복 여부 및 상세 반복 규칙</li>
 *   <li><strong>알람 정보</strong>: 설정된 모든 알람 목록</li>
 *   <li><strong>메타 정보</strong>: 생성/수정 시간, 사용자 정보</li>
 * </ul>
 * 
 * <h3>사용 시나리오</h3>
 * <ul>
 *   <li><strong>단일 계획 조회</strong>: GET /plans/{id} 응답</li>
 *   <li><strong>월별 계획 조회</strong>: GET /plans/monthly 응답의 배열 요소</li>
 *   <li><strong>계획 생성</strong>: POST /plans 응답</li>
 *   <li><strong>계획 수정</strong>: PUT /plans/{id} 응답</li>
 * </ul>
 * 
 * <h3>JSON 형식</h3>
 * <ul>
 *   <li><strong>날짜</strong>: "yyyy-MM-dd" 형식</li>
 *   <li><strong>시간</strong>: "HH:mm" 형식</li>
 *   <li><strong>타임스탬프</strong>: "yyyy-MM-dd HH:mm:ss" 형식</li>
 * </ul>
 * 
 * <h3>조건부 필드</h3>
 * <ul>
 *   <li><strong>recurringResInfo</strong>: isRecurring=true인 경우만 포함</li>
 *   <li><strong>alarms</strong>: 설정된 알람이 있는 경우만 포함</li>
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
public class PlanResponse {

    private Long id;
    private String planName;
    private String planContent;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;

    private String location;
    private Boolean isRecurring;

    // 반복 정보 (isRecurring이 true인 경우만)
    private RecurringResInfo recurringResInfo;

    // 알람 정보
    private List<AlarmResInfo> alarms;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    // 사용자 정보
    private Long userId;
    private String userName;
}