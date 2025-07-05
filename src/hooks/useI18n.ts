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

/**
 * 현재 언어 설정 관리 훅
 */
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

	// 언어 변경 함수
	const changeLocale = (locale: Locale) => {
		setCurrentLocale(locale);
		localStorage.setItem(LOCALE_STORAGE_KEY, locale);

		// 페이지 리로드 (next-intl이 새 언어 적용하도록)
		window.location.reload();
	};

	return {
		currentLocale,
		changeLocale,
		localeMetadata: localeMetadata[currentLocale],
		availableLocales: locales,
		supportedLocales: locales,
		isRTL: localeMetadata[currentLocale].dir === 'rtl',
	};
};

/**
 * 다국어 메시지 훅 (평면 구조)
 */
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

	// 번역 함수 (한국어 키 직접 사용)
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
