package org.example.calendar.plan.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.calendar.plan.entity.PlanAlarm;
import org.example.calendar.plan.repository.PlanAlarmRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * 알람 발송 서비스
 * 
 * <h3>핵심 기능</h3>
 * <ul>
 *   <li><strong>SMS 발송</strong>: 사용자 휴대폰에 일정 알림 메시지 전송</li>
 *   <li><strong>배치 처리</strong>: 스케줄러를 통한 자동 발송</li>
 *   <li><strong>상태 관리</strong>: 발송 성공/실패 처리</li>
 * </ul>
 * 
 * <h3>알림 메시지 특징</h3>
 * <ul>
 *   <li><strong>AI 기반</strong>: 자연스러운 사람 말투로 메시지 생성</li>
 *   <li><strong>개인화</strong>: 사용자별 맞춤 메시지</li>
 *   <li><strong>간결함</strong>: SMS 길이 제한 고려</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-25
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AlarmService {

    private final PlanAlarmRepository planAlarmRepository;

    /**
     * 스케줄된 알람 처리 (배치)
     * 매분 실행하여 발송 대상 알람 확인 및 발송
     */
    @Scheduled(fixedRate = 60000) // 1분마다 실행
    @Transactional
    public void processScheduledAlarms() {
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        
        // 현재 시간에 발송해야 할 알람 조회
        List<PlanAlarm> readyAlarms = planAlarmRepository.findReadyToSendAlarms(currentDate, currentTime);
        
        if (readyAlarms.isEmpty()) {
            return;
        }
        
        log.info("Processing {} scheduled alarms at {}", readyAlarms.size(), LocalDateTime.now());
        
        for (PlanAlarm alarm : readyAlarms) {
            try {
                sendSmsAlarm(alarm);
                markAlarmAsSent(alarm.getId());
                
            } catch (Exception e) {
                log.error("Failed to send alarm: alarmId={}, error={}", alarm.getId(), e.getMessage());
                markAlarmAsFailed(alarm.getId(), e.getMessage());
            }
        }
    }

    /**
     * SMS 알림 메시지 발송
     * 
     * @param alarm 발송할 알람 정보
     */
    private void sendSmsAlarm(PlanAlarm alarm) {
        // 알림 메시지 생성 (AI 기반으로 자연스러운 메시지)
        String message = generateAlarmMessage(alarm);
        
        // 사용자 휴대폰 번호 추출
        String phoneNumber = alarm.getPlan().getUser().getPhoneNumber();
        
        // SMS 발송 (실제 SMS 발송 로직)
        sendSms(phoneNumber, message);
        
        log.info("SMS alarm sent: userId={}, planId={}, phone={}, message={}", 
                alarm.getPlan().getUser().getId(), 
                alarm.getPlan().getId(),
                maskPhoneNumber(phoneNumber), 
                message);
    }

    /**
     * AI 기반 알림 메시지 생성
     * 사람이 말하는 것처럼 자연스러운 메시지 생성
     * 
     * @param alarm 알람 정보
     * @return 생성된 메시지
     */
    private String generateAlarmMessage(PlanAlarm alarm) {
        String userName = alarm.getPlan().getUser().getName();
        String planName = alarm.getPlan().getPlanName();
        LocalTime startTime = alarm.getPlan().getStartTime();
        
        // TODO: 추후 AI 서비스 연동하여 개선
        // 현재는 기본 메시지 템플릿 사용
        return String.format("%s님, %s 일정이 %s에 시작됩니다. 준비하세요!", 
                userName, planName, startTime.toString());
    }

    /**
     * 실제 SMS 발송
     * 
     * @param phoneNumber 수신자 번호
     * @param message 메시지 내용
     */
    private void sendSms(String phoneNumber, String message) {
        // TODO: SMS 발송 서비스 연동 (예: AWS SNS, Twilio, 국내 SMS 서비스)
        // 현재는 로그로 대체
        log.info("SMS would be sent to {} with message: {}", maskPhoneNumber(phoneNumber), message);
        
        // 실제 SMS 발송 로직이 여기에 들어갈 예정
        // smsProvider.sendMessage(phoneNumber, message);
    }

    /**
     * 알람 발송 성공 처리
     * 
     * @param alarmId 알람 ID
     */
    @Transactional
    public void markAlarmAsSent(Long alarmId) {
        int updated = planAlarmRepository.markAsSent(alarmId, LocalDateTime.now());
        
        if (updated > 0) {
            log.debug("Alarm marked as sent: alarmId={}", alarmId);
        } else {
            log.warn("Failed to mark alarm as sent: alarmId={}", alarmId);
        }
    }

    /**
     * 알람 발송 실패 처리
     * 
     * @param alarmId 알람 ID
     * @param failureReason 실패 사유
     */
    @Transactional
    public void markAlarmAsFailed(Long alarmId, String failureReason) {
        int updated = planAlarmRepository.markAsFailed(alarmId, failureReason);
        
        if (updated > 0) {
            log.debug("Alarm marked as failed: alarmId={}, reason={}", alarmId, failureReason);
        } else {
            log.warn("Failed to mark alarm as failed: alarmId={}", alarmId);
        }
    }

    /**
     * 휴대폰 번호 마스킹 (보안용)
     * 
     * @param phoneNumber 원본 번호
     * @return 마스킹된 번호 (예: 010-1234-*****)
     */
    private String maskPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.length() < 8) {
            return "****";
        }
        
        int length = phoneNumber.length();
        return phoneNumber.substring(0, length - 4) + "****";
    }
}
