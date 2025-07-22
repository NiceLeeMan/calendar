package org.example.calendar.plan.dto.request;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanDeleteReq {

    public enum DeleteOption {
        TODAY_ONLY,      // 오늘 일정만 삭제
        ALL_RECURRING    // 반복되는 모든 일정 삭제
    }

    private DeleteOption deleteOption = DeleteOption.TODAY_ONLY;

    // 특정 날짜의 반복 일정만 삭제할 경우
    private LocalDate targetDate;
}
