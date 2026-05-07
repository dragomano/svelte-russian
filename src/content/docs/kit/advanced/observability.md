---
title: Наблюдаемость
origin: https://svelte.dev/docs/kit/observability
sidebar:
  order: 8
---

<blockquote class="since note">
  <p>Доступно с версии 2.31</p>
</blockquote>

Иногда вам может понадобиться наблюдать за поведением вашего приложения, чтобы улучшить производительность или найти причину надоедливой ошибки. Для помощи в этом SvelteKit может генерировать серверные интервалы трассировки [OpenTelemetry](https://opentelemetry.io) для следующего:

- Хук [`handle`](/kit/advanced/hooks/#handle) и функции `handle`, выполняющиеся в [`sequence`](https://svelte.dev/docs/kit/@sveltejs-kit-hooks#sequence) (они будут отображаться как дочерние друг друга и корневого хука `handle`)
- Серверные функции [`load`](/kit/core-concepts/load/) и универсальные функции `load`, когда они выполняются на сервере
- [Действия форм](/kit/core-concepts/form-actions/)
- [Удалённые функции](/kit/core-concepts/remote-functions/)

Просто сказать SvelteKit генерировать интервалы не поможет — вам нужно фактически собирать их где-то, чтобы иметь возможность их просматривать. SvelteKit предоставляет `src/instrumentation.server.ts` как место для написания вашего кода настройки трассировки и инструментации. Гарантируется, что он будет выполнен до импорта кода вашего приложения, при условии, что ваша платформа развёртывания поддерживает это и ваш адаптер знает об этом.

Обе эти функции в настоящее время экспериментальные, что означает, что они, вероятно, содержат ошибки и могут измениться без предупреждения. Вы должны согласиться, добавив опции `kit.experimental.tracing.server` и `kit.experimental.instrumentation.server` в ваш `svelte.config.js`:

```diff lang="js"
// svelte.config.js
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
+    experimental: {
+      tracing: {
+        server: true
+      },
+      instrumentation: {
+        server: true
+      }
    }
  }
};

export default config;
```

:::note
Трассировка — и, что более значительно, инструментация наблюдаемости — может иметь нетривиальные накладные расходы. Прежде чем полностью включаться в трассировку, подумайте, действительно ли она вам нужна, или, возможно, лучше включить её только в средах разработки и предварительного просмотра.
:::

## Расширение встроенной трассировки

SvelteKit предоставляет доступ к интервалу `root` и интервалу `current` на событии запроса. Интервал `root` — это тот, который связан с вашей корневой функцией `handle`, а текущий интервал может быть связан с `handle`, `load`, действием формы или удалённой функцией, в зависимости от контекста. Вы можете аннотировать эти интервалы любыми атрибутами, которые хотите записать:

```js
// $lib/authenticate.ts
import { getRequestEvent } from '$app/server';
import { getAuthenticatedUser } from '$lib/auth-core';

async function authenticate() {
  const user = await getAuthenticatedUser();
  const event = getRequestEvent();
  event.tracing.root.setAttribute('userId', user.id);
}
```

## Быстрый старт для разработки

Чтобы просмотреть вашу первую трассировку, вам нужно настроить локальный коллектор. Мы будем использовать [Jaeger](https://www.jaegertracing.io/docs/getting-started/) в этом примере, поскольку они предоставляют простую команду быстрого старта. Как только ваш коллектор запущен локально:

- Включите экспериментальные флаги, упомянутые ранее, в вашем файле `svelte.config.js`
- Используйте ваш менеджер пакетов для установки необходимых зависимостей:
  ```sh
  npm i @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-proto import-in-the-middle
  ```
- Создайте `src/instrumentation.server.js` со следующим содержимым:

```js
// src/instrumentation.server.js
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { createAddHookMessageChannel } from 'import-in-the-middle';
import { register } from 'node:module';

const { registerOptions } = createAddHookMessageChannel();
register('import-in-the-middle/hook.mjs', import.meta.url, registerOptions);

const sdk = new NodeSDK({
  serviceName: 'test-sveltekit-tracing',
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();
```

Теперь серверные запросы начнут генерировать трассировки, которые вы можете просмотреть в веб-консоли Jaeger по адресу `http://localhost:16686`.

## `@opentelemetry/api`

SvelteKit использует `@opentelemetry/api` для генерации своих интервалов. Это объявлено как опциональная зависимость peer, чтобы пользователи, не нуждающиеся в трассировках, не видели никакого влияния на размер установки или производительность во время выполнения. В большинстве случаев, если вы настраиваете ваше приложение для сбора интервалов SvelteKit, вы в итоге установите библиотеку вроде `@opentelemetry/sdk-node` или `@vercel/otel`, которые в свою очередь зависят от `@opentelemetry/api`, что удовлетворит зависимость SvelteKit. Если вы видите ошибку от SvelteKit, говорящую, что он не может найти `@opentelemetry/api`, это может быть просто потому, что вы ещё не настроили сбор трассировок. Если вы _уже_ сделали это и всё ещё видите ошибку, вы можете установить `@opentelemetry/api` самостоятельно.
