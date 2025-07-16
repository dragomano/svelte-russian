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

Если `$state` и `$derived` используются непосредственно внутри `$effect` (например, при создании [реактивного класса](/runes/state#классы)), эти значения не будут рассматриваться как зависимости.

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

Эффект повторно выполняется только тогда, когда изменяется сам объект, который он читает, а не когда изменяется свойство внутри него. (Если вы хотите отслеживать изменения _внутри_ объекта во время разработки, вы можете использовать [`$inspect`](/runes/inspect).)

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

## `$effect.pending`

При использовании [`await`](/template-syntax/await-expressions) в компонентах, руна `$effect.pending()` показывает количество **ожидающих промисов** в текущей [границе](/special-elements/svelte-boundary), не включая дочерние границы ([demo](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE3WRMU_DMBCF_8rJdHDUqilILGkaiY2RgY0yOPYZWbiOFV8IleX_jpMUEAIWS_7u-d27c2ROnJBV7B6t7WDsequAozKEqmAbpo3FwKqnyOjsJ90EMr-8uvN-G97Q0sRaEfAvLjtH6CjbsDrI3nhqju5IFgkEHGAVSBDy62L_SdtvejPTzEU4Owl6cJJM50AoxcUG2gLiVM31URgChyM89N3JBORcF3BoICA9mhN2A3G9gdvdrij2UJYgejLaSCMsKLTivNj0SEOf7WEN7ZwnHV1dfqd2dTsQ5QCdk9bI10PkcxexXqcmH3W51Jt_le2kbH8os9Y3UaTcNLYpDx-Xab6GTHXpZ128MhpWqDVK2np0yrgXXqQpaLa4APDLBkIF8bd2sYql0Sn_DeE7sYr6AdNzvgljR-MUq7SwAdMHeUtgHR4CAAA=)):

```svelte
<button onclick={() => a++}>a++</button>
<button onclick={() => b++}>b++</button>

<p>{a} + {b} = {await add(a, b)}</p>

{#if $effect.pending()}
  <p>ожидающие промисы: {$effect.pending()}</p>
{/if}
```


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

Если вы используете эффект, потому что хотите иметь возможность переопределять производное значение (например, для создания оптимистичного UI), обратите внимание, что [производные значения можно напрямую переопределять](/runes/derived#переопределение-производных-значений), начиная со Svelte 5.25.

Вас может привлечь идея создать сложные связи между эффектами, чтобы связать одно значение с другим. В следующем примере представлены два поля ввода для «потраченных денег» и «оставшихся денег», которые взаимосвязаны. Если вы измените одно из них, другое должно обновиться соответственно. Не используйте эффекты для этого ([демонстрация](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE5WRTWrDMBCFryKGLBJoY3fRjWIHeoiu6i6UZBwEY0VE49TB-O6VxrFTSih0qe_Ne_OjHpxpEDS8O7ZMeIAnqC1hAP3RA1990hKI_Fb55v06XJA4sZ0J-IjvT47RcYyBIuzP1vO2chVHHFjxiQ2pUr3k-SZRQlbBx_LIFoEN4zJfzQph_UMQr4hRXmBd456Xy5Uqt6pPKHmkfmzyPAZL2PCnbRpg8qWYu63I7lu4gswOSRYqrPNt3CgeqqzgbNwRK1A76w76YqjFspfcQTWmK3vJHlQm1puSTVSeqdOc_r9GaeCHfUSY26TXry6Br4RSK3C6yMEGT-aqVU3YbUZ2NF6rfP2KzXgbuYzY46czdgyazy0On_FlLH3F-UDXhgIO35UGlA1rAgAA)):

```svelte
<script>
  const total = 100;
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

Вместо этого используйте колбэки `oninput` или — что ещё лучше — [привязки функций](/template-syntax/bind/#привязки-функций), где это возможно ([демонстрация](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE5VRvW7CMBB-FcvqECQK6dDFJEgsnfoGTQdDLsjSxVjxhYKivHvPBwFUsXS8774_nwftbQva6I_e78gdvNo6Xzu_j3quG4cQtfkaNJ1DIiWA8atkE8IiHgEpYVsb4Rm-O3gCT2yji7jrXKB15StiOJKiA1lUpXrL81VCEUjFwHTGXiJZgiyf3TYIjSxq6NwR6uyifr0ohMbEZnpHH2rWf7ImS8KZGtK6osl_UqelRIyVL5b3ir5AuwWUtoXzoee6fIWy0p31e6i0XMocLfZQDuI6qtaeykGcR7UU6XWznFAZU9LN_X9B2UyVayk9f3ji0-REugen6U9upDOCcAWcLlS7GNCejWoQTqsLtrfBqHzxDu3DrUTOf0xwIm2o62H85sk6_OHG2jQWI4y_3byXXGMCAAA=)):

```svelte {6-8} "bind:value={() => left, updateLeft}"
<script>
  const total = 100;
  let spent = $state(0);
  let left = $derived(total - spent);

  function updateLeft(left) {
    spent = total - left;
  }
</script>

<label>
  <input type="range" bind:value={spent} max={total} />
  {spent}/{total} потрачено
</label>

<label>
  <input type="range" bind:value={() => left, updateLeft} max={total} />
  {left}/{total} осталось
</label>
```

Если вам абсолютно необходимо обновить `$state` внутри эффекта и вы столкнулись с бесконечным циклом, потому что читаете и записываете в одно и то же состояние `$state`, используйте [untrack](https://svelte.dev/docs/svelte/svelte#untrack).
