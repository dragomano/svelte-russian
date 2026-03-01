---
title: Создание адаптеров
origin: https://svelte.dev/docs/kit/writing-adapters
---

Если адаптер для вашей предпочитаемой среды ещё не существует, вы можете создать свой собственный. Мы рекомендуем [изучить исходный код адаптера](https://github.com/sveltejs/kit/tree/main/packages) для платформы, похожей на вашу, и использовать его в качестве отправной точки.

Пакеты адаптеров реализуют следующий API, который создаёт `Adapter`:

```js
/** @param {AdapterSpecificOptions} options */
export default function (options) {
  /** @type {import('@sveltejs/kit').Adapter} */
  const adapter = {
      name: 'adapter-package-name',
      async adapt(builder) {
          // adapter implementation
      },
      async emulate() {
          return {
              async platform({ config, prerender }) {
                  // возвращаемый объект становится `event.platform` во время разработки, сборки и
                  // предпросмотра. Его структура соответствует типу `App.Platform`
              }
          }
      },
      supports: {
          read: ({ config, route }) => {
              // Возвращает `true`, если маршрут с указанным `config` может использовать `read`
              // из `$app/server` в продакшене, возвращает `false`, если это невозможно.
              // Или выбрасывает описательную ошибку, объясняющую, как настроить развёртывание
          },
          instrumentation: () => {
              // Возвращает `true`, если данный адаптер поддерживает загрузку `instrumentation.server.js`.
              // Возвращает `false`, если не поддерживает, либо выбрасывает информативную ошибку.
          }
      }
  };

  return adapter;
}
```

Из них `name` и `adapt` являются обязательными. `emulate` и `supports` — необязательные.

В методе `adapt` адаптер должен выполнять следующие действия:

- Очищать директорию сборки.
- Записывать выходные данные SvelteKit с помощью `builder.writeClient`, `builder.writeServer` и `builder.writePrerendered`.
- Создавать код, который:
  - Импортирует `Server` из `${builder.getServerDirectory()}/index.js`.
  - Создаёт экземпляр приложения с манифестом, сгенерированным с помощью `builder.generateManifest({ relativePath })`.
  - Обрабатывает запросы от платформы, при необходимости преобразует их в стандартный [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request), вызывает функцию `server.respond(request, { getClientAddress })` для создания [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) и отвечает с её помощью.
  - Предоставляет SvelteKit любую специфичную для платформы информацию через опцию `platform`, передаваемую в `server.respond`.
  - Глобально подменяет `fetch` для работы на целевой платформе, если это необходимо. SvelteKit предоставляет помощник `@sveltejs/kit/node/polyfills` для платформ, которые могут использовать `undici`.
- При необходимости собирает выходные данные в бандл, чтобы избежать установки зависимостей на целевой платформе.
- Размещает статические файлы пользователя и сгенерированные JS/CSS в правильном месте для целевой платформы.

По возможности мы рекомендуем размещать выходные данные адаптера в директории `build/`, а любые промежуточные данные — в `.svelte-kit/[adapter-name]`.
