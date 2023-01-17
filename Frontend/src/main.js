import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Notifications from '@kyvg/vue3-notification'
import '@fortawesome/fontawesome-free/js/all'
import '../src/assets/css/form.css'
import '../src/assets/tabulator_bootstrap4.min.css'
createApp(App).use(store).use(router).use(Notifications).mount('#app')