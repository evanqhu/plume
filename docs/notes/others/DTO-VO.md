---
title: DTO-VO
createTime: 2025/04/22 15:48:02
permalink: /others/57696viv/
---

DTO 是 `Data Transfer Object`，用于传输数据。

VO 是 `Value Object`，用于表示值。

::: note
就是要定义多个 interface，就算有重复也没关系，因为他们是不同的数据结构。DTO 和 VO 是不同的数据结构，DTO 是服务器响应的数据结构，VO 是前端展示的数据结构，逻辑应该分开。
:::

```ts
// 服务器响应的数据结构
interface ArticleDTO {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

// 请求的参数结构
interface ArticleRequestDTO {
  title: string;
  content: string;
  author: string;
}

// 前端展示的数据结构
interface ArticleVO {
  id: string;
  title: string;
  content: string;
  author: string;
}
```
