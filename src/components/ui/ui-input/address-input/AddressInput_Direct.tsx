/* 
  파일명: /address-input/AddressInput_Direct.tsx
  기능: 직접 입력 방식 주소 입력 컴포넌트
  책임: API 없이 사용자가 직접 주소를 텍스트로 입력
*/ // ------------------------------

import React, { useState, useCallback } from 'react';
import { MapPin, X } from 'lucide-react';

import type { AddressInput_DirectProps, DirectAddressData } from './types';

// #region 타입 정의
// 내부 상태 관리용 인터페이스
interface AddressFields {
  fullAddress: string;
}
// #endregion

export const AddressInput_Direct: React.FC<AddressInput_DirectProps> = ({
  placeholder = '주소를 직접 입력하세요',
  disabled = false,
  className = '',
  value,
  onChange,
  onClear,
  addressPlaceholder,
  showClearButton = true
}) => {
  // #region 상태
  const [addressFields, setAddressFields] = useState<AddressFields>(() => ({
    fullAddress: value?.fullAddress || ''
  }));
  // #endregion

  // DirectAddressData 생성
  const createAddressData = useCallback((fields: AddressFields): DirectAddressData => {
    return {
      fullAddress: fields.fullAddress,
      postalCode: undefined,
      coordinates: undefined, // 직접입력에서는 좌표 정보 없음
      rawData: {
        inputMethod: 'manual',
        timestamp: Date.now()
      }
    };
  }, []);

  // 주소 필드 변경 핸들러
  const handleFieldChange = useCallback((field: keyof AddressFields, newValue: string) => {
    const updatedFields = {
      ...addressFields,
      [field]: newValue
    };
    
    setAddressFields(updatedFields);
    
    // fullAddress가 있을 때만 유효한 주소로 간주
    if (updatedFields.fullAddress.trim()) {
      const addressData = createAddressData(updatedFields);
      onChange?.(addressData);
    } else {
      // fullAddress가 비어있으면 null 전달
      onChange?.(null);
    }
  }, [addressFields, createAddressData, onChange]);

  // 주소 초기화
  const handleClear = useCallback(() => {
    const emptyFields: AddressFields = {
      fullAddress: ''
    };
    
    setAddressFields(emptyFields);
    onChange?.(null);
    onClear?.();
  }, [onChange, onClear]);
  // #endregion

  // #region 렌더링
  const hasAddress = addressFields.fullAddress.trim() !== '';
  const effectivePlaceholder = addressPlaceholder || placeholder;

  return (
    <div className={`relative ${className}`}>
      <MapPin className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-muted-foreground" />
      
      <input
        type="text"
        value={addressFields.fullAddress}
        onChange={(e) => handleFieldChange('fullAddress', e.target.value)}
        placeholder={effectivePlaceholder}
        disabled={disabled}
        className={`
          w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border transition-colors
          ${disabled 
            ? 'bg-muted text-muted-foreground cursor-not-allowed border-border/50' 
            : 'bg-background border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'
          }
        `}
      />
      
      {hasAddress && showClearButton && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 w-4 h-4 transition-colors transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
  // #endregion
};
