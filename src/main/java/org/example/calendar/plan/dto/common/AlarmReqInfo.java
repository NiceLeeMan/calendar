package org.example.calendar.plan.dto.common;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;



/**
 * 알람 요청 정보 DTO
 * 
 * <p>계획 생성/수정 시 알람 설정을 위한 요청 데이터를 담는 공통 클래스입니다.</p>
 * 
 * <h3>알람 설정 방식</h3>
 * <ul>
 *   <li><strong>알람 없음</strong>: alarms 리스트를 비우거나 null로 설정</li>
 *   <li><strong>다일간 계획</strong>: alarmDate로 특정 날짜 지정</li>
 *   <li><strong>반복 계획</strong>: alarmDate로 특정 반복 인스턴스 날짜 지정</li>
 * </ul>
 * 
 * <h3>알람 시간</h3>
 * <ul>
 *   <li>정확한 시간(LocalTime)으로만 설정</li>
 *   <li>"N분 전" 기능은 지원하지 않음 (단순성 유지)</li>
 * </ul>
 * 
 * <h3>사용 예시</h3>
 * <pre>
 * // 계획 시작일 오전 9시에 알람
 * AlarmReqInfo alarm1 = AlarmReqInfo.builder()
 *     .alarmDate(null)  // 시작일 자동 사용
 *     .alarmTime(LocalTime.of(9, 0))
 *     .build();
 * 
 * // 특정 날짜 오후 2시에 알람
 * AlarmReqInfo alarm2 = AlarmReqInfo.builder()
 *     .alarmDate(LocalDate.of(2025, 7, 30))
 *     .alarmTime(LocalTime.of(14, 0))
 *     .build();
 * </pre>
 * 
 * @author Calendar Team
 * @since 2025-07-24
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlarmReqInfo {

    // 알람을 설정할 날짜 (다일간/반복 계획에서 필요)
    // null인 경우 계획의 시작일에 알람 설정
    private LocalDate alarmDate;

    // 구체적인 알람 시간 지정 (알람 설정 시 필수)
    private LocalTime alarmTime;
}