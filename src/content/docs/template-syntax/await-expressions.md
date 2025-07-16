---
title: "await"
origin: https://svelte.dev/docs/svelte/await-expressions
---

Начиная со Svelte 5.36 ключевое слово `await` можно использовать в компонентах в трёх новых местах:

- на верхнем уровне `<script>` компонента
- внутри выражений `$derived(...)`
- непосредственно в разметке

Данная функциональность пока экспериментальна — для её использования необходимо добавить параметр `experimental.async` в [конфигурации](https://svelte.dev/docs/kit/configuration) Svelte:

```js
// svelte.config.js
export default {
  compilerOptions: {
    experimental: {
      async: true
    }
  }
};
```

Экспериментальный флаг будет удалён в Svelte 6.

## Границы

В текущей реализации `await` можно использовать только внутри [`<svelte:boundary>`](/special-elements/svelte-boundary) при наличии сниппета `pending`:

```svelte
<svelte:boundary>
  <MyApp />

  {#snippet pending()}
    <p>загрузка...</p>
  {/snippet}
</svelte:boundary>
```

Это ограничение будет снято после реализации асинхронного серверного рендеринга в Svelte (см. [ограничения](#ограничения)).

:::note
В [песочнице](https://svelte.dev/playground) ваше приложение рендерится внутри границы с пустым сниппетом `pending`, что позволяет использовать `await` без необходимости создавать его вручную.
:::

## Синхронизированные обновления

Когда выражение `await` зависит от определённого состояния, изменения этого состояния не будут отражены в интерфейсе до завершения асинхронной операции. Это предотвращает попадание интерфейса в несогласованное состояние. Например, в ситуации как [здесь](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE42QsWrDQBBEf2VZUkhYRE4gjSwJ0qVMkS6XYk9awcFpJe5Wdoy4fw-ycdykSPt2dpiZFYVGxgrf2PsJTlPwPWTcO-U-xwIH5zli9bminudNtwEsbl-v8_wYj-x1Y5Yi_8W7SZRFI1ZYxy64WVsjRj0rEDTwEJWUs6f8cKP2Tp8vVIxSPEsHwyKdukmA-j6jAmwO63Y1SidyCsIneA_T6CJn2ZBD00Jk_XAjT4tmQwEv-32eH6AsgYK6wXWOPPTs6Xy1CaxLECDYgb3kSUbq8p5aaifzorCt0RiUZbQcDIJ10ldH8gs3K6X2Xzqbro5zu1KCHaw2QQPrtclvwVSXc2sEC1T-Vqw0LJy-ClRy_uSkx2ogHzn9ADZ1CubKAQAA)...

```svelte
<script>
  let a = $state(1);
  let b = $state(2);

  async function add(a, b) {
    await new Promise((f) => setTimeout(f, 500)); // искусственная задержка
    return a + b;
  }
</script>

<input type="number" bind:value={a}>
<input type="number" bind:value={b}>

<p>{a} + {b} = {await add(a, b)}</p>
```

...если вы увеличите `a`, содержимое `<p>` не сразу обновится, чтобы отобразить это:

```html
<p>2 + 2 = 3</p>
```

Вместо этого текст обновится до `2 + 2 = 4`, когда `add(a, b)` завершится.

Обновления могут перекрываться — быстрое обновление отобразится в интерфейсе, пока предыдущее медленное обновление всё ещё выполняется.

## Параллелизм

Svelte будет выполнять как можно больше асинхронной работы параллельно. Например, если у вас есть два выражения `await` в вашей разметке...

```svelte
<p>{await one()}</p>
<p>{await two()}</p>
```

...обе функции будут выполняться одновременно, поскольку они являются независимыми выражениями, несмотря на то, что они _визуально_ последовательны.

Это не относится к последовательным выражениям `await` внутри вашего `<script>` или внутри асинхронных функций — они выполняются как любой другой асинхронный JavaScript. Исключением является то, что независимые выражения `$derived` будут обновляться независимо, хотя они будут выполняться последовательно при их первом создании:

```js
// они будут выполняться последовательно при первом запуске,
// но будут обновляться независимо
let a = $derived(await one());
let b = $derived(await two());
```

:::note
Если вы пишете код таким образом, ожидайте, что Svelte выдаст предупреждение [`await_waterfall`](/reference/runtime-warnings/#await_waterfall)
:::

## Индикация состояний загрузки

В дополнение к фрагменту [`pending`](/special-elements/svelte-boundary#pending) ближайшей границы вы можете указать, что асинхронная работа продолжается, с помощью [`$effect.pending()`](/runes/effect/#effectpending).

Вы также можете использовать [`settled()`](https://svelte.dev/docs/svelte/svelte#settled), чтобы получить промис, который разрешается, когда текущее обновление завершено:

```js
import { tick, settled } from 'svelte';

async function onclick() {
  updating = true;

  // без этого изменение `updating` будет
  // сгруппировано с другими изменениями, что означает,
  // что оно не отобразится в интерфейсе
  await tick();

  color = 'octarine';
  answer = 42;

  await settled();

  // все обновления, зависящие от `color` или `answer`,
  // теперь применены
  updating = false;
}
```

## Обработка ошибок

Ошибки в выражениях `await` будут передаваться к ближайшей [границе ошибок](/special-elements/svelte-boundary).

## Ограничения

Как экспериментальная функция, детали обработки `await` (и связанные с ней API, такие как `$effect.pending()`) могут подвергаться изменениям, нарушающим совместимость, вне основного выпуска по семантическому версионированию, хотя мы стремимся свести такие изменения к минимуму.

В настоящее время серверный рендеринг является синхронным. Если во время SSR встречается `<svelte:boundary>` с фрагментом `pending`, будет отрендерен только фрагмент `pending`.

## Изменения, нарушающие совместимость

Эффекты выполняются в немного другом порядке, когда опция `experimental.async` равна `true`. В частности, эффекты _блоков_, такие как `{#if ...}` и `{#each ...}`, теперь выполняются до `$effect.pre` или `beforeUpdate` в том же компоненте, что означает, что в [очень редких ситуациях](https://svelte.dev/playground/untitled?#H4sIAAAAAAAAE22R3VLDIBCFX2WLvUhnTHsf0zre-Q7WmfwtFV2BgU1rJ5N3F0jaOuoVcPbw7VkYhK4_URTiGYkMnIyjDjLsFGO3EvdCKkIvipdB8NlGXxSCPt96snbtj0gctab2-J_eGs2oOWBE6VunLO_2es-EDKZ5x5ZhC0vPNWM2gHXGouNzAex6hHH1cPHil_Lsb95YT9VQX6KUAbS2DrNsBdsdDFHe8_XSYjH1SrhELTe3MLpsemajweiWVPuxHSbKNd-8eQTdE0EBf4OOaSg2hwNhhE_ABB_ulJzjj9FULvIcqgm5vnAqUB7wWFMfhuugQWkcAr8hVD-mq8D12kOep24J_IszToOXdveGDsuNnZwbJUNlXsKnhJdhUcTo42s41YpOSneikDV5HL8BktM6yRcCAAA=) возможно обновить блок, который больше не должен существовать, но только если вы обновляете состояние внутри эффекта, [чего следует избегать](/runes/effect#когда-не-использовать-effect).
