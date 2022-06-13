import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import HomeView from '../views/SummaryView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      //meta: { transition: 'fade' },
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/CalendarView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/settings/theme',
      name: 'theme',
      component: () => import('../views/SettingsTheme.vue'),
    },
    {
      path: '/settings/language',
      name: 'language',
      component: () => import('../views/SettingsLanguage.vue'),
    },
    {
      path: '/settings/privacy-policy',
      name: 'privacy-policy',
      component: () => import('../views/SettingsPrivacyPolicy.vue'),
    },
    {
      path: '/settings/manage-data',
      name: 'manage-data',
      component: () => import('../views/SettingsManageData.vue'),
    },
    {
      path: '/stats/:type',
      name: 'stats',
      component: () => import('../views/StatsView.vue'),
    },
  ],
});

export default router;
