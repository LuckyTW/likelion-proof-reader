"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { navConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * 모바일 네비게이션 컴포넌트
 * Sheet를 사용한 모바일용 사이드 메뉴입니다.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle>
            <Logo size="sm" asLink={false} />
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-4">
          {navConfig.mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">테마</span>
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
