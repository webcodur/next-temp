/* 
  파일명: /utils/devAccounts.ts
  기능: 개발자 모드 계정 정보를 환경변수에서 로드
  책임: 환경변수를 파싱하여 개발자 계정 배열을 생성한다.
*/

// #region 타입
export interface DevAccountSet {
	id: string;
	password: string;
	description: string;
}
// #endregion

// #region 환경변수 로더
export function loadDevAccounts(): DevAccountSet[] {
	const accounts: DevAccountSet[] = [];
	
	// 계정 1
	const id1 = process.env.NEXT_PUBLIC_DEV_ACCOUNT_1_ID;
	const password1 = process.env.NEXT_PUBLIC_DEV_ACCOUNT_1_PASSWORD;
	const description1 = process.env.NEXT_PUBLIC_DEV_ACCOUNT_1_DESCRIPTION;
	if (id1 && password1 && description1) {
		accounts.push({ id: id1, password: password1, description: description1 });
	}
	
	// 계정 2
	const id2 = process.env.NEXT_PUBLIC_DEV_ACCOUNT_2_ID;
	const password2 = process.env.NEXT_PUBLIC_DEV_ACCOUNT_2_PASSWORD;
	const description2 = process.env.NEXT_PUBLIC_DEV_ACCOUNT_2_DESCRIPTION;
	if (id2 && password2 && description2) {
		accounts.push({ id: id2, password: password2, description: description2 });
	}
	
	// 계정 3
	const id3 = process.env.NEXT_PUBLIC_DEV_ACCOUNT_3_ID;
	const password3 = process.env.NEXT_PUBLIC_DEV_ACCOUNT_3_PASSWORD;
	const description3 = process.env.NEXT_PUBLIC_DEV_ACCOUNT_3_DESCRIPTION;
	if (id3 && password3 && description3) {
		accounts.push({ id: id3, password: password3, description: description3 });
	}
	
	// 빌드 시에는 로그 출력하지 않음
	if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
		if (accounts.length === 0) {
			console.warn('⚠️ 개발자 계정 환경변수가 설정되지 않음');
		} else {
			console.log(`✅ 개발자 계정 ${accounts.length}개 로드됨`);
		}
	}
	
	return accounts;
}