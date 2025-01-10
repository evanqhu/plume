import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '博客', link: '/blog/', activeMatch: '/blog/' },
  // 笔记相关
  {
    text: 'Vue',
    items: [
      { text: 'Vue', link: '/notes/vue/', activeMatch: '/vue/' },
      { text: 'Nuxt', link: '/notes/nuxt/', activeMatch: '/nuxt/' },
    ]
  },

  { text: '工程化', link: '/notes/engineering/', activeMatch: '/engineering/' },
  { text: '组件&算法', link: '/notes/examples/', activeMatch: '/examples/' },
  { text: '其它', link: '/notes/others/', activeMatch: '/others/' },
])
