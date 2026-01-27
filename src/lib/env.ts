import { z } from "zod";

/**
 * 환경 변수 스키마 정의
 * Zod를 사용하여 런타임에 환경 변수를 검증합니다.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

/**
 * 환경 변수 타입
 * 스키마에서 자동으로 추론됩니다.
 */
export type Env = z.infer<typeof envSchema>;

/**
 * 검증된 환경 변수
 * 애플리케이션 전체에서 이 객체를 통해 환경 변수에 접근합니다.
 */
export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
