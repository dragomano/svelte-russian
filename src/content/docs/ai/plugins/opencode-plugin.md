---
title: OpenCode
origin: https://svelte.dev/docs/ai/opencode-plugin
sidebar:
  order: 1
---

OpenCode имеет [систему плагинов](https://opencode.ai/docs/plugins/), которая позволяет разработчикам программно добавлять MCP-серверы, агенты и команды. У Svelte есть плагин для OpenCode, опубликованный под именем `@sveltejs/opencode`.

## Установка

Чтобы установить плагин, отредактируйте [конфигурацию OpenCode](https://opencode.ai/docs/config/) (глобальную или локальную), добавив `@sveltejs/opencode` в список плагинов.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@sveltejs/opencode"]
}
```

Вот и всё! Теперь у вас настроены Svelte [MCP-сервер](/ai/mcp/overview), [навыки](/ai/skills) и [субагент](/ai/subagents) `svelte-file-editor`.

## Настройка

По умолчанию всё включено, но вы можете настроить плагин, добавив файл конфигурации:

- локально, в `.opencode/svelte.json`
- глобально, в `~/.config/opencode/svelte.json` (или, если задана переменная окружения, в `$OPENCODE_CONFIG_DIR/svelte.json`)

```json
{
  "$schema": "https://svelte.dev/opencode/schema.json",
  "mcp": {
    "type": "remote", // или "local" — по умолчанию remote
    "enabled": true
  },
  "subagent": {
    "enabled": true,
    "agents": {
      "svelte-file-editor": {
        "model": "<другая-модель>", // по умолчанию совпадает с основным агентом
        "temperature": 1, // по умолчанию не задано
        "top_p": 0.7, // по умолчанию не задано
        "maxSteps": 20 // по умолчанию без ограничений
      }
    }
  },
  "skills": {
    // может быть `true` или массивом навыков для включения
    // например ["svelte-core-bestpractices"]
    "enabled": true
  },
  "instructions": {
    "enabled": true
  }
}
```
