---
title: "{@render ...}"
origin: https://svelte.dev/docs/svelte/@render
sidebar:
  order: 6
---

Используйте тег `{@render ...}` для отображения [фрагментов](/template-syntax/snippet/):

```svelte
{#snippet sum(a, b)}
  <p>{a} + {b} = {a + b}</p>
{/snippet}

{@render sum(1, 2)}
{@render sum(3, 4)}
{@render sum(5, 6)}
```

Выражение может быть идентификатором (`sum`) или произвольным выражением на JavaScript:

```svelte
{@render (cool ? coolSnippet : lameSnippet)()}
```

## Необязательные фрагменты

Если фрагмент может быть неопределённым — например, потому что это входной пропс, — вы можете использовать опциональную цепочку, чтобы отображать его только тогда, когда он _определён_:

```svelte
{@render children?.()}
```

Используйте блок [`{#if ...}`](/template-syntax/if/) с конструкцией `:else` для отображения альтернативного контента:

```svelte
{#if children}
  {@render children()}
{:else}
  <p>альтернативный контент</p>
{/if}
```
