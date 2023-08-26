import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import '@/assets/css/global.css'

const app = createApp(App)
// 统一导入el-icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 统一注册el-icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 图表
import ECharts from 'vue-echarts';
import { graphic } from 'echarts/index';


app.use(store).use(router).use(ElementPlus, {
    locale,
    size: "mini"
}).provide('graphic', graphic).component('VChart', ECharts).mount('#app')
