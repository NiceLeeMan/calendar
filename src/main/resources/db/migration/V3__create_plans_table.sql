-- V3__create_plans_table.sql
-- Plans 및 관련 테이블 생성 (최종 설계 반영)

-- 1. RecurringInfo 테이블 생성 (반복 일정 정보)
CREATE TABLE recurring_info (
    id BIGSERIAL PRIMARY KEY,
    repeat_unit VARCHAR(20) NOT NULL,
    repeat_interval INTEGER,
    repeat_day_of_month INTEGER,
    repeat_week_of_month INTEGER,
    repeat_month INTEGER,
    repeat_day_of_year INTEGER,
    
    CONSTRAINT repeat_unit_check CHECK (repeat_unit IN ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY')),
    CONSTRAINT repeat_interval_check CHECK (repeat_interval IS NULL OR repeat_interval > 0),
    CONSTRAINT repeat_day_of_month_check CHECK (repeat_day_of_month IS NULL OR (repeat_day_of_month >= 1 AND repeat_day_of_month <= 31)),
    CONSTRAINT repeat_week_of_month_check CHECK (repeat_week_of_month IS NULL OR repeat_week_of_month IN (-1, 1, 2, 3, 4)),
    CONSTRAINT repeat_month_check CHECK (repeat_month IS NULL OR (repeat_month >= 1 AND repeat_month <= 12)),
    CONSTRAINT repeat_day_of_year_check CHECK (repeat_day_of_year IS NULL OR (repeat_day_of_year >= 1 AND repeat_day_of_year <= 366))
);

-- 2. RecurringInfo ElementCollection 테이블들
CREATE TABLE recurring_repeat_weeks_of_month (
    recurring_info_id BIGINT NOT NULL,
    week_of_month INTEGER NOT NULL,
    
    PRIMARY KEY (recurring_info_id, week_of_month),
    CONSTRAINT fk_recurring_week_of_month FOREIGN KEY (recurring_info_id) REFERENCES recurring_info(id) ON DELETE CASCADE,
    CONSTRAINT week_of_month_check CHECK (week_of_month IN (-1, 1, 2, 3, 4))
);

CREATE TABLE recurring_repeat_weekdays (
    recurring_info_id BIGINT NOT NULL,
    repeat_weekday VARCHAR(10) NOT NULL,
    
    PRIMARY KEY (recurring_info_id, repeat_weekday),
    CONSTRAINT fk_recurring_weekday FOREIGN KEY (recurring_info_id) REFERENCES recurring_info(id) ON DELETE CASCADE,
    CONSTRAINT repeat_weekday_check CHECK (repeat_weekday IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'))
);

CREATE TABLE recurring_exceptions (
    recurring_info_id BIGINT NOT NULL,
    exception_date DATE NOT NULL,
    
    PRIMARY KEY (recurring_info_id, exception_date),
    CONSTRAINT fk_recurring_exception FOREIGN KEY (recurring_info_id) REFERENCES recurring_info(id) ON DELETE CASCADE
);

-- 3. Plans 테이블 생성 (최종 구조)
CREATE TABLE plans (
    id BIGSERIAL PRIMARY KEY,
    plan_name VARCHAR(30) NOT NULL,
    plan_content VARCHAR(300),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    recurring_info_id BIGINT,
    user_id BIGINT NOT NULL,
    version BIGINT DEFAULT 0,
    
    CONSTRAINT fk_plan_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_plan_recurring_info FOREIGN KEY (recurring_info_id) REFERENCES recurring_info(id) ON DELETE SET NULL,
    CONSTRAINT check_date_order CHECK (start_date <= end_date),
    CONSTRAINT check_time_order CHECK (start_time <= end_time OR start_date < end_date)
);

-- 4. PlanAlarm 테이블 생성 (alarm_message 제외)
CREATE TABLE plan_alarms (
    id BIGSERIAL PRIMARY KEY,
    plan_id BIGINT NOT NULL,
    alarm_date DATE NOT NULL,
    alarm_time TIME NOT NULL,
    alarm_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    failure_reason VARCHAR(500),
    retry_count INTEGER DEFAULT 0,

    CONSTRAINT fk_alarm_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
    CONSTRAINT alarm_status_check CHECK (alarm_status IN ('PENDING', 'SENT', 'FAILED', 'CANCELLED')),
    CONSTRAINT retry_count_check CHECK (retry_count >= 0)
);

-- 5. 인덱스 생성
-- Plans 테이블 인덱스
CREATE INDEX idx_plans_user_id ON plans(user_id);
CREATE INDEX idx_plans_start_date ON plans(start_date);
CREATE INDEX idx_plans_end_date ON plans(end_date);
CREATE INDEX idx_plans_is_recurring ON plans(is_recurring);
CREATE INDEX idx_plans_user_date_range ON plans(user_id, start_date, end_date);

-- RecurringInfo 테이블 인덱스
CREATE INDEX idx_recurring_info_repeat_unit ON recurring_info(repeat_unit);

-- PlanAlarm 테이블 인덱스
CREATE INDEX idx_plan_alarms_plan_id ON plan_alarms(plan_id);
CREATE INDEX idx_plan_alarms_alarm_datetime ON plan_alarms(alarm_date, alarm_time);
CREATE INDEX idx_plan_alarms_alarm_status ON plan_alarms(alarm_status);

-- 6. 테이블 및 컬럼 코멘트
COMMENT ON TABLE plans IS '일정(계획) 테이블';
COMMENT ON COLUMN plans.plan_name IS '일정 제목';
COMMENT ON COLUMN plans.plan_content IS '일정 내용';
COMMENT ON COLUMN plans.is_recurring IS '반복 일정 여부';
COMMENT ON COLUMN plans.recurring_info_id IS '연관된 반복 정보 ID';

COMMENT ON TABLE recurring_info IS '반복 일정 정보 테이블';
COMMENT ON COLUMN recurring_info.repeat_unit IS '반복 단위 (DAILY, WEEKLY, MONTHLY, YEARLY)';
COMMENT ON COLUMN recurring_info.repeat_interval IS '반복 간격';
COMMENT ON COLUMN recurring_info.repeat_day_of_month IS '월 반복 시 특정 일';
COMMENT ON COLUMN recurring_info.repeat_week_of_month IS '월 반복 시 주차 (1-4: 첫째-넷째주, -1: 마지막주)';
COMMENT ON COLUMN recurring_info.repeat_month IS '연 반복 시 특정 월 (1-12)';
COMMENT ON COLUMN recurring_info.repeat_day_of_year IS '연 반복 시 특정 일 (1-366)';

COMMENT ON TABLE recurring_repeat_weeks_of_month IS '반복 일정의 월간 주차 정보 (복수 선택 가능)';
COMMENT ON TABLE recurring_repeat_weekdays IS '반복 일정의 요일 정보';
COMMENT ON TABLE recurring_exceptions IS '반복 일정의 예외 날짜 정보';

COMMENT ON TABLE plan_alarms IS '일정 알람 테이블';
COMMENT ON COLUMN plan_alarms.alarm_status IS '알람 상태 (PENDING, SENT, FAILED, CANCELLED)';
COMMENT ON COLUMN plan_alarms.sent_at IS '발송 완료 시각';
COMMENT ON COLUMN plan_alarms.failure_reason IS '발송 실패 사유';
COMMENT ON COLUMN plan_alarms.retry_count IS '재시도 횟수';
