import { useState, useEffect, useCallback } from 'react';
import { FunctionModeState, GlobalFunctionMode } from '../types';
import {
	saveViewModePreferences,
	loadViewModePreferences,
} from '../utils/viewModeConfig';

// #region 기능 모드 상태 관리 훅
export const useFunctionMode = () => {
	const [functionModeState, setFunctionModeState] = useState<FunctionModeState>(
		{
			globalMode: 'barrier-operation',
		}
	);

	// 초기 로드 시 저장된 설정 불러오기
	useEffect(() => {
		const savedPreferences = loadViewModePreferences();
		const savedMode =
			(savedPreferences._functionMode as GlobalFunctionMode) ||
			'barrier-operation';
		setFunctionModeState((prev) => ({
			...prev,
			globalMode: savedMode,
		}));
	}, []);

	// 전역 모드 설정
	const setGlobalFunctionMode = useCallback((mode: GlobalFunctionMode) => {
		setFunctionModeState((prev) => ({
			...prev,
			globalMode: mode,
		}));

		// 설정 저장
		const currentPreferences = loadViewModePreferences();
		saveViewModePreferences({
			...currentPreferences,
			_functionMode: mode,
		});
	}, []);

	return {
		functionModeState,
		setGlobalFunctionMode,
	};
};
// #endregion
