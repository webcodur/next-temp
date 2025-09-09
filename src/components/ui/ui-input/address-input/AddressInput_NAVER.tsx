import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, X, Search } from 'lucide-react';
import { CountrySelector } from './CountrySelector';
import { 
  LABEL_BOX_STYLES, 
  CONTAINER_STYLES, 
  ICON_POSITIONS,
  createInputStyles,
  createSearchButtonStyles 
} from './styles';
import type { AddressInputProps_KOR, AddressData } from './types';

// Daum Postcode API 타입 확장

interface DaumAddressData {
  zonecode: string; // 우편번호
  roadAddress: string; // 도로명주소
  jibunAddress: string; // 지번주소
  buildingName: string; // 건물명
  userSelectedType: 'R' | 'J'; // R: 도로명, J: 지번
  sido: string; // 시도
  sigungu: string; // 시군구
  bname: string; // 법정동
  roadname: string; // 도로명
  buildingCode: string; // 건물관리번호
}

/**
 * Daum Postcode API + 네이버 Maps JavaScript SDK를 사용한 한국 주소 입력 컴포넌트
 * 
 * 기능:
 * - Daum Postcode API를 통한 주소 검색
 * - 네이버 Maps JavaScript SDK로 지도 표시
 * - 상세주소 입력 기능
 */
export const AddressInput_NAVER: React.FC<AddressInputProps_KOR> = ({
  disabled = false,
  className = '',
  colorVariant = 'primary',
  value,
  onChange,
  onClear,
  showClearButton = true,
  showDetailAddress = true,
  detailAddressPlaceholder = '동, 호수 등 상세주소를 입력하세요'
}) => {
  const [detailAddress, setDetailAddress] = useState('');
  const [inputAddress, setInputAddress] = useState<string>(''); // 사용자 입력 주소
  const [selectedAddress, setSelectedAddress] = useState<string>(''); // 선택된 최종 주소
  const [selectedDaumData, setSelectedDaumData] = useState<DaumAddressData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [marker, setMarker] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [infoWindow, setInfoWindow] = useState<any>(null);
  const [isNaverSdkLoaded, setIsNaverSdkLoaded] = useState(false);
  const [isDaumLoaded, setIsDaumLoaded] = useState(false);
  
  const detailInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // value 변경 시 상태 업데이트
  useEffect(() => {
    if (value && typeof value === 'object' && 'fullAddress' in value) {
      const baseAddress = value.fullAddress?.split(' ').slice(0, -1).join(' ') || '';
      setSelectedAddress(baseAddress);
      setInputAddress(baseAddress); // 입력 필드에도 반영
      const detail = value.fullAddress?.replace(baseAddress, '').trim() || '';
      setDetailAddress(detail);
    } else if (!value) {
      setSelectedAddress('');
      setInputAddress('');
      setDetailAddress('');
    }
  }, [value]);

  // Daum Postcode API 로드
  useEffect(() => {
    const loadDaumPostcode = () => {
      // 이미 로드되었다면 스킵
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).daum && (window as any).daum.Postcode) {
        setIsDaumLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = () => {
        setIsDaumLoaded(true);
      };
      script.onerror = () => {
        console.error('Daum Postcode API 로드 실패');
      };
      
      document.head.appendChild(script);
    };

    loadDaumPostcode();
  }, []);

  // 네이버 Maps JavaScript SDK 로드
  useEffect(() => {
    const loadNaverMaps = () => {
      const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
      
      if (!clientId) {
        console.warn('네이버 Maps Client ID가 설정되지 않았습니다.');
        return;
      }
      
      console.log('🔑 네이버 Client ID:', clientId);

      // 이미 로드되었다면 스킵
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).naver && (window as any).naver.maps) {
        setIsNaverSdkLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
      script.async = true;
      script.onload = () => {
        setIsNaverSdkLoaded(true);
        console.log('🗺️ 네이버 Maps SDK 로드 완료');
      };
      script.onerror = () => {
        console.error('네이버 Maps JavaScript SDK 로드 실패');
      };
      
      document.head.appendChild(script);
    };

    loadNaverMaps();
  }, []);


  // 네이버 Geocoding API로 좌표 검색 후 지도 업데이트
  const searchCoordinatesAndUpdateMap = useCallback(async (address: string) => {
    console.log('🔍 주소 좌표 검색 시작:', address);
    try {
      const response = await fetch('/api/geocoding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: address }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📍 좌표 검색 결과:', data);
        if (data.coordinates) {
          const coords = { x: data.coordinates.longitude, y: data.coordinates.latitude };
          
          // 지도 생성을 위해 DOM이 준비될 때까지 대기
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((window as any).naver && (window as any).naver.maps && mapRef.current) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const position = new (window as any).naver.maps.LatLng(coords.y, coords.x);
              
              let mapInstance = map;
              
              // 지도가 없으면 새로 생성
              if (!mapInstance) {
                console.log('🗺️ 지도 생성:', address);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                mapInstance = new (window as any).naver.maps.Map(mapRef.current, {
                  center: position,
                  zoom: 16
                });
                setMap(mapInstance);
              } else {
                // 지도가 있으면 위치 업데이트
                mapInstance.setCenter(position);
                mapInstance.setZoom(16);
              }

              // 기존 마커와 정보창 제거
              if (marker) {
                marker.setMap(null);
              }
              if (infoWindow) {
                infoWindow.close();
              }

              // 새 마커 생성 (단순화)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const newMarker = new (window as any).naver.maps.Marker({
                position: position,
                map: mapInstance,
                title: address
              });

              // 정보창 내용 생성 (단순화)
              const infoContent = `
                <div style="padding: 8px 12px; font-size: 14px;">
                  <strong>${address}</strong>
                  ${detailAddress ? `<br><small>${detailAddress}</small>` : ''}
                </div>
              `;

              // 정보창 생성 (단순화)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const newInfoWindow = new (window as any).naver.maps.InfoWindow({
                content: infoContent
              });

              // 마커 클릭 이벤트 추가
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as any).naver.maps.Event.addListener(newMarker, 'click', function() {
                if (newInfoWindow.getMap()) {
                  newInfoWindow.close();
                } else {
                  newInfoWindow.open(mapInstance, newMarker);
                }
              });

              setMarker(newMarker);
              setInfoWindow(newInfoWindow);
            }
          }, 100); // DOM 렌더링을 위한 대기 시간
        } else {
          console.warn('좌표 정보를 찾을 수 없습니다:', data);
        }
      } else {
        const errorData = await response.json();
        console.error('Geocoding API 오류:', {
          status: response.status,
          errorData
        });
        alert(`주소 검색 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('좌표 검색 오류:', error);
    }
  }, [map, marker, infoWindow, detailAddress]);

  // 입력 필드 변경 핸들러
  const handleInputChange = useCallback((newValue: string) => {
    setInputAddress(newValue);
  }, []);

  // Daum Postcode API로 주소 검색
  const openPostcodeSearch = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!isDaumLoaded || !(window as any).daum) {
      console.error('Daum Postcode API가 로드되지 않았습니다.');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (window as any).daum.Postcode({
      oncomplete: function(data: DaumAddressData) {
        
        // 도로명주소 우선, 없으면 지번주소 사용
        const selectedAddr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        setSelectedAddress(selectedAddr);
        setInputAddress(selectedAddr); // 입력 필드도 업데이트
        setSelectedDaumData(data);
        
        const addressData: AddressData = {
          fullAddress: `${selectedAddr}${detailAddress ? ` ${detailAddress}` : ''}`,
          postalCode: data.zonecode,
          roadAddress: data.roadAddress,
          jibunAddress: data.jibunAddress,
          addressType: data.userSelectedType === 'R' ? 'road' : 'jibun'
        };
        
        onChange?.(addressData);
        
        // 네이버 지도에서 좌표 검색 후 지도 표시
        searchCoordinatesAndUpdateMap(selectedAddr);
        
        // 상세주소 입력으로 포커스 이동
        if (showDetailAddress) {
          setTimeout(() => {
            detailInputRef.current?.focus();
          }, 100);
        }
      },
      width: '100%',
      height: '100%',
      autoClose: true,
      // 검색어가 있으면 전달
      ...(inputAddress.trim() && { q: inputAddress.trim() })
    }).open();
  }, [inputAddress, detailAddress, onChange, showDetailAddress, searchCoordinatesAndUpdateMap, isDaumLoaded]);

  // 상세주소 변경 핸들러
  const handleDetailAddressChange = useCallback((newDetail: string) => {
    setDetailAddress(newDetail);
    
    if (selectedAddress && selectedDaumData) {
      const addressData: AddressData = {
        fullAddress: `${selectedAddress}${newDetail ? ` ${newDetail}` : ''}`,
        postalCode: selectedDaumData.zonecode,
        roadAddress: selectedDaumData.roadAddress,
        jibunAddress: selectedDaumData.jibunAddress,
        coordinates: value?.coordinates,
        addressType: selectedDaumData.userSelectedType === 'R' ? 'road' : 'jibun'
      };
      onChange?.(addressData);
    }
  }, [selectedAddress, selectedDaumData, value?.coordinates, onChange]);

  // 주소 초기화
  const handleClear = useCallback(() => {
    setInputAddress('');
    setSelectedAddress('');
    setDetailAddress('');
    setSelectedDaumData(null);
    onChange?.(null);
    onClear?.();

    // 마커와 정보창 제거
    if (marker) {
      marker.setMap(null);
      setMarker(null);
    }
    if (infoWindow) {
      infoWindow.close();
      setInfoWindow(null);
    }

    // 지도 제거
    if (map) {
      setMap(null);
    }
  }, [onChange, onClear, marker, infoWindow, map]);

  const colorClasses = {
    ring: `focus-within:ring-${colorVariant === 'primary' ? 'primary' : 'secondary'}/20`,
    border: `focus:border-${colorVariant === 'primary' ? 'primary' : 'secondary'}`,
    icon: `text-${colorVariant === 'primary' ? 'primary' : 'secondary'}`,
  };

  return (
    <div className={`${CONTAINER_STYLES.main} ${className}`}>
      {/* 국가 선택 (한국 고정) */}
      <div className="grid grid-cols-3 gap-3 items-center">
        <div className={LABEL_BOX_STYLES}>
          <label className="text-sm font-medium text-foreground">국가</label>
        </div>
        <div className="col-span-2">
          <CountrySelector
            value="KR"
            onChange={() => {}}
            disabled={disabled}
            colorVariant={colorVariant}
            fixedCountry="KR"
            enableCountryApi={true}
            showLabel={false}
          />
        </div>
      </div>
      
      {/* 주소 검색 영역 */}
      <div className="space-y-3">
        {/* 주소 검색 */}
        <div className="grid grid-cols-3 gap-3 items-center">
          <div className={LABEL_BOX_STYLES}>
            <label className="text-sm font-medium text-foreground">주소 검색</label>
          </div>
          <div className="relative col-span-2 h-14">
            <MapPin className={`${ICON_POSITIONS.left} text-muted-foreground`} />
            
            <input
              type="text"
              value={inputAddress}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="검색 버튼을 눌러 주소를 찾으세요"
              disabled={disabled}
              readOnly={!disabled} // disabled가 아닐 때는 readOnly
              className={createInputStyles(disabled, true, colorVariant, 'withIconAndButton')}
              onClick={!disabled ? openPostcodeSearch : undefined} // 클릭 시에도 검색 팝업 열기
            />

            {/* 검색 버튼 */}
            <button
              type="button"
              onClick={openPostcodeSearch}
              disabled={disabled || !isDaumLoaded}
              className={createSearchButtonStyles(disabled || !isDaumLoaded)}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Clear 버튼 */}
            {inputAddress && showClearButton && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className={`absolute right-16 top-1/2 w-4 h-4 transform -translate-y-1/2 transition-colors text-muted-foreground hover:text-foreground`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* 상세주소 입력 */}
        {showDetailAddress && (
          <div className="grid grid-cols-3 gap-3">
            <div className={LABEL_BOX_STYLES}>
              <label className="text-sm font-medium text-foreground">상세주소</label>
            </div>
            <div className="col-span-2">
              <input
                ref={detailInputRef}
                type="text"
                value={detailAddress}
                onChange={(e) => handleDetailAddressChange(e.target.value)}
                placeholder={detailAddressPlaceholder}
                disabled={disabled || !Boolean(selectedAddress)}
                className={`
                  w-full px-3 py-3 text-base rounded-lg border transition-colors outline-none
                  ${disabled || !Boolean(selectedAddress)
                    ? 'bg-muted text-muted-foreground cursor-not-allowed border-border/50' 
                    : `bg-background border-border focus:ring-2 ${colorClasses.ring} ${colorClasses.border}`
                  }
                `}
              />
            </div>
          </div>
        )}
        
        {/* 미리보기 */}
        <div className="p-3 rounded-lg border bg-muted/30 border-border/50">
          {Boolean(selectedAddress) ? (
            <div className="flex items-start space-x-2">
              <MapPin className={`w-4 h-4 ${colorClasses.icon} mt-0.5 flex-shrink-0`} />
              <div className="flex-1">
                <div className="flex gap-2 items-center">
                  {selectedDaumData && (
                    <>
                      <span className="inline-flex items-center px-2 py-0.5 text-xs rounded bg-primary/10 text-primary">
                        Daum 주소
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 text-xs rounded bg-muted">
                        {selectedDaumData.userSelectedType === 'R' ? '도로명' : '지번'}
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-1 text-sm text-foreground">
                  {`${selectedAddress}${detailAddress ? ` ${detailAddress}` : ''}`}
                </div>
                {selectedDaumData && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    우편번호: {selectedDaumData.zonecode}
                  </div>
                )}
              </div>
            </div>
          ) : inputAddress ? (
            <div className="flex items-start space-x-2">
              <MapPin className={`w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0`} />
              <div className="flex-1">
                <div className="mt-1 text-sm text-muted-foreground">
                  입력된 주소: {inputAddress}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  검색 버튼을 눌러 정확한 주소를 찾으세요
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-14 text-sm text-muted-foreground">
              주소를 입력하고 검색하면 미리보기가 표시됩니다
            </div>
          )}
        </div>
        
        {/* 지도 표시 - SDK가 로드되고 주소가 선택된 경우 */}
        {process.env.NEXT_PUBLIC_NAVER_CLIENT_ID && isNaverSdkLoaded && selectedAddress && (
          <div className="overflow-hidden rounded-lg border border-border">
            <div 
              ref={mapRef}
              className="w-full h-64 bg-muted/30"
            />
          </div>
        )}
      </div>
    </div>
  );
};