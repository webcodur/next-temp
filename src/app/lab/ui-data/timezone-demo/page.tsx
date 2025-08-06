'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/ui-effects/card/Card';
import timezone, { getUserTimezone, type TimezoneInfo } from '@/utils/timezone';

/**
 * UTC 시간 변환 유틸리티 데모 페이지
 */
export default function TimezoneDemoPage() {
  const [userTimezone, setUserTimezone] = useState<TimezoneInfo | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // 예시 UTC 시간들
  const sampleUtcTimes = [
    '2024-01-15T09:30:00Z', // 오전
    '2024-01-15T14:45:00Z', // 오후
    '2024-01-14T23:15:00Z', // 어제
    '2024-01-13T16:20:00Z', // 2일 전
  ];

  useEffect(() => {
    setUserTimezone(getUserTimezone());
    
    // 실시간 시계
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!userTimezone) {
    return <div>시간대 정보를 불러오는 중...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">UTC 시간 변환 데모</h1>
        <p className="text-gray-600">
          DB에 저장된 UTC 시간을 사용자 시간대로 변환하는 예시
        </p>
      </div>

      {/* 사용자 시간대 정보 */}
      <Card title="현재 시간대 정보">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">시간대:</span>
              <span className="ml-2">{userTimezone.timezone}</span>
            </div>
            <div>
              <span className="font-medium">UTC 오프셋:</span>
              <span className="ml-2">{userTimezone.offsetString}</span>
            </div>
            <div>
              <span className="font-medium">지역:</span>
              <span className="ml-2">{userTimezone.city}</span>
            </div>
            <div>
              <span className="font-medium">현재 시간:</span>
              <span className="ml-2 font-mono">
                {currentTime.toLocaleString('ko-KR')}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 변환 예시 */}
      <Card title="UTC → 로컬 시간 변환 예시">
        <div className="space-y-4">
          {sampleUtcTimes.map((utcTime, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">DB 저장값 (UTC):</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {utcTime}
                  </code>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">전체 날짜시간:</span>
                    <div className="font-mono text-sm">
                      {timezone.formatDateTime(utcTime)}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">상대 시간:</span>
                    <div className="font-mono text-sm">
                      {timezone.formatRelativeTime(timezone.utcToLocal(utcTime))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">날짜만:</span>
                    <div className="font-mono text-sm">
                      {timezone.formatDate(utcTime)}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">시간만:</span>
                    <div className="font-mono text-sm">
                      {timezone.formatTime(utcTime)}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {timezone.isToday(utcTime) && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      오늘
                    </span>
                  )}
                  {timezone.isYesterday(utcTime) && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                      어제
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 포맷 옵션 예시 */}
      <Card title="다양한 포맷 옵션">
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">기본 (한국어):</span>
              <div className="font-mono mt-1">
                {timezone.formatDateTime(sampleUtcTimes[0])}
              </div>
            </div>
            
            <div>
              <span className="font-medium">영어:</span>
              <div className="font-mono mt-1">
                {timezone.formatDateTime(sampleUtcTimes[0], { locale: 'en-US' })}
              </div>
            </div>
            
            <div>
              <span className="font-medium">날짜만:</span>
              <div className="font-mono mt-1">
                {timezone.formatDateTime(sampleUtcTimes[0], { format: 'date' })}
              </div>
            </div>
            
            <div>
              <span className="font-medium">시간만 (초 포함):</span>
              <div className="font-mono mt-1">
                {timezone.formatDateTime(sampleUtcTimes[0], { 
                  format: 'time', 
                  includeSeconds: true 
                })}
              </div>
            </div>
            
            <div>
              <span className="font-medium">12시간 형식:</span>
              <div className="font-mono mt-1">
                {timezone.formatDateTime(sampleUtcTimes[0], { 
                  format: 'time', 
                  use24Hour: false 
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 시간 계산 예시 */}
      <Card title="시간 차이 계산">
        <div className="space-y-3">
          {sampleUtcTimes.slice(0, -1).map((startTime, index) => {
            const endTime = sampleUtcTimes[index + 1];
            const diff = timezone.getTimeDifference(startTime, endTime);
            
            return (
              <div key={index} className="border rounded-lg p-3">
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium">시작:</span>
                    <span className="ml-2 font-mono">
                      {timezone.formatDateTime(startTime)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">종료:</span>
                    <span className="ml-2 font-mono">
                      {timezone.formatDateTime(endTime)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">차이:</span>
                    <span className="ml-2">
                      {diff.days > 0 && `${diff.days}일 `}
                      {diff.hours > 0 && `${diff.hours}시간 `}
                      {diff.minutes > 0 && `${diff.minutes}분`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 사용법 가이드 */}
      <Card title="사용법">
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">기본 사용법:</h4>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
{`import timezone from '@/utils/timezone';

// DB에서 받은 UTC 시간 변환
const utcTime = '2024-01-15T09:30:00Z';
const localTime = timezone.formatDateTime(utcTime);

// 상대 시간 표시
const relativeTime = timezone.formatRelativeTime(
  timezone.utcToLocal(utcTime)
);

// 시간대 정보 가져오기
const userTz = timezone.getUserTimezone();`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">주요 함수:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li><code>utcToLocal()</code> - UTC를 로컬 Date 객체로 변환</li>
              <li><code>formatDateTime()</code> - 다양한 포맷으로 시간 표시</li>
              <li><code>formatRelativeTime()</code> - [2시간 전] 형태로 표시</li>
              <li><code>getUserTimezone()</code> - 사용자 시간대 정보 조회</li>
              <li><code>isToday()</code>, <code>isYesterday()</code> - 날짜 비교</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}