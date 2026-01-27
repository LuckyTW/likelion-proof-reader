"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ProofreadingError, ErrorType, SortOption } from "@/lib/types";
import { ERROR_TYPE_COLORS } from "@/lib/types";

interface ProofreadingResultProps {
  errors: ProofreadingError[];
}

// 모든 오류 유형 목록
const ALL_ERROR_TYPES: ErrorType[] = [
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

/**
 * **강조** 패턴을 노란색 하이라이트 span으로 변환
 */
function highlightText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const content = part.slice(2, -2);
      return (
        <mark
          key={index}
          className="rounded bg-yellow-200 px-0.5 dark:bg-yellow-800 dark:text-yellow-100"
        >
          {content}
        </mark>
      );
    }
    return part;
  });
}

/**
 * 결과 테이블 컴포넌트
 */
export function ProofreadingResult({ errors }: ProofreadingResultProps) {
  // 필터 상태
  const [selectedTypes, setSelectedTypes] = useState<ErrorType[]>([]);
  // 정렬 상태
  const [sortBy, setSortBy] = useState<SortOption>("page-asc");

  // 오류 유형별 개수 계산
  const errorTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    errors.forEach((error) => {
      counts[error.errorType] = (counts[error.errorType] || 0) + 1;
    });
    return counts;
  }, [errors]);

  // 필터링된 오류 목록
  const filteredErrors = useMemo(() => {
    if (selectedTypes.length === 0) {
      return errors;
    }
    return errors.filter((error) => selectedTypes.includes(error.errorType));
  }, [errors, selectedTypes]);

  // 정렬된 오류 목록
  const sortedErrors = useMemo(() => {
    const sorted = [...filteredErrors];

    switch (sortBy) {
      case "page-asc":
        sorted.sort((a, b) => a.page - b.page);
        break;
      case "page-desc":
        sorted.sort((a, b) => b.page - a.page);
        break;
      case "type":
        sorted.sort((a, b) => a.errorType.localeCompare(b.errorType));
        break;
    }

    return sorted;
  }, [filteredErrors, sortBy]);

  // 필터 토글
  const toggleTypeFilter = (type: ErrorType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // 필터 초기화
  const clearFilters = () => {
    setSelectedTypes([]);
  };

  // 정렬 순환
  const cycleSortBy = () => {
    setSortBy((prev) => {
      if (prev === "page-asc") return "page-desc";
      if (prev === "page-desc") return "type";
      return "page-asc";
    });
  };

  // 정렬 라벨
  const sortLabel = {
    "page-asc": "페이지 오름차순",
    "page-desc": "페이지 내림차순",
    type: "오류 유형순",
  }[sortBy];

  return (
    <div className="space-y-4">
      {/* 필터 및 정렬 컨트롤 */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* 필터 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                필터
                {selectedTypes.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedTypes.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>오류 유형</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ALL_ERROR_TYPES.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => toggleTypeFilter(type)}
                  disabled={!errorTypeCounts[type]}
                >
                  <span className="flex-1">{type}</span>
                  {errorTypeCounts[type] && (
                    <span className="text-xs text-muted-foreground">
                      ({errorTypeCounts[type]})
                    </span>
                  )}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={clearFilters}
              >
                필터 초기화
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 정렬 버튼 */}
          <Button variant="outline" size="sm" onClick={cycleSortBy}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            {sortLabel}
          </Button>
        </div>

        {/* 결과 개수 */}
        <p className="text-sm text-muted-foreground">
          {selectedTypes.length > 0 ? (
            <>
              {sortedErrors.length}건 표시 (전체 {errors.length}건)
            </>
          ) : (
            <>총 {errors.length}건</>
          )}
        </p>
      </div>

      {/* 테이블 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">페이지</TableHead>
              <TableHead className="w-[100px]">위치</TableHead>
              <TableHead>현재 내용</TableHead>
              <TableHead>수정 제안</TableHead>
              <TableHead className="w-[120px]">오류 유형</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedErrors.length > 0 ? (
              sortedErrors.map((error) => (
                <TableRow key={error.id}>
                  <TableCell className="font-medium">{error.page}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {error.location}
                  </TableCell>
                  <TableCell className="min-w-[200px] max-w-[300px]">
                    <span className="whitespace-normal break-words text-sm">
                      {highlightText(error.currentContent)}
                    </span>
                  </TableCell>
                  <TableCell className="min-w-[200px] max-w-[300px]">
                    <span className="whitespace-normal break-words text-sm">
                      {highlightText(error.suggestedFix)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        ERROR_TYPE_COLORS[error.errorType]
                      )}
                    >
                      {error.errorType}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  {selectedTypes.length > 0
                    ? "선택한 필터에 해당하는 오류가 없습니다"
                    : "발견된 오류가 없습니다"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 오류 유형별 요약 */}
      {errors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(errorTypeCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => (
              <Badge
                key={type}
                variant="outline"
                className={cn(
                  "cursor-pointer transition-opacity",
                  selectedTypes.length > 0 &&
                    !selectedTypes.includes(type as ErrorType) &&
                    "opacity-50"
                )}
                onClick={() => toggleTypeFilter(type as ErrorType)}
              >
                {type}: {count}건
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
}
