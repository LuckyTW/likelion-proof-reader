"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  className?: string;
}

/**
 * 테마 토글 버튼
 * 다크모드/라이트모드를 전환합니다.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 하이드레이션 불일치 방지 (클라이언트 마운트 감지)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 마운트 상태 추적은 useEffect 내 setState가 필요함
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={className} disabled>
        <Sun className="h-5 w-5" />
        <span className="sr-only">테마 전환</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="테마 전환"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 transition-transform" />
      ) : (
        <Moon className="h-5 w-5 transition-transform" />
      )}
      <span className="sr-only">테마 전환</span>
    </Button>
  );
}
