---
title: Введение
origin: https://svelte.dev/docs/ai/mcp
sidebar:
  order: 0
---

Сервер Svelte [MCP](https://modelcontextprotocol.io/docs/getting-started/intro) может помочь вашей LLM или агенту выбранной модели писать лучший код на Svelte. Он работает, предоставляя документацию, релевантную текущей задаче, и статически анализируя сгенерированный код, чтобы предлагать исправления и лучшие практики.

## Настройка

Настройка варьируется в зависимости от предпочитаемой версии MCP — удалённой или локальной — и выбранного клиента MCP (например, Claude Code, Codex CLI или GitHub Copilot):

- [локальная настройка](/ai/mcp/local-setup) с использованием `@sveltejs/mcp`
- [удалённая настройка](/ai/mcp/remote-setup) с использованием `https://mcp.svelte.dev/mcp`

Если ваш клиент MCP поддерживает это, мы также рекомендуем использовать промпт [svelte-task](/ai/mcp/prompts#svelte-task), чтобы указать LLM на лучший способ использования сервера MCP.
