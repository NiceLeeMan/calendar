package org.example.calendar.plan.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import org.example.calendar.plan.dto.common.AlarmReqInfo;
import org.example.calendar.plan.dto.common.RecurringReqInfo;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


/**
 * 계획 생성 요청 DTO
 * 
 * <p>새로운 계획(단일 또는 반복)을 생성하기 위한 요청 데이터를 담는 클래스입니다.</p>
 * 
 * <h3>주요 기능</h3>
 * <ul>
 *   <li><strong>단일 계획</strong>: isRecurring=false로 설정하여 일회성 계획 생성</li>
 *   <li><strong>반복 계획</strong>: isRecurring=true와 함께 recurringPlan 설정</li>
 *   <li><strong>알람 설정</strong>: 선택적으로 복수 알람 추가 가능</li>
 * </ul>
 * 
 * <h3>validation 규칙</h3>
 * <ul>
 *   <li>계획 제목: 필수, 30자 이하</li>
 *   <li>날짜/시간: 종료는 시작 이후여야 함</li>
 *   <li>반복 계획: isRecurring=true인 경우 recurringPlan 필수</li>
 *   <li>시작 날짜: 현재 또는 미래 날짜만 허용</li>
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
public class PlanCreateReq {

    @NotBlank(message = "계획 제목은 필수입니다")
    @Size(max = 30, message = "계획 제목은 30자 이하여야 합니다")
    private String planName;

    @Size(max = 300, message = "상세 내용은 300자 이하여야 합니다")
    private String planContent;

    @NotNull(message = "시작 날짜는 필수입니다")
    @FutureOrPresent(message = "시작 날짜는 현재 또는 미래여야 합니다")
    private LocalDate startDate;

    @NotNull(message = "종료 날짜는 필수입니다")
    private LocalDate endDate;

    @NotNull(message = "시작 시간은 필수입니다")
    private LocalTime startTime;

    @NotNull(message = "종료 시간은 필수입니다")
    private LocalTime endTime;

    private String location;

    @NotNull(message = "반복 여부는 필수입니다")
    private Boolean isRecurring;

    // 반복 설정 (반복 일정인 경우 필수)
    private RecurringReqInfo recurringPlan;

    // 알람 설정 (선택)
    private List<AlarmReqInfo> alarms;

    @AssertTrue(message = "종료 날짜는 시작 날짜 이후여야 합니다")
    private boolean isValidDateRange() {
        if (startDate == null || endDate == null) return true;
        return !endDate.isBefore(startDate);
    }

    @AssertTrue(message = "같은 날짜인 경우 종료 시간은 시작 시간 이후여야 합니다")
    private boolean isValidTimeRange() {
        if (startDate == null || endDate == null ||
                startTime == null || endTime == null) return true;
        if (startDate.equals(endDate)) {
            return !endTime.isBefore(startTime);
        }
        return true;
    }

    @AssertTrue(message = "반복 일정인 경우 반복 설정이 필요합니다")
    private boolean isValidRecurringPlan() {
        if (Boolean.TRUE.equals(isRecurring)) {
            return recurringPlan != null;
        }
        return true;
    }
}