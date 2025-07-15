-- V2__create_users_table.sql
-- 사용자 테이블 생성

CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(10) NOT NULL,
                       user_id VARCHAR(20) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       phone_number VARCHAR(15) NOT NULL,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                       CONSTRAINT users_name_check CHECK (length(name) >= 2),
                       CONSTRAINT users_user_id_check CHECK (length(user_id) >= 4),
                       CONSTRAINT users_password_check CHECK (length(password) >= 8),
                       CONSTRAINT users_email_check CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_phone_check CHECK (phone_number ~ '^010-\d{4}-\d{4}$')
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_email ON users(email);

-- 테이블 코멘트
COMMENT ON TABLE users IS '사용자 정보 테이블';
COMMENT ON COLUMN users.id IS '사용자 고유 ID (Primary Key)';
COMMENT ON COLUMN users.name IS '사용자 실명 (2-10자)';
COMMENT ON COLUMN users.user_id IS '로그인 아이디 (4-20자, 고유값)';
COMMENT ON COLUMN users.password IS '암호화된 비밀번호 (BCrypt)';
COMMENT ON COLUMN users.email IS '이메일 주소 (고유값)';
COMMENT ON COLUMN users.phone_number IS '휴대폰 번호 (010-0000-0000 형식)';
COMMENT ON COLUMN users.created_at IS '계정 생성 일시';