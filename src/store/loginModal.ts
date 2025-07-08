import { atom } from 'jotai';

// 로그인 모달 열림 여부
export const loginModalOpenAtom = atom(false);

// 모달 열기 - write only
export const openLoginModalAtom = atom(null, (_get, set) => {
  set(loginModalOpenAtom, true);
});

// 모달 닫기 - write only
export const closeLoginModalAtom = atom(null, (_get, set) => {
  set(loginModalOpenAtom, false);
}); 