package org.example.calendar.plan.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.calendar.plan.dto.response.PlanResponse;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

/**
 * Plan 캐시 관리 서비스
 * 
 * <h3>캐시 전략</h3>
 * <ul>
 *   <li><strong>월별 캐시</strong>: Cache-Aside 패턴으로 월별 계획 캐싱</li>
 *   <li><strong>TTL 관리</strong>: 24시간 후 자동 만료</li>
 *   <li><strong>무효화</strong>: 계획 CUD 시 관련 캐시 삭제</li>
 * </ul>
 * 
 * <h3>캐시 키 구조</h3>
 * <ul>
 *   <li><strong>월별 계획</strong>: "monthly_plans:{userId}:{year}:{month}"</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-25
 */
@Service
@Slf4j
public class PlanCacheService {

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    // 캐시 TTL (24시간)
    private static final Duration CACHE_TTL = Duration.ofHours(24);
    
    // 캐시 키 패턴
    private static final String MONTHLY_PLANS_KEY = "monthly_plans:%d:%d:%d"; // userId:year:month

    /**
     * ObjectMapper 생성자 주입 시 설정
     */
    public PlanCacheService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    /**
     * 월별 계획 캐시 조회
     * 
     * @param userId 사용자 ID
     * @param year 년도
     * @param month 월
     * @return 캐시된 계획 목록 (Cache Miss시 null)
     */
    public List<PlanResponse> getMonthlyPlansFromCache(Long userId, int year, int month) {
        String cacheKey = String.format(MONTHLY_PLANS_KEY, userId, year, month);
        
        try {
            String cachedData = redisTemplate.opsForValue().get(cacheKey);
            
            if (cachedData == null) {
                log.debug("Cache miss for monthly plans: userId={}, year={}, month={}", userId, year, month);
                return null;
            }
            
            List<PlanResponse> plans = objectMapper.readValue(cachedData, new TypeReference<List<PlanResponse>>() {});
            log.debug("Cache hit for monthly plans: userId={}, year={}, month={}, count={}", 
                    userId, year, month, plans.size());
            
            return plans;
            
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize cached monthly plans: userId={}, year={}, month={}", 
                    userId, year, month, e);
            
            // 캐시 데이터가 손상된 경우 삭제
            redisTemplate.delete(cacheKey);
            return null;
        }
    }

    /**
     * 월별 계획 캐시 저장
     * 
     * @param userId 사용자 ID
     * @param year 년도
     * @param month 월
     * @param plans 캐시할 계획 목록
     */
    public void cacheMonthlyPlans(Long userId, int year, int month, List<PlanResponse> plans) {
        String cacheKey = String.format(MONTHLY_PLANS_KEY, userId, year, month);
        
        try {
            String jsonData = objectMapper.writeValueAsString(plans);
            redisTemplate.opsForValue().set(cacheKey, jsonData, CACHE_TTL);
            
            log.debug("Cached monthly plans: userId={}, year={}, month={}, count={}", 
                    userId, year, month, plans.size());
            
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize monthly plans for cache: userId={}, year={}, month={}", 
                    userId, year, month, e);
        }
    }

    /**
     * 사용자의 특정 월 캐시 삭제
     * 계획 생성/수정/삭제 시 해당 월 캐시 무효화용
     * 
     * @param userId 사용자 ID
     * @param year 년도
     * @param month 월
     */
    public void evictMonthlyPlansCache(Long userId, int year, int month) {
        String cacheKey = String.format(MONTHLY_PLANS_KEY, userId, year, month);
        Boolean deleted = redisTemplate.delete(cacheKey);
        
        log.debug("Evicted monthly plans cache: userId={}, year={}, month={}, deleted={}", 
                userId, year, month, deleted);
    }
}
