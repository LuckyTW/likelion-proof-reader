"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * 테마 프로바이더
 * next-themes를 사용하여 다크모드/라이트모드 전환을 지원합니다.
 * - attribute="class": Tailwind CSS의 다크모드와 호환
 * - defaultTheme="light": 라이트 모드 기본값
 * - enableSystem: 시스템 테마 감지 활성화
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
