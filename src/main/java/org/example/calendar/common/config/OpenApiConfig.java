package org.example.calendar.common.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;

import java.util.List;
/**
 * OpenAPI (Swagger) 설정 클래스
 *
 * <h3>목적</h3>
 * API 문서 자동 생성 및 Swagger UI 커스터마이징을 위한 설정을 제공합니다.
 *
 * <h3>주요 기능</h3>
 * <ul>
 *   <li>API 문서 메타데이터 설정 (제목, 버전, 설명 등)</li>
 *   <li>개발/운영 서버 환경 정보 설정</li>
 *   <li>개발팀 연락처 및 라이센스 정보 제공</li>
 *   <li>Swagger UI에서 전문적인 API 문서 화면 구성</li>
 * </ul>
 *
 * <h3>접속 URL</h3>
 * <ul>
 *   <li>Swagger UI: <a href="http://localhost:8080/api/swagger-ui.html">http://localhost:8080/api/swagger-ui.html</a></li>
 *   <li>OpenAPI JSON: <a href="http://localhost:8080/api/api-docs">http://localhost:8080/api/api-docs</a></li>
 * </ul>
 *
 * <h3>환경별 설정</h3>
 * <ul>
 *   <li><strong>개발환경 (local)</strong>: Swagger UI 활성화</li>
 *   <li><strong>테스트환경 (test)</strong>: Swagger UI 비활성화</li>
 *   <li><strong>운영환경 (prod)</strong>: Swagger UI 비활성화 (보안상)</li>
 * </ul>
 *
 * <h3>사용 예시</h3>
 * 1. 프론트엔드 개발자와의 API 명세 공유<br>
 * 2. API 테스트 및 디버깅<br>
 * 3. 신규 개발자 온보딩 시 API 문서 제공<br>
 */

 @Configuration
public class OpenApiConfig {

    @Value("${openapi.dev-url:http://localhost:8080}")
    private String devUrl;

    @Value("${openapi.prod-url:https://your-production-url.com}")
    private String prodUrl;

    @Bean
    public OpenAPI myOpenAPI() {
        // 개발 서버 정보
        Server devServer = new Server();
        devServer.setUrl(devUrl);
        devServer.setDescription("개발 환경 서버");

        // 운영 서버 정보 (나중에 배포할 때 사용)
        Server prodServer = new Server();
        prodServer.setUrl(prodUrl);
        prodServer.setDescription("운영 환경 서버");

        // 연락처 정보
        Contact contact = new Contact();
        contact.setEmail("your-email@example.com");
        contact.setName("Calendar Team");
        contact.setUrl("https://github.com/your-username");

        // 라이센스 정보
        License mitLicense = new License()
                .name("MIT License")
                .url("https://choosealicense.com/licenses/mit/");

        // API 기본 정보
        Info info = new Info()
                .title("Calendar API")
                .version("1.0.0")
                .contact(contact)
                .description("Calendar 프로젝트의 REST API 문서입니다. " +
                        "회원가입, 로그인, 캘린더 관리 기능을 제공합니다.")
                .termsOfService("https://your-terms-of-service-url.com")
                .license(mitLicense);

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer, prodServer));
    }
}