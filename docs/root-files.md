# 루트 디렉토리 설정 파일 가이드

이 문서는 프로젝트 루트 디렉토리에 위치한 주요 설정 파일들의 역할과 기능을 설명한다.

## 파일 목록 및 설명

### `next.config.ts`

Next.js 프레임워크의 핵심 설정 파일이다. 서버, 빌드, 라우팅, 환경 변수 등 프로젝트의 전반적인 동작을 제어한다. 주요 설정은 다음과 같다.

- **페이지 확장자**: `pageExtensions` 옵션을 통해 `page.tsx` 외에 `page.mdx` 등 다른 확장자를 페이지로 인식시킬 수 있다.
- **리액트 Strict Mode**: `reactStrictMode` 활성화 여부를 결정한다.
- **Webpack 설정 커스터마이징**: 필요시 Webpack 설정을 직접 수정할 수 있다.
- **리다이렉트 및 재작성**: `redirects`와 `rewrites`를 설정하여 특정 경로로의 요청을 다른 URL로 보내거나 마스킹할 수 있다.

---

### `tsconfig.json`

TypeScript 컴파일러(`tsc`)의 설정 파일이다. 이 파일은 어떤 파일을 컴파일할지, 어떤 컴파일 옵션을 적용할지 등을 정의한다.

- **`compilerOptions`**: `target` (ECMAScript 버전), `module` (모듈 시스템), `jsx` (JSX 처리 방식), `strict` (엄격한 타입 체크) 등 핵심 옵션을 포함한다.
- **`include` / `exclude`**: 컴파일 대상에 포함하거나 제외할 파일 및 디렉토리 패턴을 지정한다.
- **`paths`**: 모듈 경로에 대한 별칭(alias)을 설정하여, `../../components` 같은 복잡한 상대 경로 대신 `@/components` 같은 절대 경로를 사용할 수 있도록 한다.

---

### `postcss.config.js`

PostCSS 설정 파일이다. PostCSS는 CSS를 JavaScript 플러그인을 통해 변환하는 도구이며, Next.js는 Tailwind CSS를 처리하기 위해 내부적으로 PostCSS를 사용한다.

- **`plugins`**: `tailwindcss`, `autoprefixer` 등 PostCSS 플러그인을 등록한다. 이 플러그인들은 빌드 시점에 CSS를 스캔하고 필요한 코드를 생성하거나 브라우저 호환성을 위한 접두사(prefix)를 추가한다.

---

### `eslint.config.mjs`

ESLint 설정 파일이다. 코드의 잠재적 오류를 찾아내고 코딩 스타일을 일관되게 유지하기 위한 규칙을 정의한다.

- **`files`**: 특정 파일 패턴에만 규칙을 적용할 수 있다.
- **`rules`**: 개별 ESLint 규칙의 활성화 여부와 옵션을 설정한다. (예: `semi: ["error", "always"]`)
- **`plugins`**: 추가적인 규칙셋을 제공하는 플러그인을 설정한다. (예: `@typescript-eslint/eslint-plugin`)
- **`extends`**: `eslint-config-next`, `eslint-config-prettier` 등 미리 정의된 규칙 세트를 상속받아 사용한다.

---

### `components.json`

`shadcn/ui` 라이브러리의 설정 파일이다. CLI를 통해 컴포넌트를 추가하거나 업데이트할 때 이 파일을 참조한다.

- **`style`**: 컴포넌트의 기본 스타일을 지정한다. (`default` 또는 `new-york`)
- **`tailwind`**: Tailwind 설정 파일과 CSS 변수 파일의 경로를 지정한다.
- **`rsc`**: React Server Components (RSC) 사용 여부를 설정한다.
- **`aliases`**: 컴포넌트와 유틸리티 함수의 경로 별칭을 정의한다.

---

### `package-lock.json`

`npm`이 생성하고 관리하는 파일로, `package.json`을 기반으로 설치된 모든 패키지의 정확한 버전과 의존성 트리를 기록한다.

- **역할**: 이 파일 덕분에 다른 개발자나 배포 환경에서 `npm install`을 실행했을 때, 동일한 버전의 패키지들이 설치되는 것을 보장한다. (의존성 일관성 확보)
- **주의**: 이 파일은 직접 수정해서는 안 되며, `npm install`이나 `npm uninstall` 같은 명령어를 통해 `npm`이 자동으로 업데이트하도록 해야 한다.

---

### `next-env.d.ts`

Next.js 프로젝트에서 TypeScript를 사용할 때 자동으로 생성되는 타입 선언 파일이다.

- **역할**: Next.js가 사용하는 내장 타입(예: `*.png`, `*.svg` 등)을 TypeScript 컴파일러가 인식할 수 있도록 전역으로 선언해준다.
- **주의**: 이 파일은 Next.js가 관리하므로 직접 수정하지 않아야 한다.

---

### `playwright.config.ts`

Playwright E2E(End-to-End) 테스트 프레임워크의 설정 파일이다.

- **`webServer`**: 테스트 실행 전 개발 서버를 구동하는 명령어를 지정한다.
- **`use`**: 모든 테스트에 적용될 기본 설정을 정의한다. (예: `baseURL`, `trace` 옵션)
- **`projects`**: 데스크톱 크롬, 모바일 사파리 등 여러 브라우저와 환경에 대한 테스트 설정을 각각 정의할 수 있다.

---

### `vercel.json`

Vercel 플랫폼에 프로젝트를 배포하기 위한 설정 파일이다.

- **`builds`**: 프로젝트의 빌드 방법을 Vercel에 알린다. Next.js 프로젝트의 경우 대부분 자동 감지되므로 설정이 불필요할 수 있다.
- **`rewrites`, `redirects`**: Vercel 엣지에서 처리할 URL 재작성 및 리다이렉트 규칙을 정의한다.

---

### `.nvmrc`

Node Version Manager(NVM) 설정 파일이다.

- **역할**: 파일 안에 명시된 Node.js 버전을 사용하여 프로젝트를 개발하도록 강제한다.
- **사용법**: 터미널에서 `nvm use` 명령을 실행하면 `.nvmrc` 파일에 지정된 버전으로 Node.js가 자동 전환된다. 이를 통해 개발팀 전체가 동일한 Node.js 환경에서 작업할 수 있다.
