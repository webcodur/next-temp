'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
	children: React.ReactNode;
	containerId?: string;
}

export const Portal: React.FC<PortalProps> = ({ 
	children, 
	containerId = 'portal-root' 
}) => {
	const [container, setContainer] = useState<HTMLElement | null>(null);

	useEffect(() => {
		// 기존 컨테이너 찾기 또는 새로 생성
		let portalContainer = document.getElementById(containerId);
		
		if (!portalContainer) {
			portalContainer = document.createElement('div');
			portalContainer.id = containerId;
			portalContainer.style.position = 'relative';
			portalContainer.style.zIndex = '9999';
			document.body.appendChild(portalContainer);
		}

		setContainer(portalContainer);

		// 클린업 함수 개선 - setTimeout으로 지연 제거
		return () => {
			// 다른 Portal들이 사용 중일 수 있으므로 지연 후 확인
			setTimeout(() => {
				const currentContainer = document.getElementById(containerId);
				if (currentContainer && currentContainer.children.length === 0) {
					document.body.removeChild(currentContainer);
				}
			}, 100); // 100ms 지연으로 다른 Portal들의 cleanup 대기
		};
	}, [containerId]);

	if (!container) {
		return null;
	}

	return createPortal(children, container);
}; 