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

		// 클린업 함수 (컴포넌트 언마운트 시)
		return () => {
			// 컨테이너가 비어있으면 제거
			if (portalContainer && portalContainer.children.length === 0) {
				document.body.removeChild(portalContainer);
			}
		};
	}, [containerId]);

	if (!container) {
		return null;
	}

	return createPortal(children, container);
}; 