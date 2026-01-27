import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface LogoProps {
  className?: string;
  /** 로고 크기 */
  size?: "sm" | "md" | "lg";
  /** 링크 비활성화 */
  asLink?: boolean;
}

/**
 * 로고 컴포넌트
 * 사이트 로고를 표시합니다. 기본적으로 홈으로 링크됩니다.
 */
export function Logo({
  className,
  size = "md",
  asLink = true
}: LogoProps) {
  const sizeClasses = {
    sm: "text-lg font-semibold",
    md: "text-xl font-bold",
    lg: "text-2xl font-bold",
  };

  const logoContent = (
    <span className={cn(sizeClasses[size], className)}>
      {siteConfig.name}
    </span>
  );

  if (!asLink) {
    return logoContent;
  }

  return (
    <Link
      href="/"
      className="flex items-center space-x-2 transition-opacity hover:opacity-80"
    >
      {logoContent}
    </Link>
  );
}
