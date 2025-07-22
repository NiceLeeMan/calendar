// CachedPlan.java
package org.example.calendar.plan.dto.cache;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CachedPlan implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    private String planName;
    private String planContent;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String location;
    private String planType;

    // 반복 정보 간소화
    private String repeatPattern;
    private Set<LocalDate> exceptionDates;

    // 알람 ID만 저장
    private Set<Long> alarmIds;

    private Long userId;
    private Long version;
}