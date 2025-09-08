# 📅 Calendar Project

> 현대적인 웹 기반 캘린더 애플리케이션 - Spring Boot + React로 구현된 개인 일정 관리 시스템

## ✨ 주요 기능

### 🔐 사용자 인증
- **이메일 인증 회원가입**: Gmail SMTP를 활용한 4자리 인증번호 시스템
- **JWT 기반 로그인**: 안전한 토큰 기반 인증
- **자동 로그아웃**: 토큰 만료 시 자동 처리

### 📆 스마트 캘린더
- **다중 뷰 지원**: 월간/주간/일간 뷰로 유연한 일정 확인
- **직관적 일정 관리**: 드래그 앤 드롭, 우클릭 메뉴로 쉬운 조작
- **복잡한 반복 일정**: 매일/매주/매월 다양한 반복 패턴 지원
- **시각적 구분**: 색상과 시간대별 일정 표시

### ⏰ 알람 시스템(서버측 아직 미구현)
- **이메일 알림**: 설정한 시간에 자동 이메일 발송 
- **알람 상태 관리**: 발송 성공/실패 추적
- **재시도 로직**: 실패 시 자동 재시도

### 📱 반응형 디자인
- **모든 디바이스 지원**: 데스크톱, 태블릿, 모바일 최적화
- **현대적 UI**: Tailwind CSS 기반 깔끔한 인터페이스

## 🛠️ 기술 스택

### Backend
- **Framework**: Spring Boot 3.5.3
- **Language**: Java 21
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Security**: Spring Security + JWT
- **Migration**: Flyway
- **Documentation**: Swagger/OpenAPI 3

### Frontend  
- **Framework**: React 18
- **Build Tool**: Vite 5.2.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 7.8.0
- **HTTP Client**: Axios

### DevOps & Infrastructure
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Build Tool**: Gradle 8.14.2
- **Monitoring**: Spring Boot Actuator + Prometheus

## 🚀 빠른 시작

### 필수 요구사항
- Java 21+
- Node.js 18+
- Docker & Docker Compose
- Git

### 1. 프로젝트 클론
```bash
git clone https://github.com/your-repo/calendar.git
cd calendar
```

### 2. 환경 설정
```bash
# 환경 변수 파일 생성
cp .env.example .env

# .env 파일을 실제 값으로 수정
# - 데이터베이스 비밀번호
# - JWT 시크릿 키  
# - Gmail SMTP 설정
```

### 3. Docker로 전체 실행 (추천)
```bash
# 전체 스택 실행 (DB + Redis + Backend + Frontend)
docker-compose up -d

# 브라우저에서 확인
open http://localhost:8080/api/swagger-ui.html  # API 문서
open http://localhost:8080                      # 웹 애플리케이션
```

### 4. 개발 환경 실행
```bash
# 1단계: 데이터베이스만 실행
docker-compose up postgres redis -d

# 2단계: 백엔드 실행
./gradlew bootRun

# 3단계: 프론트엔드 실행 (새 터미널)
cd frontend
npm install
npm run dev
```

## 📋 API 문서

### Swagger UI
개발 서버 실행 후 다음 URL에서 API 문서 확인:
- **로컬**: http://localhost:8080/api/swagger-ui.html
- **Docker**: http://localhost:8080/api/swagger-ui.html

### 주요 API 엔드포인트

#### 인증 API
```
POST /api/users/send-verification  # 이메일 인증번호 발송
POST /api/users/verify-email       # 이메일 인증 확인  
POST /api/users/signup             # 회원가입
POST /api/users/login              # 로그인
```

#### 일정 API
```
GET    /api/plans           # 일정 목록 조회
POST   /api/plans           # 일정 생성
PUT    /api/plans/{id}      # 일정 수정
DELETE /api/plans/{id}      # 일정 삭제
```

## 🏗️ 프로젝트 구조

```
calendar/
├── 📁 backend (Spring Boot)
│   ├── src/main/java/org/example/calendar/
│   │   ├── common/          # 공통 설정 (Security, Redis, JWT)
│   │   ├── user/           # 사용자 관리 모듈  
│   │   └── plan/           # 일정 관리 모듈
│   └── src/main/resources/
│       ├── application*.properties  # 환경별 설정
│       └── db/migration/           # Flyway 마이그레이션
├── 📁 frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # 재사용 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── api/           # API 통신 계층
│   │   ├── types/         # TypeScript 타입
│   │   └── utils/         # 유틸리티 함수
│   ├── package.json
│   └── vite.config.ts
├── 📁 docker/              # Docker 설정 파일
├── docker-compose.yml      # 전체 스택 Docker 구성
├── .env.example           # 환경변수 예시
└── 📚 문서들
    ├── BACKEND_DOCUMENTATION.md    # 백엔드 상세 문서
    ├── FRONTEND_DOCUMENTATION.md   # 프론트엔드 상세 문서
    ├── DEPLOYMENT.md              # 배포 가이드
    └── Docker_실행가이드.md        # Docker 실행 가이드
```

## 🔧 개발 환경 설정

### 환경별 프로필
- **local**: 로컬 개발 환경
- **docker**: Docker 컨테이너 환경  
- **prod**: 운영 환경

### 데이터베이스 설정
```bash
# PostgreSQL (기본 포트: 5432)
Database: calendar_dev (local), calendar_prod (production)

# Redis (기본 포트: 6379)  
용도: 이메일 인증번호 저장, 일정 캐싱
```

### Gmail SMTP 설정
1. Gmail 2단계 인증 활성화
2. 앱 비밀번호 생성
3. `.env` 파일에 설정
```
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

## 📊 모니터링 & 로깅

### Actuator 엔드포인트
- **헬스체크**: `/api/actuator/health`
- **애플리케이션 정보**: `/api/actuator/info`
- **메트릭**: `/admin/actuator/metrics` (관리자 전용)

### 로그 파일
```
logs/
├── application.log    # 전체 애플리케이션 로그
└── error.log         # 에러 전용 로그
```

## 🚢 배포

### Docker를 이용한 배포 (추천)
```bash
# 운영 환경 변수 설정
cp .env.example .env.production

# 운영 환경으로 실행
docker-compose --env-file .env.production up -d
```

### 수동 배포
```bash
# 1. 프론트엔드 빌드
cd frontend
npm run build

# 2. 백엔드 빌드  
cd ..
./gradlew build

# 3. JAR 파일 실행
java -jar build/libs/calendar-0.0.1-SNAPSHOT.jar
```

### CI/CD Pipeline
GitHub Actions를 통한 자동 배포:
1. 코드 푸시 → 자동 테스트 실행
2. main 브랜치 푸시 → EC2 서버 자동 배포
3. 상세한 내용은 [DEPLOYMENT.md](DEPLOYMENT.md) 참조

## 🔒 보안

### 적용된 보안 조치
- **환경변수 분리**: 민감한 정보를 `.env` 파일로 관리
- **JWT 보안**: 강력한 시크릿 키와 만료 시간 설정
- **데이터베이스 보안**: 비밀번호 암호화, 접근 권한 제한
- **Redis 보안**: 비밀번호 인증, 위험 명령어 비활성화
- **API 보안**: Spring Security를 통한 인증/인가

### 보안 권장사항
- HTTPS 적용 (운영환경)
- 정기적인 의존성 업데이트
- 로그 모니터링
- 백업 전략 수립

## 🧪 테스트

### 백엔드 테스트
```bash
# 전체 테스트 실행
./gradlew test

# 테스트 리포트 확인
open build/reports/tests/test/index.html
```

### 프론트엔드 테스트
```bash
cd frontend
# (향후 Jest + Testing Library 도입 예정)
```

## 📈 성능 최적화

### 백엔드 최적화
- **데이터베이스 인덱스**: 자주 조회되는 컬럼에 인덱스 적용
- **Redis 캐싱**: 월별 일정 데이터 캐싱으로 DB 부하 감소
- **JPA 최적화**: 지연 로딩, N+1 문제 방지

### 프론트엔드 최적화  
- **코드 분할**: 페이지별 청크 분리로 초기 로딩 시간 단축
- **번들 최적화**: 트리 쉐이킹으로 불필요한 코드 제거
- **이미지 최적화**: 압축 및 지연 로딩

## 🤝 기여하기

### 개발 워크플로우
1. 이슈 생성 또는 기존 이슈 확인
2. 브랜치 생성: `feature/기능명` 또는 `fix/버그명`
3. 코드 작성 및 테스트
4. Pull Request 생성
5. 코드 리뷰 후 병합

### 커밋 메시지 규칙
```
타입: 제목
- 상세 내용 1
- 상세 내용 2

예시:
feat: Add recurring plan generation logic
- Implement weekly recurring pattern generator  
- Add exception date handling for recurring plans
- Update API response format for recurring instances
```

### 코드 스타일
- **Backend**: Google Java Style Guide
- **Frontend**: Prettier + ESLint 설정
- **커밋 전 자동 포매팅**: 

## 📞 지원 및 문의

### 문제 해결
1. **이슈 등록**: GitHub Issues에 버그 리포트 또는 기능 요청
2. **문서 확인**: 상세한 기술 문서들 참조
3. **로그 확인**: `logs/` 폴더의 에러 로그 분석

### 추가 문서
- [📘 백엔드 상세 문서](BACKEND_DOCUMENTATION.md) - Spring Boot 아키텍처, DB 설계
- [📗 프론트엔드 상세 문서](FRONTEND_DOCUMENTATION.md) - React 컴포넌트, 상태 관리  
- [🚀 배포 가이드](DEPLOYMENT.md) - GitHub Secrets, CI/CD 설정
- [🐳 Docker 가이드](Docker_실행가이드.md) - 컨테이너 실행 방법

