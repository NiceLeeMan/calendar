package org.example.calendar.plan.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecurringPlanDeleteReq {

    public enum DeleteType {
        THIS_DATE_ONLY,  // 특정 날짜만 제외
        DELETE_ALL       // 전체 삭제
    }

    @NotNull(message = "삭제 타입은 필수입니다")
    private DeleteType deleteType;

    // THIS_DATE_ONLY 선택 시 필수
    private LocalDate targetDate;

    @AssertTrue(message = "특정 날짜 삭제 시 대상 날짜를 지정해야 합니다")
    private boolean isValidTargetDate() {
        if (deleteType == DeleteType.DELETE_ALL) return true;
        return targetDate != null;
    }
}