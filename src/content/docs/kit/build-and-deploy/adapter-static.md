---
title: Генерация статических сайтов
origin: https://svelte.dev/docs/kit/adapter-static
sidebar:
  order: 4
---

Чтобы использовать SvelteKit в качестве генератора статических сайтов (SSG), используйте [`adapter-static`](https://github.com/sveltejs/kit/tree/main/packages/adapter-static).

Это позволит предварительно отрендерить весь сайт в виде набора статических файлов. Если вы хотите предварительно отрендерить только некоторые страницы, а остальные рендерить динамически на сервере, вам потребуется использовать другой адаптер совместно с [опцией `prerender`](/kit/core-concepts/page-options/#prerender).

## Использование

Установите адаптер с помощью команды `npm i -D @sveltejs/adapter-static`, затем добавьте его в файл `svelte.config.js`:

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      // параметры по умолчанию
      // на некоторых платформах эти параметры устанавливаются автоматически — см. ниже
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: true
    })
  }
};
```

...и добавьте опцию [`prerender`](/kit/core-concepts/page-options/#prerender) в корневом `layout`:

```js
// src/routes/+layout.js
// Это значение может быть `false`, если вы используете fallback (то есть режим SPA)
export const prerender = true;
```

:::note
Вы должны убедиться, что опция SvelteKit [`trailingSlash`](/kit/core-concepts/page-options/#trailingslash) настроена корректно для вашей среды.
Если ваш хостинг не обрабатывает запросы к `/a` как `/a.html`, тогда необходимо установить `trailingSlash: 'always'` в корневом `layout`, чтобы генерировался файл `/a/index.html`.
:::

## Поддержка без дополнительной настройки

Некоторые платформы поддерживаются «из коробки» (список будет расширяться в будущем):

- [Vercel](https://vercel.com)

На этих платформах следует опустить настройки адаптера, чтобы `adapter-static` мог применить оптимальную конфигурацию:

```js
// svelte.config.js
export default {
  kit: {
    adapter: adapter({...})
  }
};
```

## Параметры

### pages

Каталог, в который будут записаны предварительно отрендеренные страницы. По умолчанию — `build`.

### assets

Каталог, в который будут записаны статические ресурсы (содержимое папки `static`, а также JS и CSS, сгенерированные SvelteKit). Обычно должен совпадать с `pages`, и по умолчанию принимает его значение. Однако в редких случаях может понадобиться выводить страницы и ресурсы в разные каталоги.

### fallback

Укажите fallback-страницу для [SPA-режима](/kit/build-and-deploy/single-page-apps), например `index.html`, `200.html` или `404.html`.

### precompress

Если `true`, файлы будут предварительно сжаты с использованием brotli и gzip. Это создаст файлы с расширениями `.br` и `.gz`.

### strict

По умолчанию `adapter-static` проверяет, что либо все страницы и эндпойнты вашего приложения были предварительно отрендерены, либо задан параметр `fallback`. Эта проверка необходима, чтобы вы случайно не опубликовали приложение, в котором часть страниц будет недоступна из-за отсутствия в итоговой сборке.
Если вы осознанно допускаете такую ситуацию (например, когда определённая страница существует только при выполнении условий), установите `strict: false`, чтобы отключить эту проверку.

## GitHub Pages

При сборке для [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages), если имя вашего репозитория не совпадает с `your-username.github.io`, обязательно обновите [`config.kit.paths.base`](https://svelte.dev/docs/kit/configuration#paths), чтобы оно соответствовало имени репозитория. Это необходимо, поскольку сайт будет обслуживаться по адресу `https://your-username.github.io/your-repo-name`, а не из корня.

Также желательно сгенерировать fallback-страницу `404.html`, которая заменит стандартную страницу 404 от GitHub Pages.

Пример конфигурации для GitHub Pages может выглядеть следующим образом:

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      fallback: '404.html'
    }),
    paths: {
      base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
    }
  }
};

export default config;
```

Вы можете использовать GitHub Actions для автоматического развёртывания сайта на GitHub Pages при каждом изменении. Ниже приведён пример сценария:


```yml
// .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: 'main'

jobs:
  build_site:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      # If you're using pnpm, add this step then change the commands and cache key below to use `pnpm`
      # - name: Install pnpm
      #   uses: pnpm/action-setup@v3
      #   with:
      #     version: 8

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
 node-version: 20
 cache: npm

      - name: Install dependencies
        run: npm install

      - name: build
        env:
 BASE_PATH: '/${{ github.event.repository.name }}'
        run: |
 npm run build

      - name: Upload Artifacts
        uses: actions/upload-pages-artifact@v3
        with:
 # this should match the `pages` option in your adapter-static options
 path: 'build/'

  deploy:
    needs: build_site
    runs-on: ubuntu-latest

    permissions:
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

Если вы не используете GitHub Actions для развёртывания сайта (например, вручную отправляете собранный сайт в отдельный репозиторий), добавьте пустой файл `.nojekyll` в каталог `static`, чтобы избежать вмешательства Jekyll.
