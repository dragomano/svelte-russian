---
title: "<svelte:document>"
origin: https://svelte.dev/docs/svelte/svelte-document
sidebar:
  order: 2
---

```svelte
<svelte:document onevent={handler} />
```

```svelte
<svelte:document bind:prop={value} />
```

Аналогично `<svelte:window>`, этот элемент позволяет добавлять обработчики событий на `document`, таких как `visibilitychange`, которые не срабатывают на `window`. Он также позволяет использовать [действия](/template-syntax/use/) на `document`.

Как и в случае с `<svelte:window>`, этот элемент может находиться только на верхнем уровне вашего компонента и никогда не должен быть внутри блока или другого элемента.

```svelte
<svelte:document onvisibilitychange={handleVisibilityChange} use:someAction />
```

Вы также можете привязываться к следующим свойствам:

- `activeElement` — активный элемент (элемент, который в данный момент находится в фокусе)
- `fullscreenElement` — элемент, находящийся в полноэкранном режиме
- `pointerLockElement` — элемент, захвативший указатель (мышь)
- `visibilityState` — состояние видимости документа (например, `visible` или `hidden`)

Все эти свойства доступны только для чтения.
