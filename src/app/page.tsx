"use client";

import { useState } from "react";
import { Upload, FileSearch, CheckCircle2, FileText, RotateCcw, Play } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileUploader } from "@/components/file-uploader";
import { ProofreadingResult } from "@/components/proofreading-result";
import { ExportButtons } from "@/components/export-buttons";
import { cn } from "@/lib/utils";
import type { ProofreadingError, ReviewProgress, UploadedFile, PDFPage, UploadResponse, ProofreadResponse } from "@/lib/types";

// 앱 상태 타입
type AppStep = "upload" | "reviewing" | "result";

export default function HomePage() {
  // 상태 관리
  const [step, setStep] = useState<AppStep>("upload");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reviewProgress, setReviewProgress] = useState<ReviewProgress>({
    status: "idle",
    currentReview: 0,
    totalReviews: 3,
    message: "",
  });
  const [errors, setErrors] = useState<ProofreadingError[]>([]);
  const [isFileReady, setIsFileReady] = useState(false);

  // 파일 선택 핸들러
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    });
  };

  // 파일 업로드 완료 핸들러
  const handleUploadComplete = () => {
    setIsFileReady(true);
  };

  // 검토 시작 핸들러
  const handleStartReview = async () => {
    if (!selectedFile) return;

    setStep("reviewing");
    setErrors([]);

    try {
      // 1단계: PDF 업로드 및 텍스트 추출
      setReviewProgress({
        status: "extracting",
        currentReview: 0,
        totalReviews: 3,
        message: "PDF에서 텍스트 추출 중...",
      });

      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadResult: UploadResponse = await uploadResponse.json();

      if (!uploadResult.success || !uploadResult.data) {
        throw new Error(uploadResult.error || "파일 업로드 실패");
      }

      const pages: PDFPage[] = uploadResult.data.pages;
      toast.success(`${uploadResult.data.totalPages}페이지 텍스트 추출 완료`);

      // 2단계: 3회 반복 검토
      const allErrors: ProofreadingError[] = [];

      for (let reviewNumber = 1; reviewNumber <= 3; reviewNumber++) {
        setReviewProgress({
          status: "reviewing",
          currentReview: reviewNumber,
          totalReviews: 3,
          message: `${reviewNumber}차 검토 진행 중...`,
        });

        const proofreadResponse = await fetch("/api/proofread", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pages, reviewNumber }),
        });

        const proofreadResult: ProofreadResponse = await proofreadResponse.json();

        if (!proofreadResult.success) {
          throw new Error(proofreadResult.error || `${reviewNumber}차 검토 실패`);
        }

        if (proofreadResult.errors) {
          allErrors.push(...proofreadResult.errors);
        }

        toast.success(`${reviewNumber}차 검토 완료`);
      }

      // 중복 제거
      const uniqueErrors = deduplicateErrors(allErrors);

      setReviewProgress({
        status: "completed",
        currentReview: 3,
        totalReviews: 3,
        message: "검토 완료",
      });

      setErrors(uniqueErrors);
      setStep("result");

      toast.success(`검토 완료! ${uniqueErrors.length}건의 오류 발견`);
    } catch (error) {
      console.error("검토 오류:", error);
      toast.error(error instanceof Error ? error.message : "검토 중 오류가 발생했습니다");

      // 에러 발생 시 업로드 단계로 복귀
      setStep("upload");
      setReviewProgress({
        status: "error",
        currentReview: 0,
        totalReviews: 3,
        message: "오류 발생",
      });
    }
  };

  // 중복 오류 제거 (클라이언트 측)
  const deduplicateErrors = (errors: ProofreadingError[]): ProofreadingError[] => {
    const seen = new Set<string>();
    return errors.filter((error) => {
      // 정규화 함수: 강조 마크 제거, 공백 정리, 소문자 변환
      const normalize = (text: string) =>
        text
          .replace(/\*\*/g, "")           // **강조** 제거
          .replace(/\s+/g, " ")           // 연속 공백을 단일 공백으로
          .trim()
          .toLowerCase();

      // suggestedFix를 키로 사용하여 같은 수정 제안이면 중복으로 처리
      const normalizedFix = normalize(error.suggestedFix);

      // 페이지 + 수정제안 + 오류유형으로 중복 판별
      const key = `${error.page}-${normalizedFix}-${error.errorType}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  // 새로운 검토 시작 (초기화)
  const handleReset = () => {
    setStep("upload");
    setUploadedFile(null);
    setSelectedFile(null);
    setIsFileReady(false);
    setReviewProgress({
      status: "idle",
      currentReview: 0,
      totalReviews: 3,
      message: "",
    });
    setErrors([]);
  };

  // 진행률 계산 (0-100)
  const progressPercent =
    reviewProgress.status === "extracting"
      ? 10
      : reviewProgress.status === "reviewing"
        ? 10 + (reviewProgress.currentReview / reviewProgress.totalReviews) * 80
        : reviewProgress.status === "completed"
          ? 100
          : 0;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-background to-muted/20">
      <Container size="md" className="py-8">
        {/* 헤더 영역 */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
            PDF 문서 교정 서비스
          </h1>
          <p className="text-muted-foreground">
            PDF를 업로드하면 AI가 3회 반복 검토하여 한국어 오류를 찾아드립니다
          </p>
        </div>

        {/* 진행 단계 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <StepIndicator
              label="업로드"
              icon={Upload}
              isActive={step === "upload"}
              isCompleted={step === "reviewing" || step === "result"}
            />
            <div className="h-px w-8 bg-border sm:w-16" />
            <StepIndicator
              label="AI 검토"
              icon={FileSearch}
              isActive={step === "reviewing"}
              isCompleted={step === "result"}
            />
            <div className="h-px w-8 bg-border sm:w-16" />
            <StepIndicator
              label="결과"
              icon={CheckCircle2}
              isActive={step === "result"}
              isCompleted={false}
            />
          </div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="mx-auto max-w-2xl">
          {/* 1단계: 업로드 */}
          {step === "upload" && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Upload className="h-5 w-5" />
                  PDF 파일 업로드
                </CardTitle>
                <CardDescription>
                  교정할 PDF 문서를 드래그하거나 클릭하여 선택하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUploader
                  onFileSelect={handleFileSelect}
                  onUploadComplete={handleUploadComplete}
                />

                {/* 검토 시작 버튼 */}
                {isFileReady && (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleStartReview}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    AI 검토 시작
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* 2단계: 검토 진행 */}
          {step === "reviewing" && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <FileSearch className="h-5 w-5 animate-pulse" />
                  AI 검토 진행 중
                </CardTitle>
                <CardDescription>
                  Claude AI가 문서를 꼼꼼히 검토하고 있습니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 파일 정보 */}
                {uploadedFile && (
                  <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1 truncate">
                      <p className="truncate text-sm font-medium">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}

                {/* 진행률 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{reviewProgress.message || "검토 준비 중..."}</span>
                    <span className="font-medium">
                      {Math.round(progressPercent)}%
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>

                {/* 검토 단계 표시 */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3].map((num) => (
                    <Badge
                      key={num}
                      variant={
                        reviewProgress.currentReview >= num
                          ? "default"
                          : "outline"
                      }
                      className={cn(
                        "transition-all",
                        reviewProgress.currentReview === num && "animate-pulse"
                      )}
                    >
                      {num}차 검토
                      {reviewProgress.currentReview > num && " ✓"}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3단계: 결과 */}
          {step === "result" && (
            <div className="space-y-4">
              {/* 결과 요약 카드 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        검토 완료
                      </CardTitle>
                      <CardDescription>
                        총 {errors.length}건의 오류가 발견되었습니다
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      새 문서 검토
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* 파일 정보 */}
                  {uploadedFile && (
                    <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div className="flex-1 truncate">
                        <p className="truncate text-sm font-medium">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          3회 반복 검토 완료
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 결과 테이블 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">오류 목록</CardTitle>
                    <ExportButtons
                      errors={errors}
                      fileName={uploadedFile?.name.replace(/\.pdf$/i, "")}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {errors.length > 0 ? (
                    <ProofreadingResult errors={errors} />
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      <CheckCircle2 className="mx-auto mb-2 h-12 w-12 text-green-500" />
                      <p>발견된 오류가 없습니다!</p>
                      <p className="text-sm">문서가 잘 작성되어 있습니다.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

// 진행 단계 표시 컴포넌트
interface StepIndicatorProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  isCompleted: boolean;
}

function StepIndicator({
  label,
  icon: Icon,
  isActive,
  isCompleted,
}: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
          isActive && "border-primary bg-primary text-primary-foreground",
          isCompleted && "border-green-500 bg-green-500 text-white",
          !isActive && !isCompleted && "border-muted-foreground/30 text-muted-foreground"
        )}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>
      <span
        className={cn(
          "text-xs font-medium",
          isActive && "text-primary",
          isCompleted && "text-green-500",
          !isActive && !isCompleted && "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </div>
  );
}
