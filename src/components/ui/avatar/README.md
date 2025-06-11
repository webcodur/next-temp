# Avatar 컴포넌트

사용자 아바타를 표시하는 컴포넌트입니다.

## 구성 요소

- `Avatar` - 기본 아바타 컨테이너
- `AvatarImage` - 아바타 이미지
- `AvatarFallback` - 이미지 로드 실패 시 대체 콘텐츠

## 사용법

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// 기본 사용
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

// 사이즈 변경
<Avatar className="w-12 h-12">
  <AvatarImage src="/user.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

## 기능

- Radix UI Avatar 기반
- 이미지 로드 실패 시 자동 Fallback
- 접근성 지원
- 커스텀 스타일링 가능