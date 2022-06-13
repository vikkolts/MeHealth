import { defineStore } from 'pinia';

export type ThemeType = 'System' | 'Dark' | 'Light';
export type LangType = 'en' | 'uk';

export type AppRootState = {
  appTheme: ThemeType;
  //appLang: LangType;
  isNotifications: boolean;
};

const isPushActive = localStorage.getItem('mehealth-push-active') === 'true' ? true : false;

export const useAppSettingsStore = defineStore({
  id: 'appSettingsTypes',
  state: (): AppRootState => ({
    appTheme: (localStorage.getItem('mehealth-theme') as ThemeType) || 'System',
    //appLang: (localStorage.getItem('mehealth-lang') as LangType) || 'en',
    isNotifications: isPushActive,
  }),
  getters: {},
  actions: {
    setTheme(theme: ThemeType) {
      this.appTheme = theme;
      localStorage.setItem('mehealth-theme', theme);
    },
    setNotificationsSettings() {
      this.isNotifications = !this.isNotifications;
      localStorage.setItem('mehealth-push-active', this.isNotifications ? 'true' : 'false');
    },
    setLang(lang: LangType) {
      //this.appLang = lang;
      localStorage.setItem('mehealth-lang', lang);
    },
  },
});
