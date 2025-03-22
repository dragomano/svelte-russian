---
title: Переход на Svelte 4
origin: https://svelte.dev/docs/svelte/v4-migration-guide
sidebar:
  order: 3
---

Это руководство по миграции предлагает общее представление о том, как перейти с Svelte версии 3 на 4. Для получения более подробной информации о каждом изменении смотрите связанные PR. Вы можете использовать скрипт миграции для автоматического выполнения некоторых из этих действий: `npx svelte-migrate@latest svelte-4`.

Если вы разрабатываете библиотеку, подумайте, стоит ли поддерживать только Svelte 4 или возможно также обеспечить совместимость с Svelte 3. Поскольку большинство критических изменений не затрагивают многих пользователей, это может быть вполне осуществимо. Не забудьте также обновить диапазон версий в ваших `peerDependencies`.

## Минимальные требования к версиям

- Обновите до Node 16 или выше. Более ранние версии больше не поддерживаются. ([#8566](https://github.com/sveltejs/svelte/issues/8566))
- Если вы используете SvelteKit, обновите до версии 1.20.4 или новее ([sveltejs/kit#10172](https://github.com/sveltejs/kit/pull/10172))
- Если вы используете Vite без SvelteKit, обновите до `vite-plugin-svelte` версии 2.4.1 или новее ([#8516](https://github.com/sveltejs/svelte/issues/8516))
- Если вы используете webpack, обновите до webpack 5 или выше и `svelte-loader` версии 3.1.8 или выше. Более ранние версии больше не поддерживаются. ([#8515](https://github.com/sveltejs/svelte/issues/8515), [198dbcf](https://github.com/sveltejs/svelte/commit/198dbcf))
- Если вы используете Rollup, обновите до `rollup-plugin-svelte` версии 7.1.5 или выше ([198dbcf](https://github.com/sveltejs/svelte/commit/198dbcf))
- Если вы используете TypeScript, обновите до TypeScript 5 или выше. Более ранние версии могут работать, но гарантии на это не даются. ([#8488](https://github.com/sveltejs/svelte/issues/8488))

## Условия для браузеров для сборщиков

Сборщики теперь должны указывать условие `browser` при создании фронтенд-бандла для браузера. SvelteKit и Vite сделают это автоматически для вас. Если вы используете другие сборщики, вы можете заметить, что такие колбэки жизненного цикла, как `onMount`, не вызываются, и вам потребуется обновить конфигурацию разрешения модулей.
- Для Rollup это делается в плагине `@rollup/plugin-node-resolve` с помощью опции `browser: true`. См. документацию [`rollup-plugin-svelte`](https://github.com/sveltejs/rollup-plugin-svelte/#usage) для получения более подробной информации.
- Для webpack это делается путём добавления `"browser"` в массив `conditionNames`. Вам также может потребоваться обновить вашу конфигурацию `alias`, если вы её настроили. См. документацию [`svelte-loader`](https://github.com/sveltejs/svelte-loader#usage) для получения более подробной информации.

([#8516](https://github.com/sveltejs/svelte/issues/8516))

## Удаление вывода, связанного с CJS

Svelte больше не поддерживает формат CommonJS (CJS) для вывода компилятора и также удалил хук `svelte/register` и версию CJS времени выполнения. Если вам необходимо оставить поддержку формата CJS, рассмотрите возможность использования сборщика для преобразования ESM-вывода Svelte в CJS на этапе постобработки. ([#8613](https://github.com/sveltejs/svelte/issues/8613))

## Более строгие типы для функций Svelte

Теперь для `createEventDispatcher`, `Action`, `ActionReturn` и `onMount` установлены более строгие типы:

- `createEventDispatcher` теперь поддерживает указание того, что полезная нагрузка является необязательной, обязательной или отсутствующей, и места вызова проверяются соответственно ([#7224](https://github.com/sveltejs/svelte/issues/7224)).

```ts
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher<{
  optional: number | null;
  required: string;
  noArgument: null;
}>();

// Svelte версии 3:
dispatch('optional');
dispatch('required'); // Я все еще могу опустить аргумент detail
dispatch('noArgument', 'surprise'); // Я все еще могу добавить аргумент detail

// Svelte версия 4 с использованием строгого режима TypeScript:
dispatch('optional');
dispatch('required'); // ошибка, пропущен аргумент
dispatch('noArgument', 'surprise'); // ошибка, невозможно передать аргумент
```

- `Action` и `ActionReturn` теперь имеют тип параметра по умолчанию `undefined`, что означает, что вам необходимо указать обобщение, если вы хотите обозначить, что это действие принимает параметр. Скрипт миграции автоматически выполнит эту задачу ([#7442](https://github.com/sveltejs/svelte/pull/7442)).

```diff lang="ts"
- const action: Action = (node, params) => { ... } // Теперь это вызывает ошибку, если вы используете параметры каким-либо образом
+ const action: Action<HTMLElement, string> = (node, params) => { ... } // params имеет тип string
```

- `onMount` теперь выдает ошибку типа, если вы асинхронно возвращаете функцию. Это может указывать на ошибку в вашем коде. Вы, возможно, ожидаете, что колбэк будет вызван при уничтожении компонента, но это происходит только для функций, возвращаемых синхронно ([#8136](https://github.com/sveltejs/svelte/issues/8136)).

```diff lang="js"
// Пример, где это изменение выявляет реальную ошибку
onMount(
- // someCleanup() не вызывается, потому что функция, переданная в onMount, является асинхронной
- async () => {
-   const something = await foo();
+ // someCleanup() вызывается, потому что функция, переданная в onMount, является синхронной
  () => {
    foo().then(something => {...});
    // ...
    return () => someCleanup();
  }
);
```

## Пользовательские элементы с Svelte

Создание пользовательских элементов с помощью Svelte было полностью переработано и значительно улучшено. Опция `tag` устарела в пользу новой опции `customElement`:

```diff lang="svelte"
- <svelte:options tag="my-component" />
+ <svelte:options customElement="my-component" />
```

Это изменение было внесено для обеспечения [большей конфигурируемости](/misc/custom-elements#параметры-компонента) для продвинутых случаев использования. Скрипт миграции автоматически скорректирует ваш код. Также немного изменилось время обновления свойств. ([#8457](https://github.com/sveltejs/svelte/issues/8457))

## SvelteComponentTyped устарел

`SvelteComponentTyped` устарел, так как `SvelteComponent` теперь обладает всеми необходимыми возможностями типизации. Замените все вхождения `SvelteComponentTyped` на `SvelteComponent`.

```diff lang="js"
- import { SvelteComponentTyped } from 'svelte';
+ import { SvelteComponent } from 'svelte';

- export class Foo extends SvelteComponentTyped<{ aProp: string }> {}
+ export class Foo extends SvelteComponent<{ aProp: string }> {}
```

Если вы ранее использовали `SvelteComponent` в качестве типа экземпляра компонента, вы можете увидеть несколько неясную ошибку типа. Это можно исправить, изменив `: typeof SvelteComponent` на `: typeof SvelteComponent<any>`.

```svelte "<any>"
<script>
  import ComponentA from './ComponentA.svelte';
  import ComponentB from './ComponentB.svelte';
  import { SvelteComponent } from 'svelte';

  let component: typeof SvelteComponent<any>;

  function choseRandomly() {
    component = Math.random() > 0.5 ? ComponentA : ComponentB;
  }
</script>

<button on:click={choseRandomly}>random</button>
<svelte:element this={component} />
```

Скрипт миграции выполнит за вас оба действия автоматически. ([#8512](https://github.com/sveltejs/svelte/issues/8512))

## Переходы по умолчанию являются локальными

Переходы теперь по умолчанию являются локальными, чтобы избежать путаницы при навигации по страницам. `local` означает, что переход не будет воспроизводиться, если он находится внутри вложенного блока управления потоком (`each/if/await/key`), и не является непосредственным родительским блоком, а блоком выше него, который создается/уничтожается. В следующем примере анимация входа `slide` будет воспроизводиться только тогда, когда `success` изменится с `false` на `true`, но _не_ будет воспроизводиться, когда `show` изменится с `false` на `true`:

```svelte
{#if show}
  ...
  {#if success}
    <p in:slide>Успешно</p>
  {/each}
{/if}
```

Чтобы сделать переходы глобальными, добавьте модификатор `|global` — тогда они будут воспроизводиться, когда _любой_ блок управления потоком выше будет создан/уничтожен. Скрипт миграции выполнит это автоматически для вас. ([#6686](https://github.com/sveltejs/svelte/issues/6686))

## Привязки по умолчанию для слотов

Привязки по умолчанию для слотов больше не доступны для именованных слотов и наоборот:

```svelte
<script>
  import Nested from './Nested.svelte';
</script>

<Nested let:count>
  <p>
    count в слоте по умолчанию — доступен: {count}
  </p>
  <p slot="bar">
    count в слоте bar — недоступен: {count}
  </p>
</Nested>
```

Это делает привязки слотов более согласованными, поскольку поведение становится неопределенным, если, например, слот по умолчанию берется из списка, а именованный слот — нет. ([#6049](https://github.com/sveltejs/svelte/issues/6049))

## Препроцессоры

Порядок применения препроцессоров был изменен. Теперь они выполняются последовательно, и в одной группе порядок следующий: `markup`, `script`, `style`.

```js
import { preprocess } from 'svelte/compiler';

const { code } = await preprocess(
  source,
  [
    {
      markup: () => {
        console.log('markup-1');
      },
      script: () => {
        console.log('script-1');
      },
      style: () => {
        console.log('style-1');
      }
    },
    {
      markup: () => {
        console.log('markup-2');
      },
      script: () => {
        console.log('script-2');
      },
      style: () => {
        console.log('style-2');
      }
    }
  ],
  {
    filename: 'App.svelte'
  }
);

// Логи Svelte 3:
// markup-1
// markup-2
// script-1
// script-2
// style-1
// style-2

// Логи Svelte 4:
// markup-1
// script-1
// style-1
// markup-2
// script-2
// style-2
```

Это может повлиять на вас, например, если вы используете `MDsveX` — в этом случае вам следует убедиться, что он находится перед любым препроцессором скриптов или стилей.

```diff lang="js"
preprocess: [
- vitePreprocess(),
- mdsvex(mdsvexConfig)
+ mdsvex(mdsvexConfig),
+ vitePreprocess()
]
```

Каждый препроцессор также должен иметь имя. ([#8618](https://github.com/sveltejs/svelte/issues/8618))

## Новый пакет eslint

`eslint-plugin-svelte3` устарел. Он может по-прежнему работать с Svelte 4, но мы не даем никаких гарантий по этому поводу. Мы рекомендуем перейти на наш новый пакет [eslint-plugin-svelte](https://github.com/sveltejs/eslint-plugin-svelte). См. [этот пост на GitHub](https://github.com/sveltejs/kit/issues/10242#issuecomment-1610798405) для получения инструкций по миграции. В качестве альтернативы вы можете создать новый проект, используя `npm create svelte@latest`, выбрать опцию eslint (и, возможно, TypeScript), а затем скопировать соответствующие файлы в ваш существующий проект.

## Другие критические изменения

- Атрибут `inert` теперь применяется к элементам, которые выходят из анимации, чтобы сделать их невидимыми для вспомогательных технологий и предотвратить взаимодействие. ([#8628](https://github.com/sveltejs/svelte/pull/8628))
- Среда выполнения теперь использует `classList.toggle(name, boolean)`, что может не работать в очень старых браузерах. Рассмотрите возможность использования [полифила](https://github.com/eligrey/classList.js), если вам нужно поддерживать эти браузеры. ([#8629](https://github.com/sveltejs/svelte/issues/8629))
- Среда выполнения теперь использует конструктор `CustomEvent`, который может не работать в очень старых браузерах. Рассмотрите возможность использования [полифила](https://github.com/theftprevention/event-constructor-polyfill/tree/master), если вам нужно поддерживать эти браузеры. ([#8775](https://github.com/sveltejs/svelte/pull/8775))
- Разработчики, реализующие свои собственные хранилища с нуля, используя интерфейс `StartStopNotifier` (который передается в функцию создания `writable` и т. д.) из `svelte/store`, теперь должны передавать функцию обновления в дополнение к функции установки. Это не повлияет на тех, кто использует или создает хранилища с помощью `svelte/store`. ([#6750](https://github.com/sveltejs/svelte/issues/6750))
- `derived` теперь будет вызывать ошибку при получении ложных значений вместо хранилищ, переданных ему. ([#7947](https://github.com/sveltejs/svelte/issues/7947))
- Определения типов для `svelte/internal` были удалены, чтобы ещё больше предотвратить использование этих внутренних методов, которые не являются публичным API. Большинство из них, вероятно, изменится в Svelte 5.
- Удаление узлов DOM теперь выполняется пакетно, что немного изменяет его порядок, что может повлиять на порядок событий, если вы используете `MutationObserver` на этих элементах. ([#8763](https://github.com/sveltejs/svelte/pull/8763))
- Если вы ранее улучшали глобальные типы через пространство имён `svelte.JSX`, вам нужно мигрировать это, чтобы использовать пространство имён `svelteHTML`. Аналогично, если вы использовали пространство имён `svelte.JSX` для использования определений типов из него, вам нужно мигрировать их, чтобы использовать типы из `svelte/elements`. Вы можете найти больше информации о том, что делать, [здесь](https://github.com/sveltejs/language-tools/blob/master/docs/preprocessors/typescript.md#im-getting-deprecation-warnings-for-sveltejsx--i-want-to-migrate-to-the-new-typings).
