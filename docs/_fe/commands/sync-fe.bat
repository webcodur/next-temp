@echo off
REM ====================================
REM  GitLab Subtree Sync Script
REM  목적: GitLab 서브트리와 양방향 동기화
REM  사용법: sync-fe.bat [push|pull|both]
REM ====================================

REM 로컬 변수 영역 시작 (변수가 배치 파일 밖에 영향 주지 않도록)
setlocal

REM 환경 변수 설정
REM GitLab 저장소 URL
set GITLAB_URL=https://gitlab.com/7meerkat/document/fe_development.git
REM 서브트리로 관리할 로컬 디렉토리 경로
set PREFIX=docs/_fe
REM 대상 브랜치 이름
set BRANCH=main

REM 매개변수 체크: 명령어가 없으면 사용법 표시
if "%1"=="" goto usage

REM 명령어별 분기 처리
if "%1"=="push" goto push
if "%1"=="pull" goto pull
if "%1"=="both" goto both
REM 유효하지 않은 명령어면 사용법 표시
goto usage

:push
REM Push 작업: 로컬 변경사항을 GitLab으로 푸시
echo ====================================
echo   Pushing to GitLab...
echo ====================================
REM subtree push: 지정된 디렉토리만 별도 저장소로 푸시
git subtree push --prefix=%PREFIX% %GITLAB_URL% %BRANCH%
echo Push complete!
goto end

:pull
REM Pull 작업: GitLab의 변경사항을 로컬로 가져오기
echo ====================================
echo   Pulling from GitLab...
echo ====================================
REM subtree pull: 원격 저장소의 변경사항을 서브트리로 가져옴
REM --squash: 히스토리를 하나의 커밋으로 압축하여 깔끔한 히스토리 유지
git subtree pull --prefix=%PREFIX% %GITLAB_URL% %BRANCH% --squash
echo Pull complete!
goto end

:both
REM Both 작업: Pull 후 Push (완전 동기화)
echo ====================================
echo   Full Sync (Pull then Push)
echo ====================================
echo.
REM Step 1: 먼저 원격 변경사항을 로컬로 가져옴 (충돌 방지)
echo [1/2] Pulling from GitLab...
git subtree pull --prefix=%PREFIX% %GITLAB_URL% %BRANCH% --squash
echo.
REM Step 2: 로컬 변경사항을 원격으로 푸시
echo [2/2] Pushing to GitLab...
git subtree push --prefix=%PREFIX% %GITLAB_URL% %BRANCH%
echo.
echo Full sync complete!
goto end

:usage
REM 사용법 안내 메시지
echo.
echo Usage: %0 [push^|pull^|both]
echo.
echo Commands:
echo   push  - Push local changes to GitLab
echo   pull  - Pull changes from GitLab
echo   both  - Pull then Push (full sync)
echo.
echo Example:
echo   %0 push
echo   %0 pull
echo   %0 both

:end
REM 사용자가 결과를 확인할 수 있도록 일시 정지
pause
REM 로컬 변수 영역 종료
endlocal
