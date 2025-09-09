/* 
  파일명: /address-input/AddressInput_Global.tsx
  기능: 해외 사용자 주소 입력 컴포넌트
  책임: REST Countries API 연동 국가 선택 및 주소 입력 처리
*/ // ------------------------------

import React, { useState, useCallback } from 'react';
import { MapPin, X } from 'lucide-react';

import { PlacesAutocomplete } from './PlacesAutocomplete';
import { CoordinatesDisplay } from './CoordinatesDisplay';
import { CountrySelector } from './CountrySelector';
import { GoogleMap } from './GoogleMap';
import { 
  LABEL_BOX_STYLES, 
  CONTAINER_STYLES 
} from './styles';

import type { AddressInputProps_Global, GlobalAddressData } from './types';
import type { PlaceDetails, ParsedAddress } from './hooks/usePlacesAutocomplete';
export const AddressInput_Global: React.FC<AddressInputProps_Global> = ({
  disabled = false,
  className = '',
  colorVariant = 'primary',
  value,
  onChange,
  onClear,
  countries: countryCodes, // 특정 국가만 필터링하고 싶을 때
  defaultCountry = 'US',
  showClearButton = true,
  showCountrySelector = true,
  showAddressLine2 = true, // Address Line 2 표시 여부
  addressLine2Placeholder = 'Apartment, suite, unit, building, floor, etc.',
  enableCountryApi = true, // API 사용 여부
  enablePlacesAPI = true, // Google Places API 사용 여부
  placeholder = 'Search for an address...',
  showMap = true, // 지도 표시 여부
  mapHeight = 300, // 지도 높이
  mapZoom = 15 // 지도 줌 레벨
}) => {
  const [selectedCountry, setSelectedCountry] = useState(
    value?.country || defaultCountry
  );
  
  const [addressFields, setAddressFields] = useState({
    street: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    ...parseAddressFromValue(value)
  });

  const [selectedPlace, setSelectedPlace] = useState<(PlaceDetails & { parsedAddress?: ParsedAddress }) | null>(null);
  const [showManualFields, setShowManualFields] = useState(false); // Google Places 실패 시만 수동 입력 표시

  // value에서 주소 필드 추출
  function parseAddressFromValue(addressValue: GlobalAddressData | null | undefined) {
    if (!addressValue) return {};
    
    // 기본적으로 fullAddress에서 정보 추출
    // 실제로는 더 정교한 파싱 로직 필요
    return {
      street: addressValue.street || '',
      addressLine2: addressValue.addressLine2 || '',
      city: addressValue.city || '',
      state: addressValue.state || '',
      postalCode: addressValue.postalCode || ''
    };
  }

  // 주소 필드를 GlobalAddressData로 변환 (수동 입력용)
  const createAddressDataFromFields = useCallback((fields: typeof addressFields, country: string): GlobalAddressData => {
    const addressParts = [
      fields.street,
      fields.addressLine2,
      fields.city,
      fields.state,
      fields.postalCode
    ].filter(Boolean);
    
    return {
      fullAddress: addressParts.join(', '),
      postalCode: fields.postalCode,
      country: country, // 국가 코드를 그대로 사용
      state: fields.state,
      city: fields.city,
      street: fields.street,
      addressLine2: fields.addressLine2,
      buildingNumber: '', // 향후 추가
      coordinates: selectedPlace ? {
        latitude: selectedPlace.geometry.location.lat,
        longitude: selectedPlace.geometry.location.lng
      } : undefined,
      rawData: {
        country: country,
        inputMode: selectedPlace ? 'autocomplete' : 'manual',
        placeId: selectedPlace?.placeId,
        ...fields
      }
    };
  }, [selectedPlace]);

  // Places API 결과를 GlobalAddressData로 변환
  const createAddressDataFromPlace = useCallback((place: PlaceDetails, parsedAddress: ParsedAddress): GlobalAddressData => {
    return {
      fullAddress: place.formattedAddress,
      postalCode: parsedAddress.postalCode || '',
      country: parsedAddress.country || selectedCountry,
      state: parsedAddress.state || '',
      city: parsedAddress.city || '',
      street: parsedAddress.street || '',
      addressLine2: '', // Google Places에서는 기본적으로 비어있음, 사용자가 추가 입력
      buildingNumber: parsedAddress.streetNumber || '',
      coordinates: {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng
      },
      rawData: {
        country: parsedAddress.countryCode || selectedCountry,
        inputMode: 'autocomplete',
        placeId: place.placeId,
        googlePlace: place,
        parsedAddress
      }
    };
  }, [selectedCountry]);

  // Places API에서 장소 선택 시 처리
  const handlePlaceSelect = useCallback((place: PlaceDetails, parsedAddress: ParsedAddress) => {
    // place와 parsedAddress를 함께 저장
    setSelectedPlace({ ...place, parsedAddress });
    setShowManualFields(false); // Google Places 성공 시 수동 입력 숨김
    
    // 국가 코드가 있으면 자동으로 국가 변경
    if (parsedAddress.countryCode && parsedAddress.countryCode !== selectedCountry) {
      setSelectedCountry(parsedAddress.countryCode);
    }
    
    // 필드에도 파싱된 주소 정보 반영
    setAddressFields({
      street: parsedAddress.street || '',
      addressLine2: '', // Google Places 선택 시 비우고 사용자가 추가 입력
      city: parsedAddress.city || '',
      state: parsedAddress.state || '',
      postalCode: parsedAddress.postalCode || ''
    });
    
    // 주소 데이터 생성 및 전달
    const addressData = createAddressDataFromPlace(place, parsedAddress);
    onChange?.(addressData);
  }, [selectedCountry, createAddressDataFromPlace, onChange]);

  // 주소 필드 변경 핸들러 (수동 입력)
  const handleFieldChange = useCallback((field: keyof typeof addressFields, newValue: string) => {
    const updatedFields = {
      ...addressFields,
      [field]: newValue
    };
    
    setAddressFields(updatedFields);
    
    // Address Line 2만 변경한 경우는 Google Places 선택 상태를 유지
    // 다른 필드 변경 시에만 수동 입력 모드로 전환
    if (field !== 'addressLine2') {
      setSelectedPlace(null); // Google Places 선택 상태 해제
      setShowManualFields(true); // 수동 입력 필드 표시
    }
    
    // Address Line 2 변경이고 Google Places로 선택된 상태인 경우
    if (field === 'addressLine2' && selectedPlace) {
      // Google Places 선택 상태에서는 이미 유효한 주소가 있으므로
      // Address Line 2만 업데이트하여 onChange 호출
      const addressData = {
        ...createAddressDataFromPlace(selectedPlace, selectedPlace.parsedAddress || {
          street: updatedFields.street,
          city: updatedFields.city,
          state: updatedFields.state,
          postalCode: updatedFields.postalCode,
          country: selectedCountry,
          countryCode: selectedCountry
        }),
        addressLine2: newValue
      };
      onChange?.(addressData);
    } else {
      // 수동 입력 모드일 때만 최소 요구사항 체크
      // street(도로명)과 city(도시) 둘 다 입력되었을 때만 유효한 주소로 간주
      const hasMinimumAddress = updatedFields.street.trim() && updatedFields.city.trim();
      
      if (hasMinimumAddress) {
        const addressData = createAddressDataFromFields(updatedFields, selectedCountry);
        onChange?.(addressData);
      } else {
        // 최소 요구사항을 충족하지 않으면 null 전달
        onChange?.(null);
      }
    }
  }, [addressFields, selectedCountry, selectedPlace, createAddressDataFromFields, createAddressDataFromPlace, onChange]);

  // 국가 변경 핸들러
  const handleCountryChange = useCallback((countryCode: string) => {
    setSelectedCountry(countryCode);
    // 국가 선택만으로는 onChange를 호출하지 않음
    // 실제 주소 필드가 입력되었을 때만 호출됨
  }, []);

  // 주소 초기화
  const handleClear = useCallback(() => {
    const emptyFields = {
      street: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: ''
    };
    
    setAddressFields(emptyFields);
    onChange?.(null);
    onClear?.();
  }, [onChange, onClear]);
  const hasAddress = addressFields.street.trim() !== '' || addressFields.city.trim() !== '';

  const colorClasses = {
    ring: `focus:ring-${colorVariant === 'primary' ? 'primary' : 'secondary'}/20`,
    border: `focus:border-${colorVariant === 'primary' ? 'primary' : 'secondary'}`,
    icon: `text-${colorVariant === 'primary' ? 'primary' : 'secondary'}`,
  };

  return (
    <div className={`${CONTAINER_STYLES.main} ${className}`}>
      {/* 국가 선택 - 고정 높이 */}
      <div className="grid items-center grid-cols-3 gap-3">
        <div className={LABEL_BOX_STYLES}>
          <label className="text-sm font-medium text-foreground">Country</label>
        </div>
        <div className="col-span-2">
          {showCountrySelector ? (
            <CountrySelector
              value={selectedCountry}
              onChange={handleCountryChange}
              disabled={disabled}
              colorVariant={colorVariant}
              countries={countryCodes}
              enableCountryApi={enableCountryApi}
              showLabel={false}
            />
          ) : (
            <div className="h-12" />
          )}
        </div>
      </div>
        
      {/* Google Places API 자동완성 - 고정 레이아웃 */}
      <div className="space-y-3">
        {/* Google Places 자동완성 (항상 기본 표시) */}
        {enablePlacesAPI && (
          <>
            <div className="grid items-center grid-cols-3 gap-3">
              <div className={LABEL_BOX_STYLES}>
                <label className="text-sm font-medium text-foreground">Search Address</label>
              </div>
              <div className="col-span-2 h-14">
                <PlacesAutocomplete
                  placeholder={placeholder}
                  disabled={disabled}
                  colorVariant={colorVariant}
                  countryRestriction={selectedCountry.toLowerCase()}
                  language="en"
                  onPlaceSelect={handlePlaceSelect}
                  showClearButton={showClearButton}
                />
              </div>
            </div>
            
            {/* Address Line 2 - 항상 표시 */}
            <div className="grid grid-cols-3 gap-3" style={{ minHeight: '56px' }}>
              {showAddressLine2 ? (
                <>
                  <div className={LABEL_BOX_STYLES}>
                    <label className="text-sm font-medium text-foreground">Address Line 2</label>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={addressFields.addressLine2}
                      onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
                      placeholder={addressLine2Placeholder}
                      disabled={disabled || !selectedPlace}
                      className={`
                        w-full px-3 py-3 text-base rounded-lg border transition-colors
                        ${disabled || !selectedPlace
                          ? 'bg-muted text-muted-foreground cursor-not-allowed border-border/50' 
                          : `bg-background border-border focus:ring-2 ${colorClasses.ring} ${colorClasses.border}`
                        }
                      `}
                    />
                  </div>
                </>
              ) : (
                <div className="h-full col-span-3" />
              )}
            </div>
          </>
        )}

        {/* 수동 입력 필드들 (Google Places 비활성화 또는 실패 시) */}
        {(!enablePlacesAPI || showManualFields) && (
          <div className="space-y-3">
            {/* Street Address */}
            <div className="grid items-center grid-cols-3 gap-3">
              <div className={LABEL_BOX_STYLES}>
                <label className="text-sm font-medium text-foreground">Street Address</label>
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  value={addressFields.street}
                  onChange={(e) => handleFieldChange('street', e.target.value)}
                  placeholder="123 Main Street"
                  disabled={disabled}
                  className={`
                    w-full px-3 py-3 text-base rounded-lg border transition-colors
                    ${disabled 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed border-border/50' 
                      : `bg-background border-border focus:ring-2 ${colorClasses.ring} ${colorClasses.border}`
                    }
                  `}
                />
              </div>
            </div>

            {/* Address Line 2 */}
            <div className="grid grid-cols-3 gap-3" style={{ minHeight: '56px' }}>
              {showAddressLine2 ? (
                <>
                  <div className={LABEL_BOX_STYLES}>
                    <label className="text-sm font-medium text-foreground">Address Line 2</label>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={addressFields.addressLine2}
                      onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
                      placeholder={addressLine2Placeholder}
                      disabled={disabled}
                      className={`
                        w-full px-3 py-3 text-base rounded-lg border transition-colors
                        ${disabled 
                          ? 'bg-muted text-muted-foreground cursor-not-allowed border-border/50' 
                          : `bg-background border-border focus:ring-2 ${colorClasses.ring} ${colorClasses.border}`
                        }
                      `}
                    />
                  </div>
                </>
              ) : (
                <div className="h-full col-span-3" />
              )}
            </div>
          
            {/* City */}
            <div className="grid items-center grid-cols-3 gap-3">
              <div className={LABEL_BOX_STYLES}>
                <label className="text-sm font-medium text-foreground">City</label>
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  value={addressFields.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  placeholder="New York"
                  disabled={disabled}
                  className={`
                    w-full px-3 py-3 text-base rounded-lg border transition-colors
                    ${disabled 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed border-border/50' 
                      : `bg-background border-border focus:ring-2 ${colorClasses.ring} ${colorClasses.border}`
                    }
                  `}
                />
              </div>
            </div>
            
            {/* State/Province */}
            <div className="grid items-center grid-cols-3 gap-3">
              <div className={LABEL_BOX_STYLES}>
                <label className="text-sm font-medium text-foreground">State/Province</label>
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  value={addressFields.state}
                  onChange={(e) => handleFieldChange('state', e.target.value)}
                  placeholder="NY"
                  disabled={disabled}
                  className={`
                    w-full px-3 py-3 text-base rounded-lg border transition-colors
                    ${disabled 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed border-border/50' 
                      : `bg-background border-border focus:ring-2 ${colorClasses.ring} ${colorClasses.border}`
                    }
                  `}
                />
              </div>
            </div>
            
            {/* Postal Code */}
            <div className="grid items-center grid-cols-3 gap-3">
              <div className={LABEL_BOX_STYLES}>
                <label className="text-sm font-medium text-foreground">Postal Code</label>
              </div>
              <div className="relative col-span-2">
                <input
                  type="text"
                  value={addressFields.postalCode}
                  onChange={(e) => handleFieldChange('postalCode', e.target.value)}
                  placeholder="10001"
                  disabled={disabled}
                  className={`
                    w-full px-3 py-3 text-base rounded-lg border transition-colors
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
          </div>
        )}
        
        {/* 미리보기 - 고정 높이 */}
        <div className="p-3 border rounded-lg bg-muted/30 border-border/50" style={{ minHeight: '80px' }}>
          {hasAddress ? (
            <div className="flex items-start space-x-2">
              <MapPin className={`w-4 h-4 ${colorClasses.icon} mt-0.5 flex-shrink-0`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {selectedPlace && (
                    <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-primary/10 text-primary">
                      Google Places
                    </span>
                  )}
                  {(selectedPlace?.geometry || (!selectedPlace && addressFields.street.trim())) && (
                    <CoordinatesDisplay
                      coordinates={
                        selectedPlace?.geometry ? {
                          latitude: selectedPlace.geometry.location.lat,
                          longitude: selectedPlace.geometry.location.lng
                        } : { latitude: 0, longitude: 0 } // 수동입력 시 좌표 없음
                      }
                      colorVariant={colorVariant}
                      compact={true}
                    />
                  )}
                </div>
                <div className="mt-1 text-sm text-foreground">
                  {selectedPlace ? 
                    `${selectedPlace.formattedAddress}${addressFields.addressLine2 ? `, ${addressFields.addressLine2}` : ''}` : 
                    createAddressDataFromFields(addressFields, selectedCountry).fullAddress
                  }
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground" style={{ minHeight: '56px' }}>
              주소를 입력하면 미리보기가 표시됩니다
            </div>
          )}
        </div>
        
        {/* 지도 표시 */}
        {showMap && selectedPlace?.geometry && (
          <div className="mt-3">
            <GoogleMap
              coordinates={{
                latitude: selectedPlace.geometry.location.lat,
                longitude: selectedPlace.geometry.location.lng
              }}
              address={selectedPlace.formattedAddress}
              height={mapHeight}
              zoom={mapZoom}
              colorVariant={colorVariant}
              showMarker={true}
              showFullscreenButton={true}
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </div>
  );
};
