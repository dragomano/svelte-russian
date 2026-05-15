---
title: Cursor
origin: https://svelte.dev/docs/ai/cursor-plugin
sidebar:
  order: 2
---

Cursor имеет [систему плагинов](https://cursor.com/ru/docs/plugins), которая может объединять правила, навыки, агенты, команды, MCP-серверы и хуки.

Плагин Svelte предоставляет удалённый MCP-сервер Svelte, [навыки](/ai/skills) для Cursor, всегда активное правило, которое объясняет модели, как правильно использовать MCP-инструменты Svelte, и субагент `svelte-file-editor` для работы с файлами `.svelte` и модулями `.svelte.ts`/`.svelte.js`. Исходный код доступен в репозитории [`sveltejs/ai-tools`](https://github.com/sveltejs/ai-tools/tree/main/plugins/cursor/svelte).

## Установка

Установите плагин из [маркетплейса Cursor](https://cursor.com/marketplace/svelte) следующей командой:

```
/add-plugin svelte
```

Плагины можно устанавливать как для текущего проекта, так и на уровне пользователя.

После установки Cursor автоматически обнаружит компоненты плагина:

- MCP-сервер Svelte добавляется из файла `.mcp.json` плагина
- правила и навыки появляются в интерфейсе правил Cursor
- агент `svelte-file-editor` становится доступен в чате

:::note
Cursor CLI пока не поддерживает плагины. Поддержка плагинов в [облачных агентах](https://cursor.com/ru/docs/cloud-agent) ограничена MCP-серверами.
:::
