# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 명령어

```bash
npm run dev      # 개발 서버 실행 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

## 아키텍처 개요

Next.js 16 App Router 기반 스타터킷. React 19, TypeScript strict 모드, Tailwind CSS v4 사용.

### 디렉토리 구조

```
src/
├── app/                    # App Router (페이지, 레이아웃)
├── components/
│   ├── ui/                 # shadcn/ui 원자 컴포넌트 (Radix UI 기반)
│   ├── common/             # 프로젝트 공통 컴포넌트 (Logo, ThemeToggle)
│   ├── layout/             # 레이아웃 컴포넌트 (Header, Footer, Container, Section)
│   └── providers/          # 컨텍스트 제공자 (ThemeProvider)
├── hooks/                  # 커스텀 훅 (useMediaQuery, useBreakpoint)
├── lib/
│   ├── utils.ts            # cn() 함수 (Tailwind 클래스 병합)
│   └── validations/        # Zod 스키마 (contact, login, signup)
├── store/                  # Zustand 상태 관리 (ui-store)
├── config/                 # 사이트 설정 (site.ts: 메타데이터, 네비게이션)
└── types/                  # TypeScript 타입 정의
```

### 핵심 패턴

- **경로 별칭**: `@/*` → `./src/*`
- **shadcn/ui 설정**: components.json 참조, `new-york` 스타일
- **테마**: next-themes 기반 다크/라이트 모드, OKLch 컬러 시스템 (globals.css)
- **폼 처리**: React Hook Form + Zod 검증 조합
- **상태 관리**: Zustand (UI 상태: 모바일메뉴, 사이드바)
- **반응형**: Mobile-first, Tailwind 브레이크포인트 (hooks/use-media-query.ts)

### 컴포넌트 추가

shadcn/ui 컴포넌트 추가 시:
```bash
npx shadcn@latest add [컴포넌트명]
```

### 주요 설정 파일

- `components.json`: shadcn/ui 설정
- `src/config/site.ts`: 사이트 메타데이터, 네비게이션, 푸터 링크
- `src/app/globals.css`: Tailwind v4 + CSS 변수 (테마 색상)
