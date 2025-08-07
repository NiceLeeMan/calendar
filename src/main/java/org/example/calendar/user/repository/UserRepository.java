package org.example.calendar.user.repository;

import org.example.calendar.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 사용자 Repository
 *
 * <h3>주요 기능</h3>
 * <ul>
 *   <li>사용자 CRUD 작업</li>
 *   <li>로그인을 위한 사용자 조회</li>
 *   <li>회원가입 시 아이디 중복 검증</li>
 * </ul>
 *
 * <p><strong>설계 원칙:</strong> YAGNI (You Aren't Gonna Need It) - 당장 필요한 기능만 구현</p>
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 사용자 ID로 사용자 조회 (로그인용)
     *
     * @param userId 사용자 ID
     * @return Optional<User> 조회된 사용자 (없으면 Empty)
     */
    Optional<User> findByUserId(String userId);

    /**
     * 사용자 ID 존재 여부 확인 (회원가입 시 중복 검증용)
     *
     * @param userId 확인할 사용자 ID
     * @return boolean 존재하면 true, 없으면 false
     */
    boolean existsByUserId(String userId);

    /**
     * 이메일 존재 여부 확인 (회원가입 시 중복 검증용)
     *
     * @param email 확인할 이메일
     * @return boolean 존재하면 true, 없으면 false
     */
    boolean existsByEmail(String email);

    /**
     * 전화번호 존재 여부 확인 (회원가입 시 중복 검증용)
     *
     * @param phoneNumber 확인할 전화번호
     * @return boolean 존재하면 true, 없으면 false
     */
    boolean existsByPhoneNumber(String phoneNumber);

    /*
     * 기본 CRUD 메서드는 JpaRepository가 자동 제공:
     * - save(User user)           : 사용자 저장/수정
     * - findById(Long id)         : ID로 사용자 조회
     * - deleteById(Long id)       : ID로 사용자 삭제
     * - count()                   : 전체 사용자 수
     * - existsById(Long id)       : ID 존재 여부 확인
     */
}