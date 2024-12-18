import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

// 引入echarts
import * as echarts from 'echarts'

// 创建 Vue 应用并全局注入 echarts
const app = createApp(App);
app.config.globalProperties.$echarts = echarts;

//应用路由
app.use(router);

// 挂载应用
app.mount('#app')