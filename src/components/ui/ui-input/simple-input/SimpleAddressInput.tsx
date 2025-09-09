/* 
  파일명: /simple-input/SimpleAddressInput.tsx
  기능: Simple-Input 패턴의 주소 입력 컴포넌트
  책임: 모달 기반 지역 선택 후 해당 주소 입력 처리
*/ // ------------------------------

import React, { useState, useRef } from 'react';
import { MapPin, X, Globe, Keyboard } from 'lucide-react';
import Image from 'next/image';

import type { ValidationRule } from '@/utils/validation';
import { validateField } from '@/utils/validation';

import { InputContainer } from './shared/InputContainer';
import { Button } from '@/components/ui/ui-input/button/Button';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';

import { AddressInput_NAVER } from '../address-input/AddressInput_NAVER';
import { AddressInput_Global } from '../address-input/AddressInput_Global';
import { AddressInput_Direct } from '../address-input/AddressInput_Direct';

import type { AddressData, GlobalAddressData, DirectAddressData, ENUM_Region } from '../address-input/types';

// #region 타입 정의
export interface SimpleAddressInputProps {
  label?: string;
  value?: string; // 기존 시스템과 호환성을 위해 string으로 받음
  onChange?: (value: string) => void; // 기존 시스템과 호환성을 위해 string으로 반환
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  validationRule?: ValidationRule;
  colorVariant?: 'primary' | 'secondary';
  
  // 기존 시스템 호환성: 분리된 주소 필드들
  onAddressChange?: (parts: {
    fullAddress: string;
    region?: string; // 시/도
    city?: string; // 시/군/구
    district?: string; // 동/읍/면
    coordinates?: {
      longitude: number;
      latitude: number;
    };
  }) => void;
}
// #endregion
export const SimpleAddressInput: React.FC<SimpleAddressInputProps> = ({
  label = '',
  value = '',
  onChange,
  disabled = false,
  className = '',
  validationRule,
  colorVariant = 'primary',
  onAddressChange,
}) => {
  // #region 상태
  const [isFocused, setIsFocused] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<ENUM_Region | null>(null);
  const [tempAddress, setTempAddress] = useState<AddressData | GlobalAddressData | DirectAddressData | null>(null); // 임시 주소 상태
  // 초기 value가 있으면 currentAddress로 설정
  const [currentAddress, setCurrentAddress] = useState<AddressData | GlobalAddressData | DirectAddressData | null>(
    value ? { fullAddress: value } as DirectAddressData : null
  ); // 현재 확정된 주소
  const inputRef = useRef<HTMLInputElement>(null);
  // #endregion

  // #region 핸들러
  const handleFocus = () => {
    if (disabled) return;
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleContainerClick = () => {
    if (disabled) return;
    setAddressModalOpen(true);
    // 모달 열릴 때 기본 탭을 한국으로 설정
    if (!selectedRegion) {
      setSelectedRegion('korea');
    }
    // 현재 주소가 있으면 임시 주소로 설정
    if (currentAddress) {
      setTempAddress(currentAddress);
    }
    inputRef.current?.focus();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange?.('');
    onAddressChange?.({
      fullAddress: '',
    });
    setCurrentAddress(null); // 현재 주소도 초기화
    inputRef.current?.focus();
  };

  // 지역 선택 핸들러
  const handleRegionSelect = (region: ENUM_Region) => {
    setSelectedRegion(region);
    // 지역이 변경되면 임시 주소 초기화
    setTempAddress(null);
  };

  // 모달 닫기 핸들러 (X 버튼이나 백드롭 클릭)
  const handleModalClose = () => {
    setAddressModalOpen(false);
    // 모달이 닫힐 때는 상태만 초기화하고 값은 유지
    setTempAddress(null); // 임시 주소만 초기화
  };

  // 임시 주소 변경 핸들러 (즉시 적용하지 않음)
  const handleTempAddressChange = (address: AddressData | GlobalAddressData | DirectAddressData | null) => {
    setTempAddress(address);
  };

  // 주소 변경 핸들러 (변경 버튼 클릭 시)
  const handleChangeAddress = () => {
    if (!tempAddress) {
      onChange?.('');
      onAddressChange?.({
        fullAddress: '',
      });
      setCurrentAddress(null);
    } else {
      onChange?.(tempAddress.fullAddress);
      setCurrentAddress(tempAddress); // 현재 주소 업데이트
      
      // 상세 주소 정보 전달
      if (onAddressChange) {
        if ('region' in tempAddress && tempAddress.region) {
          // 한국 주소인 경우
          onAddressChange({
            fullAddress: tempAddress.fullAddress,
            region: tempAddress.region,
            city: tempAddress.city,
            district: tempAddress.district,
            coordinates: tempAddress.coordinates
          });
        } else if ('country' in tempAddress && tempAddress.country) {
          // 글로벌 주소인 경우
          onAddressChange({
            fullAddress: tempAddress.fullAddress,
            coordinates: tempAddress.coordinates
          });
        } else {
          // 직접입력 주소인 경우
          onAddressChange({
            fullAddress: tempAddress.fullAddress,
            coordinates: tempAddress.coordinates
          });
        }
      }
    }
    
    // 변경 버튼 클릭 시 모달은 열린 상태 유지
    // 사용자가 계속 수정할 수 있도록 함
  };

  // validation 결과 계산
  const validationResult = validationRule ? validateField(value, validationRule) : null;
  
  // 피드백 타입 결정
  const getFeedbackType = () => {
    if (!validationRule || !validationResult) return 'info';
    if (validationRule.mode === 'edit' && !disabled && validationResult.hasValue) {
      return validationResult.isValid ? 'success' : 'error';
    }
    return 'info';
  };
  // #endregion

  // #region 렌더링
  return (
    <div className={`relative ${className}`}>
      <div className="flex justify-between items-center">
        {label && (
          <label className="text-sm font-medium leading-6 text-foreground">
            {label}
          </label>
        )}
      </div>

      <InputContainer
        isFocused={isFocused}
        disabled={disabled}
        colorVariant={colorVariant}
        validationStatus={getFeedbackType()}
        onClick={handleContainerClick}>
        
        {/* 왼쪽 지도 아이콘 */}
        <MapPin className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-muted-foreground" />

        {/* 중앙 표시 영역 */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          readOnly
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="주소를 입력하세요"
          disabled={disabled}
          className={`w-full pl-10 pr-10 text-sm font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground placeholder:select-none text-foreground text-start cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
        />

        {/* 우측 X 아이콘 */}
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 p-1 rounded-full transition-colors duration-200 transform -translate-y-1/2 hover:bg-muted"
            aria-label="값 지우기">
            <X className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </InputContainer>

      {/* 통합 주소 입력 모달 */}
      <Modal
        isOpen={addressModalOpen}
        onClose={handleModalClose}
        title="주소 입력"
        size="lg"
      >
        <div className="space-y-6">
          {/* 지역 선택 탭 */}
          <Tabs
            tabs={[
              {
                id: 'korea',
                label: '한국 주소',
                icon: <Image src="/icons/flags/KR.svg" alt="한국 국기" width={16} height={16} className="w-4 h-4" />
              },
              {
                id: 'global',
                label: 'global address',
                icon: <Globe className="w-4 h-4" />
              },
              {
                id: 'direct',
                label: '직접 입력',
                icon: <Keyboard className="w-4 h-4" />
              }
            ]}
            activeId={selectedRegion || 'korea'}
            onTabChange={(id) => handleRegionSelect(id as ENUM_Region)}
          />

          {/* 현재 주소 표시 영역 */}
          {currentAddress && (
            <div className="p-3 mb-4 rounded-lg border bg-muted/30 border-border/50">
              <div className="text-xs font-medium text-muted-foreground mb-1">현재 주소</div>
              <div className="text-sm text-foreground">{currentAddress.fullAddress}</div>
            </div>
          )}
          
          {/* 주소 입력 영역 */}
          {selectedRegion && (
            <div className="space-y-6">
              <div>
                {selectedRegion === 'korea' && (
                  <AddressInput_NAVER
                    colorVariant={colorVariant}
                    value={tempAddress && 'region' in tempAddress ? tempAddress as AddressData : null}
                    onChange={handleTempAddressChange}
                    showDetailAddress={true}
                  />
                )}
                
                {selectedRegion === 'global' && (
                  <AddressInput_Global
                    colorVariant={colorVariant}
                    value={tempAddress && 'country' in tempAddress ? tempAddress as GlobalAddressData : null}
                    onChange={handleTempAddressChange}
                  />
                )}
                
                {selectedRegion === 'direct' && (
                  <AddressInput_Direct
                    colorVariant={colorVariant}
                    value={tempAddress && !('region' in tempAddress) && !('country' in tempAddress) ? tempAddress as DirectAddressData : null}
                    onChange={handleTempAddressChange}
                  />
                )}
              </div>
              
              {/* 하단 버튼 - 변경 버튼만 표시 */}
              <div className="flex justify-end pt-4 border-t">
                <Button
                  variant="primary"
                  onClick={handleChangeAddress}
                  disabled={disabled || !tempAddress}
                >
                  변경
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
  // #endregion
};
