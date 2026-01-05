---
title: Cloudflare Workers
origin: https://svelte.dev/docs/kit/adapter-cloudflare-workers
sidebar:
  order: 7
---

:::note
`adapter-cloudflare-workers` устарел в пользу [`adapter-cloudflare`](/kit/build-and-deploy/adapter-cloudflare). Мы рекомендуем использовать `adapter-cloudflare` для развёртывания на Cloudflare Workers с [Static Assets](https://developers.cloudflare.com/workers/static-assets/), поскольку Cloudflare Workers Sites будет устаревшим в пользу этого подхода.
:::

Для развёртывания на [Cloudflare Workers](https://workers.cloudflare.com/) с [Workers Sites](https://developers.cloudflare.com/workers/configuration/sites/) используйте `adapter-cloudflare-workers`.

## Использование

Установите с помощью команды `npm i -D @sveltejs/adapter-cloudflare-workers`, затем добавьте адаптер в ваш файл `svelte.config.js`:

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare-workers';

export default {
  kit: {
    adapter: adapter({
      // см. описание доступных параметров ниже
    })
  }
};
```

## Опции

### config

Путь к вашему [конфигурационному файлу Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/). Если вы хотите использовать имя файла конфигурации Wrangler, отличное от `wrangler.jsonc`, `wrangler.json` или `wrangler.toml`, вы можете указать его с помощью этой опции.

### platformProxy

Настройки для эмулируемых локальных привязок `platform.env`. Полный список опций см. в документации по API [getPlatformProxy](https://developers.cloudflare.com/workers/wrangler/api/#parameters-1) Wrangler.

## Базовая конфигурация

Этот адаптер ожидает наличия [конфигурационного файла Wrangler](https://developers.cloudflare.com/workers/configuration/sites/configuration/) в корне проекта. Он должен выглядеть примерно так:

```jsonc
// wrangler.jsonc
{
  "name": "<your-service-name>",
  "account_id": "<your-account-id>",
  "main": "./.cloudflare/worker.js",
  "site": {
    "bucket": "./.cloudflare/public"
  },
  "build": {
    "command": "npm run build"
  },
  "compatibility_date": "2021-11-12"
}
```

`<your-service-name>` может быть любым. `<your-account-id>` можно найти, выполнив команду `wrangler whoami` с помощью инструмента Wrangler CLI или войдя в вашу [панель управления Cloudflare](https://dash.cloudflare.com) и взяв его из конца URL:

```
https://dash.cloudflare.com/<your-account-id>/home
```

:::note
Вы должны добавить директорию `.cloudflare` (или любые другие директории, указанные для `main` и `site.bucket`) и директорию `.wrangler` в ваш файл `.gitignore`.
:::

Вам нужно установить [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) и войти в систему, если вы ещё этого не сделали:

```sh
npm i -D wrangler
wrangler login
```

Затем вы можете собрать и развернуть свое приложение:

```sh
wrangler deploy
```

## API среды выполнения

Объект [`env`](https://developers.cloudflare.com/workers/runtime-apis/fetch-event#parameters) содержит [привязки](https://developers.cloudflare.com/workers/runtime-apis/bindings/) вашего проекта, такие как пространства имён KV/DO и т. д. Он передаётся в SvelteKit через свойство `platform` вместе с [`ctx`](https://developers.cloudflare.com/workers/runtime-apis/context/), [`caches`](https://developers.cloudflare.com/workers/runtime-apis/cache/) и [`cf`](https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties), что позволяет вам получать к нему доступ в хуках и эндпойнтах:

```js
export async function POST({ request, platform }) {
  const x = platform.env.YOUR_DURABLE_OBJECT_NAMESPACE.idFromName('x');
}
```

:::note
Для переменных окружения предпочтительно использовать встроенный модуль SvelteKit [`$env`](https://svelte.dev/docs/kit/$env-static-private).
:::

Чтобы сделать эти типы доступными для вашего приложения, установите [`@cloudflare/workers-types`](https://www.npmjs.com/package/@cloudflare/workers-types) и укажите их в вашем файле `src/app.d.ts`:

```diff lang="ts"
// src/app.d.ts
+import { KVNamespace, DurableObjectNamespace } from '@cloudflare/workers-types';

declare global {
  namespace App {
    interface Platform {
+     env?: {
+       YOUR_KV_NAMESPACE: KVNamespace;
+       YOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace;
+     };
    }
  }
}

export {};
```

### Локальное тестирование

Значения, специфичные для Cloudflare Workers, в свойстве `platform` эмулируются в режимах разработки и предпросмотра. Локальные [привязки](https://developers.cloudflare.com/workers/wrangler/configuration/#bindings) создаются на основе вашего [конфигурационного файла Wrangler](https://developers.cloudflare.com/workers/wrangler/) и используются для заполнения `platform.env` во время разработки и предпросмотра. Используйте опцию конфигурации адаптера [`platformProxy`](#platformproxy), чтобы изменить настройки для привязок.

Для тестирования сборки используйте [Wrangler](https://developers.cloudflare.com/workers/wrangler/) версии 4. После сборки сайта выполните команду `wrangler dev`.

## Решение проблем

### Совместимость с Node.js

Если вы хотите включить [совместимость с Node.js](https://developers.cloudflare.com/workers/runtime-apis/nodejs/), добавьте флаг совместимости `nodejs_compat` в ваш конфигурационный файл Wrangler:

```jsonc
// wrangler.jsonc
{
  "compatibility_flags": ["nodejs_compat"]
}
```

### Ограничения размера воркера

При развёртывании вашего приложения сервер, созданный SvelteKit, собирается в один файл. Wrangler не сможет опубликовать ваш воркер, если после минификации он превысит [ограничения по размеру](https://developers.cloudflare.com/workers/platform/limits/#worker-size). Обычно вы вряд ли столкнётесь с этим ограничением, но некоторые крупные библиотеки могут его вызвать. В таком случае попробуйте уменьшить размер воркера, импортируя такие библиотеки только на стороне клиента. Подробности см. в [FAQ](https://svelte.dev/docs/kit/faq#How-do-I-use-a-client-side-library-accessing-document-or-window).

### Доступ к файловой системе

В Cloudflare Workers нельзя использовать `fs` — необходимо [предварительно рендерить](/kit/core-concepts/page-options/#prerender) соответствующие маршруты.
