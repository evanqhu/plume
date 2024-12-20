/** 
 * 主题配置文件，将不需要重启服务的配置移动到此处
 * 不可配置的：plugins hostname cache editLink lastUpdated contributors changelog
 */
import { defineThemeConfig } from 'vuepress-theme-plume'
import { navbar } from './navbar'
import { notes } from './notes'

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
  logo: 'https://theme-plume.vuejs.press/plume.png',
  appearance: true,
  createTime: false, // 禁用创建时间

  // 博主信息
  profile: {
    avatar: 'https://theme-plume.vuejs.press/plume.png',
    name: 'My Vuepress Site',
    description: '',
    // circle: true,
    // location: '',
    // organization: '',
  },
  // 导航栏
  navbar,
  
  // 笔记
  notes,
  // 社交链接
  social: [
    { icon: 'github', link: '/' },
  ],
})
