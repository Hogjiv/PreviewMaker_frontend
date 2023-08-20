import { createRouter, createWebHistory } from 'vue-router'
import scriptUi from "@/views/scriptUi.vue";

const routes = [
  {
    path: '',
    name: 'scriptUi',
    component: scriptUi
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
