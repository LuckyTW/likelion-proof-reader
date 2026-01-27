import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * 404 페이지
 * 존재하지 않는 경로 접근 시 표시됩니다.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-foreground">404</h1>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="mb-6 text-muted-foreground">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Button asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
