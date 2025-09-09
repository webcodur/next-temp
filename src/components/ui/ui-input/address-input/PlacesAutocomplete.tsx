/* 
  파일명: /components/PlacesAutocomplete.tsx
  기능: Google Places API 기반 주소 자동완성 컴포넌트
  책임: 실시간 주소 검색, 자동완성 UI, 선택 처리
*/ // ------------------------------

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MapPin, Loader2, Search, X } from 'lucide-react';

import { usePlacesAutocomplete, type PlaceResult, type PlaceDetails, type ParsedAddress } from './hooks/usePlacesAutocomplete';
import { useGoogleMaps } from './hooks/useGoogleMaps';

// #region 타입 정의
export interface PlacesAutocompleteProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  colorVariant?: 'primary' | 'secondary';
  countryRestriction?: string;
  language?: string; // Google Maps API 언어 설정
  onPlaceSelect?: (place: PlaceDetails, parsedAddress: ParsedAddress) => void;
  onInputChange?: (value: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
}
// #endregion

// #region 메인 컴포넌트
export const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  value = '',
  placeholder = 'Enter address...',
  disabled = false,
  className = '',
  colorVariant = 'primary',
  countryRestriction,
  language = 'en', // 기본값: 영어
  onPlaceSelect,
  onInputChange,
  onClear,
  showClearButton = true
}) => {
  // 상태 관리
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Google Maps API 로드 (동적 방식)
  const { isLoaded: isMapsLoaded, isLoading: isMapsLoading, error: mapsError } = useGoogleMaps({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
    language: language,
    region: language === 'en' ? 'US' : undefined, // 영어일 때 US 지역 설정
    useDynamicImport: true
  });

  // Places Autocomplete Hook
  const {
    suggestions,
    isLoading,
    error,
    searchPlaces,
    getPlaceDetails,
    parseAddressComponents,
    clearSuggestions,
    resetSession
  } = usePlacesAutocomplete({
    countryRestriction,
    types: ['address'],
    language: language
  });

  // colorVariant에 따른 색상 클래스
  const getColorClasses = useCallback(() => {
    const baseColor = colorVariant === 'primary' ? 'primary' : 'secondary';
    return {
      ring: `focus:ring-${baseColor}/20`,
      border: `focus:border-${baseColor}`,
      icon: `text-${baseColor}`
    };
  }, [colorVariant]);

  const colorClasses = getColorClasses();

  // 입력값 변경 처리 (디바운싱)
  const handleInputChange = useCallback((newValue: string) => {
    setInputValue(newValue);
    setSelectedIndex(-1);
    onInputChange?.(newValue);

    // 디바운싱
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (newValue.trim() && isMapsLoaded) {
        searchPlaces(newValue);
        setShowSuggestions(true);
      } else {
        clearSuggestions();
        setShowSuggestions(false);
      }
    }, 300);
  }, [isMapsLoaded, searchPlaces, clearSuggestions, onInputChange]);

  // 장소 선택 처리
  const handlePlaceSelect = useCallback(async (place: PlaceResult) => {
    // 임시로 선택된 항목 표시 (details 로딩 전)
    setInputValue(place.description);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    clearSuggestions();

    // 상세 정보 가져오기
    try {
      const details = await getPlaceDetails(place.placeId);
      if (details) {
        // 완전한 주소로 input 값 업데이트
        setInputValue(details.formattedAddress);
        onInputChange?.(details.formattedAddress);
        
        const parsedAddress = parseAddressComponents(details.addressComponents);
        onPlaceSelect?.(details, parsedAddress);
      }
    } catch (error) {
      console.error('Failed to get place details:', error);
    }

    // 새로운 세션 시작
    resetSession();
  }, [getPlaceDetails, parseAddressComponents, onPlaceSelect, clearSuggestions, resetSession, onInputChange]);

  // 키보드 네비게이션
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handlePlaceSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [showSuggestions, suggestions, selectedIndex, handlePlaceSelect]);

  // 입력 초기화
  const handleClear = useCallback(() => {
    setInputValue('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    clearSuggestions();
    onInputChange?.('');
    onClear?.();
    inputRef.current?.focus();
  }, [clearSuggestions, onInputChange, onClear]);

  // 외부 클릭 시 제안 숨기기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // value prop 변경 시 입력값 동기화 (무한 리렌더링 방지)
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]); // inputValue를 의존성에서 제거하여 무한 루프 방지

  const hasValue = inputValue.trim() !== '';
  const showLoading = isLoading || isMapsLoading;
  const hasError = error || mapsError;

  return (
    <div className={`relative ${className}`}>
      {/* 입력 필드 */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-muted-foreground" />
        
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={placeholder}
            disabled={disabled || !isMapsLoaded}
            className={`
              w-full pl-9 pr-9 h-14 text-base rounded-lg border transition-colors
              ${disabled || !isMapsLoaded
                ? 'bg-muted text-muted-foreground cursor-not-allowed border-border/50' 
                : `bg-background border-border focus:ring-2 ${colorClasses.ring} ${colorClasses.border}`
              }
            `}
          />

        {/* 로딩/검색 아이콘 - 우측 끝에 위치 */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {showLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : !hasValue && !disabled ? (
            <Search className="w-4 h-4 text-muted-foreground" />
          ) : null}
          
          {/* 초기화 버튼 */}
          {hasValue && showClearButton && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 자동완성 제안 목록 */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-[9999] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          style={{ position: 'absolute', top: '100%' }}
        >
          {suggestions.map((suggestion, index) => {
            const isSelected = index === selectedIndex;
            const selectedClass = colorVariant === 'primary' 
              ? 'bg-primary/10 text-primary' 
              : 'bg-secondary/10 text-secondary';
            
            return (
              <button
                key={suggestion.placeId}
                type="button"
                onClick={() => handlePlaceSelect(suggestion)}
                className={`
                  w-full text-left px-3 py-2.5 transition-colors
                  ${isSelected 
                    ? selectedClass 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }
                  ${index === 0 ? 'rounded-t-lg' : ''}
                  ${index === suggestions.length - 1 ? 'rounded-b-lg' : ''}
                `}
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="flex-shrink-0 w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate dark:text-gray-100">
                      {suggestion.structuredFormatting.mainText || suggestion.mainText || suggestion.description || 'Unknown Place'}
                    </div>
                    <div className="text-xs text-gray-600 truncate dark:text-gray-400">
                      {suggestion.structuredFormatting.secondaryText || suggestion.secondaryText || ''}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 에러 메시지 */}
      {hasError && (
        <div className="mt-1 text-xs text-destructive">
          {error || mapsError}
        </div>
      )}

      {/* API 로드 상태 */}
      {!isMapsLoaded && !isMapsLoading && !hasError && (
        <div className="mt-1 text-xs text-muted-foreground">
          Google Maps API 준비 중...
        </div>
      )}
    </div>
  );
};
// #endregion
