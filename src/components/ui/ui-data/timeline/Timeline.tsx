import React from 'react';

export interface TimelineEvent {
	id: string;
	title: string;
	timestamp: string;
	description?: string;
}

export interface TimelineProps {
	events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
	return (
		<div className="p-6 rounded-lg neu-flat">
			<ul className="relative">
				{/* 뉴모피즘 타임라인 라인 - 강화된 음각 홈 */}
				<div className="absolute top-0 bottom-0 flex justify-center w-2 left-5">
					<div
						className="w-0.5 h-full rounded-full"
						style={{
							background:
								'linear-gradient(135deg, hsl(var(--muted) / 0.4), hsl(var(--card) / 0.8))',
							boxShadow: `
								inset 2px 0 4px rgba(var(--nm-dark-rgba)),
								inset -2px 0 4px rgba(var(--nm-light-rgba)),
								inset 0 2px 2px rgba(var(--nm-dark-rgba))
							`,
						}}
					/>
				</div>

				{events.map((event) => (
					<li key={event.id} className="relative mb-8 ms-12">
						{/* 뉴모피즘 원형 점 - 정확한 중앙 정렬 */}
						<div className="absolute top-2 -left-8">
							<div
								className="w-4 h-4 transition-all duration-200 rounded-full cursor-pointer"
								style={{
									background:
										'linear-gradient(135deg, hsl(var(--card) / 0.95), hsl(var(--muted) / 0.8))',
									border: '1px solid hsl(var(--border) / 0.6)',
									boxShadow: `
										2px 2px 4px rgba(var(--nm-dark-rgba)),
										-1px -1px 3px rgba(var(--nm-light-rgba)),
										inset 1px 1px 2px rgba(var(--nm-light-rgba)),
										inset -1px -1px 2px rgba(var(--nm-dark-rgba))
									`,
								}}>
								{/* 중앙 액센트 점 */}
								<div
									className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full transform -translate-x-1/2 -translate-y-1/2"
									style={{
										background: 'hsl(var(--brand) / 0.8)',
										boxShadow: 'inset 0 0 2px rgba(var(--nm-dark-rgba))',
									}}
								/>
							</div>
						</div>

						{/* 이벤트 컨테이너 */}
						<div className="p-4 transition-all duration-200 rounded-lg neu-flat hover:shadow-md">
							<time className="block mb-2 text-sm font-medium text-muted-foreground">
								{event.timestamp}
							</time>
							<h3 className="mb-1 text-lg font-semibold text-foreground">
								{event.title}
							</h3>
							{event.description && (
								<p className="text-sm leading-relaxed text-muted-foreground">
									{event.description}
								</p>
							)}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Timeline;
