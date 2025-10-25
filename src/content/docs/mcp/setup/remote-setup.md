---
title: Удалённая настройка
origin: https://svelte.dev/docs/mcp/remote-setup
sidebar:
  order: 1
---

Удалённая версия сервера MCP доступна по адресу `https://mcp.svelte.dev/mcp`.

Вот как настроить её в некоторых распространённых клиентах MCP:

## Claude Code

Чтобы включить удалённую версию MCP в Claude Code, просто выполните следующую команду:

```bash
claude mcp add -t http -s [scope] svelte https://mcp.svelte.dev/mcp
```

Вы можете выбрать предпочитаемую область видимости — `scope` (она должна быть `user`, `project` или `local`) и `name`.

## Claude Desktop

- Откройте Settings > Connectors
- Нажмите на Add Custom Connector
- Когда будет запрошен ввод имени, введите `svelte`
- В поле ввода Remote MCP server URL укажите `https://mcp.svelte.dev/mcp`
- Нажмите Add

## Codex CLI

Добавьте следующее в ваш `config.toml` (который по умолчанию находится в `~/.codex/config.toml`; обратитесь к [документации по конфигурации](https://github.com/openai/codex/blob/main/docs/config.md) для более продвинутых настроек):

```toml
experimental_use_rmcp_client = true
[mcp_servers.svelte]
url = "https://mcp.svelte.dev/mcp"
```

## Gemini CLI

Чтобы использовать удалённый сервер MCP с Gemini CLI, просто выполните следующую команду:

```bash
gemini mcp add -t http -s [scope] svelte https://mcp.svelte.dev/mcp
```

Поле `[scope]` должно быть `user`, `project` или `local`.

## OpenCode

Выполните команду:

```bash
opencode mcp add
```

и следуйте инструкциям, выбрав 'Remote' в запросе 'Select MCP server type':

```bash
opencode mcp add

┌  Add MCP server
│
◇  Enter MCP server name
│  svelte
│
◇  Select MCP server type
│  Remote
│
◇  Enter MCP server URL
│  https://mcp.svelte.dev/mcp
```

## VS Code

- Откройте палитру команд
- Выберите «MCP: Добавить сервер...»
- Выберите «HTTP (HTTP или события, отправляемые сервером)»
- Введите `https://mcp.svelte.dev/mcp` в поле ввода и нажмите `Enter`
- Введите предпочитаемое имя
- Выберите, хотите ли вы добавить его как глобальный (`Global`) или сервер MCP для рабочего пространства (`Workspace`)

## Cursor

- Откройте палитру команд
- Выберите «View: Open MCP Settings»
- Нажмите на «Add custom MCP»

Это откроет файл с вашими серверами MCP, где вы можете добавить следующую конфигурацию:

```json
{
  "mcpServers": {
    "svelte": {
      "url": "https://mcp.svelte.dev/mcp"
    }
  }
}
```

## GitHub Coding Agent

- Откройте ваш репозиторий в GitHub
- Перейдите в Settings
- Откройте Copilot > Coding agent
- Отредактируйте конфигурацию MCP

```json
{
  "mcpServers": {
    "svelte": {
      "type": "http",
      "url": "https://mcp.svelte.dev/mcp",
      "tools": ["*"]
    }
  }
}
```

- Нажмите _Save MCP configuration_

## Другие клиенты

Если среди перечисленных нет клиента MCP, который вы используете, обратитесь к документации этого клиента по настройке `remote` серверов и укажите `https://mcp.svelte.dev/mcp` в качестве URL.
