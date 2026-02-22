---
title: Серверные модули
origin: https://svelte.dev/docs/kit/server-only-modules
sidebar:
  order: 5
---

Как хороший друг, SvelteKit хранит ваши секреты. Когда вы пишете бэкенд и фронтенд в одном репозитории, легко случайно импортировать конфиденциальные данные в код фронтенда (например, переменные окружения, содержащие API-ключи). SvelteKit предоставляет способ полностью предотвратить это: серверные модули.

## Приватные переменные окружения

Модули [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) и [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) можно импортировать только в те модули, которые выполняются исключительно на сервере, такие как [`hooks.server.js`](/kit/advanced/hooks/#серверные-хуки) или [`+page.server.js`](/kit/core-concepts/routing/#pageserverjs).

## Серверные утилиты

Модуль [`$app/server`](https://svelte.dev/docs/kit/$app-server), содержащий функцию [`read`](https://svelte.dev/docs/kit/$app-server#read) для чтения ресурсов из файловой системы, точно так же может быть импортирован только кодом, выполняющимся на сервере.

## Ваши модули

Вы можете сделать свои собственные модули серверными двумя способами:

- добавив `.server` к имени файла, например `secrets.server.js`
- поместив их в `$lib/server`, например `$lib/server/secrets.js`

## Как это работает

Каждый раз, когда ваш публичный код импортирует серверный код (напрямую или косвенно)...

```js title="$lib/server/secrets.js"
export const atlantisCoordinates = [/* отредактировано */];
```

```js
// src/routes/utils.js
export { atlantisCoordinates } from '$lib/server/secrets.js';

export const add = (a, b) => a + b;
```

```html
// src/routes/+page.svelte
<script>
  import { add } from './utils.js';
</script>
```

...SvelteKit выдаст ошибку:

```
Cannot import $lib/server/secrets.ts into code that runs in the browser, as this could leak sensitive information.

 src/routes/+page.svelte imports
  src/routes/utils.js imports
   $lib/server/secrets.ts

If you're only using the import as a type, change it to `import type`.
```

Даже если публичный код — `src/routes/+page.svelte` — использует только экспорт `add`, а не секретный экспорт `atlantisCoordinates`, секретный код всё равно может попасть в JavaScript, который загружается браузером, и поэтому такая цепочка импортов считается небезопасной.

Эта функция также работает с динамическими импортами, даже с интерполированными, например ``await import(`./${foo}.js`)``.

:::note
Фреймворки для модульного тестирования, такие как Vitest, не делают различий между серверным и публичным кодом. По этой причине обнаружение недопустимых импортов отключается при запуске тестов, что определяется условием `process.env.TEST === 'true'`.
:::

## Дополнительные материалы

- [Учебник: Переменные окружения](https://svelte.dev/tutorial/kit/env-static-private)
