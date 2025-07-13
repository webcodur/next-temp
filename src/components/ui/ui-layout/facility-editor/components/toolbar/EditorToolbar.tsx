// 에디터 툴바 컴포넌트

import { Save, Undo2, Redo2, Grid, Type, Lock, Unlock, Keyboard, Wand2 } from 'lucide-react';
import { clsx } from 'clsx';
import { EditorState } from '@/types/facility';

interface EditorToolbarProps {
	editorState: EditorState;
	canUndo: boolean;
	canRedo: boolean;
	onModeChange: (mode: EditorState['mode']) => void;
	onToggleLock: () => void;
	onUndo: () => void;
	onRedo: () => void;
	onToggleHelp: () => void;
	onSave: () => void;
	onShowBatchNaming: () => void;
}

export const EditorToolbar = ({
	editorState,
	canUndo,
	canRedo,
	onModeChange,
	onToggleLock,
	onUndo,
	onRedo,
	onToggleHelp,
	onSave,
	onShowBatchNaming,
}: EditorToolbarProps) => {
	return (
		<div className="flex justify-between items-center p-4 rounded-lg neu-flat">
			<div className="flex gap-2">
				<button
					onClick={() => onModeChange('sector')}
					className={clsx(
						'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
						editorState.mode === 'sector' ? 'neu-inset text-primary' : 'neu-raised hover:scale-105'
					)}
				>
					<Grid className="w-4 h-4" />
					<span className="font-multilang">편집_섹터모드</span>
				</button>
				<button
					onClick={() => onModeChange('naming')}
					className={clsx(
						'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
						editorState.mode === 'naming' ? 'neu-inset text-primary' : 'neu-raised hover:scale-105'
					)}
				>
					<Type className="w-4 h-4" />
					<span className="font-multilang">편집_이름모드</span>
				</button>
			</div>
			
			<div className="flex gap-2">
				<button
					onClick={onUndo}
					disabled={!canUndo}
					className={clsx(
						'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
						!canUndo 
							? 'opacity-50 cursor-not-allowed' 
							: 'neu-raised hover:scale-105'
					)}
				>
					<Undo2 className="w-4 h-4" />
					<span className="font-multilang">편집_실행취소</span>
				</button>
				<button
					onClick={onRedo}
					disabled={!canRedo}
					className={clsx(
						'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
						!canRedo
							? 'opacity-50 cursor-not-allowed' 
							: 'neu-raised hover:scale-105'
					)}
				>
					<Redo2 className="w-4 h-4" />
					<span className="font-multilang">편집_다시실행</span>
				</button>
				<button
					onClick={onToggleHelp}
					className="flex gap-2 items-center px-4 py-2 rounded-lg transition-all neu-raised hover:scale-105"
				>
					<Keyboard className="w-4 h-4" />
					<span className="font-multilang">편집_단축키</span>
				</button>
				<button
					onClick={onSave}
					className="flex gap-2 items-center px-4 py-2 text-white rounded-lg transition-all neu-raised hover:scale-105 bg-primary"
				>
					<Save className="w-4 h-4" />
					<span className="font-multilang">편집_저장</span>
				</button>
				<button
					onClick={onToggleLock}
					className={clsx(
						'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
						editorState.isLocked ? 'neu-inset text-primary' : 'neu-raised hover:scale-105'
					)}
				>
					{editorState.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
					<span className="font-multilang">{editorState.isLocked ? '잠금됨' : '잠금해제'}</span>
				</button>
				<button
					onClick={onShowBatchNaming}
					className="px-4 py-2 rounded-lg neu-raised hover:scale-105 flex items-center gap-2 font-multilang"
				>
					<Wand2 className="w-4 h-4" />
					일괄 이름 설정
				</button>
			</div>
		</div>
	);
}; 