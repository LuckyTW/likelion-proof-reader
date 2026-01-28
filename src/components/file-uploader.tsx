"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { FileText, Upload, X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UploadStatus } from "@/lib/types";

// 최대 파일 크기: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;
// 최소 파일 크기: 1KB (별칭/북마크 파일 필터링)
const MIN_FILE_SIZE = 1024;

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onUploadComplete?: () => void;
  disabled?: boolean;
}

/**
 * PDF 파일 업로드 컴포넌트
 * - react-dropzone 사용
 * - 드래그앤드롭 + 클릭 지원
 * - PDF만 허용, 최대 50MB
 */
export function FileUploader({
  onFileSelect,
  onUploadComplete,
  disabled = false,
}: FileUploaderProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // 에러 초기화
      setError(null);

      // 거부된 파일 처리
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        const errorMessages = rejection.errors.map((e) => e.message);

        if (errorMessages.some((msg) => msg.includes("larger"))) {
          setError("파일 크기가 50MB를 초과합니다");
        } else if (errorMessages.some((msg) => msg.includes("type"))) {
          setError("PDF 파일만 업로드 가능합니다");
        } else {
          setError("파일을 업로드할 수 없습니다");
        }
        setStatus("error");
        return;
      }

      // 파일이 없는 경우
      if (acceptedFiles.length === 0) {
        return;
      }

      const file = acceptedFiles[0];

      // 최소 파일 크기 검증 (macOS 별칭/북마크 파일 필터링)
      if (file.size < MIN_FILE_SIZE) {
        setError("유효한 PDF 파일이 아닙니다. 별칭이 아닌 실제 파일을 선택해주세요.");
        setStatus("error");
        return;
      }

      // PDF 시그니처 검증 (실제 PDF인지 확인)
      const validatePdfSignature = async (f: File): Promise<boolean> => {
        const buffer = await f.slice(0, 1024).arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const header = String.fromCharCode(...bytes.slice(0, 1024));
        return header.includes("%PDF-");
      };

      setStatus("uploading");

      validatePdfSignature(file).then((isValidPdf) => {
        if (!isValidPdf) {
          setError("유효한 PDF 파일이 아닙니다. 파일이 손상되었거나 별칭 파일일 수 있습니다.");
          setStatus("error");
          setSelectedFile(null);
          return;
        }

        setSelectedFile(file);
        onFileSelect(file);

        setTimeout(() => {
          setStatus("success");
          onUploadComplete?.();
        }, 300);
      });
    },
    [onFileSelect, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: disabled || status === "uploading",
  });

  // 파일 선택 취소
  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setStatus("idle");
    setError(null);
  };

  // 파일 크기 포맷
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all",
          // 기본 상태
          status === "idle" && !isDragActive && "border-muted-foreground/25 bg-muted/50 hover:border-primary/50 hover:bg-muted",
          // 드래그 중
          isDragActive && !isDragReject && "border-primary bg-primary/5",
          // 드래그 거부 (잘못된 파일 타입)
          isDragReject && "border-destructive bg-destructive/5",
          // 업로드 중
          status === "uploading" && "border-primary/50 bg-primary/5",
          // 성공
          status === "success" && "border-green-500/50 bg-green-500/5",
          // 에러
          status === "error" && "border-destructive/50 bg-destructive/5",
          // 비활성화
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <input {...getInputProps()} />

        {/* 상태별 UI */}
        {status === "idle" && !isDragActive && (
          <>
            <Upload className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="mb-2 text-sm font-medium">
              PDF 파일을 여기에 드래그하세요
            </p>
            <p className="mb-4 text-xs text-muted-foreground">
              또는 클릭하여 파일 선택 (최대 50MB)
            </p>
            <Button type="button" variant="secondary" size="sm">
              파일 선택
            </Button>
          </>
        )}

        {/* 드래그 중 */}
        {isDragActive && !isDragReject && (
          <>
            <Upload className="mb-4 h-12 w-12 animate-bounce text-primary" />
            <p className="text-sm font-medium text-primary">
              여기에 파일을 놓으세요
            </p>
          </>
        )}

        {/* 드래그 거부 */}
        {isDragReject && (
          <>
            <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
            <p className="text-sm font-medium text-destructive">
              PDF 파일만 업로드 가능합니다
            </p>
          </>
        )}

        {/* 업로드 중 */}
        {status === "uploading" && selectedFile && (
          <>
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="mb-2 text-sm font-medium">파일 처리 중...</p>
            <p className="text-xs text-muted-foreground">{selectedFile.name}</p>
          </>
        )}

        {/* 업로드 성공 */}
        {status === "success" && selectedFile && (
          <div className="flex w-full items-center gap-3 rounded-lg bg-background p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
              <FileText className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">파일 제거</span>
              </Button>
            </div>
          </div>
        )}

        {/* 에러 */}
        {status === "error" && (
          <>
            <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
            <p className="mb-2 text-sm font-medium text-destructive">{error}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveFile}
            >
              다시 시도
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
