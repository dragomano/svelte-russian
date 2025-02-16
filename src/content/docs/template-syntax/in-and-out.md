---
title: 'in: и out'
origin: https://svelte.dev/docs/svelte/in-and-out
sidebar:
  order: 13
---

Директивы `in:` и `out:` идентичны [`transition:`](../transition/), за исключением того, что полученные переходы не являются двунаправленными — переход `in` будет продолжать «играть» вместе с переходом `out`, а не реверсироваться, если блок завершён, пока переход всё ещё выполняется. Если переход `out` прерывается, переходы начнутся заново.

```svelte
<script>
  import { fade, fly } from 'svelte/transition';

  let visible = $state(false);
</script>

<label>
  <input type="checkbox" bind:checked={visible}>
  видимый
</label>

{#if visible}
  <div in:fly={{ y: 200 }} out:fade>влетает, исчезает</div>
{/if}
```
