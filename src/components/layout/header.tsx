"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { navConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * 반응형 헤더 컴포넌트
 * - 모바일: 로고 + 햄버거 메뉴
 * - 데스크탑: 로고 + 가로 네비게이션 + 다크모드 토글
 */
export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <Logo />

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden items-center gap-6 md:flex">
            {navConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* 우측 액션 영역 */}
          <div className="flex items-center gap-2">
            {/* 데스크탑: 테마 토글 */}
            <ThemeToggle className="hidden md:inline-flex" />
            {/* 모바일: 햄버거 메뉴 */}
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}
