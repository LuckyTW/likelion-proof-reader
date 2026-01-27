# Document Proofreader - AI 문서 교정 시스템

PDF 문서를 업로드하면 Claude AI가 3회 반복 검토하여 한국어 오류(오탈자, 조사, 맞춤법 등)를 찾아 표 형식으로 보여주는 Next.js 웹앱

## Design Reference
https://github.com/LuckyTW/sisu-cal 스타일 참조
- 한국어 인터페이스, 미니멀 카드 레이아웃
- shadcn/ui 컴포넌트 적극 활용
- 다크/라이트 모드 지원, 모바일 반응형

## Tech Stack
- Next.js 14 (App Router), TypeScript
- Tailwind CSS, shadcn/ui
- Anthropic Claude API (claude-sonnet-4-20250514)
- pdf-parse (PDF 텍스트 추출)
- xlsx (Excel 내보내기)
- react-dropzone (파일 업로드)

## Core User Flow
```
[PDF 업로드] → [AI 3회 반복 검토] → [결과 테이블] → [Excel/CSV 내보내기]
```

## Key Features

### 1. 파일 업로드
- react-dropzone 드래그앤드롭
- PDF만 허용, 최대 50MB
- 업로드 상태 표시

### 2. AI 검토 (3회 반복)
- POST /api/proofread
- 진행 상황 실시간 표시 (1차/2차/3차 검토 중...)
- 중복 오류 자동 제거

### 3. 결과 테이블
| 페이지 | 위치 | 현재 내용 | 수정 제안 | 오류 유형 |
- `**강조**` 패턴 → 노란색 하이라이트 변환
- 오류 유형별 컬러 Badge
- 필터(오류유형별), 정렬(페이지순/유형순)

### 4. 내보내기
- Excel (.xlsx), CSV 다운로드 버튼

## Error Types (11종)
```typescript
type ErrorType =
  | '오탈자' | '조사 오류' | '외래어 표기 오류' | '맞춤법 오류'
  | '띄어쓰기 오류' | '구두점 오류' | '표기 혼용'
  | '연번 오류' | '영문 오탈자' | '어색한 표현' | '중복 표현';
```

## Directory Structure
```
app/
├── page.tsx                 # 메인 페이지
├── layout.tsx
├── globals.css
└── api/
    ├── upload/route.ts      # PDF 업로드 및 텍스트 추출
    ├── proofread/route.ts   # Claude AI 검토
    └── export/route.ts      # Excel/CSV 생성
components/
├── file-uploader.tsx        # 드래그앤드롭 업로드
├── proofreading-result.tsx  # 결과 테이블
├── progress-indicator.tsx   # 검토 진행 상황
├── export-buttons.tsx       # 내보내기 버튼
├── header.tsx               # 헤더
└── ui/                      # shadcn 컴포넌트
lib/
├── types.ts                 # 타입 정의
├── claude-client.ts         # Claude API 래퍼
├── pdf-parser.ts            # PDF 파싱 유틸
└── utils.ts                 # 유틸리티 함수
```

## Claude API Prompt (검토용)
```
당신은 꼼꼼하고 철저한 문서관리자입니다.
한국어 문서를 검토하여 다음 오류를 찾으세요:
- 오탈자, 조사 오류(을/를, 이/가, 은/는, 와/과)
- 외래어 표기 오류, 맞춤법 오류, 띄어쓰기 오류
- 구두점 오류, 표기 혼용, 연번 오류
- 영문 오탈자, 어색한 표현, 중복 표현

JSON 형식으로 반환:
{"errors":[{"page":number,"location":"위치","currentContent":"현재 **강조**","suggestedFix":"수정 **강조**","errorType":"유형"}]}
```

## shadcn Components Needed
Button, Card, Table, Badge, Progress, Tabs, Dialog, Input, Separator, Skeleton

## Environment Variables
```
ANTHROPIC_API_KEY=
```

## Implementation Priority
1. 타입 정의 (lib/types.ts)
2. 기본 레이아웃 및 헤더
3. 파일 업로드 컴포넌트
4. API 라우트 (upload → proofread → export)
5. 결과 테이블 컴포넌트
6. 진행 상황 표시
7. 내보내기 기능
8. 다크모드 및 반응형 마무리
```

---

## 🚀 Claude Code 시작 프롬프트

스타터 프로젝트 폴더에서 Claude Code를 실행한 후, 아래 프롬프트를 입력하세요:
```
CLAUDE.md를 읽고 프로젝트를 파악한 뒤, 다음 순서로 구현을 시작해줘:

1단계: 기초 설정
- 필요한 npm 패키지 설치 (pdf-parse, xlsx, react-dropzone, @anthropic-ai/sdk)
- shadcn/ui 컴포넌트 추가 (Button, Card, Table, Badge, Progress, Tabs, Input, Separator, Skeleton)
- lib/types.ts에 타입 정의

2단계: 레이아웃
- app/layout.tsx 기본 설정
- components/header.tsx 생성 (로고, 다크모드 토글)
- sisu-cal 스타일 참조하여 깔끔한 한국어 UI

3단계: 메인 페이지 기본 구조
- app/page.tsx에 3단계 플로우 UI 구성
  (업로드 영역 → 검토 진행 → 결과 테이블)

각 단계 완료 후 확인받고 다음으로 진행해줘.
```

---

## 📋 이후 단계별 프롬프트 (참고용)

**4단계 - 파일 업로드:**
```
components/file-uploader.tsx를 구현해줘:
- react-dropzone 사용
- PDF만 허용, 드래그앤드롭 + 클릭
- 업로드 상태 표시 (대기/업로드중/완료/오류)
- sisu-cal 스타일의 깔끔한 카드 디자인
```

**5단계 - API 라우트:**
```
API 라우트를 구현해줘:
1. app/api/upload/route.ts - PDF 받아서 텍스트 추출
2. app/api/proofread/route.ts - Claude API로 3회 반복 검토
3. lib/claude-client.ts - Claude API 래퍼 함수
```

**6단계 - 결과 테이블:**
```
components/proofreading-result.tsx를 구현해줘:
- shadcn Table 사용
- **강조** 패턴을 노란색 하이라이트로 변환
- 오류 유형별 컬러 Badge
- 필터 (오류 유형별), 정렬 (페이지순/유형순)
- 결과 요약 (총 N건 발견)
```

**7단계 - 내보내기:**
```
내보내기 기능을 구현해줘:
- components/export-buttons.tsx
- app/api/export/route.ts
- Excel (.xlsx)과 CSV 두 가지 포맷
- xlsx 라이브러리 사용