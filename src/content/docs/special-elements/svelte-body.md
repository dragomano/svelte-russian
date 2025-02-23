---
title: "<svelte:body>"
origin: https://svelte.dev/docs/svelte/svelte-body
sidebar:
  order: 3
---

```svelte
<svelte:body onevent={handler} />
```

Аналогично `<svelte:window>`, этот элемент позволяет добавлять обработчики событий на `document.body`, таких как `mouseenter` и `mouseleave`, которые не срабатывают на `window`. Он также позволяет использовать [действия](/template-syntax/use/) на элементе `<body>`.

Как и в случае с `<svelte:window>` и `<svelte:document>`, этот элемент может находиться только на верхнем уровне вашего компонента и никогда не должен быть внутри блока или другого элемента.

```svelte
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```
