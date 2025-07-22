-- V5__update_plans_schema.sql
-- Plan 엔티티 및 PlanAlarm 엔티티 구조 변경에 따른 스키마 업데이트

-- 1. plans 테이블 구조 수정
ALTER TABLE plans
-- 필드 크기 조정
ALTER COLUMN plan_name TYPE VARCHAR(30),
    ALTER COLUMN plan_content TYPE VARCHAR(300),

    -- 기존 alarm_time 제거 (PlanAlarm으로 분리)
    DROP COLUMN IF EXISTS alarm_time,

    -- 새로운 반복 관련 필드 추가
    ADD COLUMN IF NOT EXISTS repeat_week_of_month INTEGER,
    ADD COLUMN IF NOT EXISTS repeat_month INTEGER,
    ADD COLUMN IF NOT EXISTS repeat_day_of_year INTEGER;

-- 2. PlanAlarm 테이블 생성 (정확한 구조)
CREATE TABLE IF NOT EXISTS plan_alarms (
                                           id BIGSERIAL PRIMARY KEY,
                                           plan_id BIGINT NOT NULL,
                                           alarm_date DATE NOT NULL,
                                           alarm_time TIME NOT NULL,
                                           alarm_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    alarm_message VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    failure_reason VARCHAR(500),
    retry_count INTEGER DEFAULT 0,

    CONSTRAINT fk_alarm_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
    CONSTRAINT alarm_status_check CHECK (alarm_status IN ('PENDING', 'SENT', 'FAILED', 'CANCELLED')),
    CONSTRAINT retry_count_check CHECK (retry_count >= 0)
    );

-- 3. ElementCollection 테이블 생성 (누락된 것만)

-- 반복 주차 정보 (매월 첫째/둘째/셋째/넷째/마지막 주) - 새로 추가
CREATE TABLE IF NOT EXISTS plan_repeat_weeks_of_month (
                                                          plan_id BIGINT NOT NULL,
                                                          week_of_month INTEGER NOT NULL,

                                                          PRIMARY KEY (plan_id, week_of_month),
    CONSTRAINT fk_plan_week_of_month FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
    CONSTRAINT week_of_month_check CHECK (week_of_month IN (-1, 1, 2, 3, 4))
    );

-- 4. 제약조건 추가 (IF NOT EXISTS 문법이 없으므로 조건부로 추가)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'repeat_month_check') THEN
ALTER TABLE plans ADD CONSTRAINT repeat_month_check
    CHECK (repeat_month IS NULL OR (repeat_month >= 1 AND repeat_month <= 12));
END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'repeat_day_of_year_check') THEN
ALTER TABLE plans ADD CONSTRAINT repeat_day_of_year_check
    CHECK (repeat_day_of_year IS NULL OR (repeat_day_of_year >= 1 AND repeat_day_of_year <= 366));
END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'repeat_week_of_month_check') THEN
ALTER TABLE plans ADD CONSTRAINT repeat_week_of_month_check
    CHECK (repeat_week_of_month IS NULL OR repeat_week_of_month IN (-1, 1, 2, 3, 4));
END IF;
END $$;

-- 5. 인덱스 추가 (존재하지 않는 경우에만)
CREATE INDEX IF NOT EXISTS idx_plan_alarms_plan_id ON plan_alarms(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_alarms_alarm_datetime ON plan_alarms(alarm_date, alarm_time);
CREATE INDEX IF NOT EXISTS idx_plan_alarms_alarm_status ON plan_alarms(alarm_status);
CREATE INDEX IF NOT EXISTS idx_plans_end_date ON plans(end_date);
CREATE INDEX IF NOT EXISTS idx_plans_user_date_range ON plans(user_id, start_date, end_date);

-- 6. 테이블 및 컬럼 코멘트
COMMENT ON TABLE plan_alarms IS '일정 알람 테이블';
COMMENT ON COLUMN plan_alarms.id IS '알람 고유 ID';
COMMENT ON COLUMN plan_alarms.plan_id IS '연관된 일정 ID';
COMMENT ON COLUMN plan_alarms.alarm_date IS '알람 날짜';
COMMENT ON COLUMN plan_alarms.alarm_time IS '알람 시간';
COMMENT ON COLUMN plan_alarms.alarm_status IS '알람 상태 (PENDING, SENT, FAILED, CANCELLED)';
COMMENT ON COLUMN plan_alarms.alarm_message IS '알람 메시지';
COMMENT ON COLUMN plan_alarms.sent_at IS '발송 완료 시각';
COMMENT ON COLUMN plan_alarms.failure_reason IS '발송 실패 사유';
COMMENT ON COLUMN plan_alarms.retry_count IS '재시도 횟수';

COMMENT ON TABLE plan_repeat_weeks_of_month IS '월간 반복 주차 정보 (복수 선택 가능)';

COMMENT ON COLUMN plans.repeat_week_of_month IS '월 반복 시 주차 (1-4: 첫째-넷째주, -1: 마지막주)';
COMMENT ON COLUMN plans.repeat_month IS '연 반복 시 특정 월 (1-12)';
COMMENT ON COLUMN plans.repeat_day_of_year IS '연 반복 시 특정 일 (1-366)';