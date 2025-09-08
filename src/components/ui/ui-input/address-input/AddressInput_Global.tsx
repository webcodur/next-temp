/* 
  파일명: /address-input/AddressInput_Global.tsx
  기능: 해외 사용자 주소 입력 컴포넌트
  책임: REST Countries API 연동 국가 선택 및 주소 입력 처리
*/ // ------------------------------

import React, { useState, useCallback } from 'react';
import { MapPin, X, Globe, Loader2, RefreshCw } from 'lucide-react';

import { useCountries } from './hooks/useCountries';

import type { AddressInputProps_Global, GlobalAddressData } from './types';
export const AddressInput_Global: React.FC<AddressInputProps_Global> = ({
  disabled = false,
  className = '',
  value,
  onChange,
  onClear,
  countries: countryCodes, // 특정 국가만 필터링하고 싶을 때
  defaultCountry = 'US',
  showClearButton = true,
  showCountrySelector = true,
  enableCountryApi = true // API 사용 여부
}) => {
  // REST Countries API Hook
  const { 
    countries: apiCountries, 
    isLoading: isLoadingCountries, 
    error: countriesError,
    refreshCountries 
  } = useCountries(enableCountryApi);
  const [selectedCountry, setSelectedCountry] = useState(
    value?.country || defaultCountry
  );
  
  const [addressFields, setAddressFields] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    ...parseAddressFromValue(value)
  });

  // value에서 주소 필드 추출
  function parseAddressFromValue(addressValue: GlobalAddressData | null | undefined) {
    if (!addressValue) return {};
    
    // 기본적으로 fullAddress에서 정보 추출
    // 실제로는 더 정교한 파싱 로직 필요
    return {
      street: addressValue.street || '',
      city: addressValue.city || '',
      state: addressValue.state || '',
      postalCode: addressValue.postalCode || ''
    };
  }

  // 주소 필드를 GlobalAddressData로 변환
  const createAddressData = useCallback((fields: typeof addressFields, country: string): GlobalAddressData => {
    const addressParts = [
      fields.street,
      fields.city,
      fields.state,
      fields.postalCode
    ].filter(Boolean);
    
    const selectedCountryData = apiCountries.find(c => c.code === country);
    
    return {
      fullAddress: addressParts.join(', '),
      postalCode: fields.postalCode,
      country: selectedCountryData?.name || country,
      state: fields.state,
      city: fields.city,
      street: fields.street,
      buildingNumber: '', // 향후 추가
      coordinates: undefined, // 향후 Google Places API 등과 연동 시 추가
      rawData: {
        country: country,
        ...fields
      }
    };
  }, [apiCountries]);

  // 주소 필드 변경 핸들러
  const handleFieldChange = useCallback((field: keyof typeof addressFields, newValue: string) => {
    const updatedFields = {
      ...addressFields,
      [field]: newValue
    };
    
    setAddressFields(updatedFields);
    
    // 충분한 주소 정보가 입력되었을 때만 onChange 호출
    // street(도로명)과 city(도시) 둘 다 입력되었을 때만 유효한 주소로 간주
    const hasMinimumAddress = updatedFields.street.trim() && updatedFields.city.trim();
    
    if (hasMinimumAddress) {
      const addressData = createAddressData(updatedFields, selectedCountry);
      onChange?.(addressData);
    } else {
      // 최소 요구사항을 충족하지 않으면 null 전달
      onChange?.(null);
    }
  }, [addressFields, selectedCountry, createAddressData, onChange]);

  // 국가 변경 핸들러
  const handleCountryChange = useCallback((country: string) => {
    setSelectedCountry(country);
    // 국가 선택만으로는 onChange를 호출하지 않음
    // 실제 주소 필드가 입력되었을 때만 호출됨
  }, []);

  // 주소 초기화
  const handleClear = useCallback(() => {
    const emptyFields = {
      street: '',
      city: '',
      state: '',
      postalCode: ''
    };
    
    setAddressFields(emptyFields);
    onChange?.(null);
    onClear?.();
  }, [onChange, onClear]);

  // 필터된 국가 목록
  const availableCountries = countryCodes 
    ? apiCountries.filter(country => countryCodes.includes(country.code))
    : apiCountries;

  const hasAddress = Object.values(addressFields).some(value => value.trim() !== '');

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="space-y-3">
        {/* 국가 선택 */}
        {showCountrySelector && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-medium text-muted-foreground">
                Country
              </label>
              {/* 로딩 및 새로고침 버튼 */}
              <div className="flex gap-1 items-center">
                {isLoadingCountries && (
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                )}
                {countriesError && (
                  <button
                    onClick={refreshCountries}
                    className="p-1 rounded hover:bg-muted"
                    title={`Failed to load countries: ${countriesError}. Click to retry.`}
                  >
                    <RefreshCw className="w-3 h-3 text-orange-500" />
                  </button>
                )}
              </div>
            </div>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-muted-foreground" />
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                disabled={disabled || isLoadingCountries}
                className={`
                  w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border transition-colors
                  ${disabled || isLoadingCountries
                    ? 'bg-muted text-muted-foreground cursor-not-allowed border-border/50' 
                    : 'bg-background border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'
                  }
                `}
              >
                {isLoadingCountries ? (
                  <option>Loading countries...</option>
                ) : availableCountries.length === 0 ? (
                  <option>No countries available</option>
                ) : (
                  availableCountries.map(country => {
                    // 구분선 처리
                    if (country.code === '---') {
                      return (
                        <option key={country.code} disabled className="text-muted-foreground">
                          {country.name}
                        </option>
                      );
                    }
                    
                    return (
                      <option key={country.code} value={country.code}>
                        {country.flag ? `${country.flag} ` : ''}{country.name}
                      </option>
                    );
                  })
                )}
              </select>
            </div>
          </div>
        )}
        
        {/* 주소 입력 필드들 */}
        <div className="space-y-2">
          {/* 거리 주소 */}
          <div>
            <input
              type="text"
              value={addressFields.street}
              onChange={(e) => handleFieldChange('street', e.target.value)}
              placeholder="Street address"
              disabled={disabled}
              className={`
                w-full px-3 py-2.5 text-sm rounded-lg border transition-colors
                ${disabled 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed border-border/50' 
                  : 'bg-background border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'
                }
              `}
            />
          </div>
          
          {/* 도시, 주/도 */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={addressFields.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              placeholder="City"
              disabled={disabled}
              className={`
                w-full px-3 py-2.5 text-sm rounded-lg border transition-colors
                ${disabled 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed border-border/50' 
                  : 'bg-background border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'
                }
              `}
            />
            
            <input
              type="text"
              value={addressFields.state}
              onChange={(e) => handleFieldChange('state', e.target.value)}
              placeholder="State / Province"
              disabled={disabled}
              className={`
                w-full px-3 py-2.5 text-sm rounded-lg border transition-colors
                ${disabled 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed border-border/50' 
                  : 'bg-background border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'
                }
              `}
            />
          </div>
          
          {/* 우편번호 */}
          <div className="relative">
            <input
              type="text"
              value={addressFields.postalCode}
              onChange={(e) => handleFieldChange('postalCode', e.target.value)}
              placeholder="Postal / ZIP code"
              disabled={disabled}
              className={`
                w-full px-3 py-2.5 text-sm rounded-lg border transition-colors
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
        </div>
        
        {/* 현재 주소 미리보기 */}
        {hasAddress && (
          <div className="p-3 rounded-lg border bg-muted/30 border-border/50">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">
                  Address Preview
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {createAddressData(addressFields, selectedCountry).fullAddress}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
