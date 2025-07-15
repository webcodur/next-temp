/* 
  파일명: /unit/PageTemplate.tsx
  기능: 개발 중인 페이지를 위한 템플릿 컴포넌트
  책임: 메뉴 정보를 표시하고 준비 중인 페이지 UI를 제공한다.
*/

import type { BotMenuPath } from '@/utils/pageGenerator';

// #region 타입
interface PageTemplateProps {
	menuInfo: BotMenuPath;
}
// #endregion

// #region 렌더링
export function PageTemplate({ menuInfo }: PageTemplateProps) {
	return (
		<div className="container p-6 mx-auto space-y-6">
			{/* 페이지 헤더 */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold text-foreground">
					{menuInfo.botLabel}
				</h1>
				<p className="text-lg text-muted-foreground">{menuInfo.description}</p>
			</div>

			{/* 페이지 콘텐츠 */}
			<div className="border rounded-lg shadow-xs bg-card text-card-foreground">
				<div className="flex flex-col space-y-1.5 p-6">
					<h3 className="text-2xl font-semibold leading-none tracking-tight">
						기능 준비 중
					</h3>
					<p className="text-sm text-muted-foreground">
						이 페이지의 기능은 현재 개발 중입니다.
					</p>
				</div>
				<div className="p-6 pt-0">
					<div className="space-y-4">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<h3 className="font-semibold">메뉴 정보</h3>
								<div className="space-y-1 text-sm text-muted-foreground">
									<p>상위 카테고리: {menuInfo.topLabel}</p>
									<p>중간 카테고리: {menuInfo.midLabel}</p>
									<p>현재 페이지: {menuInfo.botLabel}</p>
								</div>
							</div>
							<div className="space-y-2">
								<h3 className="font-semibold">경로 정보</h3>
								<div className="text-sm text-muted-foreground">
									<p>URL: {menuInfo.href}</p>
								</div>
							</div>
						</div>

						<div className="p-4 mt-6 rounded-lg bg-muted">
							<p className="text-sm text-muted-foreground">
								💡 이 페이지는 메뉴 데이터를 기반으로 자동 생성되었습니다. 실제
								기능 구현 시 이 템플릿을 대체하여 사용하세요.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
// #endregion
