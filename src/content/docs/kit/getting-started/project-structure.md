---
title: Структура проекта
origin: https://svelte.dev/docs/kit/project-structure
sidebar:
  order: 3
---

Обычный проект на SvelteKit имеет следующую структуру:

```bash
my-project/
├── src/                      # Исходный код приложения
│   ├── lib/                  # Вспомогательные модули
│   │   ├── server/           # Серверные библиотеки (только для backend)
│   │   │   └── [ваши серверные модули]
│   │   └── [ваши общие модули] # Доступны через $lib
│   │
│   ├── params/               # Параметры маршрутов
│   │   └── [сопоставители параметров] # Например, slug-валидация
│   │
│   ├── routes/               # Маршруты приложения
│   │   └── [ваши маршруты]   # Файловая система = структура URL
│   │
│   ├── app.html              # Основной HTML-шаблон
│   ├── error.html            # Шаблон для ошибок
│   ├── hooks.client.js       # Клиентские хуки
│   ├── hooks.server.js       # Серверные хуки
│   └── service-worker.js     # Сервис-воркер (PWA)
│
├── static/                   # Статические ресурсы
│   └── [ваши ресурсы]         # Изображения, шрифты и т. д.
│
├── tests/                    # Тесты
│   └── [ваши тесты]          # Unit/e2e тесты
│
├── package.json             # Зависимости и скрипты
├── svelte.config.js         # Конфигурация SvelteKit
├── tsconfig.json            # Настройки TypeScript
└── vite.config.js           # Конфигурация Vite
```

Вы также найдете такие распространенные файлы, как `.gitignore` и `.npmrc` (а также `.prettierrc` и `eslint.config.js` и так далее, если вы выбрали эти параметры при запуске `npx sv create`).

## Детализация структуры

### Директория `src`

Содержит основную логику приложения. Обязательные элементы — только `routes/` и `app.html`.

- `lib` содержит код вашей библиотеки (утилиты и компоненты), который можно импортировать через псевдоним [`$lib`](https://svelte.dev/docs/kit/$lib) или упаковать для распространения с помощью [`svelte-package`](https://svelte.dev/docs/kit/packaging).
  - `server` содержит библиотечный код, предназначенный только для сервера. Его можно импортировать с помощью псевдонима [`$lib/server`](https://svelte.dev/docs/kit/server-only-modules). SvelteKit не позволит импортировать эти модули в клиентский код.
- `params` содержит любые [сопоставители параметров](https://svelte.dev/docs/kit/advanced-routing#Matching), необходимые вашему приложению.
- `routes` содержит [маршруты](https://svelte.dev/docs/kit/routing) вашего приложения. Также здесь можно размещать компоненты, используемые только внутри одного маршрута.
- `app.html` — это шаблон страницы — HTML-документ, содержащий следующие плейсхолдеры:
  - `%sveltekit.head%` — элементы `<link>` и `<script>`, необходимые для работы приложения, а также содержимое `<svelte:head>`.
  - `%sveltekit.body%` — разметка отрендеренной страницы. Она должна располагаться внутри `<div>` или другого контейнера, а не напрямую в `<body>`, чтобы избежать ошибок, вызванных расширениями браузера, которые могут внедрять элементы, уничтожаемые при гидратации. SvelteKit предупредит об этом в режиме разработки.
  - `%sveltekit.assets%` — либо путь, указанный в [`paths.assets`](https://svelte.dev/docs/kit/configuration#paths), либо относительный путь к [`paths.base`](https://svelte.dev/docs/kit/configuration#paths).
  - `%sveltekit.nonce%` — [CSP](https://svelte.dev/docs/kit/configuration#csp) `nonce` для вручную добавленных ссылок и скриптов, если используется.
  - `%sveltekit.env.[NAME]%` — будет заменён при рендеринге на значение переменной окружения `[NAME]`, которая должна начинаться с [`publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (обычно `PUBLIC_`). Если переменная не найдена, подставляется `''`.
- `error.html` — страница, отображаемая при фатальной ошибке. Может содержать следующие плейсхолдеры:
  - `%sveltekit.status%` — HTTP-статус.
  - `%sveltekit.error.message%` — сообщение об ошибке.
- `hooks.client.js` содержит клиентские [хуки](https://svelte.dev/docs/kit/hooks).
- `hooks.server.js` содержит серверные [хуки](https://svelte.dev/docs/kit/hooks).
- `service-worker.js` содержит ваш [service worker](https://svelte.dev/docs/kit/service-workers).

(Наличие файлов с расширениями `.js` или `.ts` зависит от того, выбрали ли вы TypeScript при создании проекта.)

Если при создании проекта вы добавили [Vitest](https://vitest.dev), ваши модульные тесты будут располагаться в директории `src` с расширением `.test.js`.

### Директория `static`

Любые статические ресурсы, которые должны обслуживаться как есть (например, `robots.txt` или `favicon.png`), размещаются здесь.

### Директория `tests`

Если вы добавили [Playwright](https://playwright.dev/) для браузерного тестирования при создании проекта, тесты будут располагаться в этой директории.

### package.json

Ваш файл `package.json` должен включать `@sveltejs/kit`, `svelte` и `vite` в `devDependencies`.

При создании проекта с помощью `npx sv create` вы также увидите, что в `package.json` указано `"type": "module"`. Это означает, что `.js` файлы интерпретируются как нативные модули JavaScript с использованием ключевых слов `import` и `export`. Старые CommonJS-файлы должны иметь расширение `.cjs`.

### svelte.config.js

Этот файл содержит вашу конфигурацию [Svelte и SvelteKit](https://svelte.dev/docs/kit/configuration).

### tsconfig.json

Этот файл (или `jsconfig.json`, если вы предпочитаете типизированные `.js` файлы вместо `.ts`) настраивает TypeScript, если вы включили проверку типов при выполнении `npx sv create`. Поскольку SvelteKit требует определённой конфигурации, он генерирует собственный файл `.svelte-kit/tsconfig.json`, от которого наследуется ваша конфигурация.

### vite.config.js

Проект SvelteKit на самом деле является обычным проектом на [Vite](https://dragomano.github.io/vite-docs/), который использует плагин [`@sveltejs/kit/vite`](https://svelte.dev/docs/kit/@sveltejs-kit-vite), а также любую другую [конфигурацию Vite](https://dragomano.github.io/vite-docs/config/).

## Прочие файлы

### .svelte-kit

Во время разработки и сборки проекта SvelteKit будет генерировать файлы в директории `.svelte-kit` (можно изменить через [`outDir`](https://svelte.dev/docs/kit/configuration#outDir)). Содержимое этой директории можно игнорировать и удалять в любой момент — при следующем запуске `dev` или `build` всё будет сгенерировано заново.
