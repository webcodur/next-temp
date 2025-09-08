import React, { useState, useCallback } from 'react';
import { Globe2, MapPin } from 'lucide-react';

import { useRegionDetection } from './hooks/useRegionDetection';
import { AddressInput_KOR } from './AddressInput_KOR';
import { AddressInput_Global } from './AddressInput_Global';

import type { 
  AddressInputProps, 
  AddressData, 
  GlobalAddressData, 
  ENUM_Region 
} from './types';

/**
 * 지역별 주소 입력 통합 컴포넌트
 * 
 * 기능:
 * - 자동 지역 감지 (한국/해외)
 * - 한국: Daum 우편번호 서비스
 * - 해외: 기본 텍스트 입력 또는 글로벌 서비스
 * - 수동 지역 변경 기능
 */
export const AddressInput: React.FC<AddressInputProps> = ({
  label = '주소',
  disabled = false,
  className = '',
  colorVariant = 'primary',
  value,
  onChange,
  onClear,
  forceRegion,
  autoDetectRegion = true,
  daumOptions = {},
  globalOptions = {},
  showRegionSelector = false,
  showClearButton = true
}) => {
  const [manualRegion, setManualRegion] = useState<ENUM_Region | undefined>();
  
  // 지역 감지
  const { 
    detection, 
    isLoading: isDetecting, 
    error: detectionError,
    setRegion 
  } = useRegionDetection(forceRegion, autoDetectRegion);

  // 최종 사용할 지역 결정
  const currentRegion: ENUM_Region = manualRegion || detection.region;

  // 지역 수동 변경 핸들러
  const handleRegionChange = useCallback((region: ENUM_Region) => {
    setManualRegion(region);
    setRegion(region);
    
    // 지역이 변경되면 주소 초기화
    onChange?.(null);
    onClear?.();
  }, [setRegion, onChange, onClear]);

  // 주소 변경 핸들러 (타입 안전성을 위한 래퍼)
  const handleAddressChange = useCallback((address: AddressData | GlobalAddressData | null) => {
    onChange?.(address);
  }, [onChange]);

  // 한국 주소 변경 핸들러
  const handleKoreaAddressChange = useCallback((address: AddressData | null) => {
    handleAddressChange(address);
  }, [handleAddressChange]);

  // 글로벌 주소 변경 핸들러
  const handleGlobalAddressChange = useCallback((address: GlobalAddressData | null) => {
    handleAddressChange(address);
  }, [handleAddressChange]);

  // 지역별 레이블 생성
  const getLabel = (): string => {
    if (typeof label !== 'string') return label;
    if (label !== '주소' && label !== 'Address') return label;
    
    return currentRegion === 'korea' ? '주소' : 'Address';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 지역 선택 UI */}
      {showRegionSelector && !forceRegion && (
        <div className="flex justify-between items-center p-3 rounded-lg border bg-muted/30 border-border/50">
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium text-foreground">
              주소 형식
            </div>
            <div className="text-xs text-muted-foreground">
              {detectionError ? (
                '자동 감지 실패'
              ) : isDetecting ? (
                '감지 중...'
              ) : (
                `자동 감지: ${currentRegion === 'korea' ? '한국' : '해외'} (신뢰도: ${Math.round(detection.confidence * 100)}%)`
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleRegionChange('korea')}
              disabled={disabled}
              className={`
                px-3 py-1.5 text-xs font-medium rounded transition-colors
                ${currentRegion === 'korea'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background border border-border text-muted-foreground hover:text-foreground'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <MapPin className="inline mr-1 w-3 h-3" />
              한국
            </button>
            
            <button
              type="button"
              onClick={() => handleRegionChange('global')}
              disabled={disabled}
              className={`
                px-3 py-1.5 text-xs font-medium rounded transition-colors
                ${currentRegion === 'global'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background border border-border text-muted-foreground hover:text-foreground'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <Globe2 className="inline mr-1 w-3 h-3" />
              해외
            </button>
          </div>
        </div>
      )}

      {/* 지역별 주소 입력 컴포넌트 */}
      {currentRegion === 'korea' ? (
        <AddressInput_KOR
          label={getLabel()}
          disabled={disabled}
          colorVariant={colorVariant}
          value={value && 'rawData' in value ? value as AddressData : null}
          onChange={handleKoreaAddressChange}
          onClear={onClear}
          showClearButton={showClearButton}
          {...daumOptions}
        />
      ) : (
        <AddressInput_Global
          label={getLabel()}
          disabled={disabled}
          colorVariant={colorVariant}
          value={value && !('rawData' in value) ? value as GlobalAddressData : null}
          onChange={handleGlobalAddressChange}
          onClear={onClear}
          showClearButton={showClearButton}
          {...globalOptions}
        />
      )}

      {/* 지역 감지 에러 표시 */}
      {detectionError && !forceRegion && (
        <div className="text-xs text-amber-600 dark:text-amber-400">
          ⚠️ {detectionError} 수동으로 지역을 선택해 주세요.
        </div>
      )}
    </div>
  );
};

export default AddressInput;
