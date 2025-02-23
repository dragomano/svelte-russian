---
title: "<svelte:head>"
origin: https://svelte.dev/docs/svelte/svelte-head
sidebar:
  order: 4
---

```svelte
<svelte:head>...</svelte:head>
```

Этот элемент позволяет вставлять элементы в `document.head`. При серверном рендеринге содержимое `head` предоставляется отдельно от основного содержимого `body`.

Как и в случае с `<svelte:window>`, `<svelte:document>` и `<svelte:body>`, этот элемент может находиться только на верхнем уровне вашего компонента и никогда не должен быть внутри блока или другого элемента.

```svelte
<svelte:head>
  <title>Привет, мир!</title>
  <meta name="description" content="Это место для описания, которое используется для SEO" />
</svelte:head>
```
