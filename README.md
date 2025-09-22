# 프론트엔드 개발 문서 (Git Subtree)

이 디렉토리는 **Git Subtree**로 관리되는 프론트엔드 개발 문서 저장소입니다.

## 저장소 정보

- **원격 저장소**: https://gitlab.com/7meerkat/document/fe_development.git
- **관리 방식**: Git Subtree
- **로컬 경로**: `docs/_fe/`
- **목적**: 여러 프론트엔드 프로젝트에서 공유하는 개발 가이드, 프롬프트, 템플릿 관리

## 프로젝트 목적

이 subtree 프로젝트는 다음과 같은 목적으로 만들어졌습니다:

1. **중앙화된 문서 관리**: 모든 프론트엔드 프로젝트가 공유하는 문서를 한 곳에서 관리
2. **AI 협업 최적화**: Claude, Cursor 등 AI 도구를 위한 프롬프트와 컨텍스트 제공
3. **일관성 유지**: 프로젝트 간 코딩 규칙, 구조, 패턴의 일관성 확보
4. **효율적인 업데이트**: 한 번의 수정으로 모든 프로젝트에 반영 가능

## 디렉토리 구조

```
_fe/
├── _nextjs/                    # Next.js 관련 문서
│   ├── frontend-documentation-ideas.txt
│   └── nextjs-prompt-management.txt
├── documentation/              # 일반 문서화 가이드
├── subtree/                    # Git Subtree 관련 문서
└── README.md                   # 현재 파일
```

## 동기화 방법

### GitLab에서 최신 변경사항 받기 (Pull)

```bash
git subtree pull --prefix=docs/_fe https://gitlab.com/7meerkat/document/fe_development.git main --squash
```

### 로컬 변경사항을 GitLab으로 보내기 (Push)

```bash
git subtree push --prefix=docs/_fe https://gitlab.com/7meerkat/document/fe_development.git main
```

### Windows 배치 파일 사용

프로젝트 루트에 제공된 배치 파일을 사용하면 더 편리합니다:

```cmd
# GitLab 동기화
sync-fe.bat push    # GitLab으로 push
sync-fe.bat pull    # GitLab에서 pull
sync-fe.bat both    # pull 후 push (전체 동기화)

# 양쪽 저장소 모두 push
push-all.bat        # 메인 저장소 + GitLab 동시 push
```

## 워크플로우

### 1. 문서 수정 및 기여

```bash
# 1. 파일 수정
edit docs/_fe/새문서.md

# 2. 로컬 커밋
git add docs/_fe/
git commit -m "문서 추가/수정"

# 3. 메인 프로젝트에 push (선택)
git push origin main

# 4. GitLab에도 push (다른 프로젝트와 공유)
git subtree push --prefix=docs/_fe https://gitlab.com/7meerkat/document/fe_development.git main
```

### 2. 다른 프로젝트에서 사용

```bash
# 새 프로젝트에 subtree 추가
cd /path/to/new-project
git subtree add --prefix=docs/_fe https://gitlab.com/7meerkat/document/fe_development.git main --squash

# 기존 프로젝트 업데이트
git subtree pull --prefix=docs/_fe https://gitlab.com/7meerkat/document/fe_development.git main --squash
```

## 주요 내용

### Next.js 프롬프트 관리
- AI 도구(Claude, Cursor)를 위한 프롬프트 템플릿
- 프로젝트 구조 표준화 가이드
- 코드 스타일 및 컨벤션

### 프론트엔드 문서화
- 컴포넌트 시스템 설계
- 상태 관리 전략
- API 통합 패턴
- 성능 최적화 가이드
- 테스팅 전략

### Git Subtree 가이드
- Subtree 설정 및 관리 방법
- 다중 프로젝트 동기화 전략
- 문제 해결 가이드

## 주의사항

### 권장 사항
- 공통으로 사용할 수 있는 일반적인 내용만 추가
- 정기적으로 pull하여 최신 상태 유지
- 의미 있는 커밋 메시지 작성
- PR/MR을 통한 검토 프로세스 준수

### 금지 사항
- 프로젝트 특화 내용 추가 금지
- 민감한 정보(API 키, 비밀번호 등) 포함 금지
- Force push 사용 자제
- 대용량 바이너리 파일 추가 금지

## 기여 방법

1. **Feature 브랜치 생성**
   ```bash
   git subtree push --prefix=docs/_fe https://gitlab.com/7meerkat/document/fe_development.git feature/your-feature
   ```

2. **GitLab에서 Merge Request 생성**
   - 변경사항 설명
   - 영향 범위 명시
   - 테스트 결과 포함

3. **리뷰 및 병합**
   - 팀원 리뷰
   - 피드백 반영
   - main 브랜치에 병합

## 관련 리소스

- [Git Subtree 공식 문서](https://git-scm.com/book/en/v2/Git-Tools-Subtree-Merging)
- [GitLab Repository](https://gitlab.com/7meerkat/document/fe_development)
- [Next.js 공식 문서](https://nextjs.org/docs)

## 동기화 상태

이 문서가 있는 프로젝트: **backbone**

다른 연결된 프로젝트들:
- (추후 추가될 프로젝트 목록)

## 유용한 팁

### Git Alias 설정 (권장)

```bash
# 한 번만 실행
git config alias.fe-pull 'subtree pull --prefix=docs/_fe https://gitlab.com/7meerkat/document/fe_development.git main --squash'
git config alias.fe-push 'subtree push --prefix=docs/_fe https://gitlab.com/7meerkat/document/fe_development.git main'

# 사용
git fe-pull  # GitLab에서 받기
git fe-push  # GitLab으로 보내기
```

### 충돌 해결

Pull 시 충돌이 발생하면:
1. 충돌 파일 확인: `git status`
2. 수동으로 충돌 해결
3. 해결 후 커밋: `git add . && git commit -m "충돌 해결"`

### 히스토리 정리

Subtree 히스토리가 복잡해진 경우:
```bash
# 기존 subtree 제거
git rm -rf docs/_fe
git commit -m "Reset subtree"

# 다시 추가 (--squash 옵션 필수)
git subtree add --prefix=docs/_fe https://gitlab.com/7meerkat/document/fe_development.git main --squash
```

---

*최종 업데이트: 2024-09-22*
*관리: 7meerkat team*