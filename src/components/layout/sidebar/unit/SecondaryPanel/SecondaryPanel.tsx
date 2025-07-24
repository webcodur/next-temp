/* 
  파일명: /components/layout/sidebar/unit/SecondaryPanel/SecondaryPanel.tsx
  기능: 사이드바의 세컨더리 패널 컴포넌트
  책임: 확장된 메뉴 트리와 네비게이션 링크를 제공하는 패널 (DND 지원, 리사이즈 가능)
*/
'use client';

import { useEffect, useState } from 'react';

import { useAtom } from 'jotai';
import { ChevronsUpDown, Focus, Layers } from 'lucide-react';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useTranslations } from '@/hooks/useI18n';
import { useMenuData } from '@/hooks/useMenuData';
import { useDragAndDropMenu, getBotMenuId, getMidMenuId } from '@/hooks/useDragAndDropMenu';
import { activeTopMenuAtom, endPanelWidthAtom } from '@/store/sidebar';
import { defaults } from '@/data/sidebarConfig';

import { Button } from '@/components/ui/ui-input/button/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/ui-effects/tooltip/Tooltip';

import type { MidMenu } from '@/components/layout/sidebar/types';

import { useSecondaryMenu } from '../useSecondaryMenu';
import { SortableMidMenu } from './SortableMidMenu/SortableMidMenu';
import { ResizeHandle } from '../ResizeHandle/ResizeHandle';

function SecondaryPanel() {
	// #region 훅
	const t = useTranslations();
	const { menuData, loading, error } = useMenuData();
	const [activeTopMenu] = useAtom(activeTopMenuAtom);
	const [endPanelWidth] = useAtom(endPanelWidthAtom);
	const [localMidItems, setLocalMidItems] = useState<{ [key: string]: MidMenu }>({});

	const {
		midExpanded,
		singleOpenMode,
		handleMidClick,
		handleSingleOpenToggle,
		handleExpandAll,
		handleCollapseAll,
		initializeExpandedState,
	} = useSecondaryMenu();

	const {
		isOrderUpdating,
		handleDragEnd,
	} = useDragAndDropMenu();

	// DND 센서 설정 (클릭과 드래그 구분)
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5, // 5px 이동 후 드래그 시작
			},
		})
	);
	// #endregion

	// #region 상수
	const topData = menuData[activeTopMenu];
	// #endregion

	// #region 효과
	useEffect(() => {
		if (topData) {
			setLocalMidItems(topData.midItems);
			const allMidKeys = Object.keys(topData.midItems);
			initializeExpandedState(allMidKeys);
		}
	}, [activeTopMenu, topData, initializeExpandedState]);
	// #endregion

	// #region 유틸리티
	const handleExpandCollapseClick = () => {
		const allMidKeys = Object.keys(localMidItems);
		const areAllExpanded = allMidKeys.length > 0 && allMidKeys.every((key) => midExpanded.has(key));
		
		if (areAllExpanded) {
			handleCollapseAll();
		} else {
			handleExpandAll(allMidKeys);
		}
	};

	// 로컬 메뉴 아이템 순서 업데이트
	const handleMidItemsReorder = (newMidItems: { [key: string]: MidMenu }) => {
		setLocalMidItems(newMidItems);
	};

	// 동적 메뉴 여부 확인 (연구소와 temp 메뉴는 정적, 나머지는 동적)
	const isDynamicMenu = (topMenuKey: string) => {
		return topMenuKey !== '연구소' && topMenuKey !== 'temp';
	};

	// 모든 bot 메뉴 ID 수집 (동적 메뉴만)
	const getAllBotMenuIds = () => {
		const ids: string[] = [];
		Object.entries(localMidItems).forEach(([midKey, midItem]) => {
			// 동적 메뉴인 경우만 DND ID 추가
			if (isDynamicMenu(activeTopMenu)) {
				midItem.botItems.forEach(botItem => {
					ids.push(getBotMenuId(midKey, botItem.key));
				});
			}
		});
		return ids;
	};

	// 모든 드래그 가능한 아이템 ID 수집 (mid + bot)
	const getAllDragableIds = () => {
		const ids: string[] = [];
		
		// 동적 메뉴인 경우만 처리
		if (isDynamicMenu(activeTopMenu)) {
			// Mid 메뉴 ID들 추가
			Object.keys(localMidItems).forEach(midKey => {
				ids.push(getMidMenuId(midKey));
			});
			
			// Bot 메뉴 ID들 추가
			ids.push(...getAllBotMenuIds());
		}
		
		return ids;
	};
	// #endregion

	// #region 렌더링
	if (loading) {
		return (
			<div
				style={{ width: `${endPanelWidth}px` }}
				className="flex relative flex-col h-full border-e border-border/20 bg-surface-2 sidebar-container">
				<div className="flex justify-center items-center h-full">
					<div className="w-8 h-8 rounded-full border-b-2 animate-spin border-primary"></div>
				</div>
				<ResizeHandle minWidth={defaults.minResizeWidth} maxWidth={defaults.maxResizeWidth} />
			</div>
		);
	}

	if (error) {
		return (
			<div
				style={{ width: `${endPanelWidth}px` }}
				className="flex relative flex-col h-full border-e border-border/20 bg-surface-2 sidebar-container">
				<div className="flex flex-col justify-center items-center p-4 h-full">
					<div className="text-sm text-center text-red-500">
						메뉴 로딩 실패
					</div>
					<div className="mt-2 text-xs text-center text-muted-foreground">
						{error}
					</div>
				</div>
				<ResizeHandle minWidth={defaults.minResizeWidth} maxWidth={defaults.maxResizeWidth} />
			</div>
		);
	}

	if (!topData) return null;

	const allMidKeys = Object.keys(localMidItems);
	const areAllExpanded = allMidKeys.length > 0 && allMidKeys.every((key) => midExpanded.has(key));

	return (
		<TooltipProvider delayDuration={100}>
			<div
				style={{ width: `${endPanelWidth}px` }}
				className="flex relative flex-col h-full border-e border-border/20 bg-surface-2 sidebar-container">
				{/* Menu Controls */}
				<div className="flex flex-shrink-0 justify-between items-center px-4 h-14 border-b border-border/50">
					{/* Mode Toggle */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleSingleOpenToggle}>
								{singleOpenMode ? (
									<Focus className="w-5 h-5 text-primary" />
								) : (
									<Layers className="w-5 h-5 text-muted-foreground" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom" align="start">
							{singleOpenMode ? t('메뉴_다중열기모드') : t('메뉴_단일열기모드')}
						</TooltipContent>
					</Tooltip>

					<h2 className="text-lg font-semibold text-foreground">{t(topData.key)}</h2>

					{/* Expand/Collapse All */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleExpandCollapseClick}>
								<ChevronsUpDown className="w-5 h-5 text-muted-foreground" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom" align="end">
							{areAllExpanded ? t('메뉴_전체접기') : t('메뉴_전체펼치기')}
						</TooltipContent>
					</Tooltip>
				</div>

				{/* Menu List with DND */}
				{isDynamicMenu(activeTopMenu) ? (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={(event) => handleDragEnd(event, localMidItems, handleMidItemsReorder)}
					>
						<div className="overflow-y-auto flex-1 p-4 space-y-2">
							{/* 순서 업데이트 중 표시 */}
							{isOrderUpdating && (
								<div className="p-2 mb-2 bg-blue-50 rounded-lg border border-blue-200">
									<div className="flex gap-2 items-center text-sm text-blue-700">
										<div className="w-3 h-3 rounded-full border-b border-blue-700 animate-spin"></div>
										메뉴 순서 저장 중...
									</div>
								</div>
							)}

							<SortableContext 
								items={getAllDragableIds()} 
								strategy={verticalListSortingStrategy}
							>
								{Object.entries(localMidItems).map(([midKey, midItem]) => (
									<SortableMidMenu
										key={midKey}
										midKey={midKey}
										midItem={midItem}
										isExpanded={midExpanded.has(midKey)}
										onToggle={() => handleMidClick(midKey)}
										isDynamic={true}
									/>
								))}
							</SortableContext>
						</div>
					</DndContext>
				) : (
					/* 정적 메뉴 (DND 없음) */
					<div className="overflow-y-auto flex-1 p-4 space-y-2">
						{Object.entries(localMidItems).map(([midKey, midItem]) => (
							<SortableMidMenu
								key={midKey}
								midKey={midKey}
								midItem={midItem}
								isExpanded={midExpanded.has(midKey)}
								onToggle={() => handleMidClick(midKey)}
								isDynamic={false}
							/>
						))}
					</div>
				)}

				{/* 리사이즈 핸들 */}
				<ResizeHandle minWidth={defaults.minResizeWidth} maxWidth={defaults.maxResizeWidth} />
			</div>
		</TooltipProvider>
	);
	// #endregion
}

export default SecondaryPanel; 