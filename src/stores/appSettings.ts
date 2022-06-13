import { defineStore } from 'pinia';

export type ThemeType = 'System' | 'Dark' | 'Light';
export type LangType = 'en' | 'uk';

export type AppRootState = {
  appTheme: ThemeType;
  isNotifications: boolean;
};

const isPushActive = localStorage.getItem('mehealth-push-active') === 'true' ? true : false;

export const useAppSettingsStore = defineStore({
  id: 'appSettingsTypes',
  state: (): AppRootState => ({
    appTheme: (localStorage.getItem('mehealth-theme') as ThemeType) || 'System',
    isNotifications: isPushActive,
  }),
  getters: {},
  actions: {
    setTheme(theme: ThemeType) {
      this.appTheme = theme;
      localStorage.setItem('mehealth-theme', theme);
      document.documentElement.setAttribute('data-color-scheme', theme === 'Dark' ? 'dark' : theme === 'Light' ? 'light' : 'system');
      //document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'true' ? '#373c49' : '#ffffff');
    },
    setNotificationsSettings() {
      this.isNotifications = !this.isNotifications;
      localStorage.setItem('mehealth-push-active', this.isNotifications ? 'true' : 'false');
    },
    setLang(lang: LangType) {
      localStorage.setItem('mehealth-lang', lang);
      document.documentElement.setAttribute('lang', lang);
    },
  },
});
