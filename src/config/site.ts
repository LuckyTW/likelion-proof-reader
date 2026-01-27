import type { SiteConfig, NavConfig, FooterLinkGroup } from "@/types";

/**
 * 사이트 기본 설정
 * 프로젝트에 맞게 수정하세요.
 */
export const siteConfig: SiteConfig = {
  name: "Next.js Starter",
  description: "Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 기반 모던 웹 스타터킷",
  url: "https://example.com",
  ogImage: "https://example.com/og.jpg",
  links: {
    github: "https://github.com",
    twitter: "https://twitter.com",
  },
};

/**
 * 네비게이션 설정
 */
export const navConfig: NavConfig = {
  mainNav: [
    {
      title: "홈",
      href: "/",
    },
    {
      title: "데모",
      href: "/demo",
    },
  ],
};

/**
 * 푸터 링크 그룹 설정
 */
export const footerLinks: FooterLinkGroup[] = [
  {
    title: "제품",
    links: [
      { title: "기능", href: "#" },
      { title: "가격", href: "#" },
    ],
  },
  {
    title: "리소스",
    links: [
      { title: "문서", href: "#" },
      { title: "가이드", href: "#" },
    ],
  },
  {
    title: "회사",
    links: [
      { title: "소개", href: "#" },
      { title: "블로그", href: "#" },
    ],
  },
  {
    title: "법적 고지",
    links: [
      { title: "개인정보처리방침", href: "#" },
      { title: "이용약관", href: "#" },
    ],
  },
];
