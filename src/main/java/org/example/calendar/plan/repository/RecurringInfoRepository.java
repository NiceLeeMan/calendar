package org.example.calendar.plan.repository;

import org.example.calendar.plan.entity.RecurringInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * RecurringInfo 엔티티에 대한 데이터 접근 계층
 * 
 * 실제로는 Plan과 cascade 관계로 자동 처리되므로
 * 기본 JpaRepository 기능만 제공
 * 
 * @author Calendar Team
 * @since 2025-07-25
 */
@Repository
public interface RecurringInfoRepository extends JpaRepository<RecurringInfo, Long> {
    
    /*
     * 기본 CRUD 메서드는 JpaRepository가 자동 제공:
     * - save(RecurringInfo)     : 저장/수정 (실제로는 Plan과 함께 처리)
     * - findById(Long id)       : ID로 조회 (실제로는 Plan에서 접근)
     * - deleteById(Long id)     : 삭제 (실제로는 Plan과 함께 처리)
     * 
     * Plan 엔티티의 cascade 설정으로 모든 작업이 자동 처리됨
     */
    
}
