import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../features/home/HomePage.vue';
import ConvertPage from '../features/convert/ConvertPage.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/convert', name: 'Convert', component: ConvertPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
