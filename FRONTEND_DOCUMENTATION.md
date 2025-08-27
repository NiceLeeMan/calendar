# Calendar 프로젝트 프론트엔드 문서

## 📋 프로젝트 개요

### 기술 스택
- **Framework**: React 18
- **Build Tool**: Vite 5.2.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 7.8.0
- **HTTP Client**: Axios 1.11.0
- **Linting**: ESLint + TypeScript ESLint

### 개발 환경 설정
- **Dev Server**: Vite (Port 3000)
- **API Proxy**: Backend (Port 8080)로 `/api` 요청 프록시
- **Build Output**: Spring Boot의 `static` 폴더에 직접 빌드
- **HMR**: Hot Module Replacement 지원

## 🏗️ 프로젝트 구조

### 디렉토리 구조
```
frontend/src/
├── main.tsx                          # 애플리케이션 진입점
├── App.tsx                           # 메인 앱 컴포넌트 (라우팅)
├── index.css                         # 전역 스타일
├── api/                              # API 통신 계층
│   ├── httpClient.ts                 # Axios 설정 및 인터셉터
│   ├── userApi.ts                    # 사용자 관련 API
│   ├── planApi.ts                    # 일정 관련 API (단일)
│   └── planApi/                      # 일정 관련 API (모듈화)
│       ├── index.ts                  # API 통합 내보내기
│       ├── planCrud.ts               # CRUD 작업
│       ├── planQueries.ts            # 조회 관련 API
│       └── planUtils.ts              # API 유틸리티
├── components/                       # 재사용 가능한 컴포넌트
│   ├── ui/                           # 기본 UI 컴포넌트
│   │   ├── Button.tsx                # 버튼 컴포넌트
│   │   ├── Input.tsx                 # 입력 필드
│   │   ├── Modal.tsx                 # 모달 창
│   │   ├── DatePicker.tsx            # 날짜 선택기
│   │   └── TimePicker.tsx            # 시간 선택기
│   ├── auth/                         # 인증 관련 컴포넌트
│   │   ├── LoginForm/                # 로그인 폼
│   │   ├── SignUpForm/               # 회원가입 폼
│   │   └── Common/                   # 공통 인증 컴포넌트
│   └── calendar/                     # 캘린더 관련 컴포넌트
│       ├── CalendarHeader/           # 캘린더 헤더 (네비게이션)
│       ├── CalendarSideBar/          # 사이드바
│       ├── MiniCalendar/             # 미니 캘린더
│       ├── MonthView/                # 월간 보기
│       ├── WeekView/                 # 주간 보기
│       ├── DayView/                  # 일간 보기
│       ├── PlanCreateModal/          # 일정 생성 모달
│       ├── PlanDelete/               # 일정 삭제 관련
│       └── hooks/                    # 캘린더 관련 훅
├── pages/                            # 페이지 컴포넌트
│   ├── MainPage.tsx                  # 메인 페이지
│   ├── LoginPage.tsx                 # 로그인 페이지
│   ├── SignUpPage.tsx                # 회원가입 페이지
│   ├── CalendarPage.tsx              # 캘린더 메인 페이지
│   ├── TermsPage.tsx                 # 이용약관 페이지
│   └── PrivacyPage.tsx               # 개인정보 처리방침 페이지
├── types/                            # TypeScript 타입 정의
│   ├── index.ts                      # 공통 타입 내보내기
│   ├── api.ts                        # API 관련 타입
│   ├── validation.ts                 # 유효성 검사 타입
│   ├── user/                         # 사용자 관련 타입
│   │   ├── index.ts
│   │   ├── requests.ts               # 요청 타입
│   │   ├── responses.ts              # 응답 타입
│   │   └── forms.ts                  # 폼 타입
│   └── plan/                         # 일정 관련 타입
│       ├── index.ts
│       ├── requests.ts               # 일정 요청 타입
│       ├── responses.ts              # 일정 응답 타입
│       ├── enums.ts                  # 열거형 타입
│       └── ui.ts                     # UI 관련 타입
├── errors/                           # 에러 처리
│   ├── index.ts                      # 에러 처리 내보내기
│   ├── errorCodes.ts                 # 에러 코드 정의
│   ├── errorMessages.ts              # 에러 메시지 정의
│   └── useErrorHandler.ts            # 에러 처리 훅
└── utils/                            # 유틸리티 함수
    └── planEventManager.ts           # 일정 이벤트 관리
```

## 🎨 아키텍처 설계

### 컴포넌트 계층 구조
```
App (라우터)
├── AuthPages (인증)
│   ├── LoginPage
│   └── SignUpPage
├── MainPage (랜딩)
└── CalendarPage (메인 기능)
    ├── CalendarHeader (네비게이션)
    ├── CalendarSideBar (미니캘린더, 필터)
    └── ViewComponents (뷰 전환)
        ├── MonthView
        ├── WeekView  
        └── DayView
```

### 데이터 흐름
```
UI Events → API Layer → Backend → Response → State Update → Re-render
```

## 🔗 API 통신 구조

### HTTP Client 설정
- **Base URL**: 개발 환경에서 Vite 프록시 사용
- **인터셉터**: 요청/응답 로깅, 에러 처리
- **인증**: JWT 토큰 자동 포함
- **에러 처리**: 통합 에러 핸들링

### API 모듈 구성
#### User API
- 회원가입, 로그인, 로그아웃
- 이메일 인증 (발송/확인)
- 사용자 정보 조회

#### Plan API (모듈화)
- **CRUD**: 일정 생성, 조회, 수정, 삭제
- **Queries**: 월별/주별/일별 일정 조회
- **Utils**: 날짜 처리, 반복 일정 유틸리티

### 에러 처리 전략
- **에러 코드**: 백엔드 에러 코드와 매핑
- **메시지**: 사용자 친화적 에러 메시지 제공
- **핸들러**: useErrorHandler 훅으로 중앙 집중식 처리

## 🎭 컴포넌트 설계

### UI 컴포넌트 (components/ui)
- **목적**: 재사용 가능한 기본 컴포넌트
- **특징**: Props 기반 설정, Tailwind CSS 스타일링
- **구성**: Button, Input, Modal, DatePicker, TimePicker

### 인증 컴포넌트 (components/auth)
- **LoginForm**: 로그인 폼 및 유효성 검증
- **SignUpForm**: 회원가입 다단계 폼 (기본정보 → 이메일 인증)
- **Common**: 공통 인증 UI (로딩, 버튼 등)

### 캘린더 컴포넌트 (components/calendar)
#### 뷰 컴포넌트
- **MonthView**: 월간 캘린더 그리드, 일정 표시
- **WeekView**: 주간 시간대별 뷰, 드래그 앤 드롭
- **DayView**: 일간 상세 뷰, 시간 단위 스케줄

#### 기능 컴포넌트
- **CalendarHeader**: 날짜 네비게이션, 뷰 전환 버튼
- **CalendarSideBar**: 미니 캘린더, 필터 옵션
- **PlanCreateModal**: 일정 생성/수정 모달
- **PlanDelete**: 우클릭 메뉴, 삭제 확인 모달

### 컴포넌트별 Hooks 패턴
각 주요 컴포넌트는 `hooks/` 폴더를 가지고 있으며:
- **비즈니스 로직 분리**: 컴포넌트는 UI만 담당
- **재사용성**: 다른 컴포넌트에서도 훅 재사용 가능
- **테스트 용이성**: 로직과 UI 분리로 테스트 간소화

## 🗂️ 타입 시스템

### 타입 구조 설계
- **모듈별 분리**: user/, plan/ 도메인별 타입 분리
- **용도별 분리**: requests, responses, forms, ui 등
- **중앙 집중**: index.ts에서 타입 재내보내기

### 주요 타입 카테고리
#### API 타입
- **Requests**: 백엔드 API 요청 형식
- **Responses**: 백엔드 API 응답 형식  
- **공통 타입**: BaseResponse, ErrorResponse 등

#### UI 타입
- **Form 타입**: 폼 데이터, 유효성 검증 상태
- **컴포넌트 Props**: 각 컴포넌트의 인터페이스
- **뷰 상태**: 캘린더 뷰, 모달 상태 등

#### 열거형 타입
- **RepeatUnit**: 반복 단위 (일/주/월/년)
- **AlarmStatus**: 알람 상태
- **ViewType**: 캘린더 뷰 타입

## 📱 반응형 디자인

### Tailwind CSS 활용
- **유틸리티 우선**: 클래스 기반 스타일링
- **반응형 브레이크포인트**: sm, md, lg, xl 활용
- **다크모드 대응**: (향후 확장 가능)

### 디바이스별 최적화
- **데스크톱**: 풀 캘린더 뷰, 사이드바 표시
- **태블릿**: 축소된 사이드바, 터치 최적화
- **모바일**: 단일 뷰, 햄버거 메뉴

## 🚀 빌드 & 배포

### Vite 빌드 설정
- **TypeScript 컴파일**: TSC로 타입 체크
- **번들링**: Rollup 기반 최적화
- **출력 경로**: Spring Boot static 폴더에 직접 빌드
- **파일 해싱**: 캐시 무효화를 위한 해시 적용

### 개발 서버 설정
- **HMR**: 실시간 코드 변경 반영
- **프록시**: 백엔드 API 요청 프록시
- **히스토리 API**: SPA 라우팅 지원

### 빌드 최적화
- **코드 분할**: 페이지별 청크 분리
- **트리 쉐이킹**: 사용하지 않는 코드 제거
- **에셋 최적화**: CSS, 이미지 압축

## 🎯 상태 관리

### 로컬 상태 관리
- **React Hooks**: useState, useEffect 활용
- **Custom Hooks**: 비즈니스 로직 캡슐화
- **컴포넌트 상태**: UI 상태는 컴포넌트 레벨에서 관리

### 전역 상태 관리
- **현재**: Props drilling 방식 (단순한 구조)
- **확장 가능**: Context API 또는 Zustand 도입 예정

### 서버 상태 관리
- **API 응답**: axios를 통한 직접 관리
- **캐싱**: 브라우저 레벨에서 자동 처리
- **확장 가능**: React Query/TanStack Query 도입 예정

## 🔧 개발 도구 & 품질 관리

### 린팅 & 포매팅
- **ESLint**: 코드 품질 검사
- **TypeScript**: 정적 타입 검사
- **React 전용 규칙**: Hooks, JSX 최적화

### 개발 편의성
- **TypeScript**: 컴파일 타임 에러 잡기
- **Hot Reload**: 실시간 개발 피드백
- **자동 완성**: IDE와 TypeScript 연동

## 🌟 주요 기능

### 인증 시스템
- **단계별 회원가입**: 정보 입력 → 이메일 인증
- **로그인**: JWT 토큰 기반 인증
- **자동 로그아웃**: 토큰 만료 시 처리

### 캘린더 기능
- **다중 뷰**: 월/주/일간 뷰 전환
- **일정 관리**: 생성, 수정, 삭제 (CRUD)
- **반복 일정**: 복잡한 반복 패턴 지원
- **시각적 표현**: 색상, 시간대별 표시

### 사용자 경험
- **반응형 디자인**: 모든 디바이스에서 최적화
- **직관적 UI**: 드래그 앤 드롭, 우클릭 메뉴
- **실시간 피드백**: 로딩 상태, 에러 메시지
- **접근성**: 키보드 네비게이션 지원

## 📈 성능 최적화

### 렌더링 최적화
- **컴포넌트 분할**: 작은 단위로 컴포넌트 분리
- **메모화**: React.memo, useMemo 활용
- **지연 로딩**: 필요시에만 컴포넌트 로드

### 번들 최적화
- **코드 분할**: 라우트별 청크 분리
- **트리 쉐이킹**: 사용하지 않는 코드 제거
- **압축**: 프로덕션 빌드 시 자동 압축

### 네트워크 최적화
- **API 효율성**: 필요한 데이터만 요청
- **캐싱**: 브라우저 캐시 활용
- **압축**: gzip 압축 활용

## 🔮 확장 계획

### 상태 관리 개선
- Context API 또는 Zustand 도입
- 서버 상태는 React Query로 관리

### 기능 확장
- 다크 모드 지원
- PWA (Progressive Web App) 적용
- 오프라인 지원

### 개발 경험 개선
- Storybook 도입 (컴포넌트 문서화)
- 테스트 환경 구축 (Jest, Testing Library)
- 자동화 도구 (Husky, lint-staged)

---

## 📚 추가 문서
- [백엔드 문서](BACKEND_DOCUMENTATION.md)
- [배포 가이드](DEPLOYMENT.md)
- [Docker 실행 가이드](Docker_실행가이드.md)

---
**작성일**: 2025-08-27  
**버전**: 1.0.0  
**담당**: Calendar Frontend Team
