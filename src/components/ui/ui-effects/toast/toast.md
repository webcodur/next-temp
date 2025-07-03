# Toast 컴포넌트

Sonner 라이브러리 기반의 토스트 알림 시스템입니다.

## 구성 요소

### ToastProvider
앱 전역에서 토스트 알림을 사용할 수 있게 하는 컨텍스트 프로바이더

### toast 함수
다양한 타입의 토스트 알림을 표시하는 함수

## 주요 특징

- **Sonner 기반**: 성능과 접근성에 최적화된 라이브러리
- **다양한 타입**: 성공, 에러, 경고, 정보 알림 지원
- **자동 위치 조정**: 화면 하단 중앙에 표시
- **컬러 시스템**: richColors 옵션으로 직관적인 색상 구분
- **자동 사라짐**: 3초 후 자동 제거
- **스택 관리**: 여러 토스트 자동 배치 및 관리

## 기본 설정

### 1. 프로바이더 설정

앱의 최상위에 ToastProvider를 배치하세요:

```tsx
import { ToastProvider } from '@/components/ui/ui-effects/toast/Toast';

function App() {
  return (
    <ToastProvider>
      {/* 앱 컨텐츠 */}
    </ToastProvider>
  );
}
```

### 2. 토스트 사용

```tsx
import { toast } from '@/components/ui/ui-effects/toast/Toast';

function MyComponent() {
  const handleSuccess = () => {
    toast.success('성공적으로 저장되었습니다!');
  };

  const handleError = () => {
    toast.error('오류가 발생했습니다.');
  };

  return (
    <div>
      <button onClick={handleSuccess}>성공 토스트</button>
      <button onClick={handleError}>에러 토스트</button>
    </div>
  );
}
```

## Toast 타입별 사용법

### 기본 토스트

```tsx
toast('기본 메시지입니다.');
```

### 성공 토스트

```tsx
toast.success('작업이 성공적으로 완료되었습니다!');
```

### 에러 토스트

```tsx
toast.error('오류가 발생했습니다. 다시 시도해주세요.');
```

### 경고 토스트

```tsx
toast.warning('주의가 필요한 상황입니다.');
```

### 정보 토스트

```tsx
toast.info('새로운 업데이트가 있습니다.');
```

### 로딩 토스트

```tsx
const loadingToast = toast.loading('처리 중입니다...');

// 작업 완료 후
toast.success('완료되었습니다!', { id: loadingToast });
```

## 고급 사용법

### 커스텀 지속 시간

```tsx
toast.success('이 메시지는 5초간 표시됩니다.', {
  duration: 5000
});
```

### 무한 지속 (수동 닫기)

```tsx
toast.error('수동으로 닫아야 하는 중요한 오류', {
  duration: Infinity
});
```

### 액션 버튼 포함

```tsx
toast('파일이 삭제되었습니다.', {
  action: {
    label: '되돌리기',
    onClick: () => {
      // 되돌리기 로직
      toast.success('파일이 복원되었습니다.');
    }
  }
});
```

### 커스텀 설명

```tsx
toast.success('업로드 완료', {
  description: '파일이 성공적으로 업로드되었습니다.'
});
```

### 커스텀 스타일

```tsx
toast('커스텀 스타일 토스트', {
  style: {
    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
    color: 'white'
  }
});
```

## 토스트 제어

### 모든 토스트 닫기

```tsx
import { toast } from '@/components/ui/ui-effects/toast/Toast';

toast.dismiss(); // 모든 토스트 닫기
```

### 특정 토스트 닫기

```tsx
const toastId = toast('닫을 수 있는 토스트');
toast.dismiss(toastId);
```

### 프로미스 기반 토스트

```tsx
const myPromise = fetch('/api/data');

toast.promise(myPromise, {
  loading: '데이터를 불러오는 중...',
  success: (data) => '데이터를 성공적으로 불러왔습니다!',
  error: '데이터를 불러오는데 실패했습니다.'
});
```

## 실제 사용 예시

### 폼 제출 처리

```tsx
function ContactForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const loadingToast = toast.loading('메시지를 전송하는 중...');
    
    try {
      await submitForm(formData);
      toast.success('메시지가 성공적으로 전송되었습니다!', {
        id: loadingToast
      });
    } catch (error) {
      toast.error('전송에 실패했습니다. 다시 시도해주세요.', {
        id: loadingToast
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 폼 필드들 */}
      <button type="submit">전송</button>
    </form>
  );
}
```

### 파일 업로드

```tsx
function FileUpload() {
  const handleUpload = async (files) => {
    for (const file of files) {
      const uploadPromise = uploadFile(file);
      
      toast.promise(uploadPromise, {
        loading: `${file.name} 업로드 중...`,
        success: `${file.name} 업로드 완료!`,
        error: `${file.name} 업로드 실패`
      });
    }
  };

  return (
    <input 
      type="file" 
      multiple 
      onChange={(e) => handleUpload(e.target.files)} 
    />
  );
}
```

### 데이터 저장

```tsx
function SaveButton({ data }) {
  const handleSave = async () => {
    try {
      await saveData(data);
      toast.success('변경사항이 저장되었습니다.', {
        action: {
          label: '확인',
          onClick: () => window.location.reload()
        }
      });
    } catch (error) {
      toast.error('저장 중 오류가 발생했습니다.', {
        description: error.message,
        duration: 5000
      });
    }
  };

  return (
    <button onClick={handleSave}>
      저장
    </button>
  );
}
```

## 설정 옵션

현재 기본 설정:
- **위치**: `bottom-center` (화면 하단 중앙)
- **컬러**: `richColors` 활성화
- **지속시간**: `3000ms` (3초)

### 커스텀 설정

ToastProvider에서 설정을 변경하려면:

```tsx
<Toaster 
  position="top-right"
  expand={false}
  richColors={true}
  toastOptions={{
    duration: 4000,
    style: {
      background: 'var(--background)',
      color: 'var(--foreground)',
      border: '1px solid var(--border)'
    }
  }}
/>
```

## 접근성 기능

Sonner는 기본적으로 다음 접근성 기능을 제공합니다:

- **ARIA 라이브 영역**: 스크린 리더 자동 읽기
- **키보드 지원**: ESC 키로 토스트 닫기
- **포커스 관리**: 토스트 내 버튼 포커스 처리
- **고대비 모드**: 시스템 설정 자동 적용

## 테마 지원

현재 시스템의 다크/라이트 모드와 자동으로 연동됩니다:

```tsx
// 다크 모드에서 자동으로 어두운 배경 적용
// 라이트 모드에서 자동으로 밝은 배경 적용
toast.success('테마에 맞게 자동 스타일링됩니다.');
``` 