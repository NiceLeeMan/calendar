package org.example.calendar.common.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.calendar.user.entity.User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * JWT 토큰 생성, 검증, 파싱을 담당하는 핵심 클래스
 *
 * 실무에서는 토큰 관련 모든 로직을 한 곳에서 관리합니다.
 * - 토큰 생성 (로그인 시)
 * - 토큰 검증 (API 호출 시)
 * - 토큰 파싱 (사용자 정보 추출 시)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;

    /**
     * JWT 서명에 사용할 SecretKey 생성
     * HMAC-SHA 알고리즘 사용 (실무 표준)
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes());
    }

    /**
     * 사용자 정보를 기반으로 JWT 토큰 생성
     *
     * @param user 토큰을 생성할 사용자 정보
     * @return 생성된 JWT 토큰 문자열
     */
    public String generateToken(User user) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + jwtProperties.getExpiration());

        return Jwts.builder()
                .subject(user.getUserId())                    // 사용자 ID
                .claim("email", user.getEmail())              // 이메일
                .claim("name", user.getName())                // 이름
                .claim("role", "USER")                        // 권한 (향후 확장)
                .issuer(jwtProperties.getIssuer())            // 발급자
                .issuedAt(now)                                // 발급 시간
                .expiration(expiration)                       // 만료 시간
                .signWith(getSigningKey())                    // 서명
                .compact();
    }

    /**
     * JWT 토큰 유효성 검증
     *
     * @param token 검증할 JWT 토큰
     * @return 토큰이 유효하면 true, 아니면 false
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;

        } catch (SecurityException | MalformedJwtException e) {
            log.warn("잘못된 JWT 서명입니다: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.warn("만료된 JWT 토큰입니다: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("지원되지 않는 JWT 토큰입니다: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT 토큰이 잘못되었습니다: {}", e.getMessage());
        }
        return false;
    }

    /**
     * JWT 토큰에서 사용자 ID 추출
     *
     * @param token JWT 토큰
     * @return 사용자 ID (subject)
     */
    public String getUserIdFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.getSubject();

        } catch (Exception e) {
            log.error("토큰에서 사용자 ID 추출 실패: {}", e.getMessage());
            return null;
        }
    }

    /**
     * JWT 토큰에서 사용자 이메일 추출
     *
     * @param token JWT 토큰
     * @return 사용자 이메일
     */
    public String getEmailFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.get("email", String.class);

        } catch (Exception e) {
            log.error("토큰에서 이메일 추출 실패: {}", e.getMessage());
            return null;
        }
    }

    /**
     * JWT 토큰의 만료 시간 확인
     *
     * @param token JWT 토큰
     * @return 만료 시간 (Date)
     */
    public Date getExpirationFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.getExpiration();

        } catch (Exception e) {
            log.error("토큰에서 만료 시간 추출 실패: {}", e.getMessage());
            return null;
        }
    }
}