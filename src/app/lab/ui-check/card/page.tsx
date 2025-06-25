'use client';

import * as React from 'react';
import { Heart, Bookmark, Share } from 'lucide-react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	CardActions,
	CardAction,
} from '@/components/ui/card/Card';

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

						<Card variant="outline-solid">
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

						<Card variant="outline-solid" hoverEffect>
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
									<Heart className="w-4 h-4" />
								</CardAction>
								<CardAction onClick={() => alert('북마크!')}>
									<Bookmark className="w-4 h-4" />
								</CardAction>
								<CardAction onClick={() => alert('공유!')}>
									<Share className="w-4 h-4" />
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
							<CardActions className="transition-opacity duration-200 opacity-0 group-hover:opacity-100">
								<CardAction onClick={() => alert('좋아요!')}>
									<Heart className="w-4 h-4" />
								</CardAction>
								<CardAction onClick={() => alert('북마크!')}>
									<Bookmark className="w-4 h-4" />
								</CardAction>
							</CardActions>
						</Card>
					</div>
				</section>
			</div>
		</div>
	);
}
