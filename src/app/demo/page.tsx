"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Bell,
  Check,
  ChevronDown,
  Loader2,
  Mail,
  Plus,
  Settings,
  User,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";
import { useUIStore } from "@/store/ui-store";

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  // React Hook Form + Zod
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsLoading(true);
    // 폼 제출 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success("폼이 성공적으로 제출되었습니다!", {
      description: `이름: ${data.name}, 이메일: ${data.email}`,
    });
    form.reset();
  };

  return (
    <Section padding="md">
      <Container>
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">컴포넌트 데모</h1>
          <p className="text-lg text-muted-foreground">
            이 스타터킷에 포함된 모든 UI 컴포넌트를 확인하세요.
          </p>
        </div>

        <Tabs defaultValue="buttons" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="buttons">버튼</TabsTrigger>
            <TabsTrigger value="inputs">입력</TabsTrigger>
            <TabsTrigger value="cards">카드</TabsTrigger>
            <TabsTrigger value="dialogs">다이얼로그</TabsTrigger>
            <TabsTrigger value="data">데이터</TabsTrigger>
            <TabsTrigger value="form">폼</TabsTrigger>
          </TabsList>

          {/* 버튼 탭 */}
          <TabsContent value="buttons" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>다양한 버튼 스타일</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Button Sizes</CardTitle>
                <CardDescription>버튼 크기 옵션</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Button States</CardTitle>
                <CardDescription>로딩 및 비활성화 상태</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button disabled>Disabled</Button>
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badge</CardTitle>
                <CardDescription>배지 컴포넌트</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 입력 탭 */}
          <TabsContent value="inputs" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Input & Textarea</CardTitle>
                <CardDescription>텍스트 입력 필드</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input id="email" type="email" placeholder="example@email.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">메시지</Label>
                  <Textarea id="message" placeholder="메시지를 입력하세요..." />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select</CardTitle>
                <CardDescription>드롭다운 선택</CardDescription>
              </CardHeader>
              <CardContent>
                <Select>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="옵션을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">옵션 1</SelectItem>
                    <SelectItem value="option2">옵션 2</SelectItem>
                    <SelectItem value="option3">옵션 3</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Checkbox & Switch</CardTitle>
                <CardDescription>체크박스와 스위치</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">이용약관에 동의합니다</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" />
                  <Label htmlFor="notifications">알림 받기</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 카드 탭 */}
          <TabsContent value="cards" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>기본 카드</CardTitle>
                  <CardDescription>카드 설명 텍스트</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>카드 콘텐츠 영역입니다. 다양한 정보를 표시할 수 있습니다.</p>
                </CardContent>
                <CardFooter>
                  <Button>확인</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Avatar & Tooltip</CardTitle>
                  <CardDescription>아바타와 툴팁</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>사용자 프로필</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div>
                    <p className="font-medium">사용자 이름</p>
                    <p className="text-sm text-muted-foreground">user@example.com</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Accordion</CardTitle>
                <CardDescription>아코디언 컴포넌트</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>이 스타터킷은 무엇인가요?</AccordionTrigger>
                    <AccordionContent>
                      Next.js 16 + React 19 기반의 모던 웹 개발 스타터킷입니다.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>어떤 기술이 포함되어 있나요?</AccordionTrigger>
                    <AccordionContent>
                      TypeScript, Tailwind CSS, shadcn/ui, Zustand, React Hook Form, Zod 등이 포함되어 있습니다.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skeleton</CardTitle>
                <CardDescription>로딩 플레이스홀더</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert</CardTitle>
                <CardDescription>알림 메시지</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Bell className="h-4 w-4" />
                  <AlertTitle>알림</AlertTitle>
                  <AlertDescription>기본 알림 메시지입니다.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <Bell className="h-4 w-4" />
                  <AlertTitle>오류</AlertTitle>
                  <AlertDescription>오류가 발생했습니다.</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 다이얼로그 탭 */}
          <TabsContent value="dialogs" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Dialog</CardTitle>
                <CardDescription>모달 다이얼로그</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>다이얼로그 열기</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>다이얼로그 제목</DialogTitle>
                      <DialogDescription>
                        다이얼로그 설명 텍스트입니다. 추가 정보를 제공합니다.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">다이얼로그 콘텐츠</div>
                    <DialogFooter>
                      <Button variant="outline">취소</Button>
                      <Button>확인</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sheet</CardTitle>
                <CardDescription>사이드 패널</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">시트 열기</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>시트 제목</SheetTitle>
                      <SheetDescription>
                        사이드 패널에 추가 콘텐츠를 표시합니다.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">시트 콘텐츠</div>
                  </SheetContent>
                </Sheet>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dropdown Menu</CardTitle>
                <CardDescription>드롭다운 메뉴</CardDescription>
              </CardHeader>
              <CardContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      메뉴 열기 <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      프로필
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      설정
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      이메일
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Toast</CardTitle>
                <CardDescription>토스트 알림 (Sonner)</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button onClick={() => toast("기본 토스트 메시지")}>
                  기본 토스트
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.success("성공!", { description: "작업이 완료되었습니다." })
                  }
                >
                  성공 토스트
                </Button>
                <Button
                  variant="destructive"
                  onClick={() =>
                    toast.error("오류!", { description: "문제가 발생했습니다." })
                  }
                >
                  오류 토스트
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zustand 상태 관리</CardTitle>
                <CardDescription>전역 UI 상태 예시</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <p>사이드바 상태: {isSidebarOpen ? "열림" : "닫힘"}</p>
                <Button onClick={toggleSidebar}>토글</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 데이터 탭 */}
          <TabsContent value="data" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Table</CardTitle>
                <CardDescription>데이터 테이블</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>이메일</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">금액</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">홍길동</TableCell>
                      <TableCell>hong@example.com</TableCell>
                      <TableCell>
                        <Badge variant="secondary">활성</Badge>
                      </TableCell>
                      <TableCell className="text-right">₩250,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">김철수</TableCell>
                      <TableCell>kim@example.com</TableCell>
                      <TableCell>
                        <Badge variant="outline">대기</Badge>
                      </TableCell>
                      <TableCell className="text-right">₩150,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">이영희</TableCell>
                      <TableCell>lee@example.com</TableCell>
                      <TableCell>
                        <Badge>완료</Badge>
                      </TableCell>
                      <TableCell className="text-right">₩350,000</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Separator</CardTitle>
                <CardDescription>구분선</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">섹션 1</h4>
                    <p className="text-sm text-muted-foreground">첫 번째 섹션 내용</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium">섹션 2</h4>
                    <p className="text-sm text-muted-foreground">두 번째 섹션 내용</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 폼 탭 */}
          <TabsContent value="form" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>연락처 폼</CardTitle>
                <CardDescription>
                  React Hook Form + Zod 유효성 검사 예시
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이름</FormLabel>
                          <FormControl>
                            <Input placeholder="홍길동" {...field} />
                          </FormControl>
                          <FormDescription>실명을 입력해주세요.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이메일</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="example@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>제목</FormLabel>
                          <FormControl>
                            <Input placeholder="문의 제목" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>메시지</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="문의 내용을 입력해주세요..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>이용약관에 동의합니다</FormLabel>
                            <FormDescription>
                              개인정보 처리방침 및 이용약관에 동의합니다.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          제출 중...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          제출하기
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </Section>
  );
}
