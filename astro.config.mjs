// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import starlightThemeNova from 'starlight-theme-nova';
import svelte from '@astrojs/svelte';
import starlightSidebarTopics from 'starlight-sidebar-topics';

// https://astro.build/config
export default defineConfig({
  site: 'https://svelte.dragomano.ru',
  integrations: [starlight({
    plugins: [
      starlightLinksValidator({
        errorOnRelativeLinks: false,
      }),
      /* starlightThemeNova({
        nav: [
          {
            label: 'Учебник',
            href: 'https://svelte.dev/tutorial',
          },
          {
            label: 'Песочница',
            href: 'https://svelte.dev/playground',
          }
        ]
      }), */
      starlightSidebarTopics(
        [
          {
            label: 'Svelte',
            link: '/introduction/overview/',
            icon: 'open-book',
            items: [
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
                collapsed: true,
                autogenerate: { directory: 'runtime' },
              },
              {
                label: 'Разное',
                autogenerate: { directory: 'misc' },
              },
              {
                label: 'Справочник',
                collapsed: true,
                autogenerate: { directory: 'reference' },
              },
              {
                label: 'Обучающие статьи и ролики',
                link: 'learning',
              },
            ],
          },
          {
            label: 'SvelteKit',
            link: 'https://svelte.dev/docs/kit',
            icon: 'seti:svelte',
          },
          {
            id: 'cli',
            label: 'Консольные команды',
            link: '/cli/introduction/overview',
            icon: 'seti:shell',
            items: [
              {
                label: 'Общая информация',
                autogenerate: { directory: 'cli/introduction' },
              },
              {
                label: 'Команды',
                autogenerate: { directory: 'cli/commands' },
              },
            ],
          },
        ],
      ),
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
    social: [
      { icon: 'github', label: 'GitHub', href: 'https://github.com/dragomano/svelte-russian' },
    ],
    editLink: {
      baseUrl: 'https://github.com/dragomano/svelte-russian/edit/main/',
    },
    components: {
      LastUpdated: './src/components/LastUpdated.astro',
    },
  }), svelte()],
});