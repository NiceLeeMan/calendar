// AlarmResponse.java
package org.example.calendar.plan.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlarmResponse {

    private Long id;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate alarmDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime alarmTime;

    private String alarmMessage;
    private String alarmStatus;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime sentAt;

    private String failureReason;
    private Integer retryCount;
}