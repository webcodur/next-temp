/* 
  파일명: /components/view/_pages/instance/basic/resident-panel/ResidentManagementOverlay.tsx
  기능: 주민 관리 모드 오버레이 UI 컴포넌트
  책임: 차량-주민 연결/해제, 소유자/알람 설정 UI를 제공한다.
*/ // ------------------------------

'use client';

import React from 'react';
import { Plus, Unplug, X, CarFront, BellRing, Link } from 'lucide-react';
import { Button } from '@/components/ui/ui-input/button/Button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/ui-effects/tooltip/Tooltip';
import type { CarResidentWithDetails } from '@/types/car';

// #region 타입 및 인터페이스
interface ResidentManagementOverlayProps {
  residentId: number;
  isConnected: boolean;
  carResident?: CarResidentWithDetails;
  loadingCarResidents: boolean;
  onConnectResident: (residentId: number) => void;
  onDisconnectResident: (residentId: number) => void;
  onTogglePrimary: (residentId: number) => void;
  onToggleAlarm: (residentId: number) => void;
}
// #endregion

export default function ResidentManagementOverlay({
  residentId,
  isConnected,
  carResident,
  loadingCarResidents,
  onConnectResident,
  onDisconnectResident,
  onTogglePrimary,
  onToggleAlarm
}: ResidentManagementOverlayProps) {

  if (loadingCarResidents) {
    return (
      <div className="flex absolute right-0 bottom-0 left-0 top-16 z-10 justify-center items-center rounded-b-lg backdrop-blur-sm bg-black/10">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 rounded-full text-sm text-muted-foreground shadow-sm">
          <div className="w-3 h-3 rounded-full border-2 border-current animate-spin border-t-transparent"></div>
          로딩 중...
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex absolute right-0 bottom-0 left-0 top-16 z-10 justify-center items-center rounded-b-lg backdrop-blur-sm bg-black/10">
        <div className="flex gap-3 items-center">
        {isConnected ? (
          <>
            {/* 연결 해지 버튼 */}
            <div className="relative group">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDisconnectResident(residentId)}
                    icon={Unplug}
                    className="w-12 h-12 min-w-12 text-white bg-red-500 rounded-full shadow-lg transition-all duration-200 hover:bg-red-600 hover:scale-110 hover:shadow-xl border-none [&_svg]:size-5 [&_svg]:transition-all [&_svg]:duration-200 [&_svg]:group-hover:scale-110 [&_svg]:group-hover:rotate-90"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>차량 연결 해지</p>
                </TooltipContent>
              </Tooltip>
              {/* 경고 표시 */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full border-2 border-white shadow-sm opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
                <X size={8} className="absolute inset-0 m-auto text-white" />
              </div>
            </div>

            {/* 차량 소유자 설정 버튼 */}
            <div className="relative group">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onTogglePrimary(residentId)}
                    icon={CarFront}
                    className={`w-12 h-12 min-w-12 text-white rounded-full transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl border-2 [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:group-hover:scale-110 ${
                      carResident?.isPrimary 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-blue-300 shadow-blue-200' 
                        : 'bg-gray-400 hover:bg-gray-500 border-gray-300'
                    }`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{`차량 소유자 설정 ${carResident?.isPrimary ? '(활성)' : '(비활성)'}`}</p>
                </TooltipContent>
              </Tooltip>
              {/* 차량 소유자 활성화 표시 */}
              <div className={`absolute -top-1 -right-1 w-5 h-5 border-2 border-white rounded-full transition-all duration-200 shadow-md pointer-events-none ${
                carResident?.isPrimary 
                  ? 'bg-green-500 opacity-100 scale-100' 
                  : 'bg-red-400 opacity-80 scale-90'
              }`}>
                {carResident?.isPrimary ? (
                  <div className="w-full h-full bg-green-400 rounded-full animate-ping pointer-events-none"></div>
                ) : (
                  <div className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              {/* 기능 라벨 */}
              <div className="absolute -bottom-8 left-1/2 opacity-0 transition-opacity duration-200 transform -translate-x-1/2 pointer-events-none group-hover:opacity-100">
                <div className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap shadow-sm ${
                  carResident?.isPrimary 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  차량 소유자
                </div>
              </div>
            </div>
            
            {/* 알람 설정 버튼 */}
            <div className="relative group">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onToggleAlarm(residentId)}
                    icon={BellRing}
                    className={`w-12 h-12 min-w-12 text-white rounded-full transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl border-2 [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:group-hover:scale-110 ${carResident?.carAlarm ? '[&_svg]:animate-pulse' : ''} ${
                      carResident?.carAlarm 
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 border-orange-300 shadow-orange-200' 
                        : 'bg-gray-400 hover:bg-gray-500 border-gray-300'
                    }`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{`알람 설정 ${carResident?.carAlarm ? '(활성)' : '(비활성)'}`}</p>
                </TooltipContent>
              </Tooltip>
              {/* 알람 활성화 표시 */}
              <div className={`absolute -top-1 -right-1 w-5 h-5 border-2 border-white rounded-full transition-all duration-200 shadow-md pointer-events-none ${
                carResident?.carAlarm 
                  ? 'bg-yellow-500 opacity-100 scale-100' 
                  : 'bg-gray-500 opacity-80 scale-90'
              }`}>
                {carResident?.carAlarm ? (
                  <div className="w-full h-full bg-yellow-400 rounded-full animate-ping pointer-events-none"></div>
                ) : (
                  <div className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              {/* 기능 라벨 */}
              <div className="absolute -bottom-8 left-1/2 opacity-0 transition-opacity duration-200 transform -translate-x-1/2 pointer-events-none group-hover:opacity-100">
                <div className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap shadow-sm ${
                  carResident?.carAlarm 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  알람
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 연결 추가 버튼 */}
            <div className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onConnectResident(residentId)}
                    icon={Plus}
                    className="w-16 h-16 min-w-16 text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg transition-all duration-300 animate-pulse hover:from-green-600 hover:to-emerald-600 hover:scale-110 hover:shadow-xl hover:animate-none border-none [&_svg]:size-7 [&_svg]:transition-all [&_svg]:duration-300 [&_svg]:group-hover:rotate-90"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>차량과 연결</p>
                </TooltipContent>
              </Tooltip>
              {/* 펄스 효과 */}
              <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-ping pointer-events-none"></div>
              {/* 연결 아이콘 */}
              <div className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-sm pointer-events-none">
                <Link size={12} className="text-green-600" />
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </TooltipProvider>
  );
}
