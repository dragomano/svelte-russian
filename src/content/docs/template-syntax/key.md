---
title: "{#key ...}"
origin: https://svelte.dev/docs/svelte/key
sidebar:
  order: 3
---

```svelte
{#key expression}...{/key}
```

Блоки `key` уничтожают и воссоздают свое содержимое при изменении значения выражения. При использовании вокруг компонентов это приведет к их повторному созданию и переинициализации:

```svelte
{#key value}
  <Component />
{/key}
```

Это также полезно, если вы хотите, чтобы при каждом изменении значения воспроизводился переход:

```svelte
{#key value}
  <div transition:fade>{value}</div>
{/key}
```
