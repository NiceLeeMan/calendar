package org.example.calendar.common.security.jwt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * JWT 관련 설정 프로퍼티
 *
 * 실무에서는 설정값을 외부 파일로 분리하여 관리합니다.
 * 환경별로 다른 값을 사용할 수 있도록 ConfigurationProperties 사용
 */

@Component
@Getter @Setter
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    /**
     * JWT 서명에 사용할 비밀키
     * 실무에서는 최소 256비트(32자) 이상 사용 권장
     */
    private String secret = "calendar-project-jwt-secret-key-2025-spring-boot-very-secure-and-long";

    /**
     * 토큰 만료 시간 (밀리초)
     * 24시간 = 24 * 60 * 60 * 1000 = 86400000
     */
    private long expiration = 86400000L;

    /**
     * JWT를 저장할 쿠키 이름
     */
    private String cookieName = "jwt-token";

    /**
     * 토큰 발급자 (issuer)
     */
    private String issuer = "calendar-app";
}