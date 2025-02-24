---
title: "<svelte:boundary>"
origin: https://svelte.dev/docs/svelte/svelte-boundary
sidebar:
  order: 0
---

```svelte
<svelte:boundary onerror={handler}>...</svelte:boundary>
```

:::note
Эта функция была добавлена в 5.3.0
:::

Границы позволяют вам защититься от ошибок в части вашего приложения, которые могут привести к сбою всего приложения, и восстановиться после этих ошибок.

Если ошибка происходит во время рендеринга или обновления дочерних элементов `<svelte:boundary>`, или при выполнении любых функций [`$effect`](/runes/effect/), содержащихся в них, содержимое будет удалено.

Ошибки, возникающие вне процесса рендеринга (например, в обработчиках событий или после `setTimeout` или асинхронной работы), **не** перехватываются границами ошибок.

## Параметры

Чтобы граница ошибок выполняла свою функцию, необходимо указать один или оба параметра: `failed` и `onerror`.

### `failed`

Если предоставлен фрагмент `failed`, он будет отрендерен с ошибкой, которая была выброшена, а также с функцией `reset`, которая воссоздаёт содержимое ([демонстрация](https://svelte.dev/playground/hello-world#H4sIAAAAAAAAE3VRy26DMBD8lS2tFCIh6JkAUlWp39Cq9EBg06CAbdlLArL87zWGKk8ORnhmd3ZnrD1WtOjFXqKO2BDGW96xqpBD5gXerm5QefG39mgQY9EIWHxueRMinLosti0UPsJLzggZKTeilLWgLGc51a3gkuCjKQ7DO7cXZotgJ3kLqzC6hmex1SZnSXTWYHcrj8LJjWTk0PHoZ8VqIdCOKayPykcpuQxAokJaG1dGybYj4gw4K5u6PKTasSbjXKgnIDlA8VvUdo-pzonraBY2bsH7HAl78mKSHZpgIcuHjq9jXSpZSLixRlveKYQUXhQVhL6GPobXAAb7BbNeyvNUs4qfRg3OnELLj5hqH9eQZqCnoBwR9lYcQxuVXeBzc8kMF8yXY4yNJ5oGiUzP_aaf_waTRGJib5_Ad3P_vbCuaYxzeNpbU0eUMPAOKh7Yw1YErgtoXyuYlPLzc10_xo_5A91zkQL_AgAA)):

```svelte
<svelte:boundary>
  <FlakyComponent />

  {#snippet failed(error, reset)}
    <button onclick={reset}>упс! попробовать ещё раз</button>
  {/snippet}
</svelte:boundary>
```

:::note
Как и в случае с [фрагментами, передаваемыми в компоненты](/template-syntax/snippet/#передача-фрагментов-в-компоненты), фрагмент `failed` может быть передан явно как свойство...

```svelte
<svelte:boundary {failed}>...</svelte:boundary>
```

...или неявно, объявив его непосредственно внутри границы, как в примере выше.
:::

### `onerror`

Если предоставлена функция `onerror`, она будет вызвана с теми же двумя аргументами: `error` и `reset`. Это полезно для отслеживания ошибок с помощью сервиса отчётов об ошибках...

```svelte
<svelte:boundary onerror={(e) => report(e)}>
  ...
</svelte:boundary>
```

...или для использования `error` и `reset` за пределами самой границы:

```svelte
<script>
  let error = $state(null);
  let reset = $state(() => {});

  function onerror(e, r) {
    error = e;
    reset = r;
  }
</script>

<svelte:boundary {onerror}>
  <FlakyComponent />
</svelte:boundary>

{#if error}
  <button onclick={() => {
    error = null;
    reset();
  }}>
    упс! попробовать ещё раз
  </button>
{/if}
```

Если ошибка происходит внутри функции `onerror` (или если вы повторно выбрасываете ошибку), она будет обработана родительской границей, если таковая существует.
