package org.example.calendar.common.config;

import lombok.RequiredArgsConstructor;
import org.example.calendar.common.security.CustomUserDetailsService;
import org.example.calendar.common.security.jwt.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 설정 클래스 (JWT 통합)
 *
 * <h3>실무 기준 보안 설정</h3>
 * <ul>
 *   <li>JWT 기반 Stateless 인증</li>
 *   <li>세션 사용 안함 (STATELESS)</li>
 *   <li>JWT 필터를 Security Filter Chain에 통합</li>
 *   <li>환경별 엔드포인트 접근 제어</li>
 * </ul>
 *
 * <h3>인증 정책</h3>
 * <ul>
 *   <li><strong>인증 불필요</strong>: 회원가입, 로그인, API 문서</li>
 *   <li><strong>인증 필요</strong>: 사용자 정보 조회, 캘린더 기능</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-15
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;

    /**
     * 비밀번호 암호화를 위한 PasswordEncoder Bean
     *
     * <p>BCrypt 알고리즘 사용 (실무 표준):</p>
     * <ul>
     *   <li>단방향 해시 함수 (복호화 불가)</li>
     *   <li>Salt 자동 생성 (같은 비밀번호도 다른 해시값)</li>
     *   <li>강도 조절 가능 (기본 10라운드)</li>
     * </ul>
     *
     * @return PasswordEncoder BCrypt 방식 패스워드 인코더
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * AuthenticationManager Bean 등록
     * 실무에서는 JWT 로그인 시 사용자 인증에 필요
     *
     * @param config 인증 설정
     * @return AuthenticationManager
     * @throws Exception 설정 오류 시
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * HTTP 보안 설정 (JWT 기반)
     *
     * <p>실무 기준 JWT 인증 시스템 적용:</p>
     * <ul>
     *   <li>세션 사용 안함 (STATELESS)</li>
     *   <li>JWT 필터 체인 통합</li>
     *   <li>CORS 설정 (향후 프론트엔드 연동)</li>
     *   <li>예외 처리 (인증/인가 실패)</li>
     * </ul>
     *
     * @param http HttpSecurity 객체
     * @return SecurityFilterChain 보안 필터 체인
     * @throws Exception 설정 오류 시
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 비활성화 (JWT 사용으로 불필요)
                .csrf(AbstractHttpConfigurer::disable)

                // CORS 설정 (향후 프론트엔드 연동 시 필요)
                .cors(AbstractHttpConfigurer::disable) // 개발 단계에서는 비활성화

                // 요청별 권한 설정
                .authorizeHttpRequests(authz -> authz
                        // ===== 인증 불필요 (PUBLIC) =====

                        // 회원 관리 (인증 전)
                        .requestMatchers("/users/send-verification").permitAll()
                        .requestMatchers("/users/verify-email").permitAll()
                        .requestMatchers("/users/signup").permitAll()
                        .requestMatchers("/users/login").permitAll()

                        // Swagger/OpenAPI 문서
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()

                        // Spring Boot Actuator (모니터링)
                        .requestMatchers("/actuator/**").permitAll()

                        // 정적 리소스
                        .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()

                        // ===== 인증 필요 (PROTECTED) =====

                        // 사용자 정보 관리
                        .requestMatchers("/users/me").authenticated()
                        .requestMatchers("/users/logout").authenticated()

                        // 캘린더 기능 (향후 구현)
                        .requestMatchers("/plans/**").authenticated()

                        // 기타 모든 요청도 인증 필요
                        .anyRequest().authenticated()
                )
                // 세션 정책: STATELESS (JWT 사용)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 기본 로그인 폼 비활성화 (JWT 사용)
                .formLogin(form -> form.disable())

                // HTTP Basic 인증 비활성화 (JWT 사용)
                .httpBasic(basic -> basic.disable())

                // JWT 인증 필터 추가 (실무 핵심)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // 인증 실패 처리 (향후 확장 가능)
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"error\":\"인증이 필요합니다.\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(403);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"error\":\"접근 권한이 없습니다.\"}");
                        })
                );

        return http.build();
    }

}