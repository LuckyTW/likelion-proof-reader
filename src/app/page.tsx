import Link from "next/link";
import { ArrowRight, Layers, Palette, Zap } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";

const features = [
  {
    icon: Zap,
    title: "빠른 개발",
    description: "Next.js 16 + React 19의 최신 기능으로 빠르게 개발하세요.",
  },
  {
    icon: Palette,
    title: "아름다운 UI",
    description: "shadcn/ui + Tailwind CSS로 일관된 디자인 시스템을 제공합니다.",
  },
  {
    icon: Layers,
    title: "확장 가능",
    description: "체계적인 컴포넌트 구조로 쉽게 확장할 수 있습니다.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* 히어로 섹션 */}
      <Section className="bg-gradient-to-b from-background to-muted/30">
        <Container>
          <div className="flex flex-col items-center text-center">
            <Badge variant="secondary" className="mb-4">
              Next.js 16 + React 19
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              모던 웹 개발을 위한
              <br />
              <span className="text-primary">스타터킷</span>
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/demo">
                  컴포넌트 데모 보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link
                  href={siteConfig.links?.github ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* 기능 섹션 */}
      <Section>
        <Container>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">주요 기능</h2>
            <p className="text-muted-foreground">
              빠르고 효율적인 웹 개발을 위한 모든 것이 준비되어 있습니다.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* 기술 스택 섹션 */}
      <Section className="bg-muted/30">
        <Container>
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold">기술 스택</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Next.js 16",
                "React 19",
                "TypeScript",
                "Tailwind CSS v4",
                "shadcn/ui",
                "Zustand",
                "React Hook Form",
                "Zod",
              ].map((tech) => (
                <Badge key={tech} variant="outline" className="px-3 py-1">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
