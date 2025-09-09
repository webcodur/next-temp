/* 
  파일명: /address-input/AddressInput_Direct.tsx
  기능: 직접 입력 방식 주소 입력 컴포넌트
  책임: API 없이 사용자가 직접 주소를 텍스트로 입력
*/ // ------------------------------

import React, { useState, useCallback } from 'react';
import { MapPin, X } from 'lucide-react';

import { CountrySelector } from './CountrySelector';
import type { AddressInput_DirectProps, DirectAddressData } from './types';

// #region 타입 정의
// 내부 상태 관리용 인터페이스
interface AddressFields {
  fullAddress: string;
  country?: string;
}
// #endregion

export const AddressInput_Direct: React.FC<AddressInput_DirectProps> = ({
  placeholder = '주소를 직접 입력하세요',
  disabled = false,
  className = '',
  colorVariant = 'primary',
  value,
  onChange,
  onClear,
  addressPlaceholder,
  showClearButton = true,
  showCountrySelector = true,
  defaultCountry = 'KR',
  countries,
  enableCountryApi = true
}) => {
  // 초기값에서 국가 코드와 주소 분리
  const parseInitialValue = (val: typeof value) => {
    if (!val?.fullAddress) {
      return {
        address: '',
        country: val?.country || defaultCountry
      };
    }
    
    // [국가코드] 형식이 있는지 확인
    const countryMatch = val.fullAddress.match(/^\[([A-Z]{2,3})\]\s*(.*)$/);
    if (countryMatch) {
      return {
        address: countryMatch[2] || '',
        country: countryMatch[1]
      };
    }
    
    return {
      address: val.fullAddress,
      country: val.country || defaultCountry
    };
  };
  
  const initialParsed = parseInitialValue(value);
  
  // #region 상태
  const [addressFields, setAddressFields] = useState<AddressFields>(() => ({
    fullAddress: initialParsed.address,
    country: initialParsed.country
  }));
  const [selectedCountry, setSelectedCountry] = useState(initialParsed.country);
  // #endregion

  // DirectAddressData 생성
  const createAddressData = useCallback((fields: AddressFields, country: string): DirectAddressData => {
    // 국가 코드와 주소를 합쳐서 fullAddress 생성
    const combinedAddress = fields.fullAddress.trim() 
      ? `[${country}] ${fields.fullAddress}`
      : '';
    
    return {
      fullAddress: combinedAddress,
      country: country,
      postalCode: undefined,
      coordinates: undefined, // 직접입력에서는 좌표 정보 없음
      rawData: {
        inputMethod: 'manual',
        country: country,
        originalAddress: fields.fullAddress, // 원본 주소 저장
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
      const addressData = createAddressData(updatedFields, selectedCountry);
      onChange?.(addressData);
    } else {
      // fullAddress가 비어있으면 null 전달
      onChange?.(null);
    }
  }, [addressFields, selectedCountry, createAddressData, onChange]);

  // 주소 초기화
  const handleClear = useCallback(() => {
    const emptyFields: AddressFields = {
      fullAddress: '',
      country: selectedCountry
    };
    
    setAddressFields(emptyFields);
    onChange?.(null);
    onClear?.();
  }, [selectedCountry, onChange, onClear]);
  // #endregion

  // #region 렌더링
  const hasAddress = addressFields.fullAddress.trim() !== '';
  const effectivePlaceholder = addressPlaceholder || placeholder;

  // colorVariant에 따른 색상 클래스 생성
  const getColorClasses = () => {
    const baseColor = colorVariant === 'primary' ? 'primary' : 'secondary';
    return {
      ring: `focus:ring-${baseColor}/20`,
      border: `focus:border-${baseColor}`,
    };
  };
  
  const colorClasses = getColorClasses();

  // 국가 변경 핸들러
  const handleCountryChange = useCallback((countryCode: string) => {
    setSelectedCountry(countryCode);
    // 국가가 변경되면 기존 주소와 함께 업데이트
    if (addressFields.fullAddress.trim()) {
      const addressData = createAddressData(addressFields, countryCode);
      onChange?.(addressData);
    }
  }, [addressFields, createAddressData, onChange]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 국가 선택 - 고정 높이 */}
      <div className="grid items-center grid-cols-3 gap-3">
        <label className="text-sm font-medium text-foreground">국가</label>
        <div className="col-span-2">
          {showCountrySelector ? (
            <CountrySelector
              value={selectedCountry}
              onChange={handleCountryChange}
              disabled={disabled}
              colorVariant={colorVariant}
              countries={countries}
              enableCountryApi={enableCountryApi}
              showLabel={false}
            />
          ) : (
            <div className="h-12" />
          )}
        </div>
      </div>
      
      {/* 주소 입력 필드 - 고정 레이아웃 */}
      <div className="space-y-3">
        <div className="grid items-center grid-cols-3 gap-3">
          <label className="text-sm font-medium text-foreground">
            주소 입력
          </label>
          <div className="relative col-span-2 h-14">
            <MapPin className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
            
            <input
              type="text"
              value={addressFields.fullAddress}
              onChange={(e) => handleFieldChange('fullAddress', e.target.value)}
              placeholder={effectivePlaceholder}
              disabled={disabled}
              className={`
                w-full pl-9 pr-9 py-3 text-base rounded-lg border transition-colors
                ${disabled 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed border-border/50' 
                  : `bg-background border-border focus:ring-2 ${colorClasses.ring} ${colorClasses.border}`
                }
              `}
            />
          
            {hasAddress && showClearButton && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute w-4 h-4 transition-colors transform -translate-y-1/2 right-3 top-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* 미리보기 - 고정 높이 */}
        <div className="p-3 border rounded-lg bg-muted/30 border-border/50" style={{ minHeight: '80px' }}>
          {hasAddress ? (
            <div className="flex items-start space-x-2">
              <MapPin className={`w-4 h-4 text-primary mt-0.5 flex-shrink-0`} />
              <div className="flex-1">
                <div className="mt-1 text-sm text-foreground">
                  [{selectedCountry}] {addressFields.fullAddress}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground" style={{ minHeight: '56px' }}>
              주소를 입력하면 미리보기가 표시됩니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
  // #endregion
};
