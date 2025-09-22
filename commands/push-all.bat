@echo off
REM ====================================
REM  Git Push All (Main + GitLab)
REM  목적: 메인 저장소와 GitLab 서브트리 모두 푸시
REM  사용법: push-all.bat 실행
REM ====================================

echo ====================================
echo   Git Push All (Main + GitLab)
echo ====================================

echo.
REM Step 1: 메인 저장소로 푸시
REM origin: 원격 저장소 이름 (GitHub 또는 기본 저장소)
REM main: 브랜치 이름
echo [1/2] Pushing to main repository...
git push origin main

echo.
REM Step 2: GitLab 서브트리로 푸시
REM --prefix: 서브트리로 관리할 디렉토리 경로
REM docs/_fe 디렉토리를 별도의 GitLab 저장소로 푸시
REM subtree push: 지정된 디렉토리만 별도 저장소로 푸시하는 Git 서브트리 기능
echo [2/2] Pushing to GitLab subtree...
git subtree push --prefix=docs/_fe https://gitlab.com/7meerkat/document/fe_development.git main

echo.
echo ====================================
echo   Both pushes complete!
echo ====================================

REM 사용자가 결과를 확인할 수 있도록 일시 정지
pause
