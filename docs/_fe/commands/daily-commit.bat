@echo off
REM ====================================
REM  Daily Commit and Push Script
REM  목적: 매일 자동 커밋 및 푸시를 위한 스크립트
REM  사용법: daily-commit.bat 실행
REM ====================================

echo ====================================
echo   Daily Commit and Push
echo ====================================

REM Windows 시스템에서 현재 날짜/시간 가져오기
REM wmic 명령어를 사용해 시스템 날짜/시간을 가져옴
REM wmic 출력 형식: localdatetime=20240922123456.123456+540
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"

REM 날짜/시간 문자열 파싱 (YYYYMMDDHHmmss 형식에서 추출)
set "YY=%dt:~0,4%"   REM 연도 (0번째부터 4자리)
set "MM=%dt:~4,2%"   REM 월 (4번째부터 2자리)
set "DD=%dt:~6,2%"   REM 일 (6번째부터 2자리)
set "HH=%dt:~8,2%"   REM 시간 (8번째부터 2자리)
set "MIN=%dt:~10,2%" REM 분 (10번째부터 2자리)

REM 커밋 메시지 생성 (형식: "Update: YYYY-MM-DD HH:MM")
set COMMIT_MSG="Update: %YY%-%MM%-%DD% %HH%:%MIN%"

echo.
echo Commit message: %COMMIT_MSG%
echo.

REM Step 1: 모든 변경사항을 스테이징 영역에 추가
REM -A 옵션: 모든 변경사항 (새 파일, 수정된 파일, 삭제된 파일) 추가
echo [1/3] Adding all changes...
git add -A

echo.
REM Step 2: 스테이징된 변경사항 커밋
REM -m 옵션: 커밋 메시지를 명령줄에서 직접 지정
echo [2/3] Committing...
git commit -m %COMMIT_MSG%

echo.
REM Step 3: main 브랜치로 푸시
REM origin: 원격 저장소 이름, main: 브랜치 이름
echo [3/3] Pushing to main...
git push origin main

echo.
echo ====================================
echo   Daily update complete!
echo ====================================

REM 사용자가 결과를 확인할 수 있도록 일시 정지
pause
