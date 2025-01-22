---
title: "{#await ...}"
sidebar:
  order: 4
---

```svelte
{#await expression}...{:then name}...{:catch name}...{/await}
```

```svelte
{#await expression}...{:then name}...{/await}
```

```svelte
{#await expression then name}...{/await}
```

```svelte
{#await expression catch name}...{/await}
```

Блоки `await` позволяют разделять выполнение на три возможных состояния [`Promise`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise) — ожидающий (pending), выполненный (fulfilled) или отклонённый (rejected):

```svelte
{#await promise}
  <!-- promise находится в состоянии ожидания -->
  <p>ожидание выполнения promise...</p>
{:then value}
  <!-- promise был выполнен или не является объектом Promise -->
  <p>Значение: {value}</p>
{:catch error}
  <!-- promise был отклонен -->
  <p>Произошла ошибка: {error.message}</p>
{/await}
```

:::note
Во время серверного рендеринга будет отрисовываться только ветка ожидания (pending).

Если переданное выражение не является `Promise`, будет отрисовываться только ветка `:then`, включая серверный рендеринг.
:::

Блок `catch` можно опустить, если вам не нужно ничего отрисовывать в случае отклонения promise (или если ошибка невозможна):

```svelte
{#await promise}
  <!-- promise находится в состоянии ожидания -->
  <p>ожидание выполнения promise...</p>
{:then value}
  <!-- promise был выполнен -->
  <p>Значение: {value}</p>
{/await}
```

Если вам не важен статус ожидания, вы также можете опустить начальный блок:

```svelte
{#await promise then value}
  <p>Значение: {value}</p>
{/await}
```

Аналогично, если вы хотите отображать только состояние ошибки, вы можете опустить блок `then`:

```svelte
{#await promise catch error}
  <p>Произошла ошибка: {error}</p>
{/await}
```

:::note
Вы можете использовать `#await` с [`import(...)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) для ленивой отрисовки компонентов:

```svelte
{#await import('./Component.svelte') then { default: Component }}
  <Component />
{/await}
```
:::
