'use client';

import * as React from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	CardActions,
	CardAction,
	CardImage,
	CardBadge,
} from '@/components/ui/card/Card';

// #region 아이콘 컴포넌트
const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}>
		<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
	</svg>
);

const BookmarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}>
		<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
	</svg>
);

const ShareIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}>
		<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
		<polyline points="16 6 12 2 8 6" />
		<line x1="12" x2="12" y1="2" y2="15" />
	</svg>
);
// #endregion

export default function CardPage() {
	return (
		<div className="container py-10">
			<h1 className="mb-8 text-3xl font-bold">Card 컴포넌트</h1>

			<div className="space-y-10">
				{/* 기본 카드 스타일 */}
				<section>
					<h2 className="mb-4 text-2xl font-semibold">기본 카드 스타일</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						<Card>
							<CardHeader>
								<CardTitle>기본 카드</CardTitle>
								<CardDescription>기본 스타일의 카드입니다.</CardDescription>
							</CardHeader>
							<CardContent>
								<p>카드 콘텐츠가 여기에 들어갑니다.</p>
							</CardContent>
							<CardFooter>
								<p className="text-sm text-muted-foreground">
									최종 업데이트: 2023년 6월
								</p>
							</CardFooter>
						</Card>

						<Card variant="outline">
							<CardHeader>
								<CardTitle>아웃라인 카드</CardTitle>
								<CardDescription>테두리가 강조된 카드입니다.</CardDescription>
							</CardHeader>
							<CardContent>
								<p>카드 콘텐츠가 여기에 들어갑니다.</p>
							</CardContent>
							<CardFooter>
								<p className="text-sm text-muted-foreground">
									최종 업데이트: 2023년 6월
								</p>
							</CardFooter>
						</Card>

						<Card variant="elevated">
							<CardHeader>
								<CardTitle>엘리베이티드 카드</CardTitle>
								<CardDescription>그림자가 강조된 카드입니다.</CardDescription>
							</CardHeader>
							<CardContent>
								<p>카드 콘텐츠가 여기에 들어갑니다.</p>
							</CardContent>
							<CardFooter>
								<p className="text-sm text-muted-foreground">
									최종 업데이트: 2023년 6월
								</p>
							</CardFooter>
						</Card>
					</div>
				</section>

				{/* 호버 효과 */}
				<section>
					<h2 className="mb-4 text-2xl font-semibold">호버 효과</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						<Card hoverEffect>
							<CardHeader>
								<CardTitle>호버 효과 카드</CardTitle>
								<CardDescription>
									마우스를 올리면 효과가 나타납니다.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p>카드 위에 마우스를 올려보세요.</p>
							</CardContent>
						</Card>

						<Card variant="outline" hoverEffect>
							<CardHeader>
								<CardTitle>아웃라인 + 호버</CardTitle>
								<CardDescription>아웃라인 + 호버 효과</CardDescription>
							</CardHeader>
							<CardContent>
								<p>카드 위에 마우스를 올려보세요.</p>
							</CardContent>
						</Card>

						<Card variant="elevated" hoverEffect>
							<CardHeader>
								<CardTitle>엘리베이티드 + 호버</CardTitle>
								<CardDescription>엘리베이티드 + 호버 효과</CardDescription>
							</CardHeader>
							<CardContent>
								<p>카드 위에 마우스를 올려보세요.</p>
							</CardContent>
						</Card>
					</div>
				</section>

				{/* 액션 버튼 */}
				<section>
					<h2 className="mb-4 text-2xl font-semibold">액션 버튼</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<Card className="relative">
							<CardHeader>
								<CardTitle>액션 버튼 카드</CardTitle>
								<CardDescription>
									우측 상단에 액션 버튼이 있습니다.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p>이 카드에는 우측 상단에 액션 버튼이 포함되어 있습니다.</p>
							</CardContent>
							<CardActions>
								<CardAction onClick={() => alert('좋아요!')}>
									<HeartIcon className="h-4 w-4" />
								</CardAction>
								<CardAction onClick={() => alert('북마크!')}>
									<BookmarkIcon className="h-4 w-4" />
								</CardAction>
								<CardAction onClick={() => alert('공유!')}>
									<ShareIcon className="h-4 w-4" />
								</CardAction>
							</CardActions>
						</Card>

						<Card className="relative group" hoverEffect>
							<CardHeader>
								<CardTitle>호버 시 액션 표시</CardTitle>
								<CardDescription>
									마우스를 올리면 액션 버튼이 나타납니다.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p>카드 위에 마우스를 올려 액션 버튼을 확인하세요.</p>
							</CardContent>
							<CardActions className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
								<CardAction onClick={() => alert('좋아요!')}>
									<HeartIcon className="h-4 w-4" />
								</CardAction>
								<CardAction onClick={() => alert('북마크!')}>
									<BookmarkIcon className="h-4 w-4" />
								</CardAction>
							</CardActions>
						</Card>
					</div>
				</section>

				{/* 이미지 카드 */}
				<section>
					<h2 className="mb-4 text-2xl font-semibold">이미지 카드</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						<Card className="group overflow-hidden">
							<CardImage
								src="https://images.unsplash.com/photo-1579547945413-497e1b99dac0"
								alt="산 풍경"
							/>
							<CardHeader>
								<div className="flex justify-between items-center">
									<CardTitle>산 풍경</CardTitle>
									<CardBadge>자연</CardBadge>
								</div>
								<CardDescription>아름다운 산 풍경 사진</CardDescription>
							</CardHeader>
							<CardContent>
								<p>고요한 산과 푸른 하늘이 어우러진 풍경입니다.</p>
							</CardContent>
						</Card>

						<Card className="group overflow-hidden" hoverEffect>
							<CardImage
								src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05"
								alt="숲 풍경"
							/>
							<CardHeader>
								<div className="flex justify-between items-center">
									<CardTitle>숲 풍경</CardTitle>
									<CardBadge variant="success">여행</CardBadge>
								</div>
								<CardDescription>신비로운 숲 풍경 사진</CardDescription>
							</CardHeader>
							<CardContent>
								<p>울창한 숲과 안개가 어우러진 신비로운 풍경입니다.</p>
							</CardContent>
							<CardActions className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
								<CardAction onClick={() => alert('좋아요!')}>
									<HeartIcon className="h-4 w-4" />
								</CardAction>
								<CardAction onClick={() => alert('북마크!')}>
									<BookmarkIcon className="h-4 w-4" />
								</CardAction>
							</CardActions>
						</Card>

						<Card className="group overflow-hidden" hoverEffect>
							<CardImage
								src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
								alt="호수 풍경"
							/>
							<CardHeader>
								<div className="flex justify-between items-center">
									<CardTitle>호수 풍경</CardTitle>
									<CardBadge variant="warning">인기</CardBadge>
								</div>
								<CardDescription>평화로운 호수 풍경 사진</CardDescription>
							</CardHeader>
							<CardContent>
								<p>잔잔한 호수와 나무가 어우러진 평화로운 풍경입니다.</p>
							</CardContent>
							<CardActions className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
								<CardAction onClick={() => alert('좋아요!')}>
									<HeartIcon className="h-4 w-4" />
								</CardAction>
								<CardAction onClick={() => alert('북마크!')}>
									<BookmarkIcon className="h-4 w-4" />
								</CardAction>
							</CardActions>
						</Card>
					</div>
				</section>
			</div>
		</div>
	);
}
