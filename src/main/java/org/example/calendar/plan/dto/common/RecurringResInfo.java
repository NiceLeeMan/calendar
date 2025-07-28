package org.example.calendar.plan.dto.common;

import lombok.*;
import java.util.List;

/**
 * 반복 계획 응답 정보 DTO
 * 
 * <p>계획 조회 시 반복 규칙 정보를 클라이언트에게 전달하기 위한 응답 데이터를 담는 공통 클래스입니다.</p>
 * 
 * <h3>응답 특징</h3>
 * <ul>
 *   <li><strong>문자열 형태</strong>: 클라이언트 호환성을 위해 enum을 문자열로 변환</li>
 *   <li><strong>예외 정보</strong>: 반복에서 제외된 날짜들 포함</li>
 *   <li><strong>설명 텍스트</strong>: 사용자 친화적인 반복 규칙 설명</li>
 * </ul>
 * 
 * <h3>필드 설명</h3>
 * <ul>
 *   <li><strong>repeatUnit</strong>: "WEEKLY", "MONTHLY", "YEARLY"</li>
 *   <li><strong>repeatWeekdays</strong>: 요일 문자열 배열 (예: ["MONDAY", "FRIDAY"])</li>
 *   <li><strong>exceptionDates</strong>: 제외된 날짜 문자열 배열 (ISO 형식)</li>
 *   <li><strong>repeatDescription</strong>: "매주 월,수,금", "매월 15일" 등</li>
 * </ul>
 * 
 * <h3>JSON 응답 예시</h3>
 * <pre>
 * {
 *   "repeatUnit": "WEEKLY",
 *   "repeatInterval": 1,
 *   "repeatWeekdays": ["MONDAY", "WEDNESDAY", "FRIDAY"],
 *   "exceptionDates": ["2025-08-15"],
 *   "repeatDescription": "매주 월,수,금"
 * }
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
public class RecurringResInfo {
    private String repeatUnit;
    private Integer repeatInterval;
    private List<String> repeatWeekdays;
    private Integer repeatDayOfMonth;
    private List<Integer> repeatWeeksOfMonth;
    private Integer repeatWeekOfMonth;
    private Integer repeatMonth;
    private Integer repeatDayOfYear;
    private List<String> exceptionDates; // 예외 날짜들
    private String endDate; // 반복 종료 날짜 (ISO 형식: "2025-12-31")
    private String repeatDescription; // "매주 월,수,금" 같은 설명
}