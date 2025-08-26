/**
 * 에러 알림 처리 클래스
 * 사용자에게 에러를 표시하는 모든 방식을 담당
 */

import { FriendlyErrorInfo, ErrorHandlerConfig, ErrorNotificationOptions, ErrorType } from '../types';

export class ErrorNotifier {
  private config: ErrorHandlerConfig;
  private toastQueue: FriendlyErrorInfo[] = [];
  private isProcessingToast: boolean = false;

  constructor(config: ErrorHandlerConfig) {
    this.config = config;
  }

  /**
   * 에러 알림 메인 메서드
   * 에러 타입과 옵션에 따라 적절한 알림 방식 선택
   * @param errorInfo 친화적 에러 정보
   * @param options 알림 옵션
   */
  public notify(errorInfo: FriendlyErrorInfo, options?: ErrorNotificationOptions): void {
    const notificationOptions = this.mergeOptions(options);

    // 우선순위에 따라 알림 방식 결정
    if (notificationOptions.showModal && this.shouldShowModal(errorInfo)) {
      this.showModal(errorInfo, notificationOptions);
    } else if (notificationOptions.showToast) {
      this.showToast(errorInfo, notificationOptions);
    }

    // 콘솔 로깅
    if (notificationOptions.logToConsole) {
      this.logToConsole(errorInfo);
    }
  }

  /**
   * 토스트 메시지 표시
   * @param errorInfo 에러 정보
   * @param options 알림 옵션
   */
  private showToast(errorInfo: FriendlyErrorInfo, options: ErrorNotificationOptions): void {
    // 토스트 큐에 추가
    this.toastQueue.push(errorInfo);
    
    // 토스트 처리가 진행중이 아니라면 시작
    if (!this.isProcessingToast) {
      this.processToastQueue(options);
    }
  }

  /**
   * 모달 다이얼로그 표시
   * @param errorInfo 에러 정보  
   * @param options 알림 옵션
   */
  private showModal(errorInfo: FriendlyErrorInfo, options: ErrorNotificationOptions): void {
    // 기존 모달 제거
    this.removeExistingModal();

    const modal = this.createModal(errorInfo);
    document.body.appendChild(modal);

    // 자동 숨김 설정
    if (options.autoHideDuration && options.autoHideDuration > 0) {
      setTimeout(() => {
        this.removeModal(modal);
      }, options.autoHideDuration);
    }
  }

  /**
   * 콘솔 로깅
   * @param errorInfo 에러 정보
   */
  private logToConsole(errorInfo: FriendlyErrorInfo): void {
    const { message, type, context } = errorInfo;
    
    const logMethod = this.getConsoleMethod(type);
    const prefix = this.getLogPrefix(type);
    
    console.group(`${prefix} ${message}`);
    if (context) {
      console.log('Context:', context);
    }
    console.groupEnd();
  }

  // ========== Private Helper Methods ==========

  private mergeOptions(options?: ErrorNotificationOptions): ErrorNotificationOptions {
    return {
      ...this.config.defaultNotificationOptions,
      ...options
    };
  }

  private shouldShowModal(errorInfo: FriendlyErrorInfo): boolean {
    // 중요한 에러는 모달로 표시
    return errorInfo.type === ErrorType.SERVER || 
           errorInfo.type === ErrorType.AUTHENTICATION ||
           (errorInfo.context?.statusCode && errorInfo.context.statusCode >= 500);
  }

  private processToastQueue(options: ErrorNotificationOptions): void {
    if (this.toastQueue.length === 0) {
      this.isProcessingToast = false;
      return;
    }

    this.isProcessingToast = true;
    const errorInfo = this.toastQueue.shift()!;
    
    this.displayToast(errorInfo, options);

    // 다음 토스트 처리 (간격 두기)
    setTimeout(() => {
      this.processToastQueue(options);
    }, 500);
  }

  private displayToast(errorInfo: FriendlyErrorInfo, options: ErrorNotificationOptions): void {
    // 기존 토스트 제거
    this.removeExistingToasts();

    const toast = this.createToast(errorInfo);
    document.body.appendChild(toast);

    // 애니메이션을 위한 지연
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // 자동 숨김
    const duration = options.autoHideDuration || 5000;
    setTimeout(() => {
      this.removeToast(toast);
    }, duration);
  }

  private createToast(errorInfo: FriendlyErrorInfo): HTMLElement {
    const toast = document.createElement('div');
    toast.className = `error-toast error-toast--${errorInfo.type.toLowerCase()}`;
    toast.innerHTML = `
      <div class="error-toast__content">
        <span class="error-toast__icon">${this.getErrorIcon(errorInfo.type)}</span>
        <span class="error-toast__message">${errorInfo.message}</span>
        <button class="error-toast__close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    this.addToastStyles(toast);
    return toast;
  }

  private createModal(errorInfo: FriendlyErrorInfo): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    modal.innerHTML = `
      <div class="error-modal__overlay">
        <div class="error-modal__content">
          <div class="error-modal__header">
            <span class="error-modal__icon">${this.getErrorIcon(errorInfo.type)}</span>
            <h3 class="error-modal__title">문제가 발생했어요</h3>
            <button class="error-modal__close" onclick="this.closest('.error-modal').remove()">×</button>
          </div>
          <div class="error-modal__body">
            <p class="error-modal__message">${errorInfo.message}</p>
          </div>
          <div class="error-modal__footer">
            <button class="error-modal__button" onclick="this.closest('.error-modal').remove()">
              확인
            </button>
          </div>
        </div>
      </div>
    `;

    this.addModalStyles(modal);
    return modal;
  }

  private removeExistingToasts(): void {
    const existingToasts = document.querySelectorAll('.error-toast');
    existingToasts.forEach(toast => toast.remove());
  }

  private removeExistingModal(): void {
    const existingModal = document.querySelector('.error-modal');
    if (existingModal) {
      existingModal.remove();
    }
  }

  private removeToast(toast: HTMLElement): void {
    toast.classList.add('hide');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }

  private removeModal(modal: HTMLElement): void {
    modal.classList.add('hide');
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 300);
  }

  private getErrorIcon(type: ErrorType): string {
    switch (type) {
      case ErrorType.NETWORK: return '🌐';
      case ErrorType.AUTHENTICATION: return '🔒';
      case ErrorType.VALIDATION: return '⚠️';
      case ErrorType.DUPLICATE: return '📝';
      case ErrorType.NOT_FOUND: return '🔍';
      case ErrorType.SERVER: return '🔧';
      default: return '❗';
    }
  }

  private getConsoleMethod(type: ErrorType): 'error' | 'warn' | 'info' {
    switch (type) {
      case ErrorType.SERVER:
      case ErrorType.NETWORK:
        return 'error';
      case ErrorType.AUTHENTICATION:
      case ErrorType.VALIDATION:
      case ErrorType.DUPLICATE:
        return 'warn';
      default:
        return 'info';
    }
  }

  private getLogPrefix(type: ErrorType): string {
    switch (type) {
      case ErrorType.NETWORK: return '🌐 Network Error:';
      case ErrorType.AUTHENTICATION: return '🔒 Auth Error:';
      case ErrorType.VALIDATION: return '⚠️ Validation Error:';
      case ErrorType.DUPLICATE: return '📝 Duplicate Error:';
      case ErrorType.NOT_FOUND: return '🔍 Not Found:';
      case ErrorType.SERVER: return '🔧 Server Error:';
      default: return '❗ Error:';
    }
  }

  // 간단한 인라인 스타일 추가 (향후 CSS 파일로 분리 예정)
  private addToastStyles(toast: HTMLElement): void {
    const style = toast.style;
    style.position = 'fixed';
    style.top = '20px';
    style.right = '20px';
    style.zIndex = '10000';
    style.backgroundColor = '#f44336';
    style.color = 'white';
    style.padding = '12px 16px';
    style.borderRadius = '4px';
    style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    style.transform = 'translateX(100%)';
    style.transition = 'transform 0.3s ease';
    style.maxWidth = '400px';
  }

  private addModalStyles(modal: HTMLElement): void {
    const overlayStyle = modal.querySelector('.error-modal__overlay')!.style;
    overlayStyle.position = 'fixed';
    overlayStyle.top = '0';
    overlayStyle.left = '0';
    overlayStyle.right = '0';
    overlayStyle.bottom = '0';
    overlayStyle.backgroundColor = 'rgba(0,0,0,0.5)';
    overlayStyle.display = 'flex';
    overlayStyle.alignItems = 'center';
    overlayStyle.justifyContent = 'center';
    overlayStyle.zIndex = '10001';
    
    const contentStyle = modal.querySelector('.error-modal__content')!.style;
    contentStyle.backgroundColor = 'white';
    contentStyle.borderRadius = '8px';
    contentStyle.maxWidth = '400px';
    contentStyle.width = '90%';
    contentStyle.padding = '24px';
    contentStyle.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
  }
}
