import { atom } from 'jotai';

// 현재 페이지 설명을 전역에서 공유하기 위한 atom
export const pageDescriptionAtom = atom<string>(''); 