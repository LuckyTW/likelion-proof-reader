import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  /** 섹션 ID (앵커 링크용) */
  id?: string;
  /** 패딩 크기 */
  padding?: "sm" | "md" | "lg" | "none";
}

/**
 * 섹션 래퍼 컴포넌트
 * 페이지 내 섹션을 구분하고 일관된 간격을 제공합니다.
 */
export function Section({
  children,
  className,
  id,
  padding = "lg"
}: SectionProps) {
  const paddingClasses = {
    none: "",
    sm: "py-8 md:py-12",
    md: "py-12 md:py-16",
    lg: "py-16 md:py-24",
  };

  return (
    <section
      id={id}
      className={cn(paddingClasses[padding], className)}
    >
      {children}
    </section>
  );
}
