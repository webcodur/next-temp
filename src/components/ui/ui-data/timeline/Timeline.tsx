import React from 'react';
import { useLocale } from '@/hooks/useI18n';

export interface TimelineItem {
	id: string;
	title: string;
	content: string;
	timestamp: string;
	status?: 'completed' | 'current' | 'upcoming';
	icon?: React.ReactNode;
}

interface TimelineProps {
	items: TimelineItem[];
	orientation?: 'vertical' | 'horizontal';
	className?: string;
}

const Timeline: React.FC<TimelineProps> = ({
	items,
	orientation = 'vertical',
	className = '',
}) => {
	const { isRTL } = useLocale();

	const getStatusColor = (status?: string) => {
		switch (status) {
			case 'completed':
				return 'bg-green-500';
			case 'current':
				return 'bg-blue-500';
			case 'upcoming':
				return 'bg-gray-300';
			default:
				return 'bg-primary';
		}
	};

	if (orientation === 'vertical') {
		return (
			<div className={`relative ${className}`}>
				{/* 세로 타임라인 선 */}
				<div className={`absolute top-0 bottom-0 flex justify-center w-2 ${isRTL ? 'end-5' : 'start-5'}`}>
					<div className="w-0.5 bg-border"></div>
				</div>

				{/* 타임라인 항목들 */}
				<div className="space-y-8">
									{items.map((item) => (
					<div key={item.id} className="relative">
							{/* 아이콘 */}
							<div className={`absolute top-2 ${isRTL ? 'end-8' : 'start-8'}`}>
								<div className={`w-4 h-4 rounded-full ${getStatusColor(item.status)} flex items-center justify-center`}>
									{item.icon && (
										<span className="text-white text-xs">
											{item.icon}
										</span>
									)}
								</div>
							</div>

							{/* 시간 표시 점 */}
							<div className={`absolute top-1/2 ${isRTL ? 'end-1/2' : 'start-1/2'} w-1.5 h-1.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${getStatusColor(item.status)}`}></div>

							{/* 콘텐츠 */}
							<div className={`${isRTL ? 'pe-16' : 'ps-16'} pb-8`}>
								<div className="neu-flat rounded-lg p-4 bg-background">
									<div className="flex items-start justify-between mb-2">
										<h3 className="text-lg font-semibold text-foreground font-multilang">
											{item.title}
										</h3>
										<span className="text-sm text-muted-foreground font-multilang">
											{item.timestamp}
										</span>
									</div>
									<p className="text-foreground font-multilang">
										{item.content}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	// 가로 타임라인
	return (
		<div className={`relative ${className}`}>
			{/* 가로 타임라인 선 */}
			<div className="absolute top-8 start-0 end-0 h-0.5 bg-border"></div>

			{/* 타임라인 항목들 */}
			<div className="flex justify-between items-start">
							{items.map((item) => (
				<div key={item.id} className="relative flex-1 text-center">
						{/* 아이콘 */}
						<div className="relative mb-4">
							<div className={`w-8 h-8 rounded-full ${getStatusColor(item.status)} flex items-center justify-center mx-auto`}>
								{item.icon && (
									<span className="text-white text-sm">
										{item.icon}
									</span>
								)}
							</div>
						</div>

						{/* 콘텐츠 */}
						<div className="neu-flat rounded-lg p-4 bg-background">
							<h3 className="text-md font-semibold text-foreground font-multilang mb-2">
								{item.title}
							</h3>
							<p className="text-sm text-foreground font-multilang mb-2">
								{item.content}
							</p>
							<span className="text-xs text-muted-foreground font-multilang">
								{item.timestamp}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Timeline;
