# 🐳 Docker 실행 가이드

## 📋 **사전 준비**

### 1. Docker 설치 확인
```bash
# Docker 버전 확인
docker --version
docker-compose --version

# Docker 서비스 실행 상태 확인 (Linux/Mac)
sudo systemctl status docker

# Docker 서비스 시작 (필요한 경우)
sudo systemctl start docker
```

### 2. 권한 설정 (Linux 사용자)
```bash
# 현재 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# 로그아웃 후 다시 로그인 또는
newgrp docker
```

---

## 🚀 **Docker 실행 방법**

### 1️⃣ **전체 서비스 실행 (추천)**
```bash
# 프로젝트 루트 디렉토리에서 실행
cd /path/to/calendar-project

# 모든 서비스 빌드 및 실행
docker-compose up --build

# 백그라운드에서 실행하려면
docker-compose up -d --build
```

### 2️⃣ **개별 서비스 실행**
```bash
# PostgreSQL만 실행
docker-compose up postgres

# Redis만 실행
docker-compose up redis

# Spring Boot 앱만 실행 (DB, Redis는 미리 실행되어 있어야 함)
docker-compose up calendar-app
```

### 3️⃣ **서비스 중지**
```bash
# 모든 서비스 중지
docker-compose down

# 볼륨까지 삭제 (데이터 완전 삭제)
docker-compose down -v

# 이미지까지 삭제
docker-compose down --rmi all
```

---

## 🔍 **상태 확인 방법**

### 📊 **실행 중인 컨테이너 확인**
```bash
# 실행 중인 컨테이너 목록
docker-compose ps

# 모든 컨테이너 상태 확인 (종료된 것 포함)
docker ps -a
```

### 📝 **로그 확인**
```bash
# 모든 서비스 로그 실시간 확인
docker-compose logs -f

# 특정 서비스 로그 확인
docker-compose logs -f calendar-app
docker-compose logs -f postgres
docker-compose logs -f redis

# 최근 100줄만 확인
docker-compose logs --tail=100 calendar-app
```

### 🏥 **헬스체크 확인**
```bash
# 컨테이너 상태 확인
docker inspect --format='{{.State.Health.Status}}' calendar-app

# API 헬스체크 (직접 호출)
curl http://localhost:8080/api/actuator/health
```

---

## 🌐 **접속 정보**

서비스가 정상 실행되면 다음 URL로 접속 가능합니다:

### 🎯 **메인 서비스**
- **API 서버**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **Actuator**: http://localhost:8080/api/actuator/health

### 🗄️ **데이터베이스**
- **PostgreSQL**: localhost:5432
  - Database: calendar_dev
  - Username: postgres
  - Password: dlrlqor256

### 🔴 **캐시**
- **Redis**: localhost:6379
  - Password: 없음 (개발용)

---

## 🛠️ **개발 모드 실행**

### 💻 **로컬 개발 + Docker DB만 사용**
```bash
# DB와 Redis만 실행
docker-compose up postgres redis -d

# Spring Boot는 IDE에서 실행 (application-local.properties 사용)
# 또는 터미널에서:
./gradlew bootRun
```

### 🔄 **애플리케이션만 재시작**
```bash
# 애플리케이션 컨테이너만 재시작
docker-compose restart calendar-app

# 또는 빌드부터 다시
docker-compose up --build calendar-app
```

---

## 🚨 **문제 해결**

### ❌ **포트 충돌 오류**
```bash
# 사용 중인 포트 확인
netstat -tlnp | grep :8080
netstat -tlnp | grep :5432
netstat -tlnp | grep :6379

# 기존 프로세스 종료 후 다시 시도
sudo kill -9 <PID>
```

### 🗄️ **데이터베이스 연결 실패**
```bash
# PostgreSQL 컨테이너 로그 확인
docker-compose logs postgres

# 직접 연결 테스트
docker exec -it calendar-postgres psql -U postgres -d calendar_dev
```

### 🔴 **Redis 연결 실패**
```bash
# Redis 컨테이너 로그 확인
docker-compose logs redis

# 직접 연결 테스트
docker exec -it calendar-redis redis-cli ping
```

### 🐳 **Docker 이미지 문제**
```bash
# 모든 컨테이너 정리
docker-compose down
docker system prune -a

# 캐시 무시하고 새로 빌드
docker-compose build --no-cache
docker-compose up
```

---

## 📊 **유용한 명령어**

### 🔍 **컨테이너 내부 접속**
```bash
# Spring Boot 컨테이너 접속
docker exec -it calendar-app bash

# PostgreSQL 컨테이너 접속
docker exec -it calendar-postgres bash

# Redis 컨테이너 접속
docker exec -it calendar-redis sh
```

### 💾 **데이터 백업/복원**
```bash
# PostgreSQL 데이터 백업
docker exec calendar-postgres pg_dump -U postgres calendar_dev > backup.sql

# PostgreSQL 데이터 복원
docker exec -i calendar-postgres psql -U postgres calendar_dev < backup.sql
```

### 🧹 **정리 작업**
```bash
# 사용하지 않는 이미지 정리
docker image prune

# 사용하지 않는 볼륨 정리
docker volume prune

# 전체 시스템 정리 (주의!)
docker system prune -a
```

---

## 🎉 **성공 확인**

모든 것이 정상적으로 실행되면:

1. ✅ **컨테이너 상태**: `docker-compose ps`에서 모든 서비스가 "Up" 상태
2. ✅ **API 접속**: http://localhost:8080/api/actuator/health 에서 "UP" 응답
3. ✅ **Swagger 접속**: http://localhost:8080/api/swagger-ui.html 정상 로드
4. ✅ **로그인 테스트**: 실제 로그인/회원가입 기능 동작 확인

**축하합니다! 🎉 Docker 환경에서 캘린더 애플리케이션이 성공적으로 실행되었습니다!**
