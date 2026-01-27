import Link from "next/link";
import { Container } from "@/components/layout/container";
import { siteConfig, footerLinks } from "@/config/site";
import { Separator } from "@/components/ui/separator";

/**
 * 반응형 푸터 컴포넌트
 * 링크 그룹 + 저작권 표시
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <Container>
        {/* 푸터 링크 그룹 */}
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-sm font-semibold">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator />

        {/* 저작권 */}
        <div className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {siteConfig.links?.github && (
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                GitHub
              </Link>
            )}
            {siteConfig.links?.twitter && (
              <Link
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Twitter
              </Link>
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
}
