import Link from 'next/link';

export default function OverviewPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">통합뷰</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 좌측: 수직 플로우차트 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">시스템 구조</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded border-l-4 border-blue-500">
              <h3 className="font-medium">공간 (호실)</h3>
              <p className="text-sm text-gray-600 mt-1">물리적 공간 단위 관리</p>
            </div>
            <div className="flex justify-center">
              <div className="w-px h-8 bg-gray-300"></div>
            </div>
            <div className="p-4 bg-gray-50 rounded border-l-4 border-green-500">
              <h3 className="font-medium">조직 (입주세대)</h3>
              <p className="text-sm text-gray-600 mt-1">호실에 배정된 세대 인스턴스</p>
            </div>
            <div className="flex justify-center">
              <div className="w-px h-8 bg-gray-300"></div>
            </div>
            <div className="p-4 bg-gray-50 rounded border-l-4 border-purple-500">
              <h3 className="font-medium">개인 (입주민)</h3>
              <p className="text-sm text-gray-600 mt-1">세대 구성원인 개인</p>
            </div>
          </div>
        </div>

        {/* 우측: 상세 패널 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">관리 메뉴</h2>
          <div className="space-y-3">
            <Link href="/parking/household-management/household" 
               className="block p-3 bg-blue-50 rounded hover:bg-blue-100 transition-colors">
              <h3 className="font-medium text-blue-800">호실관리</h3>
              <p className="text-sm text-blue-600 mt-1">호실 등록, 수정, 삭제</p>
            </Link>
            <Link href="/parking/household-management/household-instance"
               className="block p-3 bg-green-50 rounded hover:bg-green-100 transition-colors">
              <h3 className="font-medium text-green-800">입주세대관리</h3>
              <p className="text-sm text-green-600 mt-1">세대 등록, 이동, 설정</p>
            </Link>
            <Link href="/parking/household-management/resident"
               className="block p-3 bg-purple-50 rounded hover:bg-purple-100 transition-colors">
              <h3 className="font-medium text-purple-800">입주민관리</h3>
              <p className="text-sm text-purple-600 mt-1">입주민 등록, 이동, 이력</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 