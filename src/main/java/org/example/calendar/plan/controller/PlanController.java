package org.example.calendar.plan.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.example.calendar.common.security.CustomUserDetails;
import org.example.calendar.plan.dto.request.PlanCreateReq;
import org.example.calendar.plan.dto.request.PlanDeleteReq;
import org.example.calendar.plan.dto.request.PlanUpdateReq;
import org.example.calendar.plan.dto.response.PlanResponse;
import org.example.calendar.plan.service.PlanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 계획(일정) 관리 API 컨트롤러
 * 
 * <h3>캘린더 기능 요구사항 구현</h3>
 * <ul>
 *   <li>계획 추가: 날짜 우클릭 → 계획추가 → 입력폼 → 완료</li>
 *   <li>계획 수정: 계획 우클릭 → 수정 → 입력폼 → 완료</li>
 *   <li>계획 삭제: 계획 우클릭 → 삭제 (반복 계획의 경우 옵션 선택)</li>
 *   <li>계획 읽기: 월별 조회로 캘린더에 표시</li>
 * </ul>
 * 
 * <h3>인증 방식</h3>
 * <ul>
 *   <li>JWT 쿠키 기반 인증 (UserController와 동일)</li>
 *   <li>모든 API는 로그인 필수</li>
 *   <li>본인의 계획만 조회/수정/삭제 가능</li>
 * </ul>
 *
 * @author Calendar Team
 * @since 2025-07-25
 */
@Slf4j
@RestController
@RequestMapping("/plans")
@Tag(name = "Plan", description = "계획(일정) 관리 API")
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;

    /**
     * 월별 계획 조회 (캘린더 메인 기능)
     * 
     * <p><strong>사용자 시나리오:</strong></p>
     * <ol>
     *   <li>사용자가 캘린더 앱에 접속</li>
     *   <li>현재 년월(YYYY-MM)의 캘린더와 모든 계획이 표시</li>
     *   <li>"다음달" 버튼 클릭 시 해당 월의 모든 계획 조회</li>
     * </ol>
     */
    @GetMapping("/{year}/{month}")
    @Operation(
            summary = "월별 계획 조회",
            description = "특정 년월의 모든 계획을 조회합니다. 일반 계획과 반복 계획을 모두 포함합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 년월 형식"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    public ResponseEntity<List<PlanResponse>> getMonthlyPlans(
            @Parameter(description = "조회할 년도 (예: 2025)", example = "2025")
            @PathVariable int year,
            
            @Parameter(description = "조회할 월 (1~12)", example = "7") 
            @PathVariable int month,
            
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        Long userId = userDetails.getUser().getId();

        // 입력값 유효성 검증
        if (month < 1 || month > 12) {
            return ResponseEntity.badRequest().build();
        }
        
        if (year < 1900 || year > 2100) {
            return ResponseEntity.badRequest().build();
        }
        
        List<PlanResponse> plans = planService.getMonthlyPlans(userId, year, month);
        
        log.info("월별 계획 조회 완료: userId={}, year={}, month={}, count={}", 
                userId, year, month, plans.size());
        
        return ResponseEntity.ok(plans);
    }

    /**
     * 계획 추가
     * 
     * <p><strong>사용자 시나리오:</strong></p>
     * <ol>
     *   <li>사용자가 캘린더의 특정 날짜를 우클릭</li>
     *   <li>"계획추가" 버튼 클릭</li>
     *   <li>계획 정보 입력 (제목, 내용, 시간, 반복설정, 알람설정)</li>
     *   <li>"완료" 버튼 클릭 → 즉시 화면에 반영</li>
     * </ol>
     */
    @PostMapping
    @Operation(
            summary = "계획 추가",
            description = "새로운 계획을 생성합니다. 일반 계획 또는 반복 계획을 생성할 수 있습니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "계획 생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 입력값 (제목 30자 초과, 내용 300자 초과, 잘못된 날짜/시간)"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    public ResponseEntity<PlanResponse> createPlan(
            @Valid @RequestBody PlanCreateReq request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        Long userId = userDetails.getUser().getId();
        log.info("계획 추가 요청: userId={}, request={}", userId, request.toString());
        
        PlanResponse createdPlan = planService.createPlan(request, userId);
        
        log.info("계획 추가 완료: userId={}, planId={}", userId, createdPlan.getId());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPlan);
    }

    /**
     * 계획 수정
     * 
     * <p><strong>사용자 시나리오:</strong></p>
     * <ol>
     *   <li>사용자가 화면에 표시된 계획을 우클릭</li>
     *   <li>"수정" 버튼 클릭</li>
     *   <li>기존 정보가 표시된 입력폼에서 수정</li>
     *   <li>"완료" 버튼 클릭 → 즉시 화면에 반영</li>
     * </ol>
     * 
     * <p><strong>특별 처리:</strong></p>
     * <ul>
     *   <li>반복계획을 단일계획으로 변경 시: 다른 날짜 자동 삭제</li>
     *   <li>알람설정 해제 시: 알람 정보 null로 저장</li>
     * </ul>
     */
    @PutMapping("/{planId}")
    @Operation(
            summary = "계획 수정",
            description = "기존 계획을 수정합니다. 본인의 계획만 수정 가능합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "계획 수정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 입력값"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "403", description = "수정 권한 없음 (다른 사용자의 계획)"),
            @ApiResponse(responseCode = "404", description = "계획을 찾을 수 없음")
    })
    public ResponseEntity<PlanResponse> updatePlan(
            @Parameter(description = "수정할 계획 ID", example = "1")
            @PathVariable Long planId,
            
            @Valid @RequestBody PlanUpdateReq request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        Long userId = userDetails.getUser().getId();
        log.info("계획 수정 요청: userId={}, request={}", userId, request.toString());

        PlanResponse updatedPlan = planService.updatePlan(planId, request, userId);
        
        log.info("계획 수정 완료: userId={}, planId={}", userId, planId);
        
        return ResponseEntity.ok(updatedPlan);
    }

    /**
     * 계획 삭제 (단일 계획)
     * 
     * <p><strong>사용자 시나리오:</strong></p>
     * <ol>
     *   <li>사용자가 단일 계획을 우클릭</li>
     *   <li>"삭제" 버튼 클릭</li>
     *   <li>확인 → DB에서 삭제 및 화면에서 제거</li>
     * </ol>
     */
    @DeleteMapping("/{planId}")
    @Operation(
            summary = "계획 삭제 (단일 계획)",
            description = "단일 계획을 삭제합니다. 본인의 계획만 삭제 가능합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "계획 삭제 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "403", description = "삭제 권한 없음 (다른 사용자의 계획)"),
            @ApiResponse(responseCode = "404", description = "계획을 찾을 수 없음")
    })
    public ResponseEntity<Void> deletePlan(
            @Parameter(description = "삭제할 계획 ID", example = "1")
            @PathVariable Long planId,
            
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        Long userId = userDetails.getUser().getId();
        log.info("계획 삭제 요청: userId={}, planId={}", userId, planId);
        
        planService.deletePlan(planId, userId);
        
        log.info("계획 삭제 완료: userId={}, planId={}", userId, planId);
        
        return ResponseEntity.ok().build();
}
}
