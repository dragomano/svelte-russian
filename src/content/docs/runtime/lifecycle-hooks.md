---
title: Хуки жизненного цикла
origin: https://svelte.dev/docs/svelte/lifecycle-hooks
sidebar:
  order: 2
---

В Svelte 5 жизненный цикл компонента состоит только из двух частей: его создания и уничтожения. Всё, что происходит между ними — например, обновление определённого состояния — не связано с компонентом в целом; уведомляются только те части, которые должны реагировать на изменение состояния. Это связано с тем, что под капотом наименьшая единица изменения — это не компонент, а (рендер) эффекты, которые компонент настраивает при инициализации. Следовательно, таких понятий, как хуки `beforeUpdate` / `afterUpdate`, не существует.

## `onMount`

Функция `onMount` планирует выполнение колбэка сразу после того, как компонент будет смонтирован в DOM. Она должна вызываться во время инициализации компонента (но не обязательно находиться _внутри_ компонента; она может быть вызвана из внешнего модуля).

`onMount` не выполняется внутри компонента, который рендерится на сервере.

```svelte
<script>
  import { onMount } from 'svelte';

  onMount(() => {
    console.log('компонент смонтирован');
  });
</script>
```

Если из `onMount` возвращается функция, она будет вызвана при размонтировании компонента.

```svelte
<script>
  import { onMount } from 'svelte';

  onMount(() => {
    const interval = setInterval(() => {
      console.log('beep');
    }, 1000);

    return () => clearInterval(interval);
  });
</script>
```

:::note
Это поведение работает только в том случае, если функция, переданная в `onMount`, _синхронно_ возвращает значение. `async` функции всегда возвращают `Promise`, и поэтому не могут _синхронно_ вернуть функцию.
:::

## `onDestroy`

Планирует выполнение колбэка непосредственно перед размонтированием компонента.

Из `onMount`, `beforeUpdate`, `afterUpdate` и `onDestroy` это единственный хук, который выполняется внутри компонента на стороне сервера.

```svelte
<script>
  import { onDestroy } from 'svelte';

  onDestroy(() => {
    console.log('компонент уничтожен');
  });
</script>
```

## `tick`

Хотя хука `afterUpdate` не существует, вы можете использовать `tick`, чтобы убедиться, что пользовательский интерфейс обновлён перед продолжением. `tick` возвращает `Promise`, который выполняется после применения всех ожидающих изменений состояния или в следующей микрозадаче, если изменений нет.

```svelte
<script>
  import { tick } from 'svelte';

  $effect.pre(() => {
    console.log('компонент собирается обновиться');
    tick().then(() => {
        console.log('компонент только что обновлён');
    });
  });
</script>
```

## Устарело: `beforeUpdate` / `afterUpdate`

В Svelte 4 были хуки, которые выполнялись до и после обновления компонента в целом. Для обратной совместимости эти хуки были добавлены в Svelte 5, но они недоступны внутри компонентов, использующих руны.

```svelte
<script>
  import { beforeUpdate, afterUpdate } from 'svelte';

  beforeUpdate(() => {
    console.log('компонент собирается обновиться');
  });

  afterUpdate(() => {
    console.log('компонент только что обновлён');
  });
</script>
```

Вместо `beforeUpdate` используйте [`$effect.pre`](/runes/effect/#effectpre), а вместо `afterUpdate` — [`$effect`](/runes/effect/). Эти руны предоставляют более детальный контроль и реагируют только на те изменения, которые вас действительно интересуют.

### Пример окна чата

Чтобы реализовать окно чата, которое автоматически прокручивается вниз при появлении новых сообщений (но только если вы уже прокрутили окно вниз), нам нужно измерить DOM перед его обновлением.

В Svelte 4 мы делаем это с помощью `beforeUpdate`, но этот подход имеет недостатки — он срабатывает перед _каждым_ обновлением, независимо от того, актуально оно или нет. В примере ниже нам нужно ввести проверки, такие как `updatingMessages`, чтобы убедиться, что мы не изменяем положение прокрутки при переключении тёмного режима.

С рунами мы можем использовать `$effect.pre`, который ведет себя так же, как `$effect`, но выполняется до обновления DOM. Если мы явно ссылаемся на `messages` внутри тела эффекта, он будет запускаться при каждом изменении `messages`, но _не_ при изменении `theme`.

Таким образом, `beforeUpdate` и его не менее проблемный аналог `afterUpdate` устарели в Svelte 5.

- [До (Svelte 4)](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE31WXa_bNgz9K6yL1QmWOLlrC-w6H8MeBgwY9tY9NfdBtmlbiywZkpyPBfnvo2zLcZK28AWuRPGI5OGhkEuQc4EmiL9eAskqDOLg97oOZoE9125jDigs0t6oRqfOsjap5rXd7uTO8qpW2sIFEsyVxn_qjFmcAcstar-xPN3DFXKtKgi768IVgQku0ELj3Lgs_kZjWIEGNpAzYXDlHWyJFZI1zJjeh4O5uvl_DY8oUkVeVoFuJKYls-_CGYS25Aboj0EtWNqel0wWoBoLTGZgmdgDS9zW4Uz4NsrswPHoyutN4xInkylstnBxdmIhh8m7xzqmoNE2Wq46n1RJQzEbq4g-JQSl7e-HDx-GdaTy3KD9E3lRWvj5Zu9QX1QN20dj7zyHz8s-1S6lW7Cpz3RnXTcm04hIlfdFuO8p2mQ5-3a06cqjrn559bF_2NHOnRZ5I1PLlXQNyQT-hedMHeUEDyjtdMxsa4n2eIbNhlTwhyRthaOKOmYtniwF6pwt0wXa6MBEg0OibZec27gz_dk3UrZ6hB2LLYoiv521Yd8Gt-foTrfhiCDP0lC9VUUhcDLU49Xe_9943cNvEArHfAjxeBTovvXiNpFynfEDpIIZs9kFbg52QbeNHWZzebz32s7xHco3nJAJl1nshmhz8dYOQJDyZetnbb2gTWe-vEeWlrfpZMavr56ldb29eNt6UXvgwgFbp_WC0tl2RK25rGk6lYz3nUI2lzvBXGHhPZPGWmKUXFNBKqdaW259wl_aHbiqoVIZdpE60Nax6IOujT0LbFFxIVTCxCRR2XloUcYNvSbnGHKBp763jHoj59xiZWJI0Wm0P_m3MSS985xkasn-cFq20xTDy3J5KFcjgUTD69BHdcHIjz431z28IqlxGcPSfdFnrGDZn6gD6lyo45zyHAD-btczf-98nhQxHEvKfeUtOVkSejD3q-9X7JbzjGtsdUxlKdFU8qGsT78uaw848syWMXz85Waq2Gnem4mAn3prweq4q6Y3JEpnqMmnPoFRgmd3ySW0LLRqSKlwYHriCvJvUs2yjMaaoA-XzTXLeGMe45zmhv_XAno3Mj0xF7USuqNvnE9H343QHlq-eAgxpbTPNR9yzUkgLjwSR0NK4wKoxy-jDg-9vy8sUSToakzW-9fX13Em9Q8T6Z26uZhBN36XUYo5q7ggLXBZoub2Ofv7g6GCZfTxe034NCjiudXj7Omla0eTfo7QBPOcYxbE7qG-vl3_B1G-_i_JCAAA)
- [После (Svelte 5)](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE31WXa-jNhD9K7PsdknUQJLurtRLPqo-VKrU1327uQ8GBnBjbGSb5KZR_nvHgMlXtyIS9njO-MyZGZRzUHCBJkhez4FkNQZJ8HvTBLPAnhq3MQcUFmlvVKszZ1mbTPPGbndyZ3ndKG3hDJZne7hAoVUNYY8JV-RBPgIt2AprhA18MpZZnIQ50_twuvLHNRrDSjRXj9fwiCJTBLIKdCsxq5j9EM4gtBU3QD8GjWBZd14xWYJqLTCZg2ViDyx1W4cz4dv0hsiB49FRHkyfsCgws3GjcTKZwmYLZ2feWc9o1W8zJQ2Fb62i5JUQRNRHgs-fx3WsisKg_RN5WVn4-WrvUd9VA9tH4-AcwbfFQIpkLWByvWzqSe2sk3kyjUlOec_XPU-3TRaz_75tuvKoi19e3OvipSpamVmupJM2F_gXnnJ1lBM8oLQjHceys8R7PMFms4HwD2lRhzeEe-EsvluSrHe2TJdo4wMTLY48XKwPzm0KGm2r5ajFtRYU4TWOY7-ddWHfxhDP0QkQhnf5PWRnVVkKnIx8fZsOb5dR16nwG4TCCRdCMphWQ7z1_DoOcp3zA2SCGbPZBa5jd0G_TRxmc36Me-mG6A7l60XIlMs8ce2-OXtrDyBItdz6qVjPadObzx-RZdV1nJjx64tXad1sz962njceOHfAzmk9JzrbXqg1lw3NkZL7vgE257t-uMDcO6attSSokpmgFqVMO2U93e_dDlzOUKsc-3t6zNZp6K9cG3sS2KGSUqiUiUmq8tNYoJwbmvpTAoXA96GyjCojI26xNglk6DpwOPm7NdRYp4ia0JL94bTqRiGB5WJxqFY37RGPoz3c6i4jP3rcUA7wmhqNywQW7om_YQ2L4UQdUBdCHSPiOQJ8bFcxHzeK0jKBY0XcV95SkCWlD9t-9eOM3TLKucauiyktJdpaPqT19ddF4wFHntsqgS-_XE01e48GMwnw02AtWZP02QyGVOkcNfk072CU4PkduZSWpVYt9SkcmJ64hPwHpWF5ziVls3wIFmmW89Y83vMeGf5PBxjcyPSkXNy10J18t3x6-a6CDtBq6SGklNKeazFyLahB3PVIGo2UbhOgGi9vKjzW_j6xVFFD17difXx5ebll0vwvkcGpn4sZ9MN3vqFYsJoL6gUuK9TcPrO_PxgzWMRfflSEr2NHPJf6lj1957rRpH8CNMG84JgHidUtXt4u_wK21LXERAgAAA==)

```diff lang="svelte"
<script>
-  import { beforeUpdate, afterUpdate, tick } from 'svelte';
+  import { tick } from 'svelte';

-  let updatingMessages = false;
-  let theme = 'dark';
-  let messages = [];
+  let theme = $state('dark');
+  let messages = $state([]);

  let viewport;

-  beforeUpdate(() => {
+  $effect.pre(() => {
-    if (!updatingMessages) return;
+    messages;
    const autoscroll = viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;

    if (autoscroll) {
      tick().then(() => {
        viewport.scrollTo(0, viewport.scrollHeight);
      });
    }

-    updatingMessages = false;
  });

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      const text = event.target.value;
      if (!text) return;

-      updatingMessages = true;
      messages = [...messages, text];
      event.target.value = '';
    }
  }

  function toggle() {
    toggleValue = !toggleValue;
  }
</script>

<div class:dark={theme === 'dark'}>
  <div bind:this={viewport}>
    {#each messages as message}
      <p>{message}</p>
    {/each}
  </div>

-  <input on:keydown={handleKeydown} />
+  <input onkeydown={handleKeydown} />

-  <button on:click={toggle}> Переключить тёмный режим </button>
+  <button onclick={toggle}> Переключить тёмный режим </button>
</div>
```
