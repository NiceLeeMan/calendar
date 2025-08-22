-- 반복 일정 정보 테이블에 시작 날짜 필드 추가
-- RecurringInfo.startDate 필드 추가 (Plan.startDate와 동기화용)

ALTER TABLE recurring_info
ADD COLUMN start_date DATE;

-- 컬럼에 코멘트 추가 (PostgreSQL 방식)
COMMENT ON COLUMN recurring_info.start_date IS '반복 시작 날짜 (Plan.startDate와 동기화)';

-- 기존 데이터가 있는 경우 Plan 테이블의 start_date 값으로 초기화
UPDATE recurring_info ri
SET start_date = p.start_date
FROM plans p 
WHERE p.recurring_info_id = ri.id 
AND ri.start_date IS NULL;
