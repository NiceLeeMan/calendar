package org.example.calendar.plan.enums;

import lombok.Getter;

/**
 * 일정 유형 열거형
 *
 * <h3>일정 타입</h3>
 * <ul>
 *   <li><strong>SINGLE</strong>: 단일 일정 (한 번만 발생)</li>
 *   <li><strong>RECURRING</strong>: 반복 일정 (주기적으로 반복)</li>
 * </ul>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * Plan plan = Plan.builder()
 *     .planType(PlanType.SINGLE)    // 단일 일정
 *     .build();
 *
 * Plan recurringPlan = Plan.builder()
 *     .planType(PlanType.RECURRING) // 반복 일정
 *     .repeatUnit(RepeatUnit.WEEKLY)
 *     .build();
 * </pre>
 *
 * @author Calendar Team
 * @since 2025-07-15
 */
@Getter
public enum PlanType {

    /**
     * 단일 일정
     *
     * <p>한 번만 발생하는 일정입니다.</p>
     * <p>예: 회의, 약속, 이벤트 등</p>
     */
    SINGLE("단일 일정"),

    /**
     * 반복 일정
     *
     * <p>주기적으로 반복되는 일정입니다.</p>
     * <p>RepeatUnit과 함께 사용하여 반복 패턴을 정의합니다.</p>
     * <p>예: 매주 회의, 매월 정기 점검, 매년 생일 등</p>
     */
    RECURRING("반복 일정");

    /**
     * -- GETTER --
     *  일정 유형 설명 반환
     *
     * @return String 일정 유형 설명
     */
    private final String description;

    /**
     * PlanType 생성자
     *
     * @param description 일정 유형 설명
     */
    PlanType(String description) {
        this.description = description;
    }

    /**
     * 단일 일정인지 확인
     *
     * @return boolean 단일 일정이면 true
     */
    public boolean isSingle() {
        return this == SINGLE;
    }

    /**
     * 반복 일정인지 확인
     *
     * @return boolean 반복 일정이면 true
     */
    public boolean isRecurring() {
        return this == RECURRING;
    }

    /**
     * 문자열로부터 PlanType 조회 (대소문자 무시)
     *
     * @param value 문자열 값
     * @return PlanType 매칭되는 PlanType
     * @throws IllegalArgumentException 매칭되는 값이 없는 경우
     */
    public static PlanType fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("PlanType 값이 비어있습니다.");
        }

        try {
            return PlanType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("유효하지 않은 PlanType 값입니다: " + value);
        }
    }
}