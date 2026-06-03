---
title: Поддержка браузеров
origin: https://svelte.dev/docs/svelte/browser-support
sidebar:
  order: 3
---

Таблица ниже показывает минимальные версии браузеров, в которых Svelte должен работать. Эти требования получены на основе API браузеров, которые используются во внутреннем коде Svelte.

| Браузер | Минимальная версия |
| - | - |
| Chrome/Edge | 87 |
| Firefox | 83 |
| Safari | 14 |
| Opera | 73 |
| Opera (Android) | 62 |
| Samsung Internet | 14.0 |
| Android WebView | 87 |
| Internet Explorer | не поддерживается |

:::note
Это соответствует цели <a href="https://web-platform-dx.github.io/baseline/">Baseline</a> 2020 года.
:::

Эта таблица охватывает только сам Svelte. Она не включает [SvelteKit](/kit/getting-started/introduction/), другие библиотеки Svelte или ваш собственный код.

## Исключения

Некоторые функции Svelte требуют более высокой минимальной версии браузера. Вам следует учитывать следующую таблицу только в том случае, если вы используете эти конкретные функции.

| Функция | Chrome/Edge | Firefox | Safari |
| - | - | - | - |
| [`$state.snapshot`](/runes/state/#statesnapshot) | 98 | 94 | 15.4 |
| [`bind:devicePixelContentBoxSize`](/template-syntax/bind/#размеры) | <span style="color: var(--sk-fg-4)">—</span> | 93 | не поддерживается |
| [`flip` из `svelte/animate`](https://svelte.dev/docs/svelte/svelte-animate#flip) | <span style="color: var(--sk-fg-4)">—</span> | 126 | <span style="color: var(--sk-fg-4)">—</span> |
