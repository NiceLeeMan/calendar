# 배포 가이드

## GitHub Actions Secrets 설정

배포를 위해 다음 secrets를 GitHub 저장소에 설정해야 합니다:

### CI/CD 관련 Secrets

#### 서버 접근 정보
- `EC2_HOST`: EC2 서버의 공개 IP 주소
- `EC2_USERNAME`: EC2 서버 사용자명 (예: ubuntu, ec2-user)
- `EC2_SSH_KEY`: EC2 서버 접속용 SSH 개인키

#### 데이터베이스 설정
- `TEST_DB_PASSWORD`: 테스트용 PostgreSQL 비밀번호 (기본값: test_password_123)
- `PROD_DB_PASSWORD`: 운영용 PostgreSQL 비밀번호

#### 보안 설정
- `TEST_JWT_SECRET`: 테스트용 JWT 시크릿 (최소 256비트)
- `PROD_JWT_SECRET`: 운영용 JWT 시크릿 (최소 256비트, 복잡한 문자열)
- `PROD_REDIS_PASSWORD`: 운영용 Redis 비밀번호

#### 이메일 설정
- `MAIL_USERNAME`: Gmail 계정
- `MAIL_PASSWORD`: Gmail 앱 비밀번호

### Secrets 설정 방법

1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. 위의 각 secret 이름과 값을 입력

### 보안 권장사항

- **JWT Secret**: 최소 32자 이상의 복잡한 문자열 사용
- **데이터베이스 비밀번호**: 특수문자, 숫자, 대소문자 조합
- **SSH Key**: RSA 2048비트 이상 권장
- **이메일 비밀번호**: Gmail 2단계 인증 설정 후 앱 비밀번호 사용

### 환경별 설정

#### 개발환경 (.env 파일 사용)
```bash
cp .env.example .env
# .env 파일을 실제 값으로 수정
```

#### 운영환경 (환경변수 직접 설정)
```bash
export SPRING_PROFILES_ACTIVE=prod
export DB_URL=jdbc:postgresql://localhost:5432/calendar_prod
export DB_USERNAME=calendar_user
export DB_PASSWORD=your_secure_password
export JWT_SECRET=your_very_secure_jwt_secret
export REDIS_PASSWORD=your_redis_password
```

### 주의사항

⚠️ **절대 하지 말아야 할 것들:**
- 실제 비밀번호를 코드에 커밋하지 말 것
- .env 파일을 버전 관리에 포함하지 말 것
- GitHub Actions 로그에 비밀번호가 출력되지 않도록 주의
- 운영환경에서 Swagger를 공개하지 말 것
