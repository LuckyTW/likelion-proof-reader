import { create } from "zustand";

/**
 * UI 상태 인터페이스
 */
interface UIState {
  /** 모바일 메뉴 열림 상태 */
  isMobileMenuOpen: boolean;
  /** 사이드바 열림 상태 (향후 확장용) */
  isSidebarOpen: boolean;
}

/**
 * UI 액션 인터페이스
 */
interface UIActions {
  /** 모바일 메뉴 열기 */
  openMobileMenu: () => void;
  /** 모바일 메뉴 닫기 */
  closeMobileMenu: () => void;
  /** 모바일 메뉴 토글 */
  toggleMobileMenu: () => void;
  /** 사이드바 토글 */
  toggleSidebar: () => void;
  /** 사이드바 상태 설정 */
  setSidebarOpen: (open: boolean) => void;
}

type UIStore = UIState & UIActions;

/**
 * UI 상태 관리 스토어
 * Zustand를 사용한 전역 UI 상태 관리
 */
export const useUIStore = create<UIStore>((set) => ({
  // 초기 상태
  isMobileMenuOpen: false,
  isSidebarOpen: true,

  // 액션
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
