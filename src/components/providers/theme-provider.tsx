"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * 테마 프로바이더
 * next-themes를 사용하여 다크모드/라이트모드 전환을 지원합니다.
 * - attribute="class": Tailwind CSS의 다크모드와 호환
 * - defaultTheme="system": 시스템 설정 우선 적용
 * - enableSystem: 시스템 테마 감지 활성화
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
