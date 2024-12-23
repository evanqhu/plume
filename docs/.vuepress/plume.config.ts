/** 
 * 主题配置文件，将不需要重启服务的配置移动到此处
 * 不可配置的：blog article plugins hostname cache editLink lastUpdated contributors changelog
 */
import { defineThemeConfig } from 'vuepress-theme-plume'
import { navbar } from './navbar'
import { notes } from './notes'

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
  logo: '/avatar.svg',
  appearance: true,
  createTime: false, // 禁用创建时间
  footer: false, // 禁用页脚

  /** 博主信息 */
  profile: {
    avatar: '/avatar.svg',
    name: 'Notes and Blogs',
    description: '',
    // circle: true,
    // location: '',
    // organization: '',
  },
  /** 导航栏配置 */
  navbar,
  /** 笔记配置 */
  notes,
  // 社交链接
  social: [
    { icon: 'github', link: 'https://github.com/evanqhu' },
  ],
})
