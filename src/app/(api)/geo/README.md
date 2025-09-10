# 📍 Geo API - 지오코딩 서비스

네이버 클라우드 플랫폼(NCP) Maps API를 활용한 지오코딩 서비스 집합입니다.

## 📂 API 목록

### 1. `/geo/geocoding` - 주소 → 좌표 변환
**목적**: 주소 문자열을 경위도 좌표로 변환

**메소드**: `POST`

**요청 본문**:
```json
{
  "address": "서울특별시 강남구 테헤란로 152"
}
```

**응답**:
```json
{
  "coordinates": {
    "longitude": 127.0276,
    "latitude": 37.5012
  }
}
```

**사용처**:
- ✅ `@/services/geo/geoService.ts` → `addressToCoords()` 함수 (클라이언트 래퍼)
- ✅ `@/components/ui/ui-input/address-input/AddressInput_NAVER.tsx` → 직접 API 호출로 지도 좌표 표시
- 🔄 **확장 예정**: 주소 입력 컴포넌트들에서 활용

---

### 2. `/geo/search` - 주소 검색 (다중 결과)
**목적**: 주소 키워드로 검색하여 다양한 결과와 좌표를 제공

**메소드**: `POST`

**요청 본문**:
```json
{
  "query": "강남구 테헤란로"
}
```

**응답**:
```json
{
  "addresses": [
    {
      "address": "서울특별시 강남구 테헤란로 152",
      "roadAddress": "서울특별시 강남구 테헤란로 152",
      "jibunAddress": "서울특별시 강남구 역삼동 737",
      "englishAddress": "152 Teheran-ro, Gangnam-gu, Seoul",
      "x": 127.0276,
      "y": 37.5012,
      "addressElements": {...}
    }
  ],
  "totalCount": 1
}
```

**사용처**:
- ✅ `@/services/geo/geoService.ts` → `searchAddress()` 함수 (클라이언트 래퍼)
- 🔄 **확장 예정**: 주소 자동완성 기능, 사용자 입력에 따른 주소 후보 제공

---

### 3. `/geo/reverse-geocoding` - 좌표 → 주소 변환
**목적**: 경위도 좌표를 주소로 변환

**메소드**: `POST`

**요청 본문**:
```json
{
  "latitude": 37.5012,
  "longitude": 127.0276
}
```

**응답**:
```json
{
  "address": {
    "fullAddress": "서울특별시 강남구 역삼동 737",
    "roadAddress": "서울특별시 강남구 테헤란로 152",
    "jibunAddress": "서울특별시 강남구 역삼동 737",
    "si": "서울특별시",
    "gu": "강남구", 
    "dong": "역삼동",
    "detail": "737"
  }
}
```

**사용처**:
- ✅ `@/services/geo/geoService.ts` → `coordsToAddress()` 함수 (클라이언트 래퍼)
- 🔄 **확장 예정**: 위치 기반 서비스에서 GPS 좌표를 주소로 표시, 지도 클릭 시 주소 표시

## 📊 현재 사용 현황

| API | 서비스 함수 | 직접 호출 | 상태 |
|-----|-------------|-----------|------|
| `/geo/geocoding` | ✅ `addressToCoords()` | ✅ AddressInput_NAVER | 활성 |
| `/geo/search` | ✅ `searchAddress()` | ❌ | 준비됨 |
| `/geo/reverse-geocoding` | ✅ `coordsToAddress()` | ❌ | 준비됨 |

## 🚀 사용 방법

### 클라이언트에서 사용 (권장)

```typescript
import { addressToCoords, searchAddress, coordsToAddress } from '@/services/geo';

// 1. 주소 → 좌표
const result = await addressToCoords('서울특별시 강남구 테헤란로 152');
if (result.success) {
  console.log(result.data.coordinates); // { longitude: 127.0276, latitude: 37.5012 }
}

// 2. 주소 검색  
const searchResult = await searchAddress('강남구 테헤란로');
if (searchResult.success) {
  console.log(searchResult.data.addresses); // 검색 결과 배열
}

// 3. 좌표 → 주소
const addressResult = await coordsToAddress(37.5012, 127.0276);
if (addressResult.success) {
  console.log(addressResult.data.address.fullAddress); // "서울특별시 강남구 역삼동 737"
}
```

### 직접 API 호출

```typescript
// 예시: fetch를 직접 사용
const response = await fetch('/geo/geocoding', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ address: '서울특별시 강남구 테헤란로 152' })
});
const data = await response.json();
```

## ⚠️ 중요 사항

### NCP Maps API 사용
- **✅ 사용**: Application Service > Maps API (`https://maps.apigw.ntruss.com`)
- **❌ 금지**: AI·NAVER API > Maps (`https://naveropenapi.apigw.ntruss.com`)
- **이유**: Application Service만 무료 할당량을 제공

### 환경 변수 필요
```env
NEXT_PUBLIC_NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret
```

### API 제한사항
- **일일 호출 제한**: NCP 콘솔에서 설정한 할당량
- **요청 속도 제한**: 초당 10회 (NCP 기본값)
- **동시 연결**: 최대 100개 (NCP 기본값)

## 🔧 개발 가이드

### API 추가 시
1. `src/app/(api)/geo/새기능/route.ts` 생성
2. `src/services/geo/geoService.ts`에 클라이언트 함수 추가
3. `src/services/geo/index.ts`에 export 추가

### 에러 처리
- **400**: 요청 데이터 누락 (`address`, `query`, `latitude`, `longitude`)
- **404**: 주소/좌표를 찾을 수 없음
- **500**: 서버 설정 오류 (API 키 누락) 또는 NCP API 장애

### 테스트 데이터
```typescript
// 테스트용 좌표들
const TEST_COORDS = {
  seoul: { lat: 37.5665, lng: 126.9780 },
  busan: { lat: 35.1796, lng: 129.0756 },
  gangnam: { lat: 37.5012, lng: 127.0276 }
};

// 테스트용 주소들
const TEST_ADDRESSES = [
  "서울특별시 중구 세종대로 110", // 시청
  "서울특별시 강남구 테헤란로 152", // 강남역
  "부산광역시 해운대구 해운대해변로 264" // 해운대
];
```

---

**📝 마지막 업데이트**: 2025년 9월  
**🔗 관련 문서**: [NCP Maps API 공식 문서](https://api.ncloud-docs.com/docs/ko/application-maps-overview)

## 🎯 다음 할 일

- [ ] SimpleAddressInput에서 geo 서비스 함수 활용
- [ ] 주소 자동완성 기능에 `/geo/search` API 적용
- [ ] 지도 클릭 시 `/geo/reverse-geocoding` 활용한 주소 표시
- [ ] API 응답 캐싱으로 성능 최적화
