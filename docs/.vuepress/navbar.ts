import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '博客', link: '/blog/', activeMatch: '/blog/' },
  // { text: '标签', link: '/blog/tags/' },
  // { text: '分类', link: '/blog/categories/' },
  // { text: '归档', link: '/blog/archives/' },
  // 笔记相关
  { text: 'interview', link: '/notes/interview/' },
])
