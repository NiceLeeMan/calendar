import { useNavigate } from 'react-router-dom'

const PrivacyPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">개인정보 처리방침</h1>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              돌아가기
            </button>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* 데모 프로젝트 안내 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium">학습 목적 프로젝트 안내</p>
                <p className="mt-1">본 서비스는 학부생 개인 프로젝트로 개발된 데모 버전입니다. 실제 개인정보 수집·처리는 학습 목적으로만 제한됩니다.</p>
              </div>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">개인정보 처리방침</h2>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">1. 개인정보 수집·이용 목적</h3>
                <div className="text-gray-700 leading-relaxed">
                  <p className="mb-3">캘린더 서비스는 다음의 목적으로 개인정보를 처리합니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>회원가입 및 관리:</strong> 회원 식별, 가입의사 확인, 회원자격 유지·관리</li>
                    <li><strong>서비스 제공:</strong> 개인 맞춤형 일정 관리 서비스 제공</li>
                    <li><strong>본인확인:</strong> 이메일 인증을 통한 본인 확인</li>
                    <li><strong>고객 상담:</strong> 문의사항 처리 및 서비스 개선</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">2. 수집하는 개인정보의 항목</h3>
                <div className="text-gray-700 leading-relaxed">
                  <div className="mb-4">
                    <p className="font-medium text-gray-800 mb-2">가. 회원가입 시 수집하는 정보</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>필수항목: 이름, 아이디, 비밀번호, 이메일 주소,휴대폰 번호</li>
                    </ul>
                  </div>
                  <div className="mb-4">
                    <p className="font-medium text-gray-800 mb-2">나. 서비스 이용 과정에서 자동 수집되는 정보</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>접속 IP 주소, 브라우저 정보</li>
                      <li>서비스 이용 기록, 접속 로그</li>
                      <li>쿠키(인증 토큰)</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">3. 개인정보의 처리 및 보유 기간</h3>
                <div className="text-gray-700 leading-relaxed">
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>회원정보:</strong> 회원 탈퇴 시까지 보유</li>
                    <li><strong>서비스 이용기록:</strong> 서비스 이용 종료 후 1년간 보관</li>
                    <li><strong>부정이용 기록:</strong> 관련 법령에 따라 최대 3년간 보관</li>
                  </ul>
                  <p className="mt-3 text-sm text-gray-600">
                    * 법령에서 정한 보존 기간이 있는 경우 해당 기간 동안 보관
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">4. 개인정보의 제3자 제공</h3>
                <p className="text-gray-700 leading-relaxed">
                  원칙적으로 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-gray-700">
                  <li>정보주체의 동의를 받은 경우</li>
                  <li>법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차에 따라 요청이 있는 경우</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">5. 개인정보 처리의 위탁</h3>
                <p className="text-gray-700 leading-relaxed">
                  현재 개인정보 처리업무를 외부에 위탁하고 있지 않습니다. 향후 위탁하는 경우 사전에 공지하겠습니다.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">6. 정보주체의 권리·의무 및 행사방법</h3>
                <div className="text-gray-700 leading-relaxed">
                  <p className="mb-3">정보주체는 개인정보 처리와 관련하여 다음과 같은 권리를 행사할 수 있습니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>열람권:</strong> 개인정보 처리 현황에 대한 열람 요구</li>
                    <li><strong>정정·삭제권:</strong> 잘못된 개인정보에 대한 수정·삭제 요구</li>
                    <li><strong>처리정지권:</strong> 개인정보 처리 중단 요구</li>
                    <li><strong>손해배상청구권:</strong> 개인정보 침해로 인한 손해배상 청구</li>
                  </ul>
                  <p className="mt-3 text-sm text-gray-600">
                    * 권리 행사는 서비스 내 설정 메뉴 또는 개인정보보호책임자에게 연락
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">7. 개인정보의 안전성 확보조치</h3>
                <div className="text-gray-700 leading-relaxed">
                  <p className="mb-3">개인정보 보호를 위해 다음과 같은 조치를 취하고 있습니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>관리적 조치:</strong> 개인정보보호책임자 지정, 직원 교육</li>
                    <li><strong>기술적 조치:</strong> 비밀번호 암호화, 접속기록 관리</li>
                    <li><strong>물리적 조치:</strong> 전산실 출입통제, 문서보관함 잠금</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">8. 쿠키(Cookie)의 운용</h3>
                <div className="text-gray-700 leading-relaxed">
                  <p className="mb-2">서비스는 다음과 같은 목적으로 쿠키를 사용합니다:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                    <li>로그인 상태 유지 (JWT 토큰)</li>
                    <li>서비스 이용 편의성 향상</li>
                  </ul>
                  <p className="text-sm text-gray-600">
                    쿠키 설치에 대한 선택권은 브라우저 설정에서 관리할 수 있습니다.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">9. 개인정보보호책임자</h3>
                <div className="text-gray-700 leading-relaxed">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-800 mb-2">개인정보보호책임자 연락처</p>
                    <ul className="text-sm space-y-1">
                      <li>담당자: 개발자 (학부생 프로젝트)</li>
                      <li>연락처: 데모 서비스 - 실제 연락처 미제공</li>
                      <li>처리기간: 신고일로부터 15일 이내</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">10. 개인정보 처리방침의 변경</h3>
                <p className="text-gray-700 leading-relaxed">
                  본 개인정보 처리방침은 법령·정책 또는 보안기술의 변경에 따라 내용의 추가·삭제 및 수정이 있을 경우 변경사항의 시행 7일 전부터 서비스 내에서 공지합니다.
                </p>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                <p>본 개인정보 처리방침은 2025년 8월 25일부터 시행됩니다.</p>
                <p className="mt-2">문의사항: 개인 프로젝트 데모 서비스</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage