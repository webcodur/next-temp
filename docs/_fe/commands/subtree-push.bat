@echo off
REM GitLab subtree 푸시
git subtree push --prefix=docs/_fe https://gitlab.com/7meerkat/document/fe_development.git main
pause
