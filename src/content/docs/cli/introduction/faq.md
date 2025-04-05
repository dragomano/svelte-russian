---
title: Часто задаваемые вопросы
origin: https://svelte.dev/docs/cli/faq
sidebar:
  order: 1
---

## Как запустить утилиту `sv`?

Команда для запуска `sv` немного отличается в зависимости от менеджера пакетов. Вот список наиболее распространённых вариантов:

- **npm**: `npx sv create`
- **pnpm**: `pnpx sv create` или `pnpm dlx sv create`
- **Bun**: `bunx sv create`
- **Deno**: `deno run npm:sv create`
- **Yarn**: `yarn dlx sv create`

## `npx sv` не работает

Некоторые менеджеры пакетов по умолчанию пытаются запускать локально установленные инструменты вместо загрузки и выполнения пакетов из реестра. Эта проблема чаще всего возникает с `npm` и `yarn`. Обычно это приводит к ошибке или выглядит так, будто команда не выполнилась.

Вот список известных проблем с возможными решениями, с которыми сталкивались пользователи:

- [`npx sv create` ничего не делает](https://github.com/sveltejs/cli/issues/472)
- [Имя команды `sv` конфликтует с `runit`](https://github.com/sveltejs/cli/issues/259)
- [`sv` в Windows PowerShell конфликтует с `Set-Variable`](https://github.com/sveltejs/cli/issues/317)
