import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import type { ExportRequest } from "@/lib/types";

/**
 * POST /api/export
 * 오류 목록을 Excel 또는 CSV로 내보내기
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: ExportRequest = await request.json();
    const { errors, format, fileName } = body;

    // 입력 검증
    if (!errors || !Array.isArray(errors)) {
      return NextResponse.json(
        { success: false, error: "오류 목록이 없습니다" },
        { status: 400 }
      );
    }

    if (!format || !["xlsx", "csv"].includes(format)) {
      return NextResponse.json(
        { success: false, error: "지원하지 않는 형식입니다" },
        { status: 400 }
      );
    }

    // 데이터 변환 (강조 표시 제거)
    const data = errors.map((error, index) => ({
      "번호": index + 1,
      "페이지": error.page,
      "위치": error.location,
      "현재 내용": removeMarkdown(error.currentContent),
      "수정 제안": removeMarkdown(error.suggestedFix),
      "오류 유형": error.errorType,
    }));

    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 열 너비 설정
    worksheet["!cols"] = [
      { wch: 5 },   // 번호
      { wch: 8 },   // 페이지
      { wch: 15 },  // 위치
      { wch: 40 },  // 현재 내용
      { wch: 40 },  // 수정 제안
      { wch: 15 },  // 오류 유형
    ];

    // 워크북 생성
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "교정 결과");

    // 파일명 생성
    const timestamp = new Date().toISOString().slice(0, 10);
    const baseFileName = fileName || `문서교정결과_${timestamp}`;

    if (format === "xlsx") {
      // Excel 파일 생성
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(baseFileName)}.xlsx"`,
        },
      });
    } else {
      // CSV 파일 생성
      const csvContent = XLSX.utils.sheet_to_csv(worksheet);
      // UTF-8 BOM 추가 (Excel에서 한글 깨짐 방지)
      const bom = "\uFEFF";
      const csvWithBom = bom + csvContent;

      return new NextResponse(csvWithBom, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(baseFileName)}.csv"`,
        },
      });
    }
  } catch (error) {
    console.error("Export API 오류:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "내보내기 중 오류가 발생했습니다"
      },
      { status: 500 }
    );
  }
}

/**
 * **강조** 마크다운 표시 제거
 */
function removeMarkdown(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1");
}
