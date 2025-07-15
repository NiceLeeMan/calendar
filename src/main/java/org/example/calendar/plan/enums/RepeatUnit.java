package org.example.calendar.plan.enums;

import lombok.Getter;

/**
 * 반복 단위 열거형
 *
 * <h3>반복 패턴</h3>
 * <ul>
 *   <li><strong>WEEKLY</strong>: 주간 반복 (매주)</li>
 *   <li><strong>MONTHLY</strong>: 월간 반복 (매월)</li>
 *   <li><strong>YEARLY</strong>: 연간 반복 (매년)</li>
 * </ul>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * // 매주 반복
 * Plan weeklyMeeting = Plan.builder()
 *     .planType(PlanType.RECURRING)
 *     .repeatUnit(RepeatUnit.WEEKLY)
 *     .repeatInterval(1)  // 1주마다
 *     .build();
 *
 * // 격월 반복
 * Plan monthlyCheck = Plan.builder()
 *     .planType(PlanType.RECURRING)
 *     .repeatUnit(RepeatUnit.MONTHLY)
 *     .repeatInterval(2)  // 2개월마다
 *     .build();
 * </pre>
 *
 * @author Calendar Team
 * @since 2025-07-15
 */
@Getter
public enum RepeatUnit {

    /**
     * 주간 반복
     *
     * <p>매주 또는 N주마다 반복되는 패턴입니다.</p>
     * <p>repeatWeekdays와 함께 사용하여 특정 요일에 반복할 수 있습니다.</p>
     *
     * <p><strong>예시:</strong></p>
     * <ul>
     *   <li>매주 월요일 회의</li>
     *   <li>격주 화요일, 목요일 운동</li>
     *   <li>3주마다 금요일 정기 점검</li>
     * </ul>
     */
    WEEKLY("주간"),

    /**
     * 월간 반복
     *
     * <p>매월 또는 N개월마다 반복되는 패턴입니다.</p>
     * <p>repeatDayOfMonth와 함께 사용하여 특정 날짜에 반복할 수 있습니다.</p>
     *
     * <p><strong>예시:</strong></p>
     * <ul>
     *   <li>매월 15일 급여일</li>
     *   <li>분기별(3개월마다) 실적 점검</li>
     *   <li>매월 첫째 주 월요일 전체 회의</li>
     * </ul>
     */
    MONTHLY("월간"),

    /**
     * 연간 반복
     *
     * <p>매년 또는 N년마다 반복되는 패턴입니다.</p>
     * <p>주로 생일, 기념일, 연례 행사 등에 사용됩니다.</p>
     *
     * <p><strong>예시:</strong></p>
     * <ul>
     *   <li>매년 생일</li>
     *   <li>매년 결혼기념일</li>
     *   <li>2년마다 건강검진</li>
     * </ul>
     */
    YEARLY("연간");

    /**
     * -- GETTER --
     *  반복 단위 설명 반환
     *
     * @return String 반복 단위 설명
     */
    private final String description;

    /**
     * RepeatUnit 생성자
     *
     * @param description 반복 단위 설명
     */
    RepeatUnit(String description) {
        this.description = description;
    }

    /**
     * 주간 반복인지 확인
     *
     * @return boolean 주간 반복이면 true
     */
    public boolean isWeekly() {
        return this == WEEKLY;
    }

    /**
     * 월간 반복인지 확인
     *
     * @return boolean 월간 반복이면 true
     */
    public boolean isMonthly() {
        return this == MONTHLY;
    }

    /**
     * 연간 반복인지 확인
     *
     * @return boolean 연간 반복이면 true
     */
    public boolean isYearly() {
        return this == YEARLY;
    }

    /**
     * 문자열로부터 RepeatUnit 조회 (대소문자 무시)
     *
     * @param value 문자열 값
     * @return RepeatUnit 매칭되는 RepeatUnit
     * @throws IllegalArgumentException 매칭되는 값이 없는 경우
     */
    public static RepeatUnit fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("RepeatUnit 값이 비어있습니다.");
        }

        try {
            return RepeatUnit.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("유효하지 않은 RepeatUnit 값입니다: " + value);
        }
    }

    /**
     * 해당 반복 단위에서 사용 가능한 최대 간격 반환
     *
     * @return int 최대 반복 간격
     */
    public int getMaxInterval() {
        return switch (this) {
            case WEEKLY -> 52;  // 최대 52주 (1년)
            case MONTHLY -> 24;  // 최대 24개월 (2년)
            case YEARLY -> 10;  // 최대 10년
            default -> 1;
        };
    }
}