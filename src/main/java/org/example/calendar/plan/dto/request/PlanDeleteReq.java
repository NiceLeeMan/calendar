package org.example.calendar.plan.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

/**
 * 반복 계획 삭제 요청 DTO
 * 
 * <p>반복 계획의 복잡한 삭제 옵션을 처리하기 위한 요청 데이터를 담는 클래스입니다.</p>
 * <p><strong>참고:</strong> 단일 계획 삭제는 Path Variable(planId)만 사용하며 이 DTO를 사용하지 않습니다.</p>
 * 
 * <h3>삭제 옵션</h3>
 * <ul>
 *   <li><strong>DELETE_ALL</strong>: 반복 계획 전체 삭제 (모든 반복 인스턴스 삭제)</li>
 *   <li><strong>EXCLUDE_DATE</strong>: 특정 날짜만 제외 (예외 날짜로 추가, 반복 계획은 유지)</li>
 * </ul>
 * 
 * <h3>사용 예시</h3>
 * <pre>
 * // 반복 계획 전체 삭제
 * DELETE /plans/123 + { deleteType: "DELETE_ALL" }
 * 
 * // 7월 30일만 제외 (예외 날짜 추가)
 * DELETE /plans/123 + { deleteType: "EXCLUDE_DATE", targetDate: "2025-07-30" }
 * </pre>
 * 
 * <h3>validation 규칙</h3>
 * <ul>
 *   <li>deleteType: 필수 값</li>
 *   <li>EXCLUDE_DATE 선택 시: targetDate 필수</li>
 *   <li>DELETE_ALL 선택 시: targetDate 불필요</li>
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
public class PlanDeleteReq {

    /**
     * 반복 계획 삭제 타입
     */
    public enum DeleteType {
        DELETE_ALL,    // 반복 계획 전체 삭제 (모든 인스턴스 삭제)
        EXCLUDE_DATE   // 특정 날짜만 제외 (예외 날짜로 추가, 계획은 유지)
    }

    @NotNull(message = "삭제 타입은 필수입니다")
    private DeleteType deleteType;

    // EXCLUDE_DATE 선택 시 필수
    @NotNull(message = "특정 날짜 제외 시 대상 날짜는 필수입니다")
    private LocalDate targetDate;

    @AssertTrue(message = "특정 날짜 제외 시 대상 날짜를 지정해야 합니다")
    private boolean isValidTargetDate() {
        if (deleteType == DeleteType.DELETE_ALL) return true;
        return targetDate != null;
    }
}