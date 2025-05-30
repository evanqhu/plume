import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '博客', link: '/blog/', activeMatch: '/blog/' },
  { text: 'AI', link: '/ai/', activeMatch: '/ai/' },
  { text: 'Style', link: '/style/', activeMatch: '/style/' },
  // 笔记相关
  { text: 'JS', link: '/javascript/', activeMatch: '^/(javascript)/' },
  {
    text: 'Vue',
    activeMatch: '^/(vue|nuxt)/',
    items: [
      { text: 'Vue', link: '/vue/', activeMatch: '/vue/' },
      { text: 'Nuxt', link: '/nuxt/', activeMatch: '/nuxt/' },
    ]
  },
  {
    text: 'React',
    activeMatch: '^/(react|next)/',
    items: [
      { text: 'React', link: '/react/', activeMatch: '/react/' },
      { text: 'Next', link: '/next/', activeMatch: '/next/' },
    ]
  },
  { text: 'Node', link: '/node/', activeMatch: '/node/' },
  { text: '工程化', link: '/engineering/', activeMatch: '/engineering/' },
  { text: '组件&算法', link: '/examples/', activeMatch: '/examples/' },
  { text: '其它', link: '/others/', activeMatch: '/others/' },
])
