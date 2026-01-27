import { z } from "zod";

/**
 * 연락처 폼 유효성 검사 스키마
 * React Hook Form + Zod 연동 예시
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "이름은 2자 이상이어야 합니다." })
    .max(50, { message: "이름은 50자 이하여야 합니다." }),

  email: z
    .string()
    .email({ message: "유효한 이메일 주소를 입력해주세요." }),

  subject: z
    .string()
    .min(5, { message: "제목은 5자 이상이어야 합니다." })
    .max(100, { message: "제목은 100자 이하여야 합니다." }),

  message: z
    .string()
    .min(10, { message: "메시지는 10자 이상이어야 합니다." })
    .max(1000, { message: "메시지는 1000자 이하여야 합니다." }),

  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: "이용약관에 동의해주세요.",
    }),
});

/** 연락처 폼 타입 (스키마에서 자동 추론) */
export type ContactFormValues = z.infer<typeof contactFormSchema>;

/**
 * 로그인 폼 유효성 검사 스키마
 */
export const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "유효한 이메일 주소를 입력해주세요." }),

  password: z
    .string()
    .min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),

  rememberMe: z.boolean().optional(),
});

/** 로그인 폼 타입 */
export type LoginFormValues = z.infer<typeof loginFormSchema>;

/**
 * 회원가입 폼 유효성 검사 스키마
 */
export const signupFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "이름은 2자 이상이어야 합니다." }),

    email: z
      .string()
      .email({ message: "유효한 이메일 주소를 입력해주세요." }),

    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .regex(/[A-Z]/, { message: "대문자를 포함해야 합니다." })
      .regex(/[a-z]/, { message: "소문자를 포함해야 합니다." })
      .regex(/[0-9]/, { message: "숫자를 포함해야 합니다." }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

/** 회원가입 폼 타입 */
export type SignupFormValues = z.infer<typeof signupFormSchema>;
