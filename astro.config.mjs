// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import starlightUiTweaks from 'starlight-ui-tweaks';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'https://svelte.dragomano.ru',
  integrations: [
    starlight({
      plugins: [
        starlightLinksValidator({
          errorOnRelativeLinks: false,
        }),
        starlightUiTweaks(),
        starlightSidebarTopics(
          [
            {
              label: 'Svelte',
              link: '/introduction/overview',
              icon: 'open-book',
              items: [
                {
                  label: 'Введение',
                  items: [{ autogenerate: { directory: 'introduction' } }],
                },
                {
                  label: 'Руны',
                  items: [{ autogenerate: { directory: 'runes' } }],
                },
                {
                  label: 'Синтаксис шаблонов',
                  collapsed: true,
                  items: [{ autogenerate: { directory: 'template-syntax' } }],
                },
                {
                  label: 'Стилизация',
                  items: [{ autogenerate: { directory: 'styling' } }],
                },
                {
                  label: 'Специальные элементы',
                  collapsed: true,
                  items: [{ autogenerate: { directory: 'special-elements' } }],
                },
                {
                  label: 'Рантайм',
                  collapsed: true,
                  items: [{ autogenerate: { directory: 'runtime' } }],
                },
                {
                  label: 'Разное',
                  items: [{ autogenerate: { directory: 'misc' } }],
                },
                {
                  label: 'Справочник',
                  collapsed: true,
                  items: [{ autogenerate: { directory: 'reference' } }],
                },
                {
                  label: 'Обучающие статьи и ролики',
                  link: 'learning',
                },
              ],
            },
            {
              id: 'kit',
              label: 'SvelteKit',
              link: '/kit/getting-started/introduction',
              icon: 'seti:svelte',
              items: [
                {
                  label: 'Начало работы',
                  items: [{ autogenerate: { directory: 'kit/getting-started' } }],
                },
                {
                  label: 'Основные концепции',
                  items: [{ autogenerate: { directory: 'kit/core-concepts' } }],
                },
                {
                  label: 'Сборка и развёртывание',
                  items: [{ autogenerate: { directory: 'kit/build-and-deploy' } }],
                },
                {
                  label: 'Дополнительно',
                  items: [{ autogenerate: { directory: 'kit/advanced' } }],
                },
                {
                  label: 'Лучшие практики',
                  items: [{ autogenerate: { directory: 'kit/best-practices' } }],
                },
              ],
            },
            {
              id: 'cli',
              label: 'Консольные команды',
              link: '/cli/introduction/overview',
              icon: 'seti:shell',
              items: [
                {
                  label: 'Общая информация',
                  items: [{ autogenerate: { directory: 'cli/introduction' } }],
                },
                {
                  label: 'Команды',
                  items: [{ autogenerate: { directory: 'cli/commands' } }],
                },
              ],
            },
            {
              id: 'ai',
              label: 'ИИ',
              link: '/ai/overview',
              icon: 'desktop',
              items: [
                {
                  label: 'Введение',
                  link: 'ai/overview',
                },
                {
                  label: 'Инструкции',
                  link: 'ai/instructions',
                },
                {
                  label: 'MCP-сервер',
                  items: [{ autogenerate: { directory: 'ai/mcp' } }],
                },
                {
                  label: 'Навыки',
                  link: 'ai/skills',
                },
                {
                  label: 'Субагенты',
                  link: 'ai/subagents',
                },
                {
                  label: 'Плагины',
                  items: [{ autogenerate: { directory: 'ai/plugins' } }],
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
        {
          tag: 'script',
          content: `(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "r5l1g73n2s");`,
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
        SocialIcons: './src/components/SocialIcons.astro',
      },
    }),
    svelte(),
  ],
});