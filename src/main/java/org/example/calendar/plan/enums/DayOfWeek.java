package org.example.calendar.plan.enums;

import lombok.Getter;

/**
 * 요일 열거형
 *
 * <h3>요일 타입</h3>
 * <ul>
 *   <li><strong>MONDAY</strong>: 월요일 (1)</li>
 *   <li><strong>TUESDAY</strong>: 화요일 (2)</li>
 *   <li><strong>WEDNESDAY</strong>: 수요일 (3)</li>
 *   <li><strong>THURSDAY</strong>: 목요일 (4)</li>
 *   <li><strong>FRIDAY</strong>: 금요일 (5)</li>
 *   <li><strong>SATURDAY</strong>: 토요일 (6)</li>
 *   <li><strong>SUNDAY</strong>: 일요일 (7)</li>
 * </ul>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * // 매주 월요일 반복
 * Plan weeklyMeeting = Plan.builder()
 *     .planType(PlanType.RECURRING)
 *     .repeatUnit(RepeatUnit.WEEKLY)
 *     .repeatInterval(1)
 *     .repeatWeekdays(Set.of(DayOfWeek.MONDAY))
 *     .build();
 *
 * // 격주 월수금 반복
 * Plan workoutPlan = Plan.builder()
 *     .planType(PlanType.RECURRING)
 *     .repeatUnit(RepeatUnit.WEEKLY)
 *     .repeatInterval(2)
 *     .repeatWeekdays(Set.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY))
 *     .build();
 * </pre>
 *
 * @author Calendar Team
 * @since 2025-07-22
 */
@Getter
public enum DayOfWeek {

    /**
     * 월요일
     */
    MONDAY(1, "월요일", "월"),

    /**
     * 화요일
     */
    TUESDAY(2, "화요일", "화"),

    /**
     * 수요일
     */
    WEDNESDAY(3, "수요일", "수"),

    /**
     * 목요일
     */
    THURSDAY(4, "목요일", "목"),

    /**
     * 금요일
     */
    FRIDAY(5, "금요일", "금"),

    /**
     * 토요일
     */
    SATURDAY(6, "토요일", "토"),

    /**
     * 일요일
     */
    SUNDAY(7, "일요일", "일");

    /**
     * -- GETTER --
     * 요일 번호 (1: 월요일, 7: 일요일)
     */
    private final int value;

    /**
     * -- GETTER --
     * 요일 전체 이름
     */
    private final String description;

    /**
     * -- GETTER --
     * 요일 단축 이름
     */
    private final String shortName;

    /**
     * DayOfWeek 생성자
     *
     * @param value 요일 번호 (1-7)
     * @param description 요일 전체 이름
     * @param shortName 요일 단축 이름
     */
    DayOfWeek(int value, String description, String shortName) {
        this.value = value;
        this.description = description;
        this.shortName = shortName;
    }

    /**
     * 평일인지 확인 (월~금)
     *
     * @return boolean 평일이면 true
     */
    public boolean isWeekday() {
        return this.value >= MONDAY.value && this.value <= FRIDAY.value;
    }

    /**
     * 주말인지 확인 (토, 일)
     *
     * @return boolean 주말이면 true
     */
    public boolean isWeekend() {
        return this == SATURDAY || this == SUNDAY;
    }

    /**
     * 요일 번호로 DayOfWeek 조회
     *
     * @param value 요일 번호 (1-7)
     * @return DayOfWeek 매칭되는 DayOfWeek
     * @throws IllegalArgumentException 유효하지 않은 번호인 경우
     */
    public static DayOfWeek fromValue(int value) {
        for (DayOfWeek dayOfWeek : DayOfWeek.values()) {
            if (dayOfWeek.value == value) {
                return dayOfWeek;
            }
        }
        throw new IllegalArgumentException("유효하지 않은 요일 번호입니다: " + value);
    }

    /**
     * 문자열로부터 DayOfWeek 조회 (대소문자 무시)
     *
     * @param value 문자열 값
     * @return DayOfWeek 매칭되는 DayOfWeek
     * @throws IllegalArgumentException 매칭되는 값이 없는 경우
     */
    public static DayOfWeek fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("DayOfWeek 값이 비어있습니다.");
        }

        try {
            return DayOfWeek.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("유효하지 않은 DayOfWeek 값입니다: " + value);
        }
    }

    /**
     * Java 표준 DayOfWeek로 변환
     *
     * @return java.time.DayOfWeek Java 표준 DayOfWeek
     */
    public java.time.DayOfWeek toJavaDayOfWeek() {
        return java.time.DayOfWeek.of(this.value);
    }

    /**
     * Java 표준 DayOfWeek에서 변환
     *
     * @param javaDayOfWeek Java 표준 DayOfWeek
     * @return DayOfWeek 변환된 DayOfWeek
     */
    public static DayOfWeek fromJavaDayOfWeek(java.time.DayOfWeek javaDayOfWeek) {
        return fromValue(javaDayOfWeek.getValue());
    }
}