package org.example.calendar.common.security;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.example.calendar.user.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * Spring Security의 UserDetails 구현체
 *
 * 실무에서는 User 엔티티를 Spring Security가 이해할 수 있는 형태로 변환합니다.
 * 인증 후 SecurityContext에 저장되어 현재 로그인한 사용자 정보를 제공
 */
@Getter
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;

    /**
     * 사용자 권한 목록 반환
     * 현재는 모든 사용자에게 USER 권한만 부여 (향후 확장 가능)
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    /**
     * 사용자 비밀번호 반환
     */
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    /**
     * 사용자 이름 반환 (여기서는 userId 사용)
     */
    @Override
    public String getUsername() {
        return user.getUserId();
    }

    /**
     * 계정 만료 여부
     * 실무에서는 User 엔티티에 만료 관련 필드를 추가하여 관리
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * 계정 잠금 여부
     * 실무에서는 로그인 실패 횟수 등을 체크하여 계정 잠금 처리
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * 인증 정보 만료 여부
     * 비밀번호 변경 주기 등을 관리할 때 사용
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * 계정 활성화 여부
     * 실무에서는 User 엔티티에 enabled 필드를 추가하여 관리
     */
    @Override
    public boolean isEnabled() {
        // 향후 User 엔티티에 enabled 필드 추가 시 사용
        // return user.isEnabled();
        return true;
    }

    /**
     * 편의 메서드: 원본 User 엔티티 반환
     * 컨트롤러에서 현재 로그인한 사용자 정보에 접근할 때 사용
     */
    public User getUser() {
        return user;
    }

    /**
     * 편의 메서드: 사용자 ID 반환
     */
    public String getUserId() {
        return user.getUserId();
    }

    /**
     * 편의 메서드: 이메일 반환
     */
    public String getEmail() {
        return user.getEmail();
    }
}