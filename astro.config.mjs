// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import starlightThemeNova from 'starlight-theme-nova';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'https://svelte.dragomano.ru',
  integrations: [starlight({
    plugins: [
      starlightLinksValidator({
        errorOnRelativeLinks: false,
      }),
      starlightThemeNova(),
    ],
    title: 'Svelte по-русски',
    description: 'Документация Svelte 5 на русском языке.',
    head: [
      {
        tag: 'meta',
        attrs: {
          name: 'google-site-verification',
          content: 'fq1A8llkn1XRVaPfBInN-TPoDtGsEUQmvEr3QVrEsyI',
        },
      },
    ],
    defaultLocale: 'root',
    locales: {
      root: {
        label: 'Русский',
        lang: 'ru',
      },
    },
    logo: {
      dark: './src/assets/dark_logo.svg',
      light: './src/assets/logo.svg',
      replacesTitle: true,
      alt: 'Логотип Svelte',
    },
    social: {
      github: 'https://github.com/dragomano/svelte-russian',
    },
    editLink: {
      baseUrl: 'https://github.com/dragomano/svelte-russian/edit/main/',
    },
    components: {
      LastUpdated: './src/components/LastUpdated.astro',
    },
    sidebar: [
      {
        label: 'Введение',
        autogenerate: { directory: 'introduction' },
      },
      {
        label: 'Руны',
        autogenerate: { directory: 'runes' },
      },
      {
        label: 'Синтаксис шаблонов',
        collapsed: true,
        autogenerate: { directory: 'template-syntax' },
      },
      {
        label: 'Стилизация',
        autogenerate: { directory: 'styling' },
      },
      {
        label: 'Специальные элементы',
        collapsed: true,
        autogenerate: { directory: 'special-elements' },
      },
      {
        label: 'Рантайм',
        autogenerate: { directory: 'runtime' },
      },
      {
        label: 'Разное',
        autogenerate: { directory: 'misc' },
      },
      {
        label: 'Справочник',
        autogenerate: { directory: 'reference' },
      },
      {
        label: 'Обучающие статьи и ролики',
        link: 'learning',
      },
    ],
  }), svelte()],
});