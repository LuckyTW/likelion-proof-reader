"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProofreadingError } from "@/lib/types";

interface ExportButtonsProps {
  errors: ProofreadingError[];
  fileName?: string;
  disabled?: boolean;
}

type ExportFormat = "xlsx" | "csv";

/**
 * 내보내기 버튼 컴포넌트
 * Excel (.xlsx) 및 CSV 형식 지원
 */
export function ExportButtons({
  errors,
  fileName,
  disabled = false,
}: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (errors.length === 0) {
      toast.error("내보낼 오류가 없습니다");
      return;
    }

    setIsExporting(format);

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          errors,
          format,
          fileName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "내보내기 실패");
      }

      // Blob으로 변환
      const blob = await response.blob();

      // 파일명 추출
      const contentDisposition = response.headers.get("Content-Disposition");
      let downloadFileName = `교정결과.${format}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="([^"]+)"/);
        if (match) {
          downloadFileName = decodeURIComponent(match[1]);
        }
      }

      // 다운로드 트리거
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`${format.toUpperCase()} 파일이 다운로드되었습니다`);
    } catch (error) {
      console.error("내보내기 오류:", error);
      toast.error(
        error instanceof Error ? error.message : "내보내기 중 오류가 발생했습니다"
      );
    } finally {
      setIsExporting(null);
    }
  };

  const isDisabled = disabled || errors.length === 0;

  return (
    <div className="flex gap-2">
      {/* 개별 버튼 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("xlsx")}
        disabled={isDisabled || isExporting !== null}
      >
        {isExporting === "xlsx" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="mr-2 h-4 w-4" />
        )}
        Excel
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("csv")}
        disabled={isDisabled || isExporting !== null}
      >
        {isExporting === "csv" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FileText className="mr-2 h-4 w-4" />
        )}
        CSV
      </Button>
    </div>
  );
}

/**
 * 드롭다운 스타일 내보내기 버튼 (대안)
 */
export function ExportDropdown({
  errors,
  fileName,
  disabled = false,
}: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (errors.length === 0) {
      toast.error("내보낼 오류가 없습니다");
      return;
    }

    setIsExporting(format);

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          errors,
          format,
          fileName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "내보내기 실패");
      }

      const blob = await response.blob();

      const contentDisposition = response.headers.get("Content-Disposition");
      let downloadFileName = `교정결과.${format}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="([^"]+)"/);
        if (match) {
          downloadFileName = decodeURIComponent(match[1]);
        }
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`${format.toUpperCase()} 파일이 다운로드되었습니다`);
    } catch (error) {
      console.error("내보내기 오류:", error);
      toast.error(
        error instanceof Error ? error.message : "내보내기 중 오류가 발생했습니다"
      );
    } finally {
      setIsExporting(null);
    }
  };

  const isDisabled = disabled || errors.length === 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isDisabled || isExporting !== null}
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          내보내기
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("xlsx")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileText className="mr-2 h-4 w-4" />
          CSV (.csv)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
