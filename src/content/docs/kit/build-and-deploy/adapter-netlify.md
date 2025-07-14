---
title: Netlify
origin: https://svelte.dev/docs/kit/adapter-netlify
sidebar:
  order: 8
---

Для развёртывания на Netlify используйте [`adapter-netlify`](https://github.com/sveltejs/kit/tree/main/packages/adapter-netlify).

Этот адаптер устанавливается по умолчанию при использовании [`adapter-auto`](/kit/build-and-deploy/adapter-auto), но добавление его в ваш проект позволяет указать параметры, специфичные для Netlify.

## Использование

Установите с помощью команды `npm i -D @sveltejs/adapter-netlify`, затем добавьте адаптер в ваш файл `svelte.config.js`:

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-netlify';

export default {
  kit: {
    // параметры по умолчанию
    adapter: adapter({
      // если true, создаст функцию Netlify Edge вместо
      // использования стандартных функций на основе Node
      edge: false,

      // если true, разделит ваше приложение на несколько функций
      // вместо создания одной функции для всего приложения.
      // если `edge` равно true, эта опция не может быть использована
      split: false
    })
  }
};
```

Затем убедитесь, что в корне проекта есть файл [netlify.toml](https://docs.netlify.com/configure-builds/file-based-configuration). Он определяет, куда записывать статические активы на основе настроек `build.publish`, как показано в следующем примере конфигурации:

```toml
[build]
  command = "npm run build"
  publish = "build"
```

Если файл `netlify.toml` или значение `build.publish` отсутствуют, будет использоваться значение по умолчанию `"build"`. Обратите внимание, что если вы установили директорию публикации в интерфейсе Netlify на что-то другое, вам также нужно указать её в `netlify.toml` или использовать значение по умолчанию `"build"`.

### Версия Node

Новые проекты по умолчанию используют текущую LTS-версию Node. Однако, если вы обновляете проект, созданный ранее, он может быть привязан к более старой версии. Подробности о ручном указании текущей версии Node см. в [документации Netlify](https://docs.netlify.com/configure-builds/manage-dependencies/#node-js-and-javascript).

## Функции Netlify Edge

SvelteKit поддерживает [Функции Netlify Edge](https://docs.netlify.com/netlify-labs/experimental-features/edge-functions/). Если передать опцию `edge: true` в функцию `adapter`, серверный рендеринг будет выполняться в edge-функции на основе Deno, которая развёртывается ближе к посетителю сайта. Если установлено значение `false` (по умолчанию), сайт будет развёртываться с помощью функций Netlify на основе Node.

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-netlify';

export default {
  kit: {
    adapter: adapter({
      // создаст функцию Netlify Edge на основе Deno
      // вместо использования стандартных функций на основе Node
      edge: true
    })
  }
};
```

## Альтернативные решения Netlify для функций SvelteKit

Вы можете создавать приложение, используя функциональность, предоставляемую непосредственно SvelteKit, без зависимости от возможностей Netlify. Использование версий этих функций в SvelteKit позволит применять их в режиме разработки, тестировать с помощью интеграционных тестов и работать с другими адаптерами, если вы решите отказаться от Netlify. Однако в некоторых сценариях использование версий функций от Netlify может быть полезным. Например, это может быть актуально при миграции приложения, уже размещённого на Netlify, на SvelteKit.

### `_headers` и `_redirects`

Файлы [`_headers`](https://docs.netlify.com/routing/headers/#syntax-for-the-headers-file) и [`_redirects`](https://docs.netlify.com/routing/redirects/redirect-options/), специфичные для Netlify, могут использоваться для ответов статических активов (например, изображений), если поместить их в корневую папку проекта.

### Правила перенаправления

Во время компиляции правила перенаправления автоматически добавляются в файл `_redirects`. (Если он ещё не существует, он будет создан.) Это означает:

- `[[redirects]]` в `netlify.toml` никогда не будут применяться, так как `_redirects` имеет [более высокий приоритет](https://docs.netlify.com/routing/redirects/#rule-processing-order). Поэтому всегда размещайте ваши правила в файле [`_redirects`](https://docs.netlify.com/routing/redirects/#syntax-for-the-redirects-file).
- В `_redirects` не должно быть пользовательских правил «перехвата всех», таких как `/* /foobar/:splat`. В противном случае автоматически добавленное правило никогда не будет применено, так как Netlify обрабатывает [только первое подходящее правило](https://docs.netlify.com/routing/redirects/#rule-processing-order).

### Формы Netlify

1. Создайте HTML-форму Netlify, как описано [здесь](https://docs.netlify.com/forms/setup/#html-forms), например, в `/routes/contact/+page.svelte`. (Не забудьте добавить скрытый элемент ввода `form-name`!)
2. Бот сборки Netlify анализирует ваши HTML-файлы во время развёртывания, поэтому ваша форма должна быть [предварительно отрендерена](/kit/core-concepts/page-options/#prerender) как HTML. Вы можете добавить `export const prerender = true` в ваш файл `contact.svelte`, чтобы предварительно отрендерить только эту страницу, или установить опцию `kit.prerender.force: true`, чтобы предварительно отрендерить все страницы.
3. Если ваша форма Netlify имеет [пользовательское сообщение об успешной отправке](https://docs.netlify.com/forms/setup/#success-messages), например `<form netlify ... action="/success">`, убедитесь, что соответствующая страница `/routes/success/+page.svelte` существует и также предварительно отрендерена.

### Функции Netlify

С этим адаптером эндпойнты SvelteKit размещаются как [функции Netlify](https://docs.netlify.com/functions/overview/). Обработчики функций Netlify имеют дополнительный контекст, включая информацию о [Netlify Identity](https://docs.netlify.com/visitor-access/identity/). Вы можете получить доступ к этому контексту через поле `event.platform.context` в ваших хуках и эндпойнтах `+page.server` или `+layout.server`. Это [облачные функции](https://docs.netlify.com/functions/overview/), если свойство `edge` в конфигурации адаптера установлено в `false`, или [edge-функции](https://docs.netlify.com/edge-functions/overview/#app), если оно установлено в `true`.

```js
// +page.server.js
export const load = async (event) => {
  const context = event.platform.context;
  console.log(context); // отображается в журнале функций в приложении Netlify
};
```

Кроме того, вы можете добавить свои собственные функции Netlify, создав для них директорию и добавив конфигурацию в ваш файл `netlify.toml`. Например:

```toml
[build]
  command = "npm run build"
  publish = "build"

[functions]
  directory = "functions"
```

## Решение проблем

### Доступ к файловой системе

В edge-развёртываниях нельзя использовать `fs`.

В облачных развёртываниях использовать `fs` можно, но он не будет работать как ожидается, поскольку файлы из вашего проекта не копируются в развёртывание. Вместо этого используйте функцию [`read`](https://svelte.dev/docs/kit/$app-server#read) из `$app/server` для доступа к вашим файлам. `read` не работает в edge-развёртываниях (это может измениться в будущем).

В качестве альтернативы вы можете [предварительно рендерить](/kit/core-concepts/page-options/#prerender) соответствующие маршруты.
