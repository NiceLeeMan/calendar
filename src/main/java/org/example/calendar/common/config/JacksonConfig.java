package org.example.calendar.common.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.io.IOException;
import java.time.LocalTime;

/**
 * Jackson JSON 직렬화/역직렬화 설정
 * 
 * <h3>목적</h3>
 * LocalTime, LocalDate 등의 Java Time API 객체들을  
 * JSON과 자연스럽게 변환하기 위한 설정
 * 
 * <h3>지원 형식</h3>
 * <ul>
 *   <li>LocalTime: 객체 형태 {"hour": 14, "minute": 30, "second": 0, "nano": 0}</li>
 *   <li>LocalDate: 문자열 형태 "2025-07-28"</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-28
 */
@Configuration
public class JacksonConfig {

    /**
     * ObjectMapper Bean 설정
     * LocalTime 객체 형식 지원을 위한 커스텀 설정
     */
    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        
        // Java Time 모듈 등록
        mapper.registerModule(new JavaTimeModule());
        
        // 커스텀 LocalTime Deserializer 등록
        SimpleModule customModule = new SimpleModule();
        customModule.addDeserializer(LocalTime.class, new LocalTimeObjectDeserializer());
        mapper.registerModule(customModule);
        
        // TIMESTAMPS를 활성화하여 객체 형태로 처리
        mapper.enable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        return mapper;
    }

    /**
     * LocalTime 객체 형태 지원을 위한 커스텀 Deserializer
     */
    public static class LocalTimeObjectDeserializer extends JsonDeserializer<LocalTime> {
        @Override
        public LocalTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            JsonNode node = p.getCodec().readTree(p);
            
            // 객체 형태인 경우
            if (node.isObject()) {
                int hour = node.get("hour").asInt();
                int minute = node.get("minute").asInt();
                int second = node.has("second") ? node.get("second").asInt() : 0;
                int nano = node.has("nano") ? node.get("nano").asInt() : 0;
                
                return LocalTime.of(hour, minute, second, nano);
            }
            
            // 문자열 형태인 경우 (기존 호환성 유지)
            if (node.isTextual()) {
                return LocalTime.parse(node.asText());
            }
            
            throw new IllegalArgumentException("LocalTime을 파싱할 수 없습니다: " + node);
        }
    }
}
