/* 
  파일명: /hooks/usePlacesAutocomplete.ts
  기능: Google Places API 자동완성 훅 (Hybrid 방식)
  책임: 새로운 API 우선 사용, fallback으로 기존 API 지원
  참조: https://developers.google.com/maps/documentation/javascript/legacy/places-migration-overview
*/ // ------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback, useRef } from 'react';

// #region 타입 정의
export interface PlaceResult {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  types: string[];
  structuredFormatting: {
    mainText: string;
    secondaryText: string;
  };
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  formattedAddress: string;
  addressComponents: Array<{
    longName: string;
    shortName: string;
    types: string[];
  }>;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
}

export interface ParsedAddress {
  street?: string;
  streetNumber?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  countryCode?: string;
}

// Google Places API 타입 정의 (기존 API와 호환)
declare global {
  interface Window {
    google?: {
      maps?: {
        importLibrary?(library: string): Promise<any>;
        places?: {
          AutocompleteService?: new () => {
            getPlacePredictions(request: any, callback: (predictions: any, status: any) => void): void;
          };
          PlacesService?: new (element: HTMLElement) => {
            getDetails(request: any, callback: (place: any, status: any) => void): void;
          };
          AutocompleteSessionToken?: new () => any;
          PlacesServiceStatus?: {
            OK: any;
            ZERO_RESULTS: any;
          };
          // 새로운 API들
          Place?: new (options: { id: string }) => {
            fetchFields(options: { fields: string[] }): Promise<any>;
          };
          AutocompleteSuggestion?: {
            fetchAutocompleteSuggestions(request: any): Promise<{
              suggestions: Array<{
                placePrediction: any;
              }>;
            }>;
          };
        };
      };
    };
  }
}
// #endregion

// #region Places API 훅
export const usePlacesAutocomplete = (options: {
  countryRestriction?: string;
  types?: string[];
  sessionToken?: string;
  language?: string; // 언어 설정 추가
}) => {
  // 상태 관리
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 세션 토큰 참조
  const sessionToken = useRef<any>(null);
  const placesLibrary = useRef<any>(null);

  // Places 라이브러리 로드 및 초기화
  const loadPlacesLibrary = useCallback(async () => {
    try {
      if (!placesLibrary.current && window.google?.maps) {
        try {
          // 새로운 동적 라이브러리 import 시도
          placesLibrary.current = await window.google.maps.importLibrary?.("places");
        } catch (error) {
          console.warn('동적 라이브러리 로드 실패, 기존 방식 사용:', error);
          placesLibrary.current = window.google.maps.places;
        }
        
        if (!sessionToken.current && window.google.maps.places?.AutocompleteSessionToken) {
          sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
        }
        return true;
      }
      return placesLibrary.current !== null;
    } catch (error) {
      console.error('Places 라이브러리 로드 실패:', error);
      return false;
    }
  }, []);

  // 주소 자동완성 검색
  const searchPlaces = useCallback(async (input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const isLibraryLoaded = await loadPlacesLibrary();
    if (!isLibraryLoaded) {
      setError('Google Maps Places 라이브러리를 로드할 수 없습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 새로운 AutocompleteSuggestion API 시도
      if (window.google?.maps?.places?.AutocompleteSuggestion) {
        const request = {
          input: input.trim(),
          sessionToken: sessionToken.current,
          types: options.types || ['address'],
          componentRestrictions: options.countryRestriction ? {
            country: options.countryRestriction
          } : undefined,
          language: options.language || 'en', // 언어 설정 추가
        };

        try {
          const response = await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
          
          if (response?.suggestions) {
            const results: PlaceResult[] = response.suggestions.map((suggestion: any) => {
              const prediction = suggestion.placePrediction || suggestion;
              const text = prediction.text || prediction.description || '';
              const structured = prediction.structuredFormat || prediction.structured_formatting || {};
              
              const mainText = structured.mainText?.text || structured.main_text || text;
              const secondaryText = structured.secondaryText?.text || structured.secondary_text || '';
              
              return {
                placeId: prediction.placeId || prediction.place_id || '',
                description: text,
                mainText: mainText,
                secondaryText: secondaryText,
                types: prediction.types || [],
                structuredFormatting: {
                  mainText: mainText,
                  secondaryText: secondaryText
                }
              };
            });
            
            setSuggestions(results);
            setIsLoading(false);
            return;
          }
        } catch (newApiError) {
          // 새로운 API 실패 시 fallback으로 넘어감
          const errorMessage = newApiError instanceof Error ? newApiError.message : String(newApiError);
          console.warn('새로운 AutocompleteSuggestion API 사용 불가:', errorMessage);
        }
      }
      
      // Fallback: 기존 AutocompleteService 사용
      if (window.google?.maps?.places?.AutocompleteService) {
        const autocompleteService = new window.google.maps.places.AutocompleteService();
        
        const legacyRequest = {
          input: input.trim(),
          sessionToken: sessionToken.current,
          types: options.types || ['address'],
          componentRestrictions: options.countryRestriction ? {
            country: options.countryRestriction
          } : undefined,
          language: options.language || 'en', // 언어 설정 추가
        };
        
        autocompleteService.getPlacePredictions(
          legacyRequest,
          (predictions: any, status: any) => {
            setIsLoading(false);

            if (status === window.google?.maps?.places?.PlacesServiceStatus?.OK && predictions) {
              const results: PlaceResult[] = predictions.map((prediction: any) => {
                const mainText = prediction.structured_formatting?.main_text || prediction.description || '';
                const secondaryText = prediction.structured_formatting?.secondary_text || '';
                
                return {
                  placeId: prediction.place_id || '',
                  description: prediction.description || '',
                  mainText: mainText,
                  secondaryText: secondaryText,
                  types: prediction.types || [],
                  structuredFormatting: {
                    mainText: mainText,
                    secondaryText: secondaryText
                  }
                };
              });
              
              setSuggestions(results);
            } else if (status === window.google?.maps?.places?.PlacesServiceStatus?.ZERO_RESULTS) {
              setSuggestions([]);
            } else {
              setError('자동완성 검색 중 오류가 발생했습니다.');
              setSuggestions([]);
            }
          }
        );
      } else {
        setError('Google Places API를 사용할 수 없습니다.');
        setIsLoading(false);
      }
      
    } catch (err) {
      setIsLoading(false);
      setError('검색 중 오류가 발생했습니다.');
      console.error('Places Autocomplete error:', err);
    }
  }, [options.countryRestriction, options.types, options.language, loadPlacesLibrary]);

  // 장소 상세 정보 조회
  const getPlaceDetails = useCallback(async (placeId: string): Promise<PlaceDetails | null> => {
    const isLibraryLoaded = await loadPlacesLibrary();
    if (!isLibraryLoaded) {
      throw new Error('Google Maps Places 라이브러리를 로드할 수 없습니다.');
    }

    try {
      // 새로운 Place 클래스 시도
      if (window.google?.maps?.places?.Place) {
        try {
          const place = new window.google.maps.places.Place({ id: placeId });
          
          const result = await place.fetchFields({
            fields: ['id', 'displayName', 'formattedAddress', 'addressComponents', 'location', 'types']
            // 새로운 API는 전역 언어 설정을 따름
          });
          
          if (result) {
            const details: PlaceDetails = {
              placeId: placeId,
              name: result.displayName?.text || '',
              formattedAddress: result.formattedAddress || '',
              addressComponents: result.addressComponents?.map((component: any) => ({
                longName: component.longText,
                shortName: component.shortText,
                types: component.types
              })) || [],
              geometry: {
                location: {
                  lat: result.location?.lat() || 0,
                  lng: result.location?.lng() || 0
                }
              },
              types: result.types || []
            };
            return details;
          }
        } catch (newApiError) {
          console.warn('새로운 Place API 실패:', newApiError);
        }
      }
      
    } catch (err) {
      console.warn('새로운 Place.fetchFields 실패, 기존 API 사용:', err);
    }
    
    // Fallback: 기존 PlacesService 사용
    if (window.google?.maps?.places?.PlacesService) {
      const div = document.createElement('div');
      const placesService = new window.google.maps.places.PlacesService(div);
      
      return new Promise((resolve) => {
        const request = {
          placeId,
          fields: [
            'name',
            'formatted_address', 
            'address_components',
            'geometry.location',
            'types'
          ],
          sessionToken: sessionToken.current,
          language: options.language || 'en' // 언어 설정 추가
        };

        placesService.getDetails(request, (place: any, status: any) => {
          if (status === window.google?.maps?.places?.PlacesServiceStatus?.OK && place) {
            const details: PlaceDetails = {
              placeId,
              name: place.name || '',
              formattedAddress: place.formatted_address || '',
              addressComponents: place.address_components?.map((component: any) => ({
                longName: component.long_name,
                shortName: component.short_name,
                types: component.types
              })) || [],
              geometry: {
                location: {
                  lat: place.geometry?.location?.lat() || 0,
                  lng: place.geometry?.location?.lng() || 0
                }
              },
              types: place.types || []
            };
            resolve(details);
          } else {
            resolve(null);
          }
        });
      });
    }
    
    return null;
  }, [loadPlacesLibrary, options.language]);

  // 주소 구성요소 파싱
  const parseAddressComponents = useCallback((components: PlaceDetails['addressComponents']): ParsedAddress => {
    const parsed: ParsedAddress = {};
    
    components.forEach(component => {
      const { longName, shortName, types } = component;
      
      if (types.includes('street_number')) {
        parsed.streetNumber = longName;
      } else if (types.includes('route')) {
        parsed.street = `${parsed.streetNumber ? parsed.streetNumber + ' ' : ''}${longName}`;
      } else if (types.includes('locality') || types.includes('sublocality')) {
        parsed.city = longName;
      } else if (types.includes('administrative_area_level_1')) {
        parsed.state = longName;
      } else if (types.includes('postal_code')) {
        parsed.postalCode = longName;
      } else if (types.includes('country')) {
        parsed.country = longName;
        parsed.countryCode = shortName;
      }
    });
    
    return parsed;
  }, []);

  // 세션 토큰 초기화
  const resetSession = useCallback(() => {
    if (window.google?.maps?.places?.AutocompleteSessionToken) {
      sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
    }
  }, []);

  // 검색 결과 초기화
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    // 상태
    suggestions,
    isLoading,
    error,
    
    // 메서드
    searchPlaces,
    getPlaceDetails,
    parseAddressComponents,
    clearSuggestions,
    resetSession,
    
    // 유틸리티
    isApiReady: loadPlacesLibrary
  };
};
// #endregion