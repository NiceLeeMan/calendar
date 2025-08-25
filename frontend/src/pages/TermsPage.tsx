import { useNavigate } from 'react-router-dom'

const TermsPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">이용약관</h1>
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
                <p className="mt-1">본 서비스는 학부생 개인 프로젝트로 개발된 데모 버전입니다. 실제 상용 서비스가 아니므로 참고용으로만 활용해 주시기 바랍니다.</p>
              </div>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">캘린더 서비스 이용약관</h2>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">제1조 (목적)</h3>
                <p className="text-gray-700 leading-relaxed">
                  본 약관은 캘린더 서비스(이하 "서비스")의 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">제2조 (정의)</h3>
                <div className="text-gray-700 leading-relaxed">
                  <p className="mb-2">본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>"서비스"란 개인 일정 관리를 위한 웹 기반 캘린더 플랫폼을 의미합니다</li>
                    <li>"회원"이란 본 약관에 따라 서비스 이용계약을 체결하고 서비스를 이용하는 자를 의미합니다</li>
                    <li>"계정"이란 회원 식별과 서비스 이용을 위해 회원이 설정한 문자와 숫자의 조합을 의미합니다</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">제3조 (서비스 제공)</h3>
                <div className="text-gray-700 leading-relaxed">
                  <p className="mb-3">서비스는 다음과 같은 기능을 제공합니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>개인 일정 등록, 수정, 삭제 기능</li>
                    <li>월별, 주별, 일별 캘린더 뷰 제공</li>
                    <li>일정 검색 및 필터링 기능</li>
                    <li>일정 알림 기능</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">제4조 (회원가입)</h3>
                <div className="text-gray-700 leading-relaxed">
                  <p className="mb-2">서비스 이용을 위해서는 다음 정보를 제공하여야 합니다:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>이름, 아이디, 비밀번호, 이메일 주소</li>
                    <li>본인 인증을 위한 이메일 인증 절차</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">제5조 (회원의 의무)</h3>
                <div className="text-gray-700 leading-relaxed">
                  <p className="mb-2">회원은 다음 의무를 준수해야 합니다:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>정확하고 최신의 정보 제공</li>
                    <li>계정 정보의 안전한 관리</li>
                    <li>다른 회원의 개인정보 보호 및 존중</li>
                    <li>서비스의 정상적인 운영을 방해하는 행위 금지</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">제6조 (서비스 제한)</h3>
                <p className="text-gray-700 leading-relaxed">
                  서비스 제공자는 회원이 본 약관을 위반하거나 서비스의 정상적인 운영을 방해한 경우 사전 통지 후 서비스 이용을 제한할 수 있습니다.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">제7조 (개인정보 보호)</h3>
                <p className="text-gray-700 leading-relaxed">
                  서비스 제공자는 관련 법령에 따라 회원의 개인정보를 보호하며, 개인정보 처리에 관한 세부사항은 별도의 개인정보 처리방침에 따릅니다.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">제8조 (면책조항)</h3>
                <div className="text-gray-700 leading-relaxed">
                  <p className="mb-2">서비스 제공자는 다음의 경우 책임을 지지 않습니다:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>천재지변, 전쟁, 테러 등 불가항력으로 인한 서비스 중단</li>
                    <li>회원의 귀책사유로 인한 서비스 이용 장애</li>
                    <li>회원이 서비스를 통해 얻은 정보로 인해 발생한 손해</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">제9조 (약관의 효력 및 변경)</h3>
                <p className="text-gray-700 leading-relaxed">
                  본 약관은 서비스 내 게시와 동시에 효력이 발생합니다. 약관의 변경이 필요한 경우 사전에 공지하며, 변경된 약관은 공지 후 7일 이후부터 효력이 발생합니다.
                </p>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                <p>본 약관은 2025년 8월 25일부터 시행됩니다.</p>
                <p className="mt-2">문의사항: 개인 프로젝트 데모 서비스</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage