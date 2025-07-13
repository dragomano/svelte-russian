---
title: Cloudflare
origin: https://svelte.dev/docs/kit/adapter-cloudflare
sidebar:
  order: 6
---

Для развёртывания на [Cloudflare Workers](https://workers.cloudflare.com/) или [Cloudflare Pages](https://pages.cloudflare.com/) используйте [`adapter-cloudflare`](https://github.com/sveltejs/kit/tree/main/packages/adapter-cloudflare).

Этот адаптер устанавливается по умолчанию при использовании [`adapter-auto`](/kit/build-and-deploy/adapter-auto). Если вы планируете остаться с Cloudflare, вы можете перейти от [`adapter-auto`](/kit/build-and-deploy/adapter-auto) к прямому использованию этого адаптера, чтобы `event.platform` эмулировался во время локальной разработки, автоматически применялись декларации типов и предоставлялась возможность настройки параметров, специфичных для Cloudflare.

## Сравнение

- `adapter-cloudflare` – поддерживает все функции SvelteKit; собирает для Cloudflare Workers Static Assets и Cloudflare Pages.
- `adapter-cloudflare-workers` – устарел. Поддерживает все функции SvelteKit; собирает для Cloudflare Workers Sites.
- `adapter-static` – создаёт только клиентские статические активы; совместим с Cloudflare Workers Static Assets и Cloudflare Pages.

## Использование

Установите с помощью команды `npm i -D @sveltejs/adapter-cloudflare`, затем добавьте адаптер в ваш файл `svelte.config.js`:

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare';

export default {
  kit: {
    adapter: adapter({
      // См. информацию об этих параметрах ниже
      config: undefined,
      platformProxy: {
        configPath: undefined,
        environment: undefined,
        persist: undefined
      },
      fallback: 'plaintext',
      routes: {
        include: ['/*'],
        exclude: ['<all>']
      }
    })
  }
};
```

## Опции

### config

Путь к вашему [конфигурационному файлу Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/). Если вы хотите использовать имя файла конфигурации Wrangler, отличное от `wrangler.jsonc`, `wrangler.json` или `wrangler.toml`, вы можете указать его с помощью этой опции.

### platformProxy

Настройки для эмулируемых локальных привязок `platform.env`. Подробный список опций см. в документации по API [getPlatformProxy](https://developers.cloudflare.com/workers/wrangler/api/#parameters-1) Wrangler.

### fallback

Определяет, рендерить ли текстовую страницу 404.html или резервную страницу SPA для запросов, не соответствующих активам.

Для Cloudflare Workers по умолчанию возвращается ответ с кодом 404 и пустым телом для запросов, не соответствующих активам. Однако, если настройка [`assets.not_found_handling`](https://developers.cloudflare.com/workers/static-assets/routing/#2-not_found_handling) в конфигурации Wrangler установлена в `"404-page"`, эта страница будет возвращена при неудачном совпадении с активом. Если `assets.not_found_handling` установлено в `"single-page-application"`, адаптер отрендерит страницу index.html для SPA fallback независимо от указанной опции `fallback`.

Для Cloudflare Pages эта страница будет возвращена только в случае, если запрос, соответствующий записи в `routes.exclude`, не совпадает с активом.

В большинстве случаев достаточно использовать `plaintext`, но если вы используете `routes.exclude` для ручного исключения набора предварительно отрендеренных страниц, не превышая лимит в 100 маршрутов, вы можете выбрать `spa`, чтобы избежать отображения нестилизованной страницы 404 для пользователей.

Дополнительную информацию см. в разделе [Not Found behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/#not-found-behavior) для Cloudflare Pages.

### routes

Только для Cloudflare Pages. Позволяет настроить файл [`_routes.json`](https://developers.cloudflare.com/pages/functions/routing/#create-a-_routesjson-file), создаваемый `adapter-cloudflare`.

- `include` определяет маршруты, которые будут вызывать функцию, по умолчанию — `['/*']`.
- `exclude` определяет маршруты, которые _не_ будут вызывать функцию — это более быстрый и экономичный способ обслуживания статических активов вашего приложения. Этот массив может включать следующие специальные значения:
  - `<build>` содержит артефакты сборки вашего приложения (файлы, сгенерированные Vite).
  - `<files>` содержит содержимое вашей директории `static`.
  - `<prerendered>` содержит список предварительно отрендеренных страниц.
  - `<all>` (по умолчанию) включает всё вышеперечисленное.

Вы можете указать до 100 правил `include` и `exclude` в совокупности. Обычно опцию `routes` можно не задавать, но если, например, ваши пути `<prerendered>` превышают этот лимит, может быть полезно вручную создать список `exclude`, включающий `'/articles/*'`, вместо автоматически сгенерированного `['/articles/foo', '/articles/bar', '/articles/baz', ...]`.

## Cloudflare Workers

### Базовая конфигурация

При сборке для Cloudflare Workers этот адаптер ожидает наличия [конфигурационного файла Wrangler](https://developers.cloudflare.com/workers/configuration/sites/configuration/) в корне проекта. Он должен выглядеть примерно так:

```jsonc
// wrangler.jsonc
{
  "name": "<any-name-you-want>",
  "main": ".svelte-kit/cloudflare/_worker.js",
  "compatibility_date": "2025-01-01",
  "assets": {
    "binding": "ASSETS",
    "directory": ".svelte-kit/cloudflare",
  }
}
```

### Развёртывание

Для начала следуйте [руководству по фреймворкам](https://developers.cloudflare.com/workers/frameworks/framework-guides/svelte/) для Cloudflare Workers.

## Cloudflare Pages

### Развёртывание

Для начала следуйте [руководству по началу работы](https://developers.cloudflare.com/pages/get-started/) для Cloudflare Pages.

Если вы используете [интеграцию с Git](https://developers.cloudflare.com/pages/get-started/git-integration/), ваши настройки сборки должны выглядеть следующим образом:

- Предустановка фреймворка – SvelteKit
- Команда сборки – `npm run build` или `vite build`
- Директория вывода сборки – `.svelte-kit/cloudflare`

### Дополнительные материалы

Вы можете обратиться к [документации Cloudflare по развёртыванию сайта на SvelteKit на Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-svelte-kit-site/).

### Примечания

Функции, содержащиеся в директории [`/functions`](https://developers.cloudflare.com/pages/functions/routing/) в корне проекта, _не_ будут включены в развёртывание. Вместо этого функции должны быть реализованы как [серверные эндпойнты](/kit/core-concepts/routing/#server) в вашем приложении SvelteKit, которое компилируется в [единый файл `_worker.js`](https://developers.cloudflare.com/pages/functions/advanced-mode/).

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

Значения, специфичные для Cloudflare, в свойстве `platform` эмулируются в режимах разработки и предпросмотра. Локальные [привязки](https://developers.cloudflare.com/workers/wrangler/configuration/#bindings) создаются на основе вашего [конфигурационного файла Wrangler](https://developers.cloudflare.com/workers/wrangler/) и используются для заполнения `platform.env` во время разработки и предпросмотра. Используйте опцию конфигурации адаптера [`platformProxy`](#platformproxy), чтобы изменить настройки для привязок.

Для тестирования сборки используйте [Wrangler](https://developers.cloudflare.com/workers/wrangler/) версии 4. После сборки сайта выполните команду `wrangler dev .svelte-kit/cloudflare` для тестирования на Cloudflare Workers или `wrangler pages dev .svelte-kit/cloudflare` для Cloudflare Pages.

## Заголовки и перенаправления

Файлы [`_headers`](https://developers.cloudflare.com/pages/configuration/headers/) и [`_redirects`](https://developers.cloudflare.com/pages/configuration/redirects/), специфичные для Cloudflare, могут использоваться для ответов статических активов (например, изображений), если поместить их в корневую папку проекта.

Однако они не влияют на ответы, динамически рендерящиеся SvelteKit. Для таких случаев следует возвращать пользовательские заголовки или ответы с перенаправлением из [серверных эндпойнтов](/kit/core-concepts/routing/#server) или с помощью хука [`handle`](https://svelte.dev/docs/kit/hooks#Server-hooks-handle).

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

## Миграция с Workers Sites

Cloudflare больше не рекомендует использовать [Workers Sites](https://developers.cloudflare.com/workers/configuration/sites/configuration/) и вместо этого советует использовать [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/). Для миграции замените `@sveltejs/adapter-cloudflare-workers` на `@sveltejs/adapter-cloudflare` и удалите все настройки `site` из вашего конфигурационного файла Wrangler, затем добавьте настройки `assets.directory` и `assets.binding`:

### svelte.config.js

```diff lang="js"
// svelte.config.js
-import adapter from '@sveltejs/adapter-cloudflare-workers';
+import adapter from '@sveltejs/adapter-cloudflare';

export default {
  kit: {
    adapter: adapter()
  }
};
```

### wrangler.toml

```diff lang="toml"
// wrangler.toml
-site.bucket = ".cloudflare/public"
+assets.directory = ".cloudflare/public"
+assets.binding = "ASSETS"
```

### wrangler.jsonc

```diff lang="jsonc"
// wrangler.jsonc
{
-  "site": {
-    "bucket": ".cloudflare/public"
-  },
+  "assets": {
+    "directory": ".cloudflare/public",
+    "binding": "ASSETS"
+  }
}
```
