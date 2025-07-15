-- V4__create_plan_collection_tables.sql
-- 반복 일정 관련 컬렉션 테이블 생성

-- 반복 요일 테이블 (주간 반복 시 사용)
CREATE TABLE plan_repeat_weekdays (
                                      plan_id BIGINT NOT NULL,
                                      repeat_weekday VARCHAR(10) NOT NULL,

                                      PRIMARY KEY (plan_id, repeat_weekday),
                                      CONSTRAINT fk_weekdays_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
                                      CONSTRAINT repeat_weekday_check CHECK (repeat_weekday IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'))
);

-- 예외 날짜 테이블 (반복 일정에서 제외할 날짜)
CREATE TABLE plan_exceptions (
                                 plan_id BIGINT NOT NULL,
                                 exception_date DATE NOT NULL,

                                 PRIMARY KEY (plan_id, exception_date),
                                 CONSTRAINT fk_exceptions_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX idx_plan_weekdays_plan_id ON plan_repeat_weekdays(plan_id);
CREATE INDEX idx_plan_exceptions_plan_id ON plan_exceptions(plan_id);
CREATE INDEX idx_plan_exceptions_date ON plan_exceptions(exception_date);

-- 테이블 코멘트
COMMENT ON TABLE plan_repeat_weekdays IS '반복 일정의 요일 정보 테이블';
COMMENT ON COLUMN plan_repeat_weekdays.plan_id IS '일정 ID (plans.id 참조)';
COMMENT ON COLUMN plan_repeat_weekdays.repeat_weekday IS '반복 요일 (MONDAY ~ SUNDAY)';

COMMENT ON TABLE plan_exceptions IS '반복 일정에서 제외할 예외 날짜 테이블';
COMMENT ON COLUMN plan_exceptions.plan_id IS '일정 ID (plans.id 참조)';
COMMENT ON COLUMN plan_exceptions.exception_date IS '제외할 날짜';