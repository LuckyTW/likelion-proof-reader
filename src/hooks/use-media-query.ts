"use client";

import { useEffect, useState } from "react";

/**
 * 미디어 쿼리 훅
 * 반응형 디자인을 위한 브레이크포인트 감지
 *
 * @param query - CSS 미디어 쿼리 문자열 (예: "(min-width: 768px)")
 * @returns 미디어 쿼리 매칭 여부
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 767px)");
 * const isDesktop = useMediaQuery("(min-width: 1024px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // 초기값 설정 (SSR에서는 false, 클라이언트에서 실제 값으로 업데이트)
    setMatches(mediaQuery.matches); // eslint-disable-line react-hooks/set-state-in-effect -- 외부 시스템(window.matchMedia)과 동기화

    // 변경 리스너
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 이벤트 리스너 등록
    mediaQuery.addEventListener("change", handler);

    // 클린업
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}

/**
 * 미리 정의된 브레이크포인트 훅
 * Tailwind CSS 브레이크포인트와 동일
 */
export function useBreakpoint() {
  const isSm = useMediaQuery("(min-width: 640px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isXl = useMediaQuery("(min-width: 1280px)");
  const is2xl = useMediaQuery("(min-width: 1536px)");

  return { isSm, isMd, isLg, isXl, is2xl };
}
