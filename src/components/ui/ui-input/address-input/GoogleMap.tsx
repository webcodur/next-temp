/* 
  파일명: /address-input/GoogleMap.tsx
  기능: Google Maps API 기반 지도 표시 컴포넌트
  책임: 지도 렌더링, 마커 표시, 지도 상호작용 처리
*/ // ------------------------------

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Maximize2, Minimize2 } from 'lucide-react';

import { useGoogleMaps } from './hooks/useGoogleMaps';

// #region 타입 정의
export interface GoogleMapProps {
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  className?: string;
  colorVariant?: 'primary' | 'secondary';
  height?: number;
  zoom?: number;
  showMarker?: boolean;
  showFullscreenButton?: boolean;
  disabled?: boolean;
  onMapClick?: (coordinates: { latitude: number; longitude: number }) => void;
}

type GoogleMapInstance = google.maps.Map;
type GoogleMarkerInstance = google.maps.Marker;
// #endregion

// #region 메인 컴포넌트
export const GoogleMap: React.FC<GoogleMapProps> = ({
  coordinates,
  address,
  className = '',
  colorVariant = 'primary',
  height = 300,
  zoom = 15,
  showMarker = true,
  showFullscreenButton = true,
  disabled = false,
  onMapClick
}) => {
  // Refs
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<GoogleMapInstance | null>(null);
  const markerRef = useRef<GoogleMarkerInstance | null>(null);
  
  // 상태 관리
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Google Maps API 로드
  const { isLoaded: isMapsLoaded, isLoading: isMapsLoading, error: mapsError } = useGoogleMaps({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['maps'],
    language: 'en'
  });

  // colorVariant에 따른 색상 클래스
  const getColorClasses = useCallback(() => {
    const baseColor = colorVariant === 'primary' ? 'primary' : 'secondary';
    return {
      border: `border-${baseColor}/20`,
      button: `text-${baseColor} hover:bg-${baseColor}/10`,
      icon: `text-${baseColor}`
    };
  }, [colorVariant]);

  const colorClasses = getColorClasses();

  // 지도 초기화
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google?.maps || mapInstanceRef.current) return;

    const defaultCenter = coordinates 
      ? { lat: coordinates.latitude, lng: coordinates.longitude }
      : { lat: 37.5665, lng: 126.9780 }; // 서울 기본 좌표

    const mapOptions: google.maps.MapOptions = {
      center: defaultCenter,
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      gestureHandling: disabled ? 'none' : 'auto',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    };

    mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);

    // 지도 클릭 이벤트
    if (onMapClick && !disabled) {
      mapInstanceRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          onMapClick({ latitude: lat, longitude: lng });
        }
      });
    }

    setIsMapReady(true);
  }, [coordinates, zoom, disabled, onMapClick]);

  // 마커 업데이트
  const updateMarker = useCallback(() => {
    if (!mapInstanceRef.current || !coordinates || !showMarker) return;

    // 기존 마커 제거
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // 새 마커 생성
    const position = { lat: coordinates.latitude, lng: coordinates.longitude };
    
    markerRef.current = new google.maps.Marker({
      position: position,
      map: mapInstanceRef.current,
      title: address || 'Selected Location',
      animation: google.maps.Animation.DROP,
      icon: {
        url: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${colorVariant === 'primary' ? '#3b82f6' : '#10b981'}"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24),
        anchor: new google.maps.Point(12, 24)
      }
    });

    // 지도 중심 이동
    mapInstanceRef.current.setCenter(position);
  }, [coordinates, address, showMarker, colorVariant]);

  // 전체화면 토글
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Google Maps API 로드 완료 시 지도 초기화
  useEffect(() => {
    if (isMapsLoaded) {
      // 약간의 지연을 두어 DOM이 완전히 렌더링되도록 함
      const timer = setTimeout(initializeMap, 100);
      return () => clearTimeout(timer);
    }
  }, [isMapsLoaded, initializeMap]);

  // 좌표 변경 시 마커 업데이트
  useEffect(() => {
    if (isMapReady && coordinates) {
      updateMarker();
    }
  }, [isMapReady, coordinates, updateMarker]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      mapInstanceRef.current = null;
    };
  }, []);

  const mapHeight = isFullscreen ? '70vh' : `${height}px`;

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`
          relative rounded-lg border overflow-hidden
          ${colorClasses.border}
          ${disabled ? 'opacity-50 pointer-events-none' : ''}
          ${isFullscreen ? 'fixed inset-4 z-[9999] bg-white dark:bg-gray-800' : ''}
        `}
        style={{ height: mapHeight }}
      >
        {/* 지도 컨테이너 */}
        <div
          ref={mapRef}
          className="w-full h-full"
          style={{ minHeight: '200px' }}
        />

        {/* 로딩 상태 */}
        {(isMapsLoading || !isMapReady) && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <div className="text-sm text-muted-foreground">
                지도 로딩 중...
              </div>
            </div>
          </div>
        )}

        {/* 에러 상태 */}
        {mapsError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="text-center text-red-500">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm">
                지도를 로드할 수 없습니다
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {mapsError}
              </div>
            </div>
          </div>
        )}

        {/* 컨트롤 버튼들 */}
        {showFullscreenButton && isMapReady && !mapsError && (
          <div className="absolute top-2 right-2 z-10">
            <button
              type="button"
              onClick={toggleFullscreen}
              className={`
                p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                shadow-sm transition-colors
                ${colorClasses.button}
              `}
              title={isFullscreen ? '전체화면 해제' : '전체화면'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        )}

        {/* 주소 표시 */}
        {address && isMapReady && !mapsError && (
          <div className="absolute bottom-2 left-2 right-2 z-10">
            <div className="bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <MapPin className={`w-4 h-4 flex-shrink-0 ${colorClasses.icon}`} />
                <div className="text-sm text-gray-900 dark:text-gray-100 truncate font-medium">
                  {address}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 전체화면 배경 오버레이 */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9998]"
          onClick={toggleFullscreen}
        />
      )}
    </div>
  );
};
// #endregion