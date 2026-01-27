import { NextRequest, NextResponse } from "next/server";
import { parsePDF, validatePDF } from "@/lib/pdf-parser";
import type { UploadResponse } from "@/lib/types";

/**
 * POST /api/upload
 * PDF 파일을 받아서 텍스트 추출
 */
export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    // FormData에서 파일 추출
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "파일이 없습니다" },
        { status: 400 }
      );
    }

    // 파일 타입 확인
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "PDF 파일만 업로드 가능합니다" },
        { status: 400 }
      );
    }

    // 파일을 Buffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // PDF 유효성 검사
    const validation = validatePDF(buffer);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // PDF 파싱
    const parsedPDF = await parsePDF(buffer);

    // 텍스트가 추출되지 않은 경우
    if (!parsedPDF.text.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "PDF에서 텍스트를 추출할 수 없습니다. 스캔된 이미지 PDF일 수 있습니다."
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: parsedPDF,
    });
  } catch (error) {
    console.error("Upload API 오류:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "파일 처리 중 오류가 발생했습니다"
      },
      { status: 500 }
    );
  }
}
