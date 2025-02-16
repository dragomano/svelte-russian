---
title: TypeScript
origin: https://svelte.dev/docs/svelte/typescript
sidebar:
  order: 1
---

<!-- - в основном то, что у нас есть сегодня (https://svelte.dev/docs/typescript)
- встроенная поддержка, но только для функций, связанных с типами
- дженерики (обобщения)
- использование `Component` и других вспомогательных типов
- использование `svelte-check` -->

Вы можете применять TypeScript в компонентах Svelte. Расширения для IDE, такие как [расширение Svelte для VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode), помогут вам выявлять ошибки непосредственно в редакторе. Пакет [`svelte-check`](https://www.npmjs.com/package/svelte-check) выполняет аналогичную функцию в командной строке.

## `<script lang="ts">`

Чтобы использовать TypeScript внутри ваших компонентов Svelte, добавьте `lang="ts"` к вашим тегам `script`:

```svelte
<script lang="ts">
  let name: string = 'world';

  function greet(name: string) {
    alert(`Hello, ${name}!`);
  }
</script>

<button onclick={(e: Event) => greet(e.target.innerText)}>
  {name as string}
</button>
```

Такой подход позволяет использовать функции TypeScript, которые касаются _только типов_. То есть все функции, которые просто исчезают при транспиляции в JavaScript, такие как аннотации типов или объявления интерфейсов. Функции, которые требуют от компилятора TypeScript генерации реального кода, не поддерживаются. Это включает в себя:

- использование перечислений (enums)
- использование модификаторов `private`, `protected` или `public` в конструкторах вместе с инициализаторами
- использование функций, которые ещё не являются частью стандарта ECMAScript (не находятся на уровне 4 в процессе TC39) и, следовательно, ещё не реализованы в Acorn, парсере, который мы используем для разбора JavaScript

Если вы хотите использовать одну из этих функций, вам нужно настроить препроцессор `script`.

## Настройка препроцессора

Чтобы использовать функции TypeScript, помимо типизации, внутри компонентов Svelte, вам нужно добавить препроцессор, который преобразует TypeScript в JavaScript.

```ts
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  // Обратите внимание на `{ script: true }`
  preprocess: vitePreprocess({ script: true })
};

export default config;
```

### Использование SvelteKit или Vite

Самый простой способ начать — это создать новый проект SvelteKit, введя `npx sv create`, следуя подсказкам и выбрав опцию TypeScript.

```ts
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess()
};

export default config;
```

Если вам не нужны все функции, которые предлагает SvelteKit, вы можете создать проект на Vite с поддержкой Svelte, введя `npm create vite@latest` и выбрав опцию `svelte-ts`.

В обоих случаях будет добавлен файл `svelte.config.js` с `vitePreprocess`, который будет использоваться Vite/SvelteKit.

### Другие инструменты сборки

Если вы используете такие инструменты, как Rollup или Webpack, установите соответствующие плагины для Svelte. Для Rollup это [rollup-plugin-svelte](https://github.com/sveltejs/rollup-plugin-svelte), а для Webpack — [svelte-loader](https://github.com/sveltejs/svelte-loader). В обоих случаях вам нужно установить `typescript` и `svelte-preprocess`, а также добавить препроцессор в конфигурацию плагина (см. соответствующие README для получения дополнительной информации). Если вы начинаете новый проект, вы также можете использовать шаблон [rollup](https://github.com/sveltejs/template) или [webpack](https://github.com/sveltejs/template-webpack) для быстрой настройки проекта с помощью скрипта.

:::note
Если вы запускаете новый проект, мы советуем использовать SvelteKit или Vite.
:::

## Настройки tsconfig.json

При использовании TypeScript убедитесь, что ваш `tsconfig.json` настроен правильно.

- Установите [`target`](https://www.typescriptlang.org/tsconfig/#target) не ниже `ES2022`, или `target` не ниже `ES2015` вместе с [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig/#useDefineForClassFields). Это гарантирует, что объявления рун в полях класса не будут нарушены, что может привести к сбоям в компиляторе Svelte.
- Установите [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) в `true`, чтобы импорты оставались без изменений.
- Установите [`isolatedModules`](https://www.typescriptlang.org/tsconfig/#isolatedModules) в `true`, чтобы каждый файл рассматривался изолированно. У TypeScript есть несколько функций, которые требуют анализа и компиляции между файлами, что компилятор Svelte и инструменты, такие как Vite, не делают.

## Типизация `$props`

Типизируйте `$props` так же, как обычный объект с определёнными свойствами.

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    requiredProperty: number;
    optionalProperty?: boolean;
    snippetWithStringArgument: Snippet<[string]>;
    eventHandler: (arg: string) => void;
    [key: string]: unknown;
  }

  let {
    requiredProperty,
    optionalProperty,
    snippetWithStringArgument,
    eventHandler,
    ...everythingElse
  }: Props = $props();
</script>

<button onclick={() => eventHandler('clicked button')}>
  {@render snippetWithStringArgument('hello')}
</button>
```

## Обобщённые `$props`

Компоненты могут устанавливать обобщённые отношения между своими свойствами. Например, это может быть обобщенный компонент списка, который принимает список элементов и свойство обратного вызова, получающее элемент из списка. Чтобы указать, что свойство `items` и обратный вызов `select` работают с одинаковыми типами, добавьте атрибут `generics` в тег `script`:

```svelte
<script lang="ts" generics="Item extends { text: string }">
  interface Props {
    items: Item[];
    select(item: Item): void;
  }

  let { items, select }: Props = $props();
</script>

{#each items as item}
  <button onclick={() => select(item)}>
    {item.text}
  </button>
{/each}
```

Содержимое `generics` — это то, что вы бы поместили между тегами `<...>` обобщённой функции. Другими словами, вы можете использовать несколько обобщений, `extends` и типы по умолчанию.

## Типизация обёрток компонентов

Если вы пишете компонент, который оборачивает нативный элемент, вам может понадобиться предоставить пользователю доступ ко всем атрибутам базового элемента. В этом случае используйте (или расширяйте) один из интерфейсов, предоставляемых `svelte/elements`. Вот пример для компонента `Button`:

```svelte
<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  let { children, ...rest }: HTMLButtonAttributes = $props();
</script>

<button {...rest}>
  {@render children?.()}
</button>
```

Не все элементы имеют специальное определение типа. Для тех, у кого его нет, используйте `SvelteHTMLElements`:

```svelte
<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements';

  let { children, ...rest }: SvelteHTMLElements['div'] = $props();
</script>

<div {...rest}>
  {@render children?.()}
</div>
```

## Типизация `$state`

Вы можете типизировать `$state` так же, как любую другую переменную.

```ts
let count: number = $state(0);
```

Если вы не укажете начальное значение для `$state`, часть его типов будет `undefined`.

```ts
// Error: Type 'number | undefined' is not assignable to type 'number'
let count: number = $state();
```

Если вы уверены, что переменная _будет_ определена перед первым использованием, используйте приведение типа с помощью `as`. Это особенно полезно в контексте классов:

```ts
class Counter {
  count = $state() as number;
  constructor(initial: number) {
    this.count = initial;
  }
}
```

## Тип `Component`

Компоненты Svelte имеют тип `Component`. Вы можете использовать его и связанные типы для задания различных ограничений.

Используйте его в сочетании с динамическими компонентами, чтобы ограничить, какие типы компонентов могут быть переданы:

```svelte
<script lang="ts">
  import type { Component } from 'svelte';

  interface Props {
    // только компоненты, у которых есть не более одного
    // обязательного свойства «prop», могут быть переданы.
    DynamicComponent: Component<{ prop: string }>;
  }

  let { DynamicComponent }: Props = $props();
</script>

<DynamicComponent prop="foo" />
```

:::caution
В Svelte 4 компоненты имели тип `SvelteComponent`.
:::

Чтобы извлечь свойства из компонента, используйте `ComponentProps`.

```ts
import type { Component, ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';

function withProps<TComponent extends Component<any>>(
  component: TComponent,
  props: ComponentProps<TComponent>
) {}

// Ошибки, если второй аргумент не соответствует ожидаемым свойствам,
// которые компонент принимает в первом аргументе.
withProps(MyComponent, { foo: 'bar' });
```

Чтобы объявить, что переменная ожидает тип конструктора или экземпляра компонента:

```svelte
<script lang="ts">
  import MyComponent from './MyComponent.svelte';

  let componentConstructor: typeof MyComponent = MyComponent;
  let componentInstance: MyComponent;
</script>

<MyComponent bind:this={componentInstance} />
```

## Расширение встроенных типов DOM

Svelte предоставляет максимально полное описание всех типов HTML DOM. Иногда вам может понадобиться использовать экспериментальные атрибуты или пользовательские события, возникающие из действия. В таких случаях TypeScript выдаст ошибку типа, указывая, что не знает этих типов. Если это стандартный атрибут/событие, не относящееся к экспериментальным, возможно, это пропущенная типизация в наших [HTML типах](https://github.com/sveltejs/svelte/blob/main/packages/svelte/elements.d.ts). В этом случае вы можете открыть проблему и/или PR для её исправления.

Если это пользовательский или экспериментальный атрибут/событие, вы можете улучшить типизацию следующим образом:

```ts
// additional-svelte-typings.d.ts
declare namespace svelteHTML {
  // расширяем элементы
  interface IntrinsicElements {
    'my-custom-element': { someattribute: string; 'on:event': (e: CustomEvent<any>) => void };
  }
  // расширяем атрибуты
  interface HTMLAttributes<T> {
    // Если вы хотите использовать событие beforeinstallprompt
    onbeforeinstallprompt?: (event: any) => any;
    // Если вы хотите использовать myCustomAttribute={..} (обратите внимание: все буквы в нижнем регистре)
    mycustomattribute?: any; // Вы можете заменить `any` на что-то более конкретное, если хотите
  }
}
```

Затем убедитесь, что файл `d.ts` указан в вашем `tsconfig.json`. Если он содержит что-то вроде `"include": ["src/**/*"]`, и ваш файл `d.ts` находится внутри `src`, это должно сработать. Возможно, вам потребуется перезагрузить приложение, чтобы изменения вступили в силу.

Вы также можете объявить типы, расширяя модуль `svelte/elements` следующим образом:

```ts
// additional-svelte-typings.d.ts
import { HTMLButtonAttributes } from 'svelte/elements';

declare module 'svelte/elements' {
  export interface SvelteHTMLElements {
    'custom-button': HTMLButtonAttributes;
  }

  // позволяет более детально контролировать, к какому элементу добавлять типизацию
  export interface HTMLButtonAttributes {
    veryexperimentalattribute?: string;
  }
}

export {}; // убедитесь, что это не амбиентный модуль, иначе типы будут заменены, а не дополнены
```
