---
title: 介绍
createTime: 2025/05/06 16:21:12
permalink: /next/
---

Next.js 是一个用于构建全栈 Web 应用程序的 React 框架。您可以使用 React 组件构建用户界面，并使用 Next.js 实现附加功能和优化。

## 目录结构

::: file-tree

- app 包含应用程序的所有路由、组件和逻辑
  - lib 包含应用程序中使用的函数，例如可重用的实用程序函数和数据获取函数
    - actions.ts 操作数据相关的函数
    - data.ts 获取数据相关的函数
    - utils.ts 工具函数
    - definitions.ts 类型定义
    - placeholder-data.ts 占位数据
  - ui UI 组件相关
    - fonts.ts 字体
    - global.css 全局样式
    - skeletons.ts 骨架屏
  - seed
    - route.ts 初始化数据库
  - query
    - route.ts 后端 API 端点示例，访问 /query 会返回一个 JSON 对象
- public/
- next.config.ts

:::

## 样式

可以使用多种方式来书写样式，推荐使用原子化 CSS 的方式来书写样式，如 tailwindcss 等。

### 全局样式

在根布局组件中引入全局样式文件

::: code-tabs
@tab app/layout.tsx

```tsx
import "@/app/ui/global.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

:::

### 原子化 CSS

使用原子化 CSS 的方式来书写样式，如 tailwindcss 等。

::: code-tabs
@tab app/page.tsx

```tsx
export default function Page() {
  return <main className="flex min-h-screen flex-col p-6">main</main>;
}
```

:::

### CSS Modules

CSS Modules 是 CSS 的模块化解决方案，可以避免样式冲突。

::: code-tabs
@tab app/page.tsx

```tsx
import styles from "./page.module.css";

export default function Page() {
  return <main className={styles.main}>main</main>;
}
```

:::

### clsx 库

[clsx](https://github.com/lukeed/clsx) 是一个用于动态生成 CSS 类的库，可以避免手动拼接字符串。

::: code-tabs
@tab app/page.tsx

```tsx
import { clsx } from "clsx";

export default function Page() {
  return (
    <main
      className={clsx("inline-flex items-center rounded-full px-2 py-1 text-sm", {
        "bg-gray-100 text-gray-500": status === "pending",
        "bg-green-500 text-white": status === "paid",
      })}
    >
      main
    </main>
  );
}
```

:::

## 字体和图像

### 字体

累计布局偏移（Cumulative Layout Shift）是 Google 用来评估网站性能和用户体验的指标。对于字体而言，布局偏移是指浏览器最初使用后备字体或系统字体渲染文本，然后在加载完成后将其替换为自定义字体。这种替换可能会导致文本大小、间距或布局发生变化，从而影响其周围的元素。

使用 `next/font` 模块时，Next.js 会自动优化应用程序中的字体。它会在构建时下载字体文件，并将其与其他静态资源一起托管。这意味着当用户访问您的应用程序时，不会产生任何会影响性能的字体网络请求。

::: code-tabs
@tab app/ui/fonts.ts

```ts
import { Inter } from "next/font/google"; // 从 next/font/google 模块导入 Inter 字体

export const inter = Inter({ subsets: ["latin"] }); // 创建一个 Inter 字体实例，并指定其子集为 latin
```

@tab app/layout.tsx

```tsx
import { inter } from "@/app/ui/fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
```

:::

### 图像

Next.js 提供了 `next/image` 组件，可以优化图像的加载和显示。

::: code-tabs
@tab app/page.tsx

```tsx
import Image from "next/image";

export default function Page() {
  return (
    <Image
      src="/hero-desktop.png"
      width={1000}
      height={760}
      className="hidden md:block"
      alt="Screenshots of the dashboard project showing desktop version"
    />
  );
}
```

:::

## 布局和页面

Next.js 使用文件系统路由，其中**文件夹**用于创建**嵌套路由**。每个文件夹代表一个映射到 URL 段的路由段 。

Next.js 提供了 `layout.tsx` 和 `page.tsx` 文件来组织应用程序的布局和页面。其中 `layout.tsx` 是布局组件，`page.tsx` 是页面组件。

::: code-tabs
@tab app/layout.tsx

```tsx
// 布局组件
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

@tab app/page.tsx

```tsx
// 路由(页面)组件
export default function Page() {
  return <main>Page</main>;
}
```

:::

### 根布局

根布局组件是应用程序的根组件，它包含应用程序的布局和页面。

::: code-tabs
@tab app/layout.tsx

```tsx
// 根布局组件
import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
```

:::

## 路由导航

Next.js 提供了 `Link` 组件、`usePathname` 钩子等来实现路由导航。

### Link 组件

::: code-tabs
@tab app/page.tsx

```tsx
import Link from "next/link";

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>;
}
```

:::

### usePathname 钩子

`usePathname()` 可以获取当前路由的路径。使用它时需要将组件转换为客户端组件。

::: code-tabs
@tab app/ui/navigation.tsx

```tsx
"use client";

import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function NavLinks() {
  const pathname = usePathname(); // 如 /dashboard/invoices

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
```

:::

### useRouter 钩子

`useRouter()` 可以获取路由器实例，并进行路由跳转。

::: code-tabs
@tab app/page.tsx

```tsx
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return <button onClick={() => router.push("/dashboard")}>Dashboard</button>;
}
```

:::

## 数据库

Next.js 可以直接操作数据库。在 Vercel 中创建 Postgres 数据库，拿到 `POSTGRES_URL`。

### 初始化数据库

通过浏览器访问 `http://localhost:3000/api/seed` 可以初始化数据库。

::: code-tabs
@tab app/api/seed/route.ts

```ts
import bcrypt from "bcryptjs"; // 用于密码加密
import postgres from "postgres"; // PostgreSQL 数据库客户端

// 1. 创建 PostgreSQL 连接实例，启用 SSL
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/** 创建并填充用户表 */
async function seedUsers() {
  // 启用 UUID 扩展
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  // 创建用户表（如果不存在）
  // 包含字段：id(UUID), name(用户名), email(邮箱), password(加密后的密码)
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  // 遍历用户数据并插入到数据库
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      // 使用 bcrypt 对密码进行加密
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

/** API 路由，用于初始化数据库 */
export async function GET() {
  try {
    // 在一个事务中执行所有数据填充操作
    const result = await sql.begin(() => [
      seedUsers(), // 填充用户数据
    ]);
    console.log(result);

    // 返回成功响应
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    // 如果发生错误，返回 500 状态码和错误信息
    return Response.json({ error }, { status: 500 });
  }
}
```

:::

### 查询数据库

通过浏览器访问 `http://localhost:3000/api/query` 可以查询数据库。

::: code-tabs
@tab app/api/query/route.ts

```ts
/** API 路由处理函数 - GET 请求处理数据库查询 */
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function listInvoices() {
  const data = await sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `;

  return data;
}

export async function GET() {
  try {
    return Response.json(await listInvoices());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
```

:::

::: note
建议将后端 API 路由都统一放在 `app/api` 目录下，这样更便于管理。
:::

## 获取数据

可以通过 API、ORM、SQL 等方式获取数据

### 操作数据库

::: code-tabs
@tab app/lib/data.ts

```ts
import postgres from "postgres";

/** PostgreSQL 数据库连接实例 */
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/** 操作数据库，获取收入数据 */
export async function fetchRevenue() {
  try {
    console.log("Fetching revenue data...");
    const data = await sql<Revenue[]>`SELECT * FROM revenue`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}
```

@tab app/dashboard/page.tsx

```tsx
import { fetchRevenue } from "@/app/lib/data";

export default async function Page() {
  const revenue = await fetchRevenue();
  // ...
}
```

:::

::: note
Next.js 默认都是**服务端组件**，请求会在服务端发出。
:::

### 并行数据获取

流式传输是一种数据传输技术，它允许您将路由分解为更小的“块”，并在它们准备就绪时逐步将它们从服务器流式传输到客户端。

在 Next.js 中实现流式传输有两种方法：

1. 在页面级别，使用 `loading.tsx` 文件（自动为您创建 `<Suspense>` ）。
2. 在组件级别，使用 `<Suspense>` 实现更精细的控制。

::: note

- `loading.tsx` 只会在页面级别的异步加载时显示。也就是说，只有当 `page` 组件（`page.tsx`）本身是异步的，并且有“等待”的过程，`loading.tsx` 才会被渲染。
- 具体的触发场景为：你在 `page.tsx` 里有异步操作（比如 `await fetch()`、`await db.query()` 等），并且这些操作不是在 `Suspense` 包裹的子组件里完成，而是在 `page` 组件本身；或者你用了 `generateMetadata` 这种异步函数。
- `<Suspense fallback={...}>` 只会在局部组件异步时显示 `fallback`，不会触发 `loading.tsx`。

:::

## 搜索和分页

### URL 查询字符串参数

`useSearchParams` 钩子可以获取 URL 查询字符串参数。(仅客户端组件可用)

::: code-tabs
@tab app/page.tsx

```tsx
"use client";

// /dashboard/invoices?page=1&query=pending
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Page() {
  // 路由路径
  const pathname = usePathname(); // /dashboard/invoices
  // 查询字符串参数 read only
  const searchParams = useSearchParams(); // { page: '1', query: 'pending' }
  const params = searchParams.get("page");
  // 路由器
  const router = useRouter();
  // router 有以下常用的方法
  // router.push(href: string, { scroll: boolean }) 跳转路由
  // router.replace(href: string, { scroll: boolean }) 跳转路由并替换当前路由 (不会记录在历史记录中)
  // router.refresh() 刷新当前路由
  // router.back() 返回上一级路由
  // router.forward() 前进到下一级路由
  // router.prefetch(url) 预加载路由

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <main>
      <h1>Search Params</h1>
    </main>
  );
}
```

:::

服务端组件可以通过 `props` 获取 URL 查询参数。

::: code-tabs
@tab app/page.tsx

```tsx
export default function Page({ searchParams }: { searchParams: Promise<{ page: string }> }) {
  const page = await searchParams;

  return (
    <main>
      <h1>Search Params</h1>
      <p>Page: {page.page}</p>
      <p>Query: {page.query}</p>
    </main>
  );
}
```

:::

### URL 动态路由参数

URL 动态路由参数是 URL 中的一部分，用于匹配路由。

::: code-tabs
@tab app/page.tsx

```tsx
// /dashboard/invoices/123
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = await params;
}
```

:::

## 服务端操作

React Server Actions 允许您直接在服务器上运行异步代码。它们消除了创建 API 端点来修改数据的需要。相反，您可以编写在服务器上执行的异步函数，并可以从客户端或服务器组件调用它们。

::: code-tabs
@tab app/ui/invoices/create-form.tsx

```tsx
import { useActionState } from "react";

export default function Form({ customers }: { customers: CustomerField[] }) {
  const initialState: State = { message: null, errors: {} };
  /**
   * state: 当前状态，由你的异步函数返回
   * formAction: 要传递给表单或其他触发器的函数
   * createInvoice: 异步操作函数
   * initialState: 操作返回的初始状态值
   */
  const [state, formAction] = useActionState(createInvoice, initialState);

  return <form action={formAction}>...</form>;
}
```

@tab app/lib/actions.ts

```ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/** 表单验证状态类型 */
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

/** 表单验证规则 */
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce.number().gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

/** 创建时的表单验证 */
const CreateInvoice = FormSchema.omit({ id: true, date: true });

/** 更新时的表单验证 */
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

/** 创建发票 */
// prevState - 包含从 useActionState 钩子传递过来的状态
export async function createInvoice(prevState: State, formData: FormData) {
  // 验证表单数据
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    // 返回异步操作的当前状态
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  // 将金额转换为美分
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // 插入数据到数据库
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    console.error("Database Error: Failed to Create Invoice.", error);
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  // 因为数据会缓存，所以需要重新验证路径，重新从服务器获取数据
  revalidatePath("/dashboard/invoices");
  // 重定向到 invoices 页面
  redirect("/dashboard/invoices");
}
```

:::

## 身份验证和授权

Next.js 提供了 `next-auth` 库来实现身份验证和授权。NextAuth.js 简化了会话管理、登录和注销以及其他身份验证方面的许多复杂性。

- **身份验证(Authentication)**是为了确保用户的身份与其声称的身份相符。您需要使用用户名和密码等信息来证明自己的身份。
- 一旦用户的身份得到确认，**授权(Authorization)**将决定他们可以使用应用程序的哪些部分。

### NextAuth.js

#### 1. 安装

```sh
pnpm i next-auth@beta
```

#### 2. 设置密钥，加密 Cookie

```sh
openssl rand -base64 32
```

将生成的密钥放在 `.env` 文件中

```sh
AUTH_SECRET=your-secret-key
```

#### 3. 添加配置文件

::: code-tabs
@tab auth.config.ts

```ts
/**
 * Auth.js 身份验证配置文件
 * 用于设置登录、授权和重定向规则
 * 官方推荐：这里只写静态通用配置，也就是中间件和服务端都能复用的安全配置
 */
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  // 自定义身份验证页面的路由配置
  pages: {
    signIn: "/login", // 将默认的登录页面路由指向 /login
  },
  callbacks: {
    // authorized 回调用于验证请求是否有权使用 Auth.js 中间件访问页面。它在请求完成之前调用，并接收一个包含 auth 和 request 属性的对象
    // auth 属性包含用户的会话，request 属性包含传入的请求。
    authorized({ auth, request: { nextUrl } }) {
      // 检查用户是否已登录（通过验证 auth.user 是否存在）
      const isLoggedIn = !!auth?.user;
      // 检查用户是否正在访问仪表板页面（URL 是否以 /dashboard 开头）
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true; // 如果用户已登录且访问仪表板，允许访问
        return false; // 如果用户未登录但尝试访问仪表板，重定向到登录页面
      } else if (isLoggedIn) {
        // 如果用户已登录但访问其他页面（如登录页），重定向到仪表板
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      // 对于其他所有情况（如未登录用户访问公共页面），允许访问
      return true;
    },
  },
  // 身份验证提供者配置数组，当前为空
  providers: [],
} satisfies NextAuthConfig;
```

:::

#### 4. 封装统一认证入口

新建 `auth.ts`，统一导出认证相关方法

::: code-tabs
@tab auth.ts

```ts
/**
 * 身份验证功能模块
 * 包含认证、登录、登出功能
 * 将 Providers 和 NextAuth 的初始化放在同一个地方
 */
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcryptjs";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/** 根据邮箱查询用户信息的函数 */
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

// 配置并导出 NextAuth 的核心功能：auth（认证）、signIn（登录）、signOut（登出）
export const { auth, signIn, signOut } = NextAuth({
  // 展开基础配置，包含了页面路由、会话设置等
  ...authConfig,
  // 配置 Providers
  providers: [
    // 配置基于 Credentials Provider 的身份验证
    Credentials({
      // authorize 函数：验证用户凭证
      // 如果验证成功返回用户对象，失败返回 null
      async authorize(credentials) {
        // 使用 zod 验证并解析用户提供的凭证
        const parsedCredentials = z
          .object({
            // 验证邮箱格式是否正确
            email: z.string().email(),
            // 验证密码长度是否至少为 6 位
            password: z.string().min(6),
          })
          .safeParse(credentials);

        // 如果凭证格式验证通过
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          // 从数据库获取用户信息
          const user = await getUser(email);
          // 如果用户不存在，返回 null
          if (!user) return null;
          // 使用 bcrypt 比较提供的密码和存储的密码哈希是否匹配
          const passwordsMatch = await bcrypt.compare(password, user.password);

          // 如果密码匹配，返回用户对象
          if (passwordsMatch) return user;
        }

        // 记录认证失败信息
        console.log("Invalid credentials");
        // 如果验证失败（格式错误或密码不匹配），返回 null
        return null;
      },
    }),
  ],
});
```

:::

#### 5. 添加认证中间件

新建 `middleware.ts`，添加认证中间件

::: code-tabs
@tab middleware.ts

```ts
/**
 * Next.js  路由中间件
 */
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// 默认导出中间件函数
// 使用 authConfig 对象初始化 NextAuth.js 中间件，并导出 auth 属性(中间件函数)
export default NextAuth(authConfig).auth;

// 具名导出 config 对象
// 配置中间件
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // 匹配页面路由
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
```

:::

#### 6. 调用

服务端（如 Server Actions、API Route）

```ts
import { signIn, signOut, auth } from "@/auth";

// 登录
await signIn("credentials", { email, password });

// 登出
await signOut({ redirectTo: "/" });

// 获取当前用户
const session = await auth();
```

## 渲染

### 服务端和客户端渲染

- Next.js 默认使用**服务端渲染（SSR）**，但可以通过 `use client` 指令将组件转换为客户端组件
- 服务端组件无法使用 hooks 和客户端组件的特性，如 `useState`、`useEffect` 等
- 服务端组件无法响应客户端事件，如 `onClick`、`onChange` 等

### 静态渲染和动态渲染

- Next.js 默认使用**静态渲染**，网页内容在打包时生成静态的 HTML 文件
- 动态渲染在运行时生成网页内容，每次请求都会重新生成
- 一个路由页面中如果使用了动态 API，该页面就会被动态渲染，动态 API 如下：
  - cookies
  - headers
  - connection
  - draftMode
  - searchParams prop
  - unstable_noStore
- 在页面中使用 `fetch`，并设置 `cache` 为 `no-store`，该页面就会被动态渲染
- 数据库操作无法将组件变为动态
- 一般来说静态和动态渲染指的是路由页面级别，而不是组件级别；但启用 PPR 后，一个页面可能有静态组件也有动态渲染的组件
- 对于页面级别，可以使用 `export const dynamic = 'force-dynamic'` 来强制页面动态渲染
- 对于启用的 PPR 的页面，子组件中如果使用了动态 API，该子组件就会被动态渲染

#### 强制页面动态渲染

::: code-tabs
@tab app/dashboard/page.tsx

```tsx
export const dynamic = "force-dynamic";

/** 每隔 60 秒重新生成页面 */
export const revalidate = 60;

export default function Page() {
  return <div>...</div>;
}
```

:::

#### 将组件变为动态渲染

::: code-tabs
@tab app/dashboard/layout.tsx

```tsx
// 启用 PPR
export const experimental_ppr = true;
```

@tab app/dashboard/page.tsx

```tsx
export default async function Page() {
  return (
    <Suspense fallback={<CardsSkeleton />}>
      <CardWrapper />
    </Suspense>
  );
}
```

@tab app/ui/dashboard/card-wrapper.tsx

```tsx
export default async function CardWrapper() {
  // 由于设置了 no-store，dashboard 页面就会变成 PPR，CardWrapper 组件会动态渲染
  const demo = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
    cache: "no-store",
  });

  return <div>...</div>;
}
```

:::

#### revalidatePath

`revalidatePath` 是一个用于重新验证路由路径的函数。说人话，就算一个路由是静态生成了的，在调用 `revalidatePath` 后，服务端会重新渲染这个路由页面，生成最新的 html 文件，然后再跳转到这个路由页面的时候，数据就是最新的了。

在官方示例中，需要在 `createInvoice`、`updateInvoice` 和 `deleteInvoice` 三个函数中都加上 `revalidatePath("/dashboard");`，因为这三个函数的调用会影响到 dashboard 页面，所以需要重新验证这个路由页面。

::: code-tabs
@tab app/lib.actions.ts

```ts
/** 删除发票 */
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    console.error("Database Error: Failed to Delete Invoice.", error);
  }
  // 触发新的服务器请求并重新渲染表格
  revalidatePath("/dashboard/invoices");
  // 触发新的服务器请求并重新渲染首页
  revalidatePath("/dashboard");
}
```

:::
