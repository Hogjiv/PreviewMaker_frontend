import { createRouter, createWebHistory } from 'vue-router'
import scriptUi from "@/views/scriptUi.vue";
import progressBar from "../components/progressBar.vue"
import faqPage from "../components/faqPage"
const routes = [
  {
    path: '',
    name: 'scriptUi',
    component: scriptUi
  },
  {
    path: '/progress', // Новый путь для страницы с прогресс-баром
    name: 'progress',
    component: progressBar // Используйте новый компонент
  },
  {
    path: '/faqPage',  
    name: 'faq',
    component: faqPage // Используйте новый компонент
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
