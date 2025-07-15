package org.example.calendar.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis 설정 클래스
 *
 * <h3>주요 기능</h3>
 * <ul>
 *   <li>Redis 연결 설정</li>
 *   <li>RedisTemplate 빈 구성</li>
 *   <li>직렬화 설정 (String 기반)</li>
 * </ul>
 *
 * <h3>사용 용도</h3>
 * <ul>
 *   <li>이메일 인증번호 임시 저장 (TTL 5분)</li>
 *   <li>세션 관리 (추후 확장 가능)</li>
 *   <li>캐싱 (추후 확장 가능)</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-14
 */
@Configuration
public class RedisConfig {

    @Value("${spring.data.redis.host}")
    private String redisHost;

    @Value("${spring.data.redis.port}")
    private int redisPort;

    @Value("${spring.data.redis.database:0}")
    private int database;

    @Value("${spring.data.redis.password:}")
    private String password;

    /**
     * Redis 연결 팩토리 구성
     *
     * @return LettuceConnectionFactory Redis 연결 팩토리
     */
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration redisConfig = new RedisStandaloneConfiguration();
        redisConfig.setHostName(redisHost);
        redisConfig.setPort(redisPort);
        redisConfig.setDatabase(database);

        // 비밀번호가 설정된 경우에만 적용
        if (password != null && !password.trim().isEmpty()) {
            redisConfig.setPassword(password);
        }

        return new LettuceConnectionFactory(redisConfig);
    }

    /**
     * RedisTemplate 구성
     *
     * <p>Key-Value 모두 String 타입으로 직렬화하여 Redis에서 사람이 읽기 쉬운 형태로 저장</p>
     *
     * @return RedisTemplate<String, String> 문자열 기반 Redis 템플릿
     */
    @Bean
    public RedisTemplate<String, String> redisTemplate() {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory());

        // Key와 Value 모두 String 직렬화 사용
        StringRedisSerializer stringSerializer = new StringRedisSerializer();

        template.setKeySerializer(stringSerializer);
        template.setValueSerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);
        template.setHashValueSerializer(stringSerializer);

        // 설정 적용
        template.afterPropertiesSet();

        return template;
    }
}