-- V3__create_plans_table.sql
-- 일정(계획) 테이블 생성

CREATE TABLE plans (
                       id BIGSERIAL PRIMARY KEY,
                       user_id BIGINT NOT NULL,
                       plan_name VARCHAR(50) NOT NULL,
                       plan_content TEXT,
                       start_date DATE NOT NULL,
                       end_date DATE NOT NULL,
                       start_time TIME NOT NULL,
                       end_time TIME NOT NULL,
                       location VARCHAR(200),
                       alarm_time TIME,
                       plan_type VARCHAR(20) NOT NULL DEFAULT 'SINGLE',
                       repeat_unit VARCHAR(20),
                       repeat_interval INTEGER,
                       repeat_day_of_month INTEGER,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       version BIGINT DEFAULT 0,

                       CONSTRAINT fk_plan_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                       CONSTRAINT plans_plan_type_check CHECK (plan_type IN ('SINGLE', 'RECURRING')),
                       CONSTRAINT plans_repeat_unit_check CHECK (repeat_unit IS NULL OR repeat_unit IN ('WEEKLY', 'MONTHLY', 'YEARLY')),
                       CONSTRAINT plans_date_check CHECK (end_date >= start_date),
                       CONSTRAINT plans_time_check CHECK (end_time > start_time OR end_date > start_date),
                       CONSTRAINT plans_repeat_interval_check CHECK (repeat_interval IS NULL OR repeat_interval > 0),
                       CONSTRAINT plans_repeat_day_check CHECK (repeat_day_of_month IS NULL OR (repeat_day_of_month >= 1 AND repeat_day_of_month <= 31))
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_plans_user_id ON plans(user_id);
CREATE INDEX idx_plans_start_date ON plans(start_date);
CREATE INDEX idx_plans_plan_type ON plans(plan_type);
CREATE INDEX idx_plans_created_at ON plans(created_at);

-- 테이블 코멘트
COMMENT ON TABLE plans IS '사용자 일정(계획) 테이블';
COMMENT ON COLUMN plans.id IS '일정 고유 ID (Primary Key)';
COMMENT ON COLUMN plans.user_id IS '일정 소유자 ID (users.id 참조)';
COMMENT ON COLUMN plans.plan_name IS '일정 제목 (최대 50자)';
COMMENT ON COLUMN plans.plan_content IS '일정 내용 (최대 1000자)';
COMMENT ON COLUMN plans.start_date IS '시작 날짜';
COMMENT ON COLUMN plans.end_date IS '종료 날짜';
COMMENT ON COLUMN plans.start_time IS '시작 시간';
COMMENT ON COLUMN plans.end_time IS '종료 시간';
COMMENT ON COLUMN plans.location IS '장소 정보';
COMMENT ON COLUMN plans.alarm_time IS '알림 시간';
COMMENT ON COLUMN plans.plan_type IS '일정 유형 (SINGLE: 단일, RECURRING: 반복)';
COMMENT ON COLUMN plans.repeat_unit IS '반복 단위 (WEEKLY, MONTHLY, YEARLY)';
COMMENT ON COLUMN plans.repeat_interval IS '반복 간격 (N주, N개월, N년)';
COMMENT ON COLUMN plans.repeat_day_of_month IS '월 반복 시 특정 일자';
COMMENT ON COLUMN plans.created_at IS '일정 생성 일시';
COMMENT ON COLUMN plans.updated_at IS '일정 수정 일시';
COMMENT ON COLUMN plans.version IS '낙관적 락을 위한 버전 필드';