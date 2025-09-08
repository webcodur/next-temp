import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, X, Search } from 'lucide-react';
import { CoordinatesDisplay } from './CoordinatesDisplay';
import { CountrySelector } from './CountrySelector';
import type { AddressInputProps_KOR, DaumAddressData, AddressData, Coordinates } from './types';

/**
 * Daum 우편번호 서비스를 사용한 한국 주소 입력 컴포넌트
 * 
 * 기능:
 * - Daum 우편번호 서비스 API 연동
 * - 팝업/임베드 모드 지원
 * - 상세주소 입력 기능
 * - 영문 주소 지원
 */
export const AddressInput_KOR: React.FC<AddressInputProps_KOR> = ({
  disabled = false,
  className = '',
  colorVariant = 'primary',
  value,
  onChange,
  onClear,
  popupOptions,
  embedMode = false,
  embedHeight = 400,
  showClearButton = true,
  showDetailAddress = true,
  detailAddressPlaceholder = '동, 호수 등 상세주소를 입력하세요'
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmbedVisible, setIsEmbedVisible] = useState(false);
  const [detailAddress, setDetailAddress] = useState('');
  const [lastBaseAddress, setLastBaseAddress] = useState<string | null>(null);
  
  const embedRef = useRef<HTMLDivElement>(null);
  const detailInputRef = useRef<HTMLInputElement>(null);

  // Daum API 스크립트 로드
  useEffect(() => {
    if (window.daum?.Postcode) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('Daum Postcode API 로드에 실패했습니다.');
    };
    
    document.head.appendChild(script);

    return () => {
      // 스크립트 정리는 하지 않음 (다른 컴포넌트에서 재사용 가능)
    };
  }, []);

  // value 변경 시 상세주소 업데이트
  useEffect(() => {
    if (value && typeof value === 'object' && 'fullAddress' in value) {
      const rawData = value.rawData as DaumAddressData;
      if (rawData) {
        const currentBaseAddress = rawData.address;
        
        // 기본 주소가 실제로 변경되었을 때만 상세주소 리셋
        if (currentBaseAddress !== lastBaseAddress) {
          setLastBaseAddress(currentBaseAddress);
          // 기존 상세주소가 있다면 유지, 없다면 빈 값
          const existingDetail = value.fullAddress?.replace(currentBaseAddress, '').trim() || '';
          setDetailAddress(existingDetail);
        }
      }
    } else if (!value) {
      // value가 null일 때만 모든 상태 리셋
      setDetailAddress('');
      setLastBaseAddress(null);
    }
  }, [value, lastBaseAddress]);

  // Daum 데이터를 표준 AddressData로 변환
  const convertDaumToAddressData = useCallback((daumData: DaumAddressData, detail: string = ''): AddressData => {
    const isRoadAddress = daumData.addressType === 'R';
    
    // 좌표 정보 변환
    let coordinates: Coordinates | undefined;
    if (daumData.x && daumData.y) {
      const longitude = parseFloat(daumData.x);
      const latitude = parseFloat(daumData.y);
      
      if (!isNaN(longitude) && !isNaN(latitude)) {
        coordinates = { longitude, latitude };
      }
    }
    
    return {
      fullAddress: `${daumData.address}${detail ? ` ${detail}` : ''}`,
      postalCode: daumData.zonecode,
      region: daumData.sido,
      city: daumData.sigungu,
      district: daumData.bname,
      roadAddress: daumData.roadAddress || undefined,
      jibunAddress: daumData.jibunAddress,
      buildingName: daumData.buildingName || undefined,
      englishAddress: daumData.addressEnglish || undefined,
      coordinates,
      addressType: isRoadAddress ? 'road' : 'jibun',
      isApartment: daumData.apartment === 'Y',
      rawData: daumData
    };
  }, []);

  // 주소 검색 완료 핸들러
  const handleAddressComplete = useCallback((daumData: DaumAddressData) => {
    // 새로운 기본 주소 설정
    setLastBaseAddress(daumData.address);
    setDetailAddress('');
    
    const addressData = convertDaumToAddressData(daumData, '');
    onChange?.(addressData);
    
    if (embedMode) {
      setIsEmbedVisible(false);
    }
    
    // 상세주소 입력으로 포커스 이동
    if (showDetailAddress) {
      setTimeout(() => {
        detailInputRef.current?.focus();
      }, 100);
    }
  }, [convertDaumToAddressData, onChange, embedMode, showDetailAddress]);

  // 팝업 열기
  const openPopup = useCallback(() => {
    if (!isScriptLoaded || !window.daum?.Postcode || disabled) return;
    
    setIsLoading(true);
    
    const popup = new window.daum.Postcode({
      oncomplete: (data) => {
        handleAddressComplete(data);
        setIsLoading(false);
      },
      onclose: () => {
        setIsLoading(false);
      },
      width: 570,
      height: 420,
      ...popupOptions
    });
    
    // 브라우저 기본 중앙 배치 사용 (가장 안정적)
    popup.open();
  }, [isScriptLoaded, disabled, handleAddressComplete, popupOptions]);

  // 임베드 열기/닫기
  const toggleEmbed = useCallback(() => {
    if (!isScriptLoaded || !window.daum?.Postcode || disabled) return;
    
    if (!isEmbedVisible) {
      setIsEmbedVisible(true);
      setIsLoading(true);
      
      setTimeout(() => {
        if (embedRef.current && window.daum?.Postcode) {
          const embed = new window.daum.Postcode({
            oncomplete: (data) => {
              handleAddressComplete(data);
              setIsLoading(false);
            },
            ...popupOptions
          });
          
          embed.embed(embedRef.current);
          setIsLoading(false);
        }
      }, 50);
    } else {
      setIsEmbedVisible(false);
      if (embedRef.current) {
        embedRef.current.innerHTML = '';
      }
    }
  }, [isScriptLoaded, disabled, isEmbedVisible, handleAddressComplete, popupOptions]);

  // 상세주소 변경 핸들러
  const handleDetailAddressChange = useCallback((newDetail: string) => {
    // 상세주소 상태 즉시 업데이트
    setDetailAddress(newDetail);
    
    // 기본 주소가 있을 때만 onChange 호출
    if (value && typeof value === 'object' && 'fullAddress' in value) {
      const rawData = value.rawData as DaumAddressData;
      if (rawData && rawData.address) {
        const updatedAddress = convertDaumToAddressData(rawData, newDetail);
        onChange?.(updatedAddress);
      }
    }
  }, [value, onChange, convertDaumToAddressData]);

  // 주소 초기화
  const handleClear = useCallback(() => {
    setDetailAddress('');
    setLastBaseAddress(null);
    onChange?.(null);
    onClear?.();
  }, [onChange, onClear]);

  // 현재 주소 텍스트 생성
  const getCurrentAddressText = (): string => {
    if (!value || typeof value !== 'object' || !('fullAddress' in value)) {
      return '';
    }
    
    const rawData = value.rawData as DaumAddressData;
    if (!rawData) return value.fullAddress;
    
    return rawData.address || value.fullAddress;
  };

  const currentAddress = getCurrentAddressText();
  const hasAddress = Boolean(currentAddress);

  // colorVariant에 따른 색상 클래스 생성
  const getColorClasses = () => {
    const baseColor = colorVariant === 'primary' ? 'primary' : 'secondary';
    return {
      ring: `focus-within:ring-${baseColor}/20`,
      border: `focus:border-${baseColor}`,
      icon: `text-${baseColor}`,
      spinner: `border-${baseColor}/30 border-t-${baseColor}`,
    };
  };
  
  const colorClasses = getColorClasses();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 국가 선택 (한국 고정) */}
      <CountrySelector
        value="KR"
        onChange={() => {}} // 한국 고정이므로 변경 불가
        disabled={disabled}
        colorVariant={colorVariant}
        fixedCountry="KR"
        enableCountryApi={true}
      />
      
      {/* 주소 검색 영역 */}
      <div className="space-y-2">
        {/* 기본 주소 표시/검색 버튼 */}
        <div className="relative">
          <div
            className={`
              flex items-center w-full px-3 py-2.5 text-sm rounded-lg border transition-colors
              ${disabled 
                ? 'bg-muted text-muted-foreground cursor-not-allowed border-border/50' 
                : hasAddress 
                  ? 'bg-background border-border cursor-pointer hover:border-border/80'
                  : `bg-background border-border cursor-pointer hover:border-border/80 focus-within:ring-2 ${colorClasses.ring}`
              }
            `}
            onClick={embedMode ? toggleEmbed : openPopup}
          >
            <MapPin className={`w-4 h-4 mr-2 ${disabled ? 'text-muted-foreground' : colorClasses.icon}`} />
            
            <span className={`flex-1 ${hasAddress ? 'text-foreground' : 'text-muted-foreground'}`}>
              {hasAddress ? currentAddress : "주소를 검색하세요"}
            </span>
            
            {isLoading && (
              <div className={`ml-2 w-4 h-4 rounded-full border-2 animate-spin ${colorClasses.spinner}`} />
            )}
            
            {!isLoading && !disabled && (
              <Search className="ml-2 w-4 h-4 text-muted-foreground" />
            )}
            
            {hasAddress && showClearButton && !disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="ml-2 w-4 h-4 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* 임베드 모드 주소 검색 영역 */}
        {embedMode && isEmbedVisible && (
          <div className="overflow-hidden rounded-lg border border-border">
            <div 
              ref={embedRef}
              style={{ height: embedHeight }}
              className="w-full"
            />
          </div>
        )}
        
        {/* 선택된 기본 주소 표시 및 상세주소 입력 */}
        {showDetailAddress && hasAddress && (
          <div className="p-4 rounded-lg border bg-muted/30">
            <div className="space-y-2">
              {/* 기본 주소 정보 및 좌표 */}
              <div className="flex gap-2 items-center text-sm font-medium text-foreground">
                <span>선택된 주소</span>
                {value?.coordinates && (
                  <CoordinatesDisplay
                    coordinates={value.coordinates}
                    colorVariant={colorVariant}
                    compact={true}
                  />
                )}
              </div>
              
              {/* 기본 주소 표시 */}
              <div className="text-xs text-muted-foreground">
                {getCurrentAddressText()}
              </div>
              
              {/* 상세주소 입력 */}
              <input
                ref={detailInputRef}
                type="text"
                value={detailAddress}
                onChange={(e) => handleDetailAddressChange(e.target.value)}
                placeholder={detailAddressPlaceholder}
                disabled={disabled}
                className={`
                  w-full px-3 py-2.5 text-sm rounded-lg border transition-colors
                  ${disabled 
                    ? 'bg-muted text-muted-foreground cursor-not-allowed border-border/50' 
                    : `bg-background border-border focus:ring-2 ${colorClasses.ring} ${colorClasses.border}`
                  }
                `}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* API 로드 상태 */}
      {!isScriptLoaded && (
        <div className="text-xs text-muted-foreground">
          주소 검색 서비스를 로드하는 중...
        </div>
      )}
    </div>
  );
};
