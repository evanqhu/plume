import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

// const demoNote = defineNoteConfig({
//   dir: 'demo',
//   link: '/demo',
//   // 当 sidebar 数组中传入类型为 string 时，表示 markdown 文件的路径，可以省略 .md 文件后缀
//   // sidebar: ['', 'foo.md', 'bar.md'], // 当设为 auto 时会根据目录自动生成侧边栏
//   sidebar: "auto"
// })

export const notes = defineNotesConfig({
  dir: 'notes', // 所有笔记的默认文件夹
  link: '/', // 所有笔记的默认链接前缀
  // 每一个笔记都是 notes 数组中的一个对象
  notes: [
    {
      dir: 'engineering',
      link: '/engineering',
      sidebar: 'auto'
    },
    {
      dir: 'examples',
      link: '/examples',
      sidebar: 'auto'
    },
    {
      dir: 'others',
      link: '/others',
      sidebar: 'auto'
    },
    {
      dir: 'nuxt',
      link: '/nuxt',
      sidebar: 'auto'
    },
    {
      dir: 'vue',
      link: '/vue',
      sidebar: 'auto'
    }
  ],
})
