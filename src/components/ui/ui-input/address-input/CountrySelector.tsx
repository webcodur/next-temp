/* 
  파일명: /address-input/CountrySelector.tsx
  기능: 국가 선택 공통 UI 컴포넌트
  책임: REST Countries API 연동 국가 선택 드롭다운 UI
*/ // ------------------------------

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Globe, Loader2, RefreshCw, ChevronDown, Check, Search, X } from 'lucide-react';

import { useCountries } from './hooks/useCountries';

// #region 타입 정의
interface CountrySelectorProps {
  value: string; // 선택된 국가 코드
  onChange: (countryCode: string) => void;
  disabled?: boolean;
  className?: string;
  colorVariant?: 'primary' | 'secondary';
  countries?: string[]; // 필터링할 국가 코드 목록
  enableCountryApi?: boolean; // REST Countries API 사용 여부
  fixedCountry?: string; // 고정 국가 (한국의 경우 'KR')
  showLabel?: boolean; // 라벨 표시 여부 (기본: true)
  label?: string; // 커스텀 라벨
}
// #endregion

// #region 메인 컴포넌트
export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
  colorVariant = 'primary',
  countries: countryCodes,
  enableCountryApi = true,
  fixedCountry,
  showLabel = true,
  label
}) => {
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // REST Countries API Hook
  const { 
    countries: apiCountries, 
    isLoading: isLoadingCountries, 
    error: countriesError,
    refreshCountries 
  } = useCountries(enableCountryApi);

  // colorVariant에 따른 색상 클래스 생성
  const getColorClasses = () => {
    const baseColor = colorVariant === 'primary' ? 'primary' : 'secondary';
    return {
      ring: `focus:ring-${baseColor}/20`,
      border: `focus:border-${baseColor}`,
    };
  };
  
  const colorClasses = getColorClasses();

  // 필터된 국가 목록
  const availableCountries = countryCodes 
    ? apiCountries.filter(country => countryCodes.includes(country.code))
    : apiCountries;

  // 고정 국가인 경우 해당 국가 정보만 표시
  const baseCountries = fixedCountry 
    ? apiCountries.filter(country => country.code === fixedCountry)
    : availableCountries;

  // 검색 필터링
  const filteredCountries = baseCountries.filter(country => 
    country.code !== '---' && 
    (country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     country.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 현재 선택된 국가 정보
  const selectedCountry = apiCountries.find(country => country.code === value);

  // 라벨 텍스트 결정
  const getLabelText = (): string => {
    if (label) return label;
    if (fixedCountry === 'KR') return '국가';
    return 'Country';
  };

  // 드롭다운 열기
  const handleOpen = useCallback(() => {
    if (disabled || isLoadingCountries || fixedCountry) return;
    setIsOpen(true);
    setSearchTerm('');
    setSelectedIndex(-1);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [disabled, isLoadingCountries, fixedCountry]);

  // 국가 선택
  const handleSelect = useCallback((countryCode: string) => {
    onChange(countryCode);
    setIsOpen(false);
    setSearchTerm('');
    setSelectedIndex(-1);
  }, [onChange]);

  // 키보드 네비게이션
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCountries.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCountries.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredCountries[selectedIndex]) {
          handleSelect(filteredCountries[selectedIndex].code);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setSelectedIndex(-1);
        break;
    }
  }, [isOpen, filteredCountries, selectedIndex, handleSelect]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`space-y-1 ${className}`} ref={dropdownRef}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <label className="block text-xs font-medium text-muted-foreground">
            {getLabelText()}
          </label>
          
          {/* 로딩 및 새로고침 버튼 (고정 국가가 아닌 경우만) */}
          {!fixedCountry && (
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
          )}
        </div>
      )}
      
      <div className="relative">
        {/* 선택된 국가 표시 버튼 (닫힌 상태) */}
        {!isOpen && (
          <button
            type="button"
            onClick={handleOpen}
            disabled={disabled || isLoadingCountries}
            className={`
              w-full flex items-center px-3 py-2.5 text-sm rounded-lg border transition-colors text-left
              ${disabled || isLoadingCountries
                ? 'bg-muted text-muted-foreground cursor-not-allowed border-border/50' 
                : `bg-background border-border focus:ring-2 ${colorClasses.ring} ${colorClasses.border} hover:border-border/80`
              }
            `}
          >
            <Globe className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
            
            <span className="flex-1">
              {isLoadingCountries ? (
                'Loading countries...'
              ) : selectedCountry ? (
                `${selectedCountry.flag ? selectedCountry.flag + ' ' : ''}${selectedCountry.name}`
              ) : (
                'Select country...'
              )}
            </span>
            
            {fixedCountry ? (
              <span className="text-xs text-muted-foreground">Fixed</span>
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground ml-2 flex-shrink-0" />
            )}
          </button>
        )}

        {/* 검색 입력 (열린 상태) */}
        {isOpen && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search countries..."
              className={`
                w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border transition-colors
                bg-background border-border focus:ring-2 ${colorClasses.ring} ${colorClasses.border}
              `}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* 드롭다운 목록 */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground text-center">
                No countries found
              </div>
            ) : (
              filteredCountries.map((country, index) => {
                const isSelected = index === selectedIndex;
                const isCurrentValue = country.code === value;
                
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country.code)}
                    className={`
                      w-full text-left px-3 py-2.5 transition-colors flex items-center space-x-2
                      ${isSelected 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }
                      ${index === 0 ? 'rounded-t-lg' : ''}
                      ${index === filteredCountries.length - 1 ? 'rounded-b-lg' : ''}
                    `}
                  >
                    {isCurrentValue && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1">{country.name}</span>
                    <span className="text-xs text-muted-foreground">{country.code}</span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
// #endregion
