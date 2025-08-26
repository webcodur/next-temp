# API 파일명 규칙

## 디렉토리 구조
```
src/services/
├── admin/           # 관리자 관리
├── auth/            # 인증
└── ...              # 기타...
└── fetchClient.ts   # HTTP 클라이언트
```

## 파일명 규칙
**패턴**: `{도메인}[@파라미터][_{서브리소스}[@파라미터]][_$]_{HTTP메소드}.ts`

**핵심 예시**:
- `admin_POST.ts` (생성)
- `admin$_GET.ts` (검색 - 쿼리 파라미터)
- `admin@id_GET.ts` (상세 조회)
- `admin@id_PUT.ts` (수정)
- `admin@id_DELETE.ts` (삭제)

## 함수명 규칙

**HTTP 메소드별 패턴**:
- `search{Entity}()` - 검색/목록 (GET with $)
- `get{Entity}Detail()` - 상세 조회 (GET with @id)
- `create{Entity}()` - 생성 (POST)
- `update{Entity}()` - 수정 (PUT)
- `delete{Entity}()` - 삭제 (DELETE)