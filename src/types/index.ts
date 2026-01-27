/**
 * 공통 타입 정의
 * 프로젝트 전반에서 사용되는 타입들을 정의합니다.
 */

/** 네비게이션 아이템 타입 */
export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

/** 네비게이션 설정 타입 */
export interface NavConfig {
  mainNav: NavItem[];
}

/** 푸터 링크 그룹 타입 */
export interface FooterLinkGroup {
  title: string;
  links: NavItem[];
}

/** 사이트 설정 타입 */
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage?: string;
  links?: {
    github?: string;
    twitter?: string;
  };
}

/** 메타데이터 타입 (Next.js Metadata 확장용) */
export interface PageMetadata {
  title: string;
  description?: string;
}
