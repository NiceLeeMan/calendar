// DateTimeRange.java
package org.example.calendar.plan.dto.common;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DateTimeRange {

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;

    public boolean isValid() {
        if (startDate == null || endDate == null) return false;
        if (endDate.isBefore(startDate)) return false;
        if (startDate.equals(endDate) &&
                startTime != null && endTime != null &&
                endTime.isBefore(startTime)) {
            return false;
        }
        return true;
    }
}