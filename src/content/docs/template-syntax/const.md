---
title: "{@const ...}"
origin: https://svelte.dev/docs/svelte/@const
sidebar:
  order: 8
---

Тег `{@const ...}` определяет локальную константу:

```svelte
{#each boxes as box}
  {@const area = box.width * box.height}
  {box.width} * {box.height} = {area}
{/each}
```

`{@const}` можно размещать только внутри блоков (`{#if ...}`, `{#each ...}`, `{#snippet ...}` и т. д.), а также внутри `<Component />` или `<svelte:boundary>`.
