import { extractText } from "unpdf";
import type { ParsedPDF, PDFPage } from "./types";

/**
 * PDF 버퍼에서 텍스트 추출 (unpdf 사용 - Node.js 최적화)
 */
export async function parsePDF(buffer: Buffer): Promise<ParsedPDF> {
  try {
    // Buffer를 Uint8Array로 변환 (unpdf 요구사항)
    const uint8Array = new Uint8Array(buffer);

    // unpdf로 텍스트 추출
    const result = await extractText(uint8Array, { mergePages: false });

    const totalPages = result.totalPages;
    const pages: PDFPage[] = [];
    let fullText = "";

    // 페이지별 텍스트 처리
    if (Array.isArray(result.text)) {
      result.text.forEach((pageText, index) => {
        const content = pageText.trim();
        pages.push({
          pageNumber: index + 1,
          content,
        });
        fullText += content + "\n\n";
      });
    } else {
      // 단일 텍스트인 경우
      pages.push({
        pageNumber: 1,
        content: result.text,
      });
      fullText = result.text;
    }

    return {
      text: fullText.trim(),
      pages,
      totalPages,
    };
  } catch (error) {
    console.error("PDF 파싱 오류:", error);
    throw new Error("PDF 파일을 읽을 수 없습니다");
  }
}

/**
 * PDF 파일 유효성 검사
 */
export function validatePDF(buffer: Buffer): { valid: boolean; error?: string } {
  // 파일 크기 확인 (50MB 제한)
  const MAX_SIZE = 50 * 1024 * 1024;
  if (buffer.length > MAX_SIZE) {
    console.error(`PDF 유효성 검사 실패: 크기 초과 (${buffer.length} bytes)`);
    return { valid: false, error: "파일 크기가 50MB를 초과합니다" };
  }

  // PDF 시그니처 확인 (%PDF-)
  // 일부 PDF는 처음 1024바이트 내에 시그니처가 있을 수 있음
  const headerCheck = buffer.slice(0, 1024).toString("binary");
  const pdfSignatureIndex = headerCheck.indexOf("%PDF-");

  if (pdfSignatureIndex === -1) {
    console.error("PDF 유효성 검사 실패: PDF 시그니처 없음");
    console.error("처음 50바이트:", buffer.slice(0, 50).toString("hex"));
    return { valid: false, error: "유효한 PDF 파일이 아닙니다" };
  }

  console.log(`PDF 유효성 검사 통과: 시그니처 위치 ${pdfSignatureIndex}`);
  return { valid: true };
}
