# Calendar 프로젝트 백엔드 문서

## 📋 프로젝트 개요

### 기술 스택
- **Framework**: Spring Boot 3.5.3
- **Language**: Java 21
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Build Tool**: Gradle 8.14.2
- **Security**: Spring Security + JWT
- **API Documentation**: Swagger/OpenAPI 3
- **Migration**: Flyway
- **Container**: Docker + Docker Compose

### 아키텍처 개요
```
Frontend (React + Vite)
    ↓ HTTP/REST API
Backend (Spring Boot)
    ↓ JPA/Hibernate
PostgreSQL Database
    ↓ Cache Layer
Redis Cache
```

## 🏗️ 프로젝트 구조

### 패키지 구조
```
src/main/java/org/example/calendar/
├── CalendarApplication.java          # 메인 애플리케이션
├── common/                           # 공통 모듈
│   ├── config/                       # 설정 클래스들
│   │   ├── SecurityConfig.java       # Spring Security + JWT 설정
│   │   ├── RedisConfig.java          # Redis 캐시 설정
│   │   ├── JacksonConfig.java        # JSON 직렬화 설정
│   │   └── OpenApiConfig.java        # Swagger 문서 설정
│   ├── security/                     # 보안 관련
│   │   ├── CustomUserDetails.java
│   │   ├── CustomUserDetailsService.java
│   │   └── jwt/                      # JWT 토큰 처리
│       ├── JwtAuthenticationFilter.java # JWT 인증 필터
│       ├── JwtTokenProvider.java   # JWT 토큰 생성/검증
│       └── JwtProperties.java      # JWT 설정 프로퍼티
│   ├── exception/                    # 예외 처리
│   │   ├── GlobalExceptionHandler.java
│   │   └── BusinessException.java
│   ├── dto/                          # 공통 DTO
│   │   └── ErrorResponse.java        # 에러 응답 형식
│   └── controller/                   # 공통 컨트롤러
│       └── CacheController.java      # 캐시 관리 API
├── user/                             # 사용자 모듈
│   ├── entity/User.java              # 사용자 엔티티
│   ├── repository/UserRepository.java
│   ├── service/                      # 사용자 관련 서비스
│   │   ├── UserService.java
│   │   ├── AuthService.java          # 인증/로그인
│   │   └── EmailVerificationService.java
│   ├── controller/UserController.java
│   ├── dto/                          # 사용자 관련 DTO
│   └── exception/                    # 사용자 관련 예외
└── plan/                             # 일정 모듈
    ├── entity/                       # 일정 엔티티들
    │   ├── Plan.java
    │   ├── PlanAlarm.java
    │   └── RecurringInfo.java
    ├── repository/                   # JPA Repository들
    │   ├── PlanRepository.java       # 일정 데이터 접근
    │   ├── PlanAlarmRepository.java  # 알람 데이터 접근
    │   └── RecurringInfoRepository.java # 반복 정보 데이터 접근
    ├── service/                      # 일정 관련 서비스
    │   ├── PlanService.java
    │   ├── PlanCacheService.java     # Redis 캐시 서비스
    │   ├── AlarmService.java         # 알람 처리
    │   ├── helper/                   # 서비스 헬퍼 클래스들
    │   │   └── PlanUpdateHelper.java # 일정 업데이트 로직 분리
    │   └── recurring/                # 반복 일정 처리
    │       ├── RecurringGenerator.java        # 반복 생성기 인터페이스
    │       ├── RecurringGeneratorUtils.java   # 공통 유틸리티
    │       ├── RecurringPlanGenerator.java    # 메인 반복 생성 서비스
    │       ├── MonthlyRecurringGenerator.java # 월간 반복
    │       ├── WeeklyRecurringGenerator.java  # 주간 반복
    │       └── YearlyRecurringGenerator.java  # 연간 반복
    ├── controller/PlanController.java
    ├── dto/                          # 일정 관련 DTO
    │   ├── cache/                    # 캐시 전용 DTO
    │   │   ├── CachedPlan.java       # Redis 캐시용 경량 계획 DTO
    │   │   └── MonthlyPlanCache.java # 월별 계획 캐시 DTO
    │   ├── common/                   # 공통 DTO (알람, 반복 정보)
    │   │   ├── AlarmReqInfo.java     # 알람 요청 정보
    │   │   ├── AlarmResInfo.java     # 알람 응답 정보
    │   │   ├── RecurringReqInfo.java # 반복 요청 정보
    │   │   └── RecurringResInfo.java # 반복 응답 정보
    │   ├── request/                  # 요청 DTO
    │   │   ├── PlanCreateReq.java
    │   │   ├── PlanUpdateReq.java
    │   │   └── PlanDeleteReq.java
    │   └── response/                 # 응답 DTO
    │       └── PlanResponse.java
    ├── mapper/PlanMapper.java        # Entity <-> DTO 변환
    └── enums/                        # 일정 관련 열거형
```

## 🗄️ 데이터베이스 설계

### ERD 개요
```
Users (사용자)
  ├── id (PK)
  ├── user_id (로그인 ID)
  ├── password (암호화)
  ├── email (고유)
  ├── phone_number
  └── created_at

Plans (일정)
  ├── id (PK)
  ├── user_id (FK)
  ├── plan_name
  ├── plan_content
  ├── start_date/time
  ├── end_date/time
  ├── is_recurring
  ├── recurring_info_id (FK)
  └── version (낙관적 락)

RecurringInfo (반복 설정)
  ├── id (PK)
  ├── repeat_unit (DAILY/WEEKLY/MONTHLY/YEARLY)
  ├── repeat_interval
  ├── repeat_day_of_month
  ├── repeat_week_of_month
  ├── start_date (V6에서 추가)
  ├── end_date (V4에서 추가)
  └── ...

RecurringInfo ElementCollection 테이블들
  ├── recurring_repeat_weeks_of_month (주차 정보)
  ├── recurring_repeat_weekdays (요일 정보)  
  └── recurring_exceptions (예외 날짜)

PlanAlarm (알람)
  ├── id (PK)
  ├── plan_id (FK)
  ├── alarm_date/time
  ├── alarm_status
  └── retry_count
```

### 주요 테이블 상세

#### Users 테이블
- **목적**: 사용자 계정 정보 관리
- **특징**: BCrypt 암호화, 이메일/전화번호 유니크 제약
- **인덱스**: user_id, email에 인덱스 적용

#### Plans 테이블  
- **목적**: 일정 정보 저장
- **특징**: 반복 일정 지원, 버전 관리(낙관적 락)
- **관계**: User(N:1), RecurringInfo(N:1)

#### RecurringInfo 테이블
- **목적**: 복잡한 반복 패턴 설정 저장
- **특징**: 시작/종료 날짜 관리, 예외 날짜 지원
- **지원 패턴**: 일/주/월/년 반복, 특정 요일, 월의 특정 주(1-5주차, 마지막주) 등
- **ElementCollection**: 요일 목록, 주차 목록, 예외 날짜 등
- **마이그레이션**: V4(end_date 추가), V5(주차 제약 확장), V6(start_date 추가)

## 🔐 보안 구조

### 인증/인가 시스템
- **방식**: JWT (JSON Web Token) 기반 Stateless 인증
- **구조**:
  ```
  Client → Login API → JWT 발급 → Header에 포함 → 요청 검증
  ```

### JWT 구성 요소
#### JwtTokenProvider
- JWT 토큰 생성, 검증, 파싱 담당
- 사용자 정보 추출, 토큰 유효성 검증
- 시크릿 키 기반 서명 생성/검증

#### JwtAuthenticationFilter  
- Spring Security Filter Chain에 통합
- 요청 헤더에서 JWT 토큰 추출
- 토큰 유효성 검증 후 SecurityContext 설정

#### JwtProperties
- JWT 관련 설정 값 관리 (@ConfigurationProperties)
- 시크릿 키, 만료 시간, 쿠키명, 발급자 정보

### JWT 토큰 구조
- **Header**: 토큰 타입, 알고리즘 (HMAC SHA256)
- **Payload**: 사용자 ID, 권한, 발급/만료시간
- **Signature**: HMAC SHA256 서명

### 보안 정책
- **비밀번호**: BCrypt 해싱 (10 라운드)
- **JWT 만료**: 24시간 (설정 가능)
- **CORS**: 프론트엔드 도메인만 허용
- **Actuator**: 관리자 권한 필요

## 💾 데이터 접근 계층

### Repository 구조
#### PlanRepository
- 사용자별 일정 조회 (날짜 범위 기반)
- 반복 일정 조회 
- 특정 날짜의 일정 검색

#### PlanAlarmRepository  
- 특정 일정의 알람 목록 조회
- 발송 대기중인 알람 검색 (상태별)
- 사용자별 알람 관리

#### RecurringInfoRepository
- 반복 패턴별 조회
- 종료일 기준 반복 정보 관리

## 🚀 API 구조

### 사용자 관리 API
```
POST /api/users/send-verification  # 이메일 인증번호 발송
POST /api/users/verify-email       # 이메일 인증 확인
POST /api/users/signup             # 회원가입
POST /api/users/login              # 로그인
GET  /api/users/me                 # 내 정보 조회
POST /api/users/logout             # 로그아웃
```

### 일정 관리 API
```
GET    /api/plans                  # 일정 목록 조회
POST   /api/plans                  # 일정 생성
GET    /api/plans/{id}             # 특정 일정 조회  
PUT    /api/plans/{id}             # 일정 수정
DELETE /api/plans/{id}             # 일정 삭제
```

### 캐시 관리 API  
```
DELETE /api/cache/plans/{userId}   # 사용자 계획 캐시 삭제
DELETE /api/cache/plans/{userId}/{year}/{month} # 월별 캐시 삭제
```

### API 응답 구조
```json
{
  "success": true,
  "data": { ... },
  "message": "Success"
}
```

### 에러 응답 구조  
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "에러 메시지",
  "timestamp": "2025-08-27T10:00:00"
}
```

## ⚡ 캐시 전략

### Redis 사용 목적
1. **이메일 인증번호**: TTL 3분 임시 저장
2. **월간 일정 캐시**: 자주 조회되는 월간 데이터
3. **세션 관리**: 추후 확장 가능

### 캐시 구조
```
월별 캐시:
Key Pattern: calendar:{userId}:{year}:{month}
Value: MonthlyPlanCache 객체 (JSON)
TTL: 1시간

이메일 인증:  
Key Pattern: email:verification:{email}
Value: 4자리 인증번호
TTL: 3분

경량 개별 캐시:
Key Pattern: plan:{planId}  
Value: CachedPlan 객체 (JSON)
TTL: 30분
```

## 🔄 반복 일정 처리

### 지원하는 반복 패턴
- **일간**: 매일, N일 간격
- **주간**: 특정 요일들, N주 간격  
- **월간**: 매월 특정 일, 매월 N번째 요일
- **연간**: 매년 특정 날짜

### 반복 생성 로직
```java
RecurringPlanGenerator (메인 서비스)
├── RecurringGenerator (인터페이스)
│   ├── WeeklyRecurringGenerator   # 주간: 특정 요일들, N주 간격
│   ├── MonthlyRecurringGenerator  # 월간: 매월 N일, N번째 요일
│   └── YearlyRecurringGenerator   # 연간: 매년 특정 날짜
└── RecurringGeneratorUtils (공통 유틸리티)
    ├── 인스턴스 생성 및 유효성 검증
    ├── 안전한 날짜 생성 (예: 2월 30일 → 2월 28일)
    └── 예외 날짜 및 종료일 확인
```

## 📧 이메일 인증 시스템

### 인증 프로세스
1. 사용자가 이메일 입력
2. 4자리 인증번호 생성
3. Gmail SMTP로 발송
4. Redis에 3분 TTL로 저장
5. 사용자 인증번호 입력 검증

### 메일 설정
- **SMTP**: Gmail (smtp.gmail.com:587)
- **인증**: OAuth2 앱 비밀번호 사용
- **보안**: TLS/STARTTLS 적용

## 🛠️ 빌드 & 배포

### 로컬 개발환경
```bash
# 1. 환경설정
cp .env.example .env

# 2. 데이터베이스 시작  
docker-compose up postgres redis

# 3. 애플리케이션 실행
./gradlew bootRun --args='--spring.profiles.active=local'
```

### 테스트 환경
```bash
# 단위 테스트 실행
./gradlew test

# 테스트 데이터베이스 설정
# application-test.properties 참조
# - 테스트용 PostgreSQL DB
# - Flyway 비활성화 (create-drop 사용)
# - Swagger 비활성화
```

### Docker 컨테이너 실행
```bash
# 전체 스택 실행
docker-compose up -d

# 개별 서비스 실행
docker-compose up postgres redis
```

### 프로덕션 배포
- **CI/CD**: GitHub Actions
- **환경변수**: GitHub Secrets 관리
- **모니터링**: Actuator + Prometheus
- **로그**: 파일 기반 로그 저장

## 🔍 모니터링 & 로깅

### Actuator 엔드포인트
- `/api/actuator/health`: 헬스체크
- `/api/actuator/info`: 애플리케이션 정보
- `/admin/actuator/*`: 관리자 전용 메트릭

### 로깅 전략
- **레벨**: INFO (운영), DEBUG (개발)
- **파일**: application.log, error.log
- **로테이션**: 일별, 최대 50MB
- **보관**: 90일

## 📊 성능 최적화

### JPA 최적화
- **지연 로딩**: 기본 전략
- **벌크 연산**: 대량 데이터 처리시 활용
- **쿼리 최적화**: N+1 문제 방지

### 캐시 전략
- **Redis**: 자주 조회되는 월간 데이터
- **Application**: 메타데이터 캐싱
- **Database**: 쿼리 플랜 캐시

### 인덱스 전략
- **사용자별 일정 조회**: user_id, start_date, end_date 복합 인덱스
- **알람 처리**: alarm_date, alarm_time 복합 인덱스  
- **반복 정보 조회**: end_date 인덱스
- **기본 검색**: user_id, email 단일 인덱스들
- **반복 일정 필터링**: is_recurring 인덱스

## 🚨 보안 강화 사항

### 적용된 보안 조치
1. **환경변수 분리**: 민감 정보 .env로 관리
2. **JWT 보안**: 충분히 복잡한 시크릿 키
3. **Redis 보안**: 비밀번호 인증, 위험 명령어 비활성화
4. **Actuator 보안**: 관리자 권한 필요
5. **CI/CD 보안**: GitHub Secrets 사용

### 추가 보안 권장사항
- HTTPS 적용 (운영환경)
- Rate Limiting 적용
- SQL Injection 방지 (JPA 사용)
- XSS 방지 (JSON 응답)

---

## 📚 추가 문서
- [배포 가이드](DEPLOYMENT.md)
- [API 문서](http://localhost:8080/api/swagger-ui.html)
- [Docker 실행 가이드](Docker_실행가이드.md)

---
**작성일**: 2025-08-27  
**버전**: 1.0.0  
**담당**: Calendar Backend Team
