/**
 * 현장 정보 관리
 * 언어팩 키: 사이트_이름, 사이트_주소, 사이트_관리자
 */
export const siteData = {
	name: '스마트빌 아파트', // t('사이트_이름')
	code: 'SMART001',
	address: '서울시 강남구 테헤란로 123', // t('사이트_주소')
	contact: '02-1234-5678',
	manager: '김관리', // t('사이트_관리자')
};

export type SiteData = typeof siteData;
