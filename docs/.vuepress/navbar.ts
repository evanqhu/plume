import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '博客', link: '/blog/', activeMatch: '/blog/' },
  // { text: '标签', link: '/blog/tags/' },
  // { text: '分类', link: '/blog/categories/' },
  // { text: '归档', link: '/blog/archives/' },
  // 笔记相关
  { text: '工程化', link: '/notes/engineering/' },
  { text: '组件&算法', link: '/notes/examples/' },
  { text: '其它', link: '/notes/others/draft.md' },
])
