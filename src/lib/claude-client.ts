import Anthropic from "@anthropic-ai/sdk";
import type { PDFPage, ProofreadingError, ErrorType } from "./types";

// Claude API 클라이언트 초기화
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 유효한 오류 유형 목록
const VALID_ERROR_TYPES: ErrorType[] = [
  "오탈자",
  "조사 오류",
  "외래어 표기 오류",
  "맞춤법 오류",
  "띄어쓰기 오류",
  "구두점 오류",
  "표기 혼용",
  "연번 오류",
  "영문 오탈자",
  "어색한 표현",
  "중복 표현",
];

// 검토 회차별 시스템 프롬프트
const PROOFREAD_PROMPTS = {
  // 1차 검토: 조사 오류 집중
  1: `당신은 한국어 조사 전문가입니다. 문서에서 **조사 오류만** 철저히 찾으세요.

## 조사 선택 규칙 (받침 기준)

### 기본 규칙
| 앞 글자 | 을/를 | 이/가 | 은/는 | 과/와 | 으로/로 |
|---------|-------|-------|-------|-------|---------|
| 받침 있음 | 을 | 이 | 은 | 과 | 으로 |
| 받침 없음 | 를 | 가 | 는 | 와 | 로 |

### 구체적 예시
- 정책**을** (O), 정책**를** (X) - "책"에 받침 ㄱ
- 인재**를** (O), 인재**을** (X) - "재"에 받침 없음
- 멘토진**을** (O), 멘토진**를** (X) - "진"에 받침 ㄴ
- 역량**을** (O), 역량**를** (X) - "량"에 받침 ㅇ
- 시스템**을** (O), 시스템**를** (X) - "템"에 받침 ㅁ

### 괄호/따옴표 규칙 ⚠️ 반드시 확인!
조사는 **괄호 앞 단어**를 기준으로 선택 (괄호 안 내용은 무시!)
- 프리코스(사전교육)**을** (X) → 프리코스(사전교육)**를** (O)
  - "프리코스"의 "스"가 받침 없음 → "를"
  - 괄호 안 "육"의 받침이 아님!
- AI(인공지능)**이** (X) → AI(인공지능)**가** (O)
- SDK(개발도구)**을** (X) → SDK(개발도구)**를** (O)

### 영문 약어 규칙
영문은 발음 기준:
- AI → "에이아이" → 모음 끝 → 가, 를, 는
- API → "에이피아이" → 모음 끝 → 가, 를, 는
- SDK → "에스디케이" → 모음 끝 → 가, 를, 는

## 응답 형식 (필수!)
- currentContent: 틀린 부분을 **별표두개**로 감싸서 표시
- suggestedFix: 올바른 부분을 **별표두개**로 감싸서 표시
- 예: "멘토진**를**" → "멘토진**을**"

{"errors":[{"page":1,"location":"위치","currentContent":"전담 멘토진**를** 배치하여","suggestedFix":"전담 멘토진**을** 배치하여","errorType":"조사 오류"}]}`,

  // 2차 검토: 오탈자, 맞춤법, 외래어, 영문 오탈자 집중
  2: `당신은 맞춤법 전문가입니다. 문서에서 **오탈자, 맞춤법, 외래어, 영문 오탈자**를 철저히 찾으세요.

## 한글 오탈자
- 글자 순서 오류: 게획→계획, 왼력→인력
- 잘못된 글자: 프로토타이필→프로토타입

## 영문 오탈자 ⚠️ 중요!
영문 단어의 철자 오류를 반드시 찾으세요:
- Aplication→Application, Developement→Development
- Enviroment→Environment, Occured→Occurred
- Recieve→Receive, Seperate→Separate
- Managment→Management, Programing→Programming
- Buisness→Business, Accomodate→Accommodate
- 대소문자 오류도 확인 (API, SDK, AI 등)

## 맞춤법 오류
- 되/돼 혼동: 되요(X)→돼요(O)
- 않다/안하다: 않하다(X)→안 하다(O)
- 띄어쓰기: 할수(X)→할 수(O)

## 외래어 표기
- 스케쥴→스케줄, 컨텐츠→콘텐츠

## 무시할 항목
- 전문용어, 고유명사, 브랜드명
- 조사 오류 (1차에서 처리)

## 응답 형식 (필수!)
- currentContent: 틀린 부분을 **별표두개**로 감싸서 표시
- suggestedFix: 올바른 부분을 **별표두개**로 감싸서 표시

{"errors":[{"page":1,"location":"위치","currentContent":"**Developement** 환경","suggestedFix":"**Development** 환경","errorType":"영문 오탈자"}]}`,

  // 3차 검토: 전체 재검토
  3: `당신은 한국어 문서 교정 전문가입니다. 최종 점검으로 **놓친 오류**를 찾으세요.

## 중점 검토 항목
1. **조사 오류** - 특히 괄호/영문 뒤 조사
2. **오탈자** - 비슷한 글자 혼동 (한글/영문)
3. **영문 오탈자** - 철자 오류 (Developement→Development 등)
4. **맞춤법** - 되/돼, 않/안
5. **외래어** - 표준 표기

## 괄호 뒤 조사 재확인 ⚠️
괄호 안이 아닌 **괄호 앞 단어**가 기준!
- 프리코스(사전교육)**을** (X) → **를** (O) - "스" 받침 없음
- 멘토진**를** (X) → **을** (O) - "진" 받침 ㄴ

## 응답 형식 (필수!)
- currentContent: 틀린 부분을 **별표두개**로 감싸서 표시
- suggestedFix: 올바른 부분을 **별표두개**로 감싸서 표시

{"errors":[{"page":1,"location":"위치","currentContent":"프리코스(사전교육)**을** 통해","suggestedFix":"프리코스(사전교육)**를** 통해","errorType":"조사 오류"}]}`
} as const;

interface ClaudeProofreadResponse {
  errors: {
    page: number;
    location: string;
    currentContent: string;
    suggestedFix: string;
    errorType: string;
  }[];
}

/**
 * 텍스트 정규화 (비교용)
 * - **강조** 마크 제거
 * - 연속 공백 → 단일 공백
 * - 앞뒤 공백 제거
 * - 소문자 변환
 */
function normalizeText(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Claude API를 사용하여 문서 검토
 */
export async function proofreadWithClaude(
  pages: PDFPage[],
  reviewNumber: number
): Promise<ProofreadingError[]> {
  // 페이지 텍스트를 하나의 문자열로 결합
  const documentText = pages
    .map((page) => `[페이지 ${page.pageNumber}]\n${page.content}`)
    .join("\n\n---\n\n");

  // 검토 회차별 다른 프롬프트 사용
  const reviewPrompt = PROOFREAD_PROMPTS[reviewNumber as keyof typeof PROOFREAD_PROMPTS] || PROOFREAD_PROMPTS[3];

  const userPromptByReview = {
    1: `다음 문서에서 조사 오류(을/를, 이/가, 은/는, 와/과, 으로/로)를 모두 찾아주세요.
특히 괄호 뒤 조사, 영문 뒤 조사를 주의 깊게 확인하세요.

문서 내용:
${documentText}`,
    2: `다음 문서에서 오탈자, 맞춤법 오류, 외래어 표기 오류를 모두 찾아주세요.

문서 내용:
${documentText}`,
    3: `다음 문서를 최종 점검하여 놓친 오류를 찾아주세요.
조사, 오탈자, 맞춤법, 외래어 모든 유형을 확인하세요.

문서 내용:
${documentText}`
  };

  const userPrompt = userPromptByReview[reviewNumber as keyof typeof userPromptByReview] || userPromptByReview[3];

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      system: reviewPrompt,
    });

    // 응답에서 텍스트 추출
    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      console.error("Claude 응답에 텍스트가 없습니다");
      return [];
    }

    // JSON 파싱
    const jsonText = textContent.text.trim();
    let parsed: ClaudeProofreadResponse;

    try {
      // JSON 블록 추출 (```json ... ``` 형태일 수 있음)
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("JSON을 찾을 수 없습니다:", jsonText);
        return [];
      }
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON 파싱 오류:", parseError, jsonText);
      return [];
    }

    // 오류 목록 변환 및 ID 생성
    const errors: ProofreadingError[] = parsed.errors
      .filter((error) => {
        // 유효성 검증: currentContent와 suggestedFix가 다른지 확인
        const normalizedCurrent = normalizeText(error.currentContent);
        const normalizedFix = normalizeText(error.suggestedFix);

        if (normalizedCurrent === normalizedFix) {
          console.warn("무효한 오류 (동일 내용):", error);
          return false;
        }

        // 필수 필드 검증
        if (!error.currentContent || !error.suggestedFix || !error.errorType) {
          console.warn("무효한 오류 (필수 필드 누락):", error);
          return false;
        }

        return true;
      })
      .map((error, index) => ({
        id: `review-${reviewNumber}-error-${index}-${Date.now()}`,
        page: error.page,
        location: error.location,
        currentContent: error.currentContent,
        suggestedFix: error.suggestedFix,
        errorType: validateErrorType(error.errorType),
      }));

    console.log(`검토 ${reviewNumber}: ${parsed.errors.length}건 중 ${errors.length}건 유효`);
    return errors;
  } catch (error) {
    console.error("Claude API 호출 오류:", error);
    throw error;
  }
}

/**
 * 오류 유형 유효성 검사
 */
function validateErrorType(type: string): ErrorType {
  if (VALID_ERROR_TYPES.includes(type as ErrorType)) {
    return type as ErrorType;
  }
  // 가장 유사한 유형 찾기 또는 기본값 반환
  return "오탈자";
}

/**
 * 중복 오류 제거
 * suggestedFix 기반으로 정규화하여 중복 제거
 * (같은 수정 제안이면 동일 오류로 판단)
 */
export function deduplicateErrors(
  errors: ProofreadingError[]
): ProofreadingError[] {
  const seen = new Set<string>();
  return errors.filter((error) => {
    // suggestedFix를 정규화하여 키로 사용
    const normalizedFix = normalizeText(error.suggestedFix);
    const key = `${error.page}-${normalizedFix}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
