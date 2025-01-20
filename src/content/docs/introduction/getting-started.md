---
title: Первые шаги
---

Мы рекомендуем использовать [SvelteKit](https://svelte.dev/docs/kit), официальный фреймворк для разработки приложений от команды Svelte, основанный на [Vite](https://vite.dev/):

```bash
npx sv create myapp
cd myapp
npm install
npm run dev
```

Не беспокойтесь, если вы ещё не знакомы с Svelte! Вы можете игнорировать все замечательные функции, которые SvelteKit предлагает на данный момент, и вернуться к ним позже.

## Альтернативы SvelteKit

Вы также можете использовать Svelte напрямую с Vite, запустив команду `npm create vite@latest` и выбрав опцию `svelte`. В этом случае команда `npm run build` сгенерирует файлы HTML, JS и CSS в директории `dist`, используя [vite-plugin-svelte](https://github.com/sveltejs/vite-plugin-svelte). В большинстве случаев вам, вероятно, потребуется [выбрать библиотеку маршрутизации](/misc/faq#есть-ли-роутер).

Существуют также плагины для [Rollup](https://github.com/sveltejs/rollup-plugin-svelte), [Webpack](https://github.com/sveltejs/svelte-loader) [и нескольких других](https://sveltesociety.dev/packages?category=build-plugins), но мы рекомендуем Vite.

## Инструменты для редакторов

Команда Svelte поддерживает [расширение для VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode), а также существуют интеграции с различными другими [редакторами](https://sveltesociety.dev/resources#editor-support) и инструментами.

Вы также можете проверить свой код из командной строки, используя [sv check](https://github.com/sveltejs/cli).

## Получение помощи

Не стесняйтесь просить помощи в [чате Discord](https://svelte.dev/chat)! Вы также можете найти ответы на [Stack Overflow](https://stackoverflow.com/questions/tagged/svelte).
