// src/main.js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createDiscreteApi } from 'naive-ui'
import { createPinia } from 'pinia'
import {router} from './common/router'
import axios from 'axios'
import Menu from './components/Menu.vue'
import SeatItem from "./components/SeatItem.vue";
import Form from './components/Form.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import TimeLine from './components/TimeLine.vue'
import VChart from "vue-echarts";
import Chart from './components/Chart.vue'
import StatisticChart from './components/StatisticChart.vue'
import BarChart from "./components/BarChart.vue";
import LineChart from "./components/LineChart.vue";


axios.defaults.baseURL = "http://localhost:3000/api"  // 服务端地址
const { message, notification, dialog } = createDiscreteApi(
    ["message", "dialog", "notification"]
);

const app = createApp(App);
const pinia = createPinia();

app.provide("axios", axios);
app.provide("message", message);
app.provide("notification", notification);
app.provide("dialog", dialog);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.component('Menu', Menu);
app.component('SeatItem', SeatItem);
app.component('Form', Form);
app.component('TimeLine', TimeLine);
app.component('VChart', VChart);
app.component('Chart', Chart);
app.component('BarChart', BarChart);
app.component('LineChart', LineChart);
app.component('StatisticChart', StatisticChart);

app.use(naive);
app.use(ElementPlus)
app.use(pinia); 
app.use(router);
app.mount('#app');
