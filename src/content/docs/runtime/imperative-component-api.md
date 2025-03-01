---
title: Императивный API компонентов
origin: https://svelte.dev/docs/svelte/imperative-component-api
sidebar:
  order: 3
---

Каждое приложение Svelte начинается с императивного создания корневого компонента. На клиенте этот компонент монтируется к определённому элементу. На сервере вы хотите получить строку HTML, которую можно отрендерить. Следующие функции помогут вам выполнить эти задачи.

## `mount`

Создает экземпляр компонента и монтирует его к указанной цели:

```js
import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, {
  target: document.querySelector('#app'),
  props: { some: 'property' }
});
```

Вы можете монтировать несколько компонентов на одной странице, а также монтировать их изнутри вашего приложения, например, при создании компонента всплывающей подсказки и его прикреплении к наведённому элементу.

Обратите внимание, что в отличие от вызова `new App(...)` в Svelte 4, такие вещи, как эффекты (включая колбэки `onMount` и функции действий), не будут выполняться во время `mount`. Если вам нужно принудительно запустить ожидающие эффекты (например, в контексте теста), вы можете сделать это с помощью `flushSync()`.

## `unmount`

Размонтирует компонент, который был ранее создан с помощью [`mount`](#mount) или [`hydrate`](#hydrate).

Если `options.outro` равно `true`, [переходы](/template-syntax/transition/) будут воспроизведены перед удалением компонента из DOM:

```js
import { mount, unmount } from 'svelte';
import App from './App.svelte';

const app = mount(App, { target: document.body });

// позже
unmount(app, { outro: true });
```

Возвращает `Promise`, который выполняется в зависимости от значения `options.outro`:

- после завершения переходов (`options.outro` равно `true`)
- сразу (`options.outro` равно `false`)

## `render`

Доступно только на сервере и при компиляции с опцией `server`. Принимает компонент и возвращает объект со свойствами `body` и `head`, которые можно использовать для заполнения HTML при серверном рендеринге вашего приложения:

```js
import { render } from 'svelte/server';
import App from './App.svelte';

const result = render(App, {
  props: { some: 'property' }
});
result.body; // HTML для размещения внутри этого тега <body>
result.head; // HTML для размещения внутри этого тега <<head>
```

## `hydrate`

Аналогично `mount`, но повторно использует HTML, созданный SSR-выводом Svelte (с помощью функции [`render`](#render)), внутри цели и делает его интерактивным:

```js
import { hydrate } from 'svelte';
import App from './App.svelte';

const app = hydrate(App, {
  target: document.querySelector('#app'),
  props: { some: 'property' }
});
```
Как и в случае с `mount`, эффекты не будут выполняться во время `hydrate` — используйте `flushSync()` сразу после, если вам нужно их запустить.
