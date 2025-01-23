---
title: "{@const ...}"
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

`{@const}` допускается только в качестве прямого дочернего элемента таких блоков, как `{#if ...}`, `{#each ...}`, `{#snippet ...}` и подобных — или `<Component />`.
