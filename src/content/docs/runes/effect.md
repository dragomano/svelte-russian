---
title: $effect
origin: https://svelte.dev/docs/svelte/$effect
sidebar:
  order: 3
---

Эффекты — это функции, которые выполняются при обновлении состояния и могут использоваться для таких задач, как вызов сторонних библиотек, рисование на элементах `<canvas>` или выполнение сетевых запросов. Они выполняются только в браузере, а не во время серверного рендеринга.

Вообще говоря, вам _не следует_ обновлять состояние внутри эффектов, так как это может сделать код более запутанным и часто приводит к бесконечным циклам обновлений. Если вы обнаруживаете, что делаете это, ознакомьтесь с разделом [Когда не использовать `$effect`](#когда-не-использовать-effect), чтобы узнать об альтернативных подходах.

Вы можете создать эффект с помощью руны `$effect` ([демонстрация](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE31S246bMBD9lZF3pSRSAqTVvrCAVPUP2sdSKY4ZwJJjkD0hSVH-vbINuWxXfQH5zMyZc2ZmZLVUaFn6a2R06ZGlHmBrpvnBvb71fWQHVOSwPbf4GS46TajJspRlVhjZU1HqkhQSWPkHIYdXS5xw-Zas3ueI6FRn7qHFS11_xSRZhIxbFtcDtw7SJb1iXaOg5XIFeQGjzyPRaevYNOGZIJ8qogbpe8CWiy_VzEpTXiQUcvPDkSVrSNZz1UlW1N5eLcqmpdXUvaQ4BmqlhZNUCgxuzFHDqUWNAxrYeUM76AzsnOsdiJbrBp_71lKpn3RRbii-4P3f-IMsRxS-wcDV_bL4PmSdBa2wl7pKnbp8DMgVvJm8ZNskKRkEM_OzyOKQFkgqOYBQ3Nq89Ns0nbIl81vMFN-jKoLMTOr-SOBOJS-Z8f5Y6D1wdcR8dFqvEBdetK-PHwj-z-cH8oHPY54wRJ8Ys7iSQ3Bg3VA9azQbmC9k35kKzYa6PoVtfwbbKVnBixBiGn7Pq0rqJoUtHiCZwAM3jdTPWCVtr_glhVrhecIa3vuksJ_b7TqFs4DPyriSjd5IwoNNQaAmNI-ESfR2p8zimzvN1swdCkvJHPH6-_oX8o1SgcIDAAA=)):

```svelte
<script>
  let size = $state(50);
  let color = $state('#ff3e00');

  let canvas;

  $effect(() => {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // это будет повторно выполняться всякий раз, когда изменяются `color` или `size`
    context.fillStyle = color;
    context.fillRect(0, 0, size, size);
  });
</script>

<canvas bind:this={canvas} width="100" height="100" />
```

Когда Svelte выполняет функцию эффекта, она отслеживает, какие части состояния (и производного состояния) были доступны (если они не были доступны внутри [`untrack`](https://svelte.dev/docs/svelte/svelte#untrack)), и повторно запускает функцию, когда это состояние изменяется.

:::note
Если вам сложно понять, почему ваш `$effect` перезапускается или не запускается, ознакомьтесь с разделом [Понимание зависимостей](#понимание-зависимостей). Эффекты срабатывают иначе, чем блоки `$:`, к которым вы могли привыкнуть, если переходите с Svelte 4.
:::

### Понимание жизненного цикла

Ваши эффекты выполняются после того, как компонент был смонтирован в DOM, и в рамках [микрозадачи](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide) после изменений состояния. Повторные запуски группируются (например, изменение `color` и `size` одновременно не вызовет двух отдельных запусков) и происходят после применения всех обновлений DOM.

Вы можете использовать `$effect` где угодно, не только на верхнем уровне компонента, при условии, что он вызывается во время выполнения родительского эффекта.

:::note
Svelte использует эффекты внутри себя для представления логики и выражений в вашем шаблоне — именно так `<h1>привет, {name}!</h1>` обновляется при изменении `name`.
:::

Эффект может возвращать _функцию очистки_, которая будет выполняться непосредственно перед повторным запуском эффекта ([демонстрация](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE42SQVODMBCF_8pOxkPRKq3HCsx49K4n64xpskjGkDDJ0tph-O8uINo6HjxB3u7HvrehE07WKDbiyZEhi1osRWksRrF57gQdm6E2CKx_dd43zU3co6VB28mIf-nKO0JH_BmRRRVMQ8XWbXkAgfKtI8jhIpIkXKySu7lSG2tNRGZ1_GlYr1ZTD3ddYFmiosUigbyAbpC2lKbwWJkIB8ZhhxBQBWRSw6FCh3sM8GrYTthL-wqqku4N44TyqEgwF3lmRHr4Op0PGXoH31c5rO8mqV-eOZ49bikgtcHBL55tmhIkEMqg_cFB2TpFxjtg703we6NRL8HQFCS07oSUCZi6Rm04lz1yytIHBKoQpo1w6Gsm4gmyS8b8Y5PydeMdX8gwS2Ok4I-ov5NZtvQde95GMsccn_1wzNKfu3RZtS66cSl9lvL7qO1aIk7knbJGvefdtIOzi73M4bYvovUHDFk6AcX_0HRESxnpBOW_jfCDxIZCi_1L_wm4xGQ60wIAAA==)).

```svelte
<script>
  let count = $state(0);
  let milliseconds = $state(1000);

  $effect(() => {
    // Это будет пересоздано всякий раз, когда изменяется `milliseconds`
    const interval = setInterval(() => {
      count += 1;
    }, milliseconds);

    return () => {
      // если предоставлена функция очистки, она будет выполнена
      // a) немедленно перед повторным выполнением эффекта
      // b) когда компонент будет уничтожен
      clearInterval(interval);
    };
  });
</script>

<h1>{count}</h1>

<button onclick={() => (milliseconds *= 2)}>медленнее</button>
<button onclick={() => (milliseconds /= 2)}>быстрее</button>
```

Функции очистки также выполняются, когда эффект уничтожается, что происходит при уничтожении его родителя (например, когда компонент демонтируется) или при повторном запуске родительского эффекта.

### Понимание зависимостей

`$effect` автоматически отслеживает любые реактивные значения (`$state`, `$derived`, `$props`), которые _синхронно_ читаются внутри его тела функции (включая косвенные вызовы через другие функции), и регистрирует их как зависимости. Когда эти зависимости изменяются, `$effect` планирует повторный запуск.

Значения, которые читаются _асинхронно_ — после `await` или внутри `setTimeout`, например — не будут отслеживаться. Здесь холст будет перерисован, когда изменится `color`, но не когда изменится `size` ([демонстрация](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE31T246bMBD9lZF3pWSlBEirfaEQqdo_2PatVIpjBrDkGGQPJGnEv1e2IZfVal-wfHzmzJyZ4cIqqdCy9M-F0blDlnqArZjmB3f72XWRHVCRw_bc4me4aDWhJstSlllhZEfbQhekkMDKfwg5PFvihMvX5OXH_CJa1Zrb0-Kpqr5jkiwC48rieuDWQbqgZ6wqFLRcvkC-hYvnkWi1dWqa8ESQTxFRjfQWsOXiWzmr0sSLhEJu3p1YsoJkNUcdZUnN9dagrBu6FVRQHAM10sJRKgUG16bXcGxQ44AGdt7SDkTDdY02iqLHnJVU6hedlWuIp94JW6Tf8oBt_8GdTxlF0b4n0C35ZLBzXb3mmYn3ae6cOW74zj0YVzDNYXRHFt9mprNgHfZSl6mzml8CMoLvTV6wTZIUDEJv5us2iwMtiJRyAKG4tXnhl8O0yhbML0Wm-B7VNlSSSd31BG7z8oIZZ6dgIffAVY_5xdU9Qrz1Bnx8fCfwtZ7v8Qc9j3nB8PqgmMWlHIID6-bkVaPZwDySfWtKNGtquxQ23Qlsq2QJT0KIqb8dL0up6xQ2eIBkAg_c1FI_YqW0neLnFCqFpwmreedJYT7XX8FVOBfwWRhXstZrSXiwKQjUhOZeMIleb5JZfHWn2Yq5pWEpmR7Hv-N_wEqT8hEEAAA=)):

```js
$effect(() => {
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  // это будет повторно выполняться всякий раз, когда изменяется `color`...
  context.fillStyle = color;

  setTimeout(() => {
    // ...но не когда изменяется `size`
    context.fillRect(0, 0, size, size);
  }, 0);
});
```

Эффект повторно выполняется только тогда, когда изменяется сам объект, который он читает, а не когда изменяется свойство внутри него. (Если вы хотите отслеживать изменения _внутри_ объекта во время разработки, вы можете использовать [`$inspect`]($inspect).)

```svelte
<script>
  let state = $state({ value: 0 });
  let derived = $derived({ value: state.value * 2 });

  // это выполнится один раз, потому что `state` никогда не переназначается (только мутируется)
  $effect(() => {
    state;
  });

  // это будет выполняться всякий раз, когда изменяется `state.value`...
  $effect(() => {
    state.value;
  });

  // ...и это также будет выполняться, потому что `derived` — это новый объект каждый раз
  $effect(() => {
    derived;
  });
</script>

<button onclick={() => (state.value += 1)}>
  {state.value}
</button>

<p>{state.value} вдвое больше — это {derived.value}</p>
```

Эффект зависит только от значений, которые он считал в последний раз, когда выполнялся. Это имеет интересные последствия для эффектов с условным кодом.

Например, если `a` истинно в приведённом ниже фрагменте кода, код внутри блока `if` будет выполнен, и `b` будет оценено. Таким образом, изменения как `a`, так и `b` приведут к [повторному выполнению эффекта](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE3VQzWrDMAx-FdUU4kBp71li6EPstOxge0ox8-QQK2PD-N1nLy2F0Z2Evj9_chKkP1B04pnYscc3cRCT8xhF95IEf8-Vq0DBr8rzPB_jJ3qumNERH-E2ECNxiRF9tIubWY00lgcYNAywj6wZJS8rtk83wjwgCrXHaULLUrYwKEgVGrnkx-Dx6MNFNstK5OjSbFGbwE0gdXuT_zGYrjmAuco515Hr1p_uXak3K3MgCGS9s-9D2grU-judlQYXIencnzad-tdR79qZrMyvw9wd5Z8Yv1h09dz8mn8AkM7Pfo0BAAA=).

С другой стороны, если `a` ложно, `b` не будет оценено, и эффект будет повторно выполняться только при изменении `a`.

```js
$effect(() => {
  console.log('running');

  if (a) {
    console.log('b:', b);
  }
});
```

## `$effect.pre`

В редких случаях вам может понадобиться выполнить код _до_ обновления DOM. Для этого мы можем использовать руну `$effect.pre`:

```svelte
<script>
  import { tick } from 'svelte';

  let div = $state();
  let messages = $state([]);

  // ...

  $effect.pre(() => {
    if (!div) return; // ещё не смонтирован

    // ссылайтесь на длину массива `messages`, чтобы этот код повторно выполнялся всякий раз, когда он изменяется
    messages.length;

    // автопрокрутка при добавлении новых сообщений
    if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
      tick().then(() => {
        div.scrollTo(0, div.scrollHeight);
      });
    }
  });
</script>

<div bind:this={div}>
  {#each messages as message}
    <p>{message}</p>
  {/each}
</div>
```

Помимо времени выполнения, `$effect.pre` работает точно так же, как и `$effect`.

## `$effect.tracking`

Руна `$effect.tracking` — это продвинутая функция, которая сообщает вам, выполняется ли код внутри контекста отслеживания, такого как эффект или внутри вашего шаблона ([демонстрация](https://svelte.dev/playground/untitled#H4sIAAAAAAAACn3PwYrCMBDG8VeZDYIt2PYeY8Dn2HrIhqkU08nQjItS-u6buAt7UDzmz8ePyaKGMWBS-nNRcmdU-hHUTpGbyuvI3KZvDFLal0v4qvtIgiSZUSb5eWSxPfWSc4oB2xDP1XYk8HHiSHkICeXKeruDDQ4Demlldv4y0rmq6z10HQwuJMxGVv4mVVXDwcJS0jP9u3knynwtoKz1vifT_Z9Jhm0WBCcOTlDD8kyspmML5qNpHg40jc3fFryJ0iWsp_UHgz3180oBAAA=)):

```svelte
<script>
  console.log('in component setup:', $effect.tracking()); // false

  $effect(() => {
    console.log('in effect:', $effect.tracking()); // true
  });
</script>

<p>в шаблоне: {$effect.tracking()}</p> <!-- true -->
```

Это используется для реализации абстракций, таких как [createSubscriber](https://svelte.dev/docs/svelte/svelte-reactivity#createSubscriber), которая создает слушателей для обновления реактивных значений, но только если эти значения отслеживаются (в отличие, например, от значений, читаемых внутри обработчика событий).


## `$effect.root`

Руна `$effect.root` — это продвинутая функция, создающая неконтролируемую область, которая не очищается автоматически. Это полезно для вложенных эффектов, которые вы хотите контролировать вручную. Эта руна также позволяет создавать эффекты вне фазы инициализации компонента.

```svelte
<script>
  let count = $state(0);

  const cleanup = $effect.root(() => {
    $effect(() => {
      console.log(count);
    });

    return () => {
      console.log('очистка корневого эффекта');
    };
  });
</script>
```

## Когда не использовать `$effect`

В общем, `$effect` лучше рассматривать как некий выходной механизм — полезный для таких вещей, как аналитика и прямое манипулирование DOM — а не как инструмент, который следует использовать часто. В частности, избегайте использования его для синхронизации состояния. Вместо этого...

```svelte
<script>
  let count = $state(0);
  let doubled = $state();

  // не делайте так!
  $effect(() => {
    doubled = count * 2;
  });
</script>
```

...делайте так:

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>
```

:::note
Для вещей, которые более сложны, чем простое выражение, такое как `count * 2`, вы также можете использовать `$derived.by`.
:::

Вас может привлечь идея создать сложные связи между эффектами, чтобы связать одно значение с другим. В следующем примере представлены два поля ввода для «потраченных денег» и «оставшихся денег», которые взаимосвязаны. Если вы измените одно из них, другое должно обновиться соответственно. Не используйте эффекты для этого ([демонстрация](https://svelte.dev/playground/untitled#H4sIAAAAAAAACpVRy26DMBD8FcvKgUhtoIdeHBwp31F6MGSJkBbHwksEQvx77aWQqooq9bgzOzP7mGTdIHipPiZJowOpGJAv0po2VmfnDv4OSBErjYdneHWzBJaCjcx91TWOToUtCIEE3cig0OIty44r5l1oDtjOkyFIsv3GINQ_CNYyGegd1DVUlCR7oU9iilDUcP8S8roYs9n8p2wdYNVFm4csTx872BxNCcjr5I11fdgonEkXsjP2CoUUZWMv6m6wBz2x7yxaM-iJvWeRsvSbSVeUy5i0uf8vKA78NIeJLSZWv1I8jQjLdyK4XuTSeIdmVKJGGI4LdjVOiezwDu1yG74My8PLCQaSiroe5s_5C2PHrkVGAgAA)):

```svelte
<script>
  let total = 100;
  let spent = $state(0);
  let left = $state(total);

  $effect(() => {
    left = total - spent;
  });

  $effect(() => {
    spent = total - left;
  });
</script>

<label>
  <input type="range" bind:value={spent} max={total} />
  {spent}/{total} потрачено
</label>

<label>
  <input type="range" bind:value={left} max={total} />
  {left}/{total} осталось
</label>
```

Вместо этого используйте обратные вызовы, где это возможно ([демонстрация](https://svelte.dev/playground/untitled#H4sIAAAAAAAACo1SMW6EMBD8imWluFMSIEUaDiKlvy5lSOHjlhOSMRZeTiDkv8deMEEJRcqdmZ1ZjzzxqpZgePo5cRw18JQA_sSVaPz0rnVk7iDRYxdhYA8vW4Wg0NnwzJRdrfGtUAVKQIYtCsly9pIkp4AZ7cQOezAoEA7JcWUkVBuCdol0dNWrEutWsV5fHfnhPQ5wZJMnCwyejxCh6G6A0V3IHk4zu_jOxzzPBxBld83PTr7xXrb3rUNw8PbiYJ3FP22oTIoLSComq5XuXTeu8LzgnVA3KDgj13wiQ8taRaJ82rzXskYM-URRlsXktejjgNLoo9e4fyf70_8EnwncySX1GuunX6kGRwnzR_BgaPNaGy3FmLJKwrCUeBM6ZUn0Cs2mOlp3vwthQJ5i14P9st9vZqQlsQIAAA==)):

```svelte
<script>
  let total = 100;
  let spent = $state(0);
  let left = $state(total);

  function updateSpent(e) {
    spent = +e.target.value;
    left = total - spent;
  }

  function updateLeft(e) {
    left = +e.target.value;
    spent = total - left;
  }
</script>

<label>
  <input type="range" value={spent} oninput={updateSpent} max={total} />
  {spent}/{total} потрачено
</label>

<label>
  <input type="range" value={left} oninput={updateLeft} max={total} />
  {left}/{total} осталось
</label>
```

Если вам по какой-либо причине нужно использовать привязки (например, когда вы хотите нечто вроде «записываемого `$derived`»), рассмотрите возможность использования геттеров и сеттеров для синхронизации состояния ([демонстрация](https://svelte.dev/playground/untitled#H4sIAAAAAAAACpWRwW6DMBBEf8WyekikFOihFwcq9TvqHkyyQUjGsfCCQMj_XnvBNKpy6Qn2DTOD1wu_tRocF18Lx9kCFwT4iRvVxenT2syNoDGyWjl4xi93g2AwxPDSXfrW4oc0EjUgwzsqzSr2VhTnxJwNHwf24lAhHIpjVDZNwy1KS5wlNoGMSg9wOCYksQccerMlv65p51X0p_Xpdt_4YEy9yTkmV3z4MJT579-bUqsaNB2kbI0dwlnCgirJe2UakJzVrbkKaqkWivasU1O1ULxnOVk3JU-Uxti0p_-vKO4no_enbQ_yXhnZn0aHs4b1jiJMK7q2zmo1C3bTMG3LaZQVrMjeoSPgaUtkDxePMCEX2Ie6b_8D4WyJJEwCAAA=)):

```svelte
<script>
  let total = 100;
  let spent = $state(0);

  let left = {
    get value() {
      return total - spent;
    },
    set value(v) {
      spent = total - v;
    }
  };
</script>

<label>
  <input type="range" bind:value={spent} max={total} />
  {spent}/{total} потрачено
</label>

<label>
  <input type="range" bind:value={left.value} max={total} />
  {left.value}/{total} осталось
</label>
```

Если вам абсолютно необходимо обновить `$state` внутри эффекта и вы столкнулись с бесконечным циклом, потому что читаете и записываете в одно и то же состояние `$state`, используйте [untrack](https://svelte.dev/docs/svelte/svelte#untrack).
