---
title: Типы проектов
origin: https://svelte.dev/docs/kit/project-types
sidebar:
  order: 2
---

## Гибкий рендеринг в SvelteKit

SvelteKit предлагает настраиваемый рендеринг, позволяющий собирать и развёртывать проект различными способами. Вы можете создавать приложения всех перечисленных типов и не только. Настройки рендеринга не исключают друг друга — можно выбрать оптимальный способ для разных частей приложения.

Если вы ещё не определились с подходом — не беспокойтесь! Способ сборки, развёртывания и рендеринга контролируется выбранным адаптером и небольшой конфигурацией, которые всегда можно изменить позже. Независимо от типа проекта, [структура проекта](/kit/getting-started/project-structure) и [маршрутизация](https://svelte.dev/docs/kit/glossary#Routing) остаются одинаковыми.

### Рендеринг по умолчанию

По умолчанию при посещении сайта SvelteKit использует [серверный рендеринг (SSR)](https://svelte.dev/docs/kit/glossary#SSR) для первой страницы и [клиентский рендеринг (CSR)](https://svelte.dev/docs/kit/glossary#CSR) для последующих. SSR улучшает SEO и воспринимаемую скорость загрузки, а CSR ускоряет навигацию между страницами без перерисовки общих компонентов. Приложения, построенные с таким подходом, называют [гибридными](https://www.youtube.com/watch?v=860d8usGC0o).

### Генерация статических сайтов (SSG)

SvelteKit может работать как [генератор статических сайтов (SSG)](https://svelte.dev/docs/kit/glossary#SSG) с полным [пререндерингом](https://svelte.dev/docs/kit/glossary#Prerendering) через [`adapter-static`](/kit/build-and-deploy/adapter-static). Также можно пререндерить только часть страниц, используя [опцию `prerender`](/kit/core-concepts/page-options/#prerender), а остальные рендерить динамически.

Для очень больших сайтов можно использовать [постепенное обновление статики (ISR) в `adapter-vercel`](/kit/build-and-deploy/adapter-vercel/#инкрементная-статическая-регенерация) для ускорения сборки. В отличие от специализированных SSG, SvelteKit позволяет гибко комбинировать разные типы рендеринга.

### Одностраничное приложение (SPA)

[Одностраничные приложения (SPA)](https://svelte.dev/docs/kit/glossary#SPA) используют исключительно [клиентский рендеринг (CSR)](https://svelte.dev/docs/kit/glossary#CSR). SvelteKit поддерживает [создание SPA](/kit/build-and-deploy/single-page-apps) с бэкендом на любом языке. Если бэкенд не требуется, можно игнорировать разделы документации о `server`-файлах.

### Многостраничное приложение (MPA)

Хотя SvelteKit редко используется для [традиционных MPA](https://svelte.dev/docs/kit/glossary#MPA), можно отключить JavaScript на странице через [`csr = false`](/kit/core-concepts/page-options#csr) (серверный рендеринг всех переходов) или использовать [`data-sveltekit-reload`](https://svelte.dev/docs/kit/link-options#data-sveltekit-reload) для выборочного SSR.

### Отдельный бэкенд

При использовании бэкенда на Go, Java, PHP и других языках рекомендуется развёртывать фронтенд отдельно через `adapter-node` или serverless-адаптер. Альтернатива — [SPA](/kit/build-and-deploy/single-page-apps), но это ухудшает SEO и производительность. В этом случае можно игнорировать `server`-файлы и изучить [FAQ по интеграции с внешним API](https://svelte.dev/docs/kit/faq#How-do-I-use-a-different-backend-API-server).

### Serverless-приложения

SvelteKit легко развернуть на serverless-платформах. [Адаптер по умолчанию](/kit/build-and-deploy/adapter-auto) поддерживает множество платформ, а специализированные адаптеры (`adapter-vercel`, `adapter-netlify`, `adapter-cloudflare`) добавляют платформо-специфичные функции, включая [edge-рендеринг](https://svelte.dev/docs/kit/glossary#Edge). [Сообщество разработало адаптеры](https://sveltesociety.dev/packages?category=sveltekit-adapters) для почти любых сред.

### Собственный сервер

Для развёртывания на собственном сервере или VPS используйте [`adapter-node`](/kit/build-and-deploy/adapter-node).

### Контейнеризация

Приложения на [`adapter-node`](/kit/build-and-deploy/adapter-node) можно запускать в Docker/LXC.

### Библиотеки

С помощью [`@sveltejs/package`](https://svelte.dev/docs/kit/packaging) (опция `library` в `sv create`) можно создавать библиотеки для других Svelte-приложений.

### Офлайн-приложения

Поддержка [service workers](https://svelte.dev/docs/kit/service-workers) позволяет создавать офлайн-приложения и [PWA](https://svelte.dev/docs/kit/glossary#PWA).

### Мобильные приложения

SPA из SvelteKit можно преобразовать в мобильное приложение через [Tauri](https://v2.tauri.app/start/frontend/sveltekit/) или [Capacitor](https://capacitorjs.com/solution/svelte) с доступом к камере, геолокации и push-уведомлениям. Для оптимизации используйте [`bundleStrategy: 'single'`](https://svelte.dev/docs/kit/configuration#output) (особенно для Capacitor с HTTP/1).

### Десктопные приложения

SPA превращаются в десктопные приложения через [Tauri](https://v2.tauri.app/start/frontend/sveltekit/), [Wails](https://wails.io/docs/guides/sveltekit/) или [Electron](https://www.electronjs.org/).

### Браузерные расширения

Для сборки расширений подходят [`adapter-static`](/kit/build-and-deploy/adapter-static) или [специализированные адаптеры](https://sveltesociety.dev/packages?category=sveltekit-adapters).

### Встраиваемые устройства

Благодаря эффективному рендерингу Svelte работает на маломощных устройствах (микроконтроллеры, ТВ). Для снижения числа запросов используйте [`bundleStrategy: 'single'`](https://svelte.dev/docs/kit/configuration#output).
