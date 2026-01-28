"use client";

import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/common/theme-toggle";

/**
 * 헤더 컴포넌트
 * - 로고 (🦁 Likelion Proof-Reader)
 * - 다크모드 토글
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <Container>
        <div className="flex h-14 items-center justify-between">
          {/* 로고 */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <span className="text-2xl">🦁</span>
            <span className="text-lg font-bold">Likelion Proof-Reader</span>
          </Link>

          {/* 다크모드 토글 */}
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
