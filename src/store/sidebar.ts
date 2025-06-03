import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const sidebarCollapsedAtom = atom<boolean>(false);
export const headerCollapsedAtom = atom<boolean>(false);

export const currentTopMenuAtom = atom<string>('');
export const currentMidMenuAtom = atom<string>('');
export const currentBotMenuAtom = atom<string>('');
export const singleOpenModeAtom = atomWithStorage<boolean>(
	'singleOpenMode',
	false
);
