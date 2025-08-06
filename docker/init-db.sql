-- PostgreSQL 초기화 스크립트
-- Docker 컨테이너 최초 실행 시 자동 실행됩니다.

-- 기본 설정
SET timezone = 'Asia/Seoul';

-- 확장 프로그램 설치 (필요한 경우)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 데이터베이스 정보 출력
SELECT version();
SELECT current_database();
SELECT current_user;

-- 초기화 완료 메시지
DO $$
BEGIN
    RAISE NOTICE 'Calendar Database initialized successfully!';
END $$;
