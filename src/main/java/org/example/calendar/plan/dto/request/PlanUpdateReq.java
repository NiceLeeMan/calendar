// PlanUpdateRequest.java
package org.example.calendar.plan.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import org.example.calendar.plan.dto.common.AlarmReqInfo;
import org.example.calendar.plan.dto.common.RecurringReqInfo;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * 계획 수정 요청 DTO
 * 
 * <p>기존 계획의 정보를 부분적으로 수정하기 위한 요청 데이터를 담는 클래스입니다.</p>
 * 
 * <h3>수정 가능한 항목</h3>
 * <ul>
 *   <li><strong>기본 정보</strong>: 제목, 내용, 날짜/시간, 위치</li>
 *   <li><strong>반복 설정</strong>: 단일↔반복 계획 변환 및 반복 규칙 수정</li>
 *   <li><strong>알람 설정</strong>: 알람 추가/제거/수정</li>
 * </ul>
 * 
 * <h3>수정 방식</h3>
 * <ul>
 *   <li><strong>부분 수정</strong>: null이 아닌 필드만 업데이트</li>
 *   <li><strong>반복 변환</strong>: convertToSinglePlan으로 반복→단일 변환</li>
 *   <li><strong>알람 교체</strong>: alarms 설정 시 기존 알람 모두 교체</li>
 * </ul>
 * 
 * <h3>validation 규칙</h3>
 * <ul>
 *   <li>날짜/시간: 설정 시 종료는 시작 이후여야 함</li>
 *   <li>반복 계획: isRecurring=true 시 recurringPlan 필수</li>
 *   <li>필드 길이: 제목 30자, 내용 300자 이하</li>
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
@ToString
public class PlanUpdateReq {

    @Size(max = 30, message = "계획 제목은 30자 이하여야 합니다")
    private String planName;

    @Size(max = 300, message = "상세 내용은 300자 이하여야 합니다")
    private String planContent;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;

    // 반복 여부 변경
    private Boolean isRecurring;

    // 반복 설정 수정 (반복 일정인 경우)
    private RecurringReqInfo recurringPlan;

    // 알람 설정 수정
    private List<AlarmReqInfo> alarms;

    // 반복 계획을 단일 계획으로 변경 시 옵션
    private Boolean convertToSinglePlan;

    @AssertTrue(message = "종료 날짜는 시작 날짜 이후여야 합니다")
    private boolean isValidDateRange() {
        if (startDate == null || endDate == null) return true;
        return !endDate.isBefore(startDate);
    }

    @AssertTrue(message = "반복 일정인 경우 반복 설정이 필요합니다")
    private boolean isValidRecurringPlan() {
        if (Boolean.TRUE.equals(isRecurring)) {
            return recurringPlan != null;
        }
        return true;
    }
}