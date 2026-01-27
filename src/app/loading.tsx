/**
 * 전역 로딩 페이지
 * 페이지 전환 또는 데이터 로딩 중 표시됩니다.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">로딩 중...</p>
      </div>
    </div>
  );
}
