# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development Server:**
```bash
npm run dev          # Start development server with Turbopack
```

**Build and Production:**
```bash
npm run build        # Build for production
npm run start        # Start production server
```

**Code Quality:**
```bash
npm run lint         # Run ESLint checks
```

**Testing:**
```bash
npx playwright test  # Run Playwright e2e tests
```

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.10 + Custom Neumorphism Design System
- **State Management**: Jotai for global state
- **Data Fetching**: TanStack Query v5 + Custom fetch client
- **UI Components**: Custom component library with Radix UI primitives
- **Internationalization**: next-intl for multi-language support (ko, en, ar)
- **Authentication**: JWT-based auth with cookie storage
- **Testing**: Playwright for e2e testing

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── layout/            # Header, Sidebar, Footer components
│   ├── ui/                # Reusable UI component library
│   │   ├── ui-input/      # Form inputs, buttons, fields
│   │   ├── ui-layout/     # Layout components, modals, dialogs
│   │   ├── ui-data/       # Tables, pagination, infinite scroll
│   │   ├── ui-effects/    # Animations, loading states, badges
│   │   └── ui-3d/         # Three.js components and 3D visualizations
│   └── view/              # Page-specific view components
├── services/              # API client functions (auto-generated pattern)
├── hooks/                 # Custom React hooks
├── store/                 # Jotai atoms for state management
├── styles/                # Design system CSS and global styles
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── locales/              # Internationalization files
```

### Design System

The project uses a comprehensive neumorphism-based design system:
- **Colors**: HSL-based dual theme system (light/dark mode)
- **Typography**: Multi-language font stacks (Pretendard for Korean, Cairo for Arabic, Inter for English)
- **Components**: Pre-built neumorphic styled components with consistent elevation and shadows
- **CSS Variables**: Systematic 10-level grayscale with semantic color mappings
- **Tailwind Config**: Extended with custom color scales and neumorphic utilities

Key design files:
- `src/styles/design-system.css` - Unified design system
- `src/styles/system/` - Modular CSS system files
- `.cursor/rules/design-guidelines.mdc` - Comprehensive design guidelines

### API Layer

Uses a standardized API client pattern:
- **File Naming**: `{domain}[@param][_{sub}[@param]][_$]_{HTTP_METHOD}.ts`
- **Function Naming**: `create*()`, `get*()`, `search*()`, `update*()`, `delete*()`
- **Response Format**: Consistent `{success: boolean, data?: any, errorMsg?: string}` structure
- **Authentication**: Auto-attached JWT Bearer tokens via `fetchClient.ts`
- **Base URL**: Configurable via `NEXT_PUBLIC_API_BASE_URL` environment variable

### Authentication System

JWT-based authentication with:
- Login/logout endpoints (`/auth/signin`, `/auth/logout`)
- Token refresh mechanism (`/auth/refresh`)
- Cookie-based token storage with `js-cookie`
- Automatic auth header injection
- Protected route middleware
- Demo accounts: `demo/1234` (user), `admin/admin123` (admin)

### Code Organization Patterns

**TSX File Structure:**
- File header comments with path/purpose/responsibility
- Organized imports (React → Third-party → Internal → Types)
- Region-based code organization with `#region` comments
- Vertical component nesting for complex features

**Component Architecture:**
- Manager → Card → Details pattern for complex features
- Reusable UI components in `components/ui/`
- Page-specific views in `components/view/`
- Co-located hooks and utilities

**State Management:**
- Global state with Jotai atoms in `src/store/`
- Component-specific state with React hooks
- Server state with TanStack Query

### Multi-language Support

Configured for Korean (default), English, and Arabic:
- RTL support for Arabic via `tailwindcss-rtl`
- Language-specific font loading and optimization
- Translation files in `src/locales/`
- Automatic language detection

### Testing Strategy

- E2e testing with Playwright
- Test configuration in `playwright.config.ts`
- Development server integration for testing

## Important Conventions

1. **File Structure**: Follow the vertical component structure pattern for complex features
2. **Naming**: Use consistent API function naming patterns as defined in `docs/rules/api-mapping.md`
3. **Styling**: Use the established neumorphism design system and CSS variables
4. **Types**: Define types in `src/types/` and import them consistently
5. **Authentication**: Use the provided auth hooks and middleware
6. **Internationalization**: Support all three languages (ko, en, ar) when adding new features

## Environment Configuration

Create `.env.local` for local development:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3003/api
NEXT_PUBLIC_API_TIMEOUT=30000
JWT_SECRET=your-jwt-secret
```