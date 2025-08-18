/**
 * 계획 이벤트 관리자
 * 계획 CRUD 이벤트를 전역적으로 관리하여 실시간 UI 업데이트 지원
 * 
 * @author Calendar Team
 * @since 2025-08-18
 */

export interface PlanEventDetail {
  planId: number
  action: 'delete' | 'create' | 'update'
  data?: any
}

class PlanEventManager {
  private static instance: PlanEventManager
  
  private constructor() {}
  
  public static getInstance(): PlanEventManager {
    if (!PlanEventManager.instance) {
      PlanEventManager.instance = new PlanEventManager()
    }
    return PlanEventManager.instance
  }
  
  // 계획 삭제 이벤트 발생
  public emitPlanDeleted(planId: number): void {
    const event = new CustomEvent('planDeleted', {
      detail: { planId, action: 'delete' }
    })
    window.dispatchEvent(event)
    console.log(`계획 삭제 이벤트 발생: planId=${planId}`)
  }
  
  // 계획 생성 이벤트 발생
  public emitPlanCreated(planData: any): void {
    const event = new CustomEvent('planCreated', {
      detail: { action: 'create', data: planData }
    })
    window.dispatchEvent(event)
    console.log('계획 생성 이벤트 발생')
  }
  
  // 계획 업데이트 이벤트 발생
  public emitPlanUpdated(planId: number, planData: any): void {
    const event = new CustomEvent('planUpdated', {
      detail: { planId, action: 'update', data: planData }
    })
    window.dispatchEvent(event)
    console.log(`계획 업데이트 이벤트 발생: planId=${planId}`)
  }
  
  // 이벤트 리스너 추가
  public addPlanDeletedListener(callback: (planId: number) => void): void {
    const handler = (event: CustomEvent<PlanEventDetail>) => {
      callback(event.detail.planId)
    }
    window.addEventListener('planDeleted', handler as EventListener)
  }
  
  public addPlanCreatedListener(callback: (planData: any) => void): void {
    const handler = (event: CustomEvent<PlanEventDetail>) => {
      callback(event.detail.data)
    }
    window.addEventListener('planCreated', handler as EventListener)
  }
  
  public addPlanUpdatedListener(callback: (planId: number, planData: any) => void): void {
    const handler = (event: CustomEvent<PlanEventDetail>) => {
      callback(event.detail.planId, event.detail.data)
    }
    window.addEventListener('planUpdated', handler as EventListener)
  }
  
  // 이벤트 리스너 제거
  public removePlanDeletedListener(callback: EventListener): void {
    window.removeEventListener('planDeleted', callback)
  }
  
  public removePlanCreatedListener(callback: EventListener): void {
    window.removeEventListener('planCreated', callback)
  }
  
  public removePlanUpdatedListener(callback: EventListener): void {
    window.removeEventListener('planUpdated', callback)
  }
}

export const planEventManager = PlanEventManager.getInstance()
