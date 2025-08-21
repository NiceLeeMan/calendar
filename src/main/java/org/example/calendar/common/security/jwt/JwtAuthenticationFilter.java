package org.example.calendar.common.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.calendar.common.security.CustomUserDetailsService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

/**
 * JWT 인증 필터
 *
 * 실무에서는 모든 HTTP 요청을 가로채서 JWT 토큰을 검증합니다.
 * OncePerRequestFilter를 상속받아 요청당 한 번만 실행되도록 보장
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final JwtProperties jwtProperties;
    private final CustomUserDetailsService userDetailsService;

    /**
     * HTTP 요청을 가로채서 JWT 토큰 검증 및 인증 처리
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        try {
            String token = getTokenFromCookie(request);
            if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
                log.info("토큰 검증 성공 - 인증 설정 시작");

                // JWT에서 사용자 정보 추출
                String userId = jwtTokenProvider.getUserIdFromToken(token);
                log.info("토큰에서 추출된 사용자 ID: {}", userId);

                // UserDetails 로드
                UserDetails userDetails = userDetailsService.loadUserByUsername(userId);

                // Spring Security 인증 객체 생성
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                // SecurityContext에 인증 정보 설정
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.info("인증 설정 완료: {}", userId);
            }

        } catch (Exception e) {
            log.error("JWT 인증 처리 중 오류 발생: {}", e.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    /**
     * HTTP 쿠키에서 JWT 토큰 추출
     *
     * @param request HTTP 요청
     * @return JWT 토큰 또는 null
     */
    private String getTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(cookie -> jwtProperties.getCookieName().equals(cookie.getName()))
                    .findFirst()
                    .map(Cookie::getValue)
                    .orElse(null);
        }

        return null;
    }

    /**
     * 필터를 적용하지 않을 경로 설정
     * 실무에서는 로그인, 회원가입 등 인증이 불필요한 경로를 제외합니다.
     */

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();

        // 인증이 불필요한 경로들
        boolean shouldNotFilter = path.startsWith("/users/login") ||
                path.startsWith("/users/signup") ||
                path.startsWith("/users/send-verification") ||
                path.startsWith("/users/verify-email") ||
                path.startsWith("/swagger-ui") ||
                path.startsWith("/v3/api-docs") ||
                path.startsWith("/actuator");


        if (shouldNotFilter) {
            log.info("JWT 필터를 건너뜀: {}", path);
        } else {
            log.info("JWT 필터를 실행함: {}", path);
        }

        return shouldNotFilter;
    }

}