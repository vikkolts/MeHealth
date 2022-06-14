import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/SummaryView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
      meta: { transition: 'slide-left' },
    },
    {
      path: '/settings/language',
      name: 'language',
      component: () => import('../views/SettingsLanguage.vue'),
      meta: { transition: 'slide-left' },
    },
    {
      path: '/settings/privacy-policy',
      name: 'privacy-policy',
      component: () => import('../views/SettingsPrivacyPolicy.vue'),
      meta: { transition: 'slide-left' },
    },
    {
      path: '/settings/manage-data',
      name: 'manage-data',
      component: () => import('../views/SettingsManageData.vue'),
      meta: { transition: 'slide-left' },
    },
    {
      path: '/stats/:type',
      name: 'stats',
      component: () => import('../views/StatsView.vue'),
      meta: { transition: 'slide-left' },
    },
  ],
});

export default router;
