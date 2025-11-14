import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

// 禁用菜单栏和内容选择
document.oncontextmenu = (e) => e.preventDefault()
document.onselectstart = (e) => e.preventDefault()

app.mount('#app')
