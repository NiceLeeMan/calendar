-- V4: recurring_info 테이블에 end_date 컬럼 추가
-- 반복 일정의 종료 날짜를 명시적으로 저장하기 위한 마이그레이션

-- recurring_info 테이블에 end_date 컬럼 추가
ALTER TABLE recurring_info 
ADD COLUMN end_date DATE;

-- 컬럼 코멘트 추가 (PostgreSQL 구문)
COMMENT ON COLUMN recurring_info.end_date IS '반복 패턴 종료 날짜';

-- 기존 데이터가 있다면 Plan의 end_date를 참조하여 업데이트
-- (기존 반복 일정이 있을 경우를 대비)
UPDATE recurring_info ri
SET end_date = p.end_date
FROM plans p 
WHERE ri.id = p.recurring_info_id AND ri.end_date IS NULL;

-- 인덱스 추가 (반복 종료일 기준 조회 성능 향상)
CREATE INDEX idx_recurring_info_end_date ON recurring_info(end_date);
