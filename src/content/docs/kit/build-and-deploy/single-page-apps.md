---
title: Одностраничные приложения
origin: https://svelte.dev/docs/kit/single-page-apps
sidebar:
  order: 5
---

Вы можете превратить любое приложение SvelteKit, использующее любой адаптер, в полностью клиентски рендеримое одностраничное приложение (SPA), отключив SSR в корневом макете:

```js
// src/routes/+layout.js
export const ssr = false;
```

:::note
В большинстве случаев это не рекомендуется: это негативно сказывается на SEO, обычно замедляет воспринимаемую производительность и делает ваше приложение недоступным для пользователей, если JavaScript не работает или отключён (что происходит [чаще, чем вы думаете](https://kryogenix.org/code/browser/everyonehasjs.html)).
:::

Если у вас нет серверной логики (т. е. файлов `+page.server.js`, `+layout.server.js` или `+server.js`), вы можете использовать [`adapter-static`](/kit/build-and-deploy/adapter-static) для создания SPA, добавив _резервную страницу_.

## Использование

Установите адаптер с помощью команды `npm i -D @sveltejs/adapter-static`, затем добавьте его в ваш файл `svelte.config.js` со следующими параметрами:

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      fallback: '200.html' // может отличаться на разных хостах
    })
  }
};
```

Резервная страница — это HTML-страница, созданная SvelteKit на основе вашего шаблона страницы (например, `app.html`), которая загружает ваше приложение и перенаправляет на правильный маршрут. Например, [Surge](https://surge.sh/help/adding-a-200-page-for-client-side-routing), статический веб-хостинг, позволяет добавить файл `200.html`, который будет обрабатывать любые запросы, не соответствующие статическим активам или предварительно отрендеренным страницам.

На некоторых хостах это может быть `index.html` или что-то другое — уточните в документации вашей платформы.

:::note
Обратите внимание, что резервная страница всегда будет содержать абсолютные пути к активам (т. е. начинающиеся с `/`, а не с `.`), независимо от значения [`paths.relative`](https://svelte.dev/docs/kit/configuration#paths), поскольку она используется для обработки запросов к произвольным путям.
:::

## Apache

Для запуска SPA на [Apache](https://httpd.apache.org/) вы должны добавить файл `static/.htaccess`, чтобы направлять запросы на резервную страницу:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^200\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /200.html [L]
</IfModule>
```

## Предварительный рендеринг отдельных страниц

Если вы хотите, чтобы определённые страницы были предварительно отрендерены, вы можете снова включить `ssr` вместе с `prerender` только для этих частей вашего приложения:

```js
// src/routes/my-prerendered-page/+page.js
export const prerender = true;
export const ssr = true;
```
