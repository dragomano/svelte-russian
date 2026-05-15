---
title: Иконки
origin: https://svelte.dev/docs/kit/icons
sidebar:
  order: 2
---

## CSS

Отличный способ использовать иконки — определять их исключительно через CSS. Iconify предлагает поддержку [многих популярных наборов иконок](https://icon-sets.iconify.design/), которые [можно подключать через CSS](https://iconify.design/docs/usage/css/). Этот метод также можно использовать с популярными CSS-фреймворками, применяя плагин Iconify для [Tailwind CSS](https://iconify.design/docs/usage/css/tailwind/) или [UnoCSS](https://iconify.design/docs/usage/css/unocss/). В отличие от библиотек на основе Svelte-компонентов, здесь не требуется импортировать каждую иконку в ваш файл `.svelte`.

## Svelte

Существует множество [библиотек иконок для Svelte](https://svelte.dev/packages#icons). При выборе библиотеки иконок рекомендуется избегать тех, которые предоставляют отдельный `.svelte`-файл для каждой иконки, так как такие библиотеки могут содержать тысячи `.svelte`-файлов, что сильно замедляет [оптимизацию зависимостей в Vite](https://vite-docs.ru/guide/dep-pre-bundling). Это особенно проблематично, если иконки импортируются как через общий импорт, так и через подпути [как описано в FAQ `vite-plugin-svelte`](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md#what-is-going-on-with-vite-and-pre-bundling-dependencies).
