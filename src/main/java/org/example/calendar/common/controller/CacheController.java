package org.example.calendar.common.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

/**
 * 캐시 확인용 컨트롤러 (개발/테스트 용도)
 */
@RestController
@RequestMapping("/cache")
@RequiredArgsConstructor
public class CacheController {

    private final RedisTemplate<String, String> redisTemplate;

    /**
     * 모든 캐시 키 조회
     */
    @GetMapping("/keys")
    public Set<String> getAllKeys() {
        return redisTemplate.keys("*");
    }

    /**
     * 월별 계획 캐시 키만 조회
     */
    @GetMapping("/keys/monthly-plans")
    public Set<String> getMonthlyPlanKeys() {
        return redisTemplate.keys("monthly_plans:*");
    }

    /**
     * 특정 키의 값 조회
     */
    @GetMapping("/get")
    public String getValue(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    /**
     * 반복 일정의 종료일 확인용 (개발/디버깅)
     */
    @GetMapping("/debug/recurring-plans")
    public String getRecurringPlansDebug() {
        StringBuilder result = new StringBuilder();
        result.append("=== 반복 일정 종료일 디버깅 ===\n");
        
        // 여기서 직접 쿼리하거나 서비스 호출
        // 임시로 정보만 반환
        result.append("DB 쿼리 결과를 확인하세요:\n");
        result.append("SELECT p.plan_name, p.start_date, p.end_date, ri.end_date\n");
        result.append("FROM plans p JOIN recurring_info ri ON p.recurring_info_id = ri.id\n");
        result.append("WHERE p.is_recurring = true;\n");
        
        return result.toString();
    }

    /**
     * 모든 월별 계획 캐시 삭제 (개발/테스트 용도)
     */
    @GetMapping("/clear/monthly-plans")
    public String clearAllMonthlyPlansCache() {
        Set<String> keys = redisTemplate.keys("monthly_plans:*");
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
            return "Cleared " + keys.size() + " monthly plan cache keys: " + keys;
        }
        return "No monthly plan cache keys found";
    }

    /**
     * 특정 사용자의 모든 월별 계획 캐시 삭제
     */
    @GetMapping("/clear/user-monthly-plans")
    public String clearUserMonthlyPlansCache(Long userId) {
        Set<String> keys = redisTemplate.keys("monthly_plans:" + userId + ":*");
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
            return "Cleared " + keys.size() + " cache keys for user " + userId + ": " + keys;
        }
        return "No cache keys found for user " + userId;
    }

    /**
     * Redis 연결 상태 확인
     */
    @GetMapping("/ping")
    public String ping() {
        try {
            redisTemplate.getConnectionFactory().getConnection().ping();
            return "Redis connection OK";
        } catch (Exception e) {
            return "Redis connection failed: " + e.getMessage();
        }
    }
}
