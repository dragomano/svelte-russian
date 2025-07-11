---
title: Адаптеры
origin: https://svelte.dev/docs/kit/adapters
sidebar:
  order: 1
---

Перед развёртыванием приложения SvelteKit необходимо _адаптировать_ его для целевой платформы. Адаптеры — это небольшие плагины, которые принимают собранное приложение в качестве входных данных и генерируют результат для развёртывания.

Официальные адаптеры существуют для различных платформ — они описаны на следующих страницах:

- [`@sveltejs/adapter-cloudflare`](https://svelte.dev/docs/kit/adapter-cloudflare) для Cloudflare Workers и Cloudflare Pages
- [`@sveltejs/adapter-netlify`](https://svelte.dev/docs/kit/adapter-netlify) для Netlify
- [`@sveltejs/adapter-node`](https://svelte.dev/docs/kit/adapter-node) для серверов Node
- [`@sveltejs/adapter-static`](https://svelte.dev/docs/kit/adapter-static) для генерации статических сайтов (SSG)
- [`@sveltejs/adapter-vercel`](https://svelte.dev/docs/kit/adapter-vercel) для Vercel

Также существуют дополнительные [адаптеры, созданные сообществом](https://sveltesociety.dev/packages?category=sveltekit-adapters) для других платформ.

## Использование адаптеров

Ваш адаптер указывается в файле `svelte.config.js`:

```js
// svelte.config.js
import adapter from 'svelte-adapter-foo';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // параметры адаптера
    })
  }
};

export default config;
```

## Контекст, специфичный для платформы

Некоторые адаптеры могут иметь доступ к дополнительной информации о запросе. Например, Cloudflare Workers могут обращаться к объекту `env`, содержащему пространства имён KV и другие данные. Эта информация может быть передана в `RequestEvent`, используемый в [хуках](https://svelte.dev/docs/kit/hooks) и [серверных маршрутах](/kit/core-concepts/routing/#server) в качестве свойства `platform` — подробности уточняйте в документации каждого адаптера.
