/**
 * 문서 교정 시스템 타입 정의
 */

// 11가지 오류 유형
export type ErrorType =
  | '오탈자'
  | '조사 오류'
  | '외래어 표기 오류'
  | '맞춤법 오류'
  | '띄어쓰기 오류'
  | '구두점 오류'
  | '표기 혼용'
  | '연번 오류'
  | '영문 오탈자'
  | '어색한 표현'
  | '중복 표현';

// 오류 유형별 색상 매핑
export const ERROR_TYPE_COLORS: Record<ErrorType, string> = {
  '오탈자': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  '조사 오류': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  '외래어 표기 오류': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  '맞춤법 오류': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  '띄어쓰기 오류': 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300',
  '구두점 오류': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  '표기 혼용': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  '연번 오류': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  '영문 오탈자': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300',
  '어색한 표현': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  '중복 표현': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
};

// 개별 오류 항목
export interface ProofreadingError {
  id: string;
  page: number;
  location: string;
  currentContent: string;
  suggestedFix: string;
  errorType: ErrorType;
}

// 검토 결과
export interface ProofreadingResult {
  errors: ProofreadingError[];
  totalPages: number;
  reviewCount: number;
  createdAt: Date;
}

// 업로드 상태
export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

// 검토 진행 상황
export interface ReviewProgress {
  status: 'idle' | 'extracting' | 'reviewing' | 'completed' | 'error';
  currentReview: number; // 현재 몇 차 검토 중인지 (1, 2, 3)
  totalReviews: number; // 총 검토 횟수 (기본 3회)
  message: string;
}

// 업로드된 파일 정보
export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

// PDF 파싱 결과
export interface ParsedPDF {
  text: string;
  pages: PDFPage[];
  totalPages: number;
}

// PDF 페이지 정보
export interface PDFPage {
  pageNumber: number;
  content: string;
}

// API 요청/응답 타입
export interface UploadResponse {
  success: boolean;
  data?: ParsedPDF;
  error?: string;
}

export interface ProofreadRequest {
  pages: PDFPage[];
  reviewNumber: number; // 몇 차 검토인지
}

export interface ProofreadResponse {
  success: boolean;
  errors?: ProofreadingError[];
  error?: string;
}

export interface ExportRequest {
  errors: ProofreadingError[];
  format: 'xlsx' | 'csv';
  fileName?: string;
}

// 정렬 옵션
export type SortOption = 'page-asc' | 'page-desc' | 'type';

// 필터 상태
export interface FilterState {
  selectedTypes: ErrorType[];
  sortBy: SortOption;
}
