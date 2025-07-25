-- V4__remove_location_column.sql
-- Plans 테이블에서 location 컬럼 제거

-- location 컬럼 삭제
ALTER TABLE plans DROP COLUMN IF EXISTS location;

-- 테이블 코멘트 업데이트
COMMENT ON TABLE plans IS '일정(계획) 테이블 - location 필드 제거됨';
