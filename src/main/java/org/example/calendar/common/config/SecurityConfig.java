
package org.example.calendar.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security 기본 설정 클래스
 *
 * <h3>현재 단계 설정</h3>
 * <ul>
 *   <li>PasswordEncoder Bean 등록 (BCrypt)</li>
 *   <li>기본 보안 설정 (JWT는 추후 구현)</li>
 *   <li>Swagger, Actuator 접근 허용</li>
 * </ul>
 *
 * <h3>추후 확장 예정</h3>
 * <ul>
 *   <li>JWT 토큰 인증 필터</li>
 *   <li>Cookie 기반 인증</li>
 *   <li>세부 권한 설정</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * 비밀번호 암호화를 위한 PasswordEncoder Bean
     *
     * <p>BCrypt 알고리즘 사용:</p>
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
     * HTTP 보안 설정
     *
     * <p>현재는 기본 설정만 적용, JWT 구현 시 확장 예정</p>
     *
     * @param http HttpSecurity 객체
     * @return SecurityFilterChain 보안 필터 체인
     * @throws Exception 설정 오류 시
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 비활성화 (REST API에서는 일반적으로 비활성화)
                .csrf(csrf -> csrf.disable())

                // 요청별 권한 설정
                .authorizeHttpRequests(authz -> authz
                        // Swagger 접근 허용
                        .requestMatchers("/api/swagger-ui/**", "/api/v3/api-docs/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/swagger-ui.html", "/api/swagger-ui.html").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // Actuator 접근 허용
                        .requestMatchers("/api/actuator/**").permitAll()

                        // 회원가입, 로그인 관련 접근 허용
                        .requestMatchers("/api/users/signup", "/api/users/login", "/api/users/verify-email", "/api/users/send-verification").permitAll()

                        // 나머지 요청은 인증 필요 (추후 JWT로 처리)
                        .anyRequest().authenticated()
                )

                // 기본 로그인 폼 비활성화 (JWT 사용 예정)
                .formLogin(form -> form.disable())

                // HTTP Basic 인증 비활성화
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}