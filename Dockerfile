# 1단계: 빌드 환경 (Gradle + JDK 21)
FROM gradle:8.14.2-jdk21 AS builder

# 작업 디렉토리 설정
WORKDIR /app

# Gradle 설정 파일들 먼저 복사 (캐시 최적화)
COPY gradle/ ./gradle/
COPY gradlew gradlew.bat build.gradle settings.gradle ./

# 의존성 다운로드 (변경이 적어 캐시 효과적)
RUN ./gradlew dependencies --no-daemon

# 소스 코드 복사
COPY src/ ./src/

# 애플리케이션 빌드 (테스트 제외)
RUN ./gradlew build -x test --no-daemon

# 2단계: 실행 환경 (JDK 21 Runtime)
FROM openjdk:21-jdk-slim

# 메타데이터
LABEL maintainer="Calendar Team"
LABEL description="Spring Boot Calendar Application"

# 필수 패키지 설치 (헬스체크용)
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/calendar-0.0.1-SNAPSHOT.jar app.jar

# 애플리케이션 실행을 위한 사용자 생성 (보안)
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app /app/logs
USER appuser

# 포트 노출
EXPOSE 8080

# 헬스체크 (옵션)
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]

# JVM 옵션 (메모리 최적화)
ENV JAVA_OPTS="-Xmx512m -Xms256m -Djava.awt.headless=true"
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
