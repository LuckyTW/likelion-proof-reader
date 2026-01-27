import { NextRequest, NextResponse } from "next/server";
import { proofreadWithClaude, deduplicateErrors } from "@/lib/claude-client";
import type { ProofreadRequest, ProofreadResponse, ProofreadingError } from "@/lib/types";

/**
 * POST /api/proofread
 * Claude API를 사용하여 문서 검토
 * 3회 반복 검토 수행
 */
export async function POST(request: NextRequest): Promise<NextResponse<ProofreadResponse>> {
  try {
    const body: ProofreadRequest = await request.json();
    const { pages, reviewNumber } = body;

    // 입력 검증
    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json(
        { success: false, error: "검토할 페이지가 없습니다" },
        { status: 400 }
      );
    }

    if (!reviewNumber || reviewNumber < 1 || reviewNumber > 3) {
      return NextResponse.json(
        { success: false, error: "잘못된 검토 번호입니다" },
        { status: 400 }
      );
    }

    // API 키 확인
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: "API 키가 설정되지 않았습니다" },
        { status: 500 }
      );
    }

    // Claude API로 검토 수행
    const errors = await proofreadWithClaude(pages, reviewNumber);

    return NextResponse.json({
      success: true,
      errors,
    });
  } catch (error) {
    console.error("Proofread API 오류:", error);

    // API 오류 메시지 처리
    let errorMessage = "검토 중 오류가 발생했습니다";
    if (error instanceof Error) {
      if (error.message.includes("401")) {
        errorMessage = "API 인증에 실패했습니다. API 키를 확인해주세요.";
      } else if (error.message.includes("429")) {
        errorMessage = "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.";
      } else if (error.message.includes("500")) {
        errorMessage = "AI 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * 3회 반복 검토를 한 번에 처리하는 대안 엔드포인트
 * (스트리밍 없이 전체 결과 반환)
 */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { pages } = body;

    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json(
        { success: false, error: "검토할 페이지가 없습니다" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: "API 키가 설정되지 않았습니다" },
        { status: 500 }
      );
    }

    // 3회 반복 검토
    const allErrors: ProofreadingError[] = [];

    for (let reviewNumber = 1; reviewNumber <= 3; reviewNumber++) {
      const errors = await proofreadWithClaude(pages, reviewNumber);
      allErrors.push(...errors);
    }

    // 중복 제거
    const uniqueErrors = deduplicateErrors(allErrors);

    return NextResponse.json({
      success: true,
      errors: uniqueErrors,
      totalReviews: 3,
    });
  } catch (error) {
    console.error("Proofread API (PUT) 오류:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "검토 중 오류가 발생했습니다"
      },
      { status: 500 }
    );
  }
}
