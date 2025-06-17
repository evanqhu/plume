import { defineClientConfig } from 'vuepress/client'
import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
// import CustomComponent from './theme/components/Custom.vue'

import './theme/styles/custom.scss'


export default defineClientConfig({
  enhance({ app }) {
    app.component('RepoCard', RepoCard)
    // app.component('CustomComponent', CustomComponent)
    
    // 打印简历时，修改标题
    if (typeof window !== 'undefined') {
      // 保存原始标题
      let originalTitle = '';

      window.addEventListener('message', (event) => {
        if (event.data.type === 'SET_PRINT_TITLE') {
          originalTitle = document.title;
          document.title = event.data.title;
        } else if (event.data.type === 'RESTORE_TITLE') {
          document.title = originalTitle;
        }
      });
    }
  },
})
