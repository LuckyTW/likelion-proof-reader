"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * 전역 에러 페이지
 * 런타임 에러 발생 시 사용자에게 친화적인 메시지를 표시합니다.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 Sentry 등 외부 서비스 연동 권장)
    console.error("애플리케이션 에러:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          오류가 발생했습니다
        </h2>
        <p className="mb-6 text-muted-foreground">
          예기치 못한 문제가 발생했습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>
        <Button onClick={reset}>다시 시도</Button>
      </div>
    </div>
  );
}
