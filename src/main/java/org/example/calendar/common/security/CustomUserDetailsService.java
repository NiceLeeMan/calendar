package org.example.calendar.common.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.calendar.user.entity.User;
import org.example.calendar.user.exception.UserNotFoundException;
import org.example.calendar.user.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Security의 UserDetailsService 구현체
 *
 * 실무에서는 JWT 필터에서 토큰 검증 후 사용자 정보를 로드할 때 사용합니다.
 * 데이터베이스에서 사용자 정보를 조회하여 Spring Security가 이해할 수 있는 형태로 변환
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * 사용자 ID로 사용자 정보 조회
     * Spring Security에서 인증 시 자동으로 호출됩니다.
     *
     * @param userId 사용자 ID (JWT의 subject에서 추출된 값)
     * @return UserDetails 구현체
     * @throws UsernameNotFoundException 사용자를 찾을 수 없는 경우
     */
    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        log.debug("사용자 정보 로드 시도: userId={}", userId);

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> {
                    log.warn("사용자를 찾을 수 없습니다: userId={}", userId);
                    return new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + userId);
                });

        log.debug("사용자 정보 로드 성공: userId={}, email={}", user.getUserId(), user.getEmail());

        return new CustomUserDetails(user);
    }
}