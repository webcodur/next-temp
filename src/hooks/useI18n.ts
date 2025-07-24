/* 
  파일명: /hooks/useI18n.ts
  기능: 다국어 지원 훅
  책임: 언어 설정 관리, 메시지 번역, 로컬스토리지 연동
  
  주요 기능:
  - 로컬스토리지에서 저장된 언어 설정 로드
  - 브라우저 언어 자동 감지
  - 언어 변경 시 페이지 리로드 처리
  - 현재 언어에 맞는 메시지 파일 동적 로드
  - 변수 치환 기능이 있는 번역 함수 제공
*/ // ------------------------------

'use client';

import { useState, useEffect } from 'react';
import {
	type Locale,
	locales,
	defaultLocale,
	localeMetadata,
} from '@/lib/i18n';

// 로컬 스토리지 키
const LOCALE_STORAGE_KEY = 'preferred-locale';

// 현재 언어 설정 관리 훅
export const useLocale = () => {
	const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale);

	// 초기 언어 설정 로드
	useEffect(() => {
		const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
		if (stored && locales.includes(stored as Locale)) {
			setCurrentLocale(stored as Locale);
		} else {
			// 브라우저 언어 감지
			const browserLang = navigator.language.split('-')[0];
			if (locales.includes(browserLang as Locale)) {
				setCurrentLocale(browserLang as Locale);
			}
		}
	}, []);

	// 언어 변경 함수 (페이지 리로드로 next-intl 적용)
	const changeLocale = (locale: Locale) => {
		setCurrentLocale(locale);
		localStorage.setItem(LOCALE_STORAGE_KEY, locale);
		window.location.reload();
	};

	return {
		currentLocale,
		changeLocale,
		localeMetadata: localeMetadata[currentLocale],
		allLocaleMetadata: localeMetadata,
		availableLocales: locales,
		supportedLocales: locales,
		isRTL: localeMetadata[currentLocale].dir === 'rtl',
	};
};

// 다국어 메시지 훅 (평면 구조)
export const useTranslations = () => {
	const { currentLocale } = useLocale();
	const [messages, setMessages] = useState<Record<string, string>>({});

	useEffect(() => {
		const loadMessages = async () => {
			try {
				const messageModule = await import(`../locales/${currentLocale}.json`);
				setMessages(messageModule.default);
			} catch (error) {
				console.error('Failed to load messages:', error);
			}
		};

		loadMessages();
	}, [currentLocale]);

	// 번역 함수 (한국어 키 직접 사용, 변수 치환 지원)
	const t = (key: string, values?: Record<string, string | number>) => {
		const result = messages[key];

		// 값이 없으면 키 반환
		if (!result) {
			return key;
		}

		// 변수 치환
		if (values) {
			return result.replace(/\{(\w+)\}/g, (match, varName) => {
				return values[varName]?.toString() || match;
			});
		}

		return result;
	};

	return t;
};
