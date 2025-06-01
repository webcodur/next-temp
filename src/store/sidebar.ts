import { atom } from 'jotai';

export const sidebarCollapsedAtom = atom<boolean>(false);

// #region Breadcrumb 상태 관리
export const currentTopMenuAtom = atom<string>('');
export const currentMidMenuAtom = atom<string>('');
export const currentBotMenuAtom = atom<string>('');
// #endregion
