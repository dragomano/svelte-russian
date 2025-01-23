---
title: "{#if ...}"
sidebar:
  order: 1
---

```svelte
{#if expression}...{/if}
```

```svelte
{#if expression}...{:else if expression}...{/if}
```

```svelte
{#if expression}...{:else}...{/if}
```

Контент, который отображается условно, можно обернуть в блок `if`:

```svelte
{#if answer === 42}
  <p>какой был вопрос?</p>
{/if}
```

Дополнительные условия можно добавить с помощью `{:else if expression}`, при необходимости завершая блок конструкцией `{:else}`:

```svelte
{#if porridge.temperature > 100}
  <p>слишком жарко!</p>
{:else if 80 > porridge.temperature}
  <p>слишком холодно!</p>
{:else}
  <p>в самый раз!</p>
{/if}
```

(Блоки не обязательно должны оборачивать элементы, они также могут оборачивать текст внутри элементов.)
