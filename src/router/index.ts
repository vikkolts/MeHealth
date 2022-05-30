import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
});

export default router;

// // navigation guards
// router.beforeEach(async (to) => {
//   const paramsLocale = to.params.locale as string;

//   // use locale if paramsLocale is not in SUPPORT_LOCALES
//   if (!SUPPORT_LOCALES.includes(paramsLocale)) {
//     return `/${locale}`;
//   }

//   // load locale messages
//   if (!i18n.global.availableLocales.includes(paramsLocale)) {
//     await loadLocaleMessages(i18n, paramsLocale);
//   }

//   // set i18n language
//   setI18nLanguage(i18n, paramsLocale);
// });
