<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'
import './index.css'
import ReloadPrompt from './components/ReloadPrompt.vue'
import { watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  SUPPORT_LOCALES,
  setI18nLanguage,
  loadLocaleMessages,
} from './i18n'

const { locale, availableLocales, } = useI18n()
const currentLocale = ref(locale.value)

/**
 * when change the locale, go to locale route
 *
 * when the changes are detected, load the locale message and set the language via vue-router navigation guard.
 * change the vue-i18n locale too.
 */
watch(currentLocale, async (val) => {
  if (!availableLocales.includes(val)) {
    await loadLocaleMessages(val);
  }
  setI18nLanguage(val);
})
</script>
<template>
  <header>
    <img alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
    <form class="language">
      <label for="locale-select">Language</label>
      <select id="locale-select"
        v-model="currentLocale">
        <option v-for="optionLocale in SUPPORT_LOCALES"
          :key="optionLocale"
          :value="optionLocale">
          {{ optionLocale }}
        </option>
      </select>
    </form>
  </header>
  {{ $t('hello') }}

  <RouterView />
  <ReloadPrompt />
</template>

<style>
@import '@/assets/base.css';

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
