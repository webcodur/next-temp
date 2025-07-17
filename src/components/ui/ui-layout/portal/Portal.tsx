/* 
  파일명: /components/ui/ui-layout/portal/Portal.tsx
  기능: React Portal을 사용하여 컴포넌트를 DOM 트리 외부에 렌더링
  책임: 모달, 토스트, 오버레이 등을 body에 직접 렌더링하여 z-index 문제 해결
*/

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// #region 타입
interface PortalProps {
	children: ReactNode;
	containerId?: string;
}
// #endregion

export function Portal({ children, containerId = 'portal-root' }: PortalProps) {
	// #region 상태
	const [mounted, setMounted] = useState(false);
	const [container, setContainer] = useState<HTMLElement | null>(null);
	// #endregion

	// #region 효과
	useEffect(() => {
		let portalContainer = document.getElementById(containerId);
		
		// 컨테이너가 없으면 생성
		if (!portalContainer) {
			portalContainer = document.createElement('div');
			portalContainer.id = containerId;
			document.body.appendChild(portalContainer);
		}

		setContainer(portalContainer);
		setMounted(true);

		// 클린업: 컴포넌트 언마운트 시 컨테이너 제거 (자식이 없을 때만)
		return () => {
			if (portalContainer && portalContainer.children.length === 0) {
				document.body.removeChild(portalContainer);
			}
		};
	}, [containerId]);
	// #endregion

	// #region 렌더링
	if (!mounted || !container) {
		return null;
	}

	return createPortal(children, container);
	// #endregion
} 