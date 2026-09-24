// import './assets/main.css'

import { createApp } from 'vue'
// import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

import print from 'vue3-print-nb'
import '@fortawesome/fontawesome-free/css/all.css'
import 'bootstrap/dist/css/bootstrap.css'
import './assets/css/pe-icon-7-stroke.css'

const app = createApp(App)

// app.use(createPinia())
app.use(router)
app.use(print)

app.component('EasyDataTable', Vue3EasyDataTable);

app.mount('#app')
