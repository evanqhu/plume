/** 
 * VuePress 配置文件
 * 配置主题、插件、构建工具等
 * 每次修改需要重启服务
 */
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import path from 'path';

export default defineUserConfig({
  base: '/plume/',
  lang: 'zh-CN',
  title: '蛋炒饭的前端笔记',
  description: 'A VuePress Site with Plume Theme',
  /** 打包工具 */
  bundler: viteBundler(),
  /** 元信息 */
  head: [
    ['link', { rel: 'icon', href: '/plume/avatar.svg' }],
  ],
  /** VuePress 主题配置 */
  theme: plumeTheme({
    codeHighlighter: {
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
      notationDiff: true,
      notationErrorLevel: true,
      notationFocus: true,
      notationHighlight: true,
      notationWordHighlight: true,
      highlightLines: true,
      collapsedLines: false,
      lineNumbers: true,
    },
    // 添加您的部署域名
    // hostname: 'https://your_site_url',
    // your git repo url
    docsRepo: '',
    docsDir: 'docs',
    // lastUpdated: false, // 最后更新时间
    // 博客配置
    blog: {
      // archives: false
      exclude: ['components/**'] // 排除 components 目录
    },
    // 文章配置
    // article: "/article/",
    // 插件配置
    plugins: {
      /**
       * Shiki 代码高亮
       * @see https://theme-plume.vuejs.press/config/plugins/code-highlight/
       */
      // shiki: {
      //   //  强烈建议预设代码块高亮语言，插件默认加载所有语言会产生不必要的时间开销
      //   languages: ['shell', 'bash', 'typescript', 'javascript', 'html', 'css', 'vue', 'scss', 'dotenv', 'nginx', 'plaintext', 'md'],
      //   // 行号
      //   lineNumbers: false,
      // },

      /**
       * markdown enhance
       * @see https://theme-plume.vuejs.press/config/plugins/markdown-enhance/
       */
      markdownEnhance: {
        demo: true, // 禁用旧的代码演示功能
        //   include: true,
        //   chart: true,
        //   echarts: true,
        //   mermaid: true,
        //   flowchart: true,
      },

      /**
       *  markdown power
       * @see https://theme-plume.vuejs.press/config/plugin/markdown-power/
       */
      markdownPower: {
        demo: true, // 启用新的代码演示功能
        // pdf: true,
        // caniuse: true,
        // plot: true,
        // bilibili: true,
        // youtube: true,
        // icons: true,
        // codepen: true,
        // replit: true,
        // codeSandbox: true,
        // jsfiddle: true,
        // repl: {
        //   go: true,
        //   rust: true,
        //   kotlin: true,
        // },
      },

      /** 
       * markdown include
       * 在使用 <!-- @include: path --> 导入文件语法时，@ 符号会被解析为文档源目录
       */
      markdownInclude: {
        resolvePath: (file) => {
          if (file.startsWith('@')) {
            return file.replace('@', path.resolve(__dirname, '..'))
          }
          return file
        }
      },

      /**
       * 评论 comments
       * @see https://theme-plume.vuejs.press/guide/features/comments/
       */
      // comment: {
      //   provider: '', // "Artalk" | "Giscus" | "Twikoo" | "Waline"
      //   comment: true,
      //   repo: '',
      //   repoId: '',
      //   categoryId: '',
      //   mapping: 'pathname',
      //   reactionsEnabled: true,
      //   inputPosition: 'top',
      // },
      /** 阅读时间插件 */
      readingTime: false,
    },
    // 加密
    encrypt: {
      rules: {
        '/article/ky39hefg/': '980623'
      }
    }
  }),
})
