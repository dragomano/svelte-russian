---
title: $inspect
sidebar:
  order: 6
---

:::note
`$inspect` работает только во время разработки. В продакшен-сборке она становится операцией-заглушкой (noop).
:::

Руна `$inspect` примерно эквивалентна `console.log`, за исключением того, что она будет повторно выполняться каждый раз, когда изменяется её аргумент. `$inspect` отслеживает реактивное состояние глубоко, что означает, что обновление чего-то внутри объекта или массива с использованием тонкой реактивности приведет к его повторному срабатыванию ([демонстрация](https://svelte.dev/playground/untitled#H4sIAAAAAAAACkWQ0YqDQAxFfyUMhSotdZ-tCvu431AXtGOqQ2NmmMm0LOK_r7Utfby5JzeXTOpiCIPKT5PidkSVq2_n1F7Jn3uIcEMSXHSw0evHpAjaGydVzbUQCmgbWaCETZBWMPlKj29nxBDaHj_edkAiu12JhdkYDg61JGvE_s2nR8gyuBuiJZuDJTyQ7eE-IEOzog1YD80Lb0APLfdYc5F9qnFxjiKWwbImo6_llKRQVs-2u91c_bD2OCJLkT3JZasw7KLA2XCX31qKWE6vIzNk1fKE0XbmYrBTufiI8-_8D2cUWBA_AQAA)):

```svelte
<script>
  let count = $state(0);
  let message = $state('hello');

  $inspect(count, message); // будет выводить в консоль, когда изменяются `count` или `message`
</script>

<button onclick={() => count++}>Увеличить</button>
<input bind:value={message} />
```

## $inspect(...).with

`$inspect` возвращает свойство `with`, которое можно использовать с колбэком, вызываемым вместо `console.log`. Первый аргумент колбэка — это либо `"init"`, либо `"update"`; последующие аргументы — это значения, переданные в `$inspect` ([демонстрация](https://svelte.dev/playground/untitled#H4sIAAAAAAAACkVQ24qDMBD9lSEUqlTqPlsj7ON-w7pQG8c2VCchmVSK-O-bKMs-DefKYRYx6BG9qL4XQd2EohKf1opC8Nsm4F84MkbsTXAqMbVXTltuWmp5RAZlAjFIOHjuGLOP_BKVqB00eYuKs82Qn2fNjyxLtcWeyUE2sCRry3qATQIpJRyD7WPVMf9TW-7xFu53dBcoSzAOrsqQNyOe2XUKr0Xi5kcMvdDB2wSYO-I9vKazplV1-T-d6ltgNgSG1KjVUy7ZtmdbdjqtzRcphxMS1-XubOITJtPrQWMvKnYB15_1F7KKadA_AQAA)):

```svelte
<script>
  let count = $state(0);

  $inspect(count).with((type, count) => {
    if (type === 'update') {
      debugger; // или `console.trace`, или что угодно, что вам нужно
    }
  });
</script>

<button onclick={() => count++}>Увеличить</button>
```

Удобный способ найти источник какого-либо изменения — передать `console.trace` в `with`:

```js
$inspect(stuff).with(console.trace);
```

## $inspect.trace(...)

Эта руна, добавленная в версии 5.14, позволяет _отслеживать_ окружение в процессе разработки. Каждый раз, когда функция выполняется повторно в контексте [effect](/runes/effect/) или [derived](/runes/derived/), в консоль будет выводиться информация о том, какие части реактивного состояния вызвали срабатывание эффекта.

```svelte "$inspect.trace();"
<script>
  import { doSomeWork } from './elsewhere';

  $effect(() => {
    $inspect.trace();
    doSomeWork();
  });
</script>
```

`$inspect.trace` принимает необязательный первый аргумент, который будет использоваться в качестве метки.
