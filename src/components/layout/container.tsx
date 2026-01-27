import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /** 최대 너비 옵션 */
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

/**
 * 반응형 컨테이너 컴포넌트
 * 콘텐츠를 중앙 정렬하고 최대 너비를 제한합니다.
 */
export function Container({
  children,
  className,
  size = "lg"
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
