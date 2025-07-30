-- V5: week_of_month 제약 조건 수정
-- 5주차 (월의 마지막 주)를 허용하도록 제약 조건 확장

-- 기존 제약 조건 삭제
ALTER TABLE recurring_repeat_weeks_of_month 
DROP CONSTRAINT week_of_month_check;

-- 새로운 제약 조건 추가 (1-5주차, -1: 마지막주)
ALTER TABLE recurring_repeat_weeks_of_month 
ADD CONSTRAINT week_of_month_check CHECK (week_of_month IN (-1, 1, 2, 3, 4, 5));

-- 코멘트 업데이트
COMMENT ON TABLE recurring_repeat_weeks_of_month IS '반복 일정의 월간 주차 정보 (1-5주차, -1: 마지막주)';
