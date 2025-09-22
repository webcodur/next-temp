@echo off
REM GitLab subtree 풀
git subtree pull --prefix=docs/_fe https://gitlab.com/7meerkat/document/fe_development.git main --squash
pause
