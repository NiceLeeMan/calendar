package org.example.calendar.plan.dto.common;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 알람 응답 정보 DTO
 * 
 * <p>계획 조회 시 알람 정보를 클라이언트에게 전달하기 위한 응답 데이터를 담는 공통 클래스입니다.</p>
 * 
 * <h3>포함 정보</h3>
 * <ul>
 *   <li><strong>식별자</strong>: 알람 고유 ID</li>
 *   <li><strong>일시</strong>: 알람 발생 날짜와 시간</li>
 *   <li><strong>상태</strong>: 알람 처리 상태 (대기/발송완료/실패/취소)</li>
 * </ul>
 * 
 * <h3>알람 상태</h3>
 * <ul>
 *   <li><strong>PENDING</strong>: 발송 대기 중</li>
 *   <li><strong>SENT</strong>: 발송 완료</li>
 *   <li><strong>FAILED</strong>: 발송 실패</li>
 *   <li><strong>CANCELLED</strong>: 취소됨</li>
 * </ul>
 * 
 * <h3>JSON 형식</h3>
 * <ul>
 *   <li>날짜: "yyyy-MM-dd" 형식</li>
 *   <li>시간: "HH:mm" 형식</li>
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
public class AlarmResInfo {
    private Long id;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate alarmDate;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime alarmTime;
    private String alarmStatus; // PENDING, SENT, FAILED, CANCELLED
}