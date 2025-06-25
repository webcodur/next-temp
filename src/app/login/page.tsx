'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/layout/login/LoginForm';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      // TODO: 실제 로그인 API 호출 구현
      console.log('로그인 시도:', data);
      
      // 임시 로그인 처리 (2초 후)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 로그인 성공 시 홈으로 이동
      router.push('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      // TODO: 에러 토스트 표시
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <LoginForm 
          onSubmit={handleLogin}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 