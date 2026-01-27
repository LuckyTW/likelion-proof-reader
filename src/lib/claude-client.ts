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

// 검토 프롬프트
const PROOFREAD_SYSTEM_PROMPT = `당신은 꼼꼼하고 철저한 문서관리자입니다.
한국어 문서를 검토하여 다음 오류를 찾으세요:

1. 오탈자 - 잘못 입력된 글자
2. 조사 오류 - 을/를, 이/가, 은/는, 와/과 등의 잘못된 사용
3. 외래어 표기 오류 - 외래어 표기법에 맞지 않는 표기
4. 맞춤법 오류 - 한글 맞춤법에 맞지 않는 표기
5. 띄어쓰기 오류 - 잘못된 띄어쓰기
6. 구두점 오류 - 쉼표, 마침표 등의 잘못된 사용
7. 표기 혼용 - 같은 단어의 다른 표기 혼용 (예: 웹사이트/웹 사이트)
8. 연번 오류 - 번호 순서 오류
9. 영문 오탈자 - 영어 단어의 철자 오류
10. 어색한 표현 - 문맥상 어색하거나 부자연스러운 표현
11. 중복 표현 - 의미가 중복되는 표현

중요:
- 오류가 있는 부분은 **강조** 형식으로 표시해주세요.
- 확실한 오류만 보고하고, 불확실한 경우는 제외하세요.
- 문서의 스타일이나 개인 취향에 관한 사항은 지적하지 마세요.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요:
{"errors":[{"page":페이지번호,"location":"오류 위치 설명","currentContent":"현재 **잘못된부분** 포함 내용","suggestedFix":"수정된 **올바른부분** 포함 내용","errorType":"오류유형"}]}

오류가 없으면 {"errors":[]} 를 반환하세요.`;

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

  const userPrompt = `다음 문서를 검토해주세요. 이것은 ${reviewNumber}차 검토입니다.
${reviewNumber > 1 ? "이전 검토에서 놓친 오류가 있을 수 있으니 더욱 꼼꼼히 검토해주세요." : ""}

문서 내용:
${documentText}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      system: PROOFREAD_SYSTEM_PROMPT,
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
    const errors: ProofreadingError[] = parsed.errors.map((error, index) => ({
      id: `review-${reviewNumber}-error-${index}-${Date.now()}`,
      page: error.page,
      location: error.location,
      currentContent: error.currentContent,
      suggestedFix: error.suggestedFix,
      errorType: validateErrorType(error.errorType),
    }));

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
 * 같은 페이지에서 같은 내용의 오류는 제거
 */
export function deduplicateErrors(
  errors: ProofreadingError[]
): ProofreadingError[] {
  const seen = new Set<string>();
  return errors.filter((error) => {
    const key = `${error.page}-${error.currentContent}-${error.errorType}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
