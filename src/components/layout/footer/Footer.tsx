'use client';

export default function Footer() {
  return (
    <footer className="border-t border-border text-muted-foreground py-[92px] mt-[172px]">
      <div className="container px-[28px] mx-auto max-w-2xl">
        {/* 로고 및 소개 - 중앙 정렬 */}
        <div className="mb-6 text-center">
          <div className="flex justify-center items-center mb-2">
            <h2 className="text-2xl font-bold text-foreground">Meerkat API Center</h2>
          </div>
          <p className="mb-2 text-base">AX DX SPACE TECHNOLOGY</p>
        </div>
        
        {/* 구분선 */}
        <div className="mx-auto my-5 w-28 border-t border-border"></div>
        
        {/* 연락처 및 바로가기 표 형식 */}
        <div className="mx-auto mb-6 max-w-md">
          <div className="grid grid-cols-2 gap-2 text-center">
            {/* 번호 */}
            <div className="text-base">
              <p className="text-foreground">1668-4179</p>
            </div>
            
            {/* 홈페이지 */}
            <div className="text-base">
              <a 
                href="https://meerkat.day/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-colors text-foreground hover:text-primary"
              >
                공식 홈페이지
              </a>
            </div>
            
            {/* 메일 */}
            <div className="text-base">
              <p className="text-foreground">7king@7meerkat.com</p>
            </div>
            
            {/* 블로그 */}
            <div className="text-base">
              <a 
                href="https://blog.naver.com/7meerkat" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-colors text-foreground hover:text-primary"
              >
                블로그
              </a>
            </div>
          </div>
        </div>
        
        <div className="mb-6 text-center">
          <div className="mx-auto space-y-1 max-w-lg text-base">
            <p><span>본사: </span>
            <span className="text-foreground">경기도 시흥시 배곧2로 82 서울대학교 미래모빌리티연구센터 506호</span></p>
            <p><span>제조: </span>
            <span className="text-foreground">경기도 시흥시 서울대학로 59-21 로얄밸리스테크노 622호</span></p>
          </div>
        </div>
        
        {/* 구분선 */}
        <div className="mx-auto my-5 w-28 border-t border-border"></div>
        
        {/* 회사 정보 및 저작권 */}
        <div className="text-sm text-center">
          <p>(주)세븐미어캣 | 대표이사: 주명규 | 사업자등록번호: 786-86-01451</p>
          <p className="mt-1">©Copyright {new Date().getFullYear()}. All Right Reserved.</p>
          <p className="mt-1 text-gray-6">현재 보시는 화면은 PC에 최적화 되어 있습니다.</p>
        </div>
      </div>
    </footer>
  );
} 