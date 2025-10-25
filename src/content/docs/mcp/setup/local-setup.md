---
title: Локальная настройка
origin: https://svelte.dev/docs/mcp/local-setup
sidebar:
  order: 0
---

Локальная (или stdio) версия сервера MCP доступна через npm-пакет [`@sveltejs/mcp`](https://www.npmjs.com/package/@sveltejs/mcp). Вы можете либо установить его глобально и затем сослаться на него в вашей конфигурации, либо запустить с помощью `npx`:

```bash
npx -y @sveltejs/mcp
```

Вот как настроить его в некоторых распространённых клиентах MCP:

## Claude Code

Чтобы включить локальную версию MCP в Claude Code, просто выполните следующую команду:

```bash
claude mcp add -t stdio -s [scope] svelte -- npx -y @sveltejs/mcp
```

Поле `[scope]` должно быть `user`, `project` или `local`.

## Claude Desktop

В разделе Settings > Developer нажмите на Edit Config. Это откроет папку с файлом `claude_desktop_config.json`. Отредактируйте файл, чтобы включить следующую конфигурацию:

```json
{
  "mcpServers": {
    "svelte": {
      "command": "npx",
      "args": ["-y", "@sveltejs/mcp"]
    }
  }
}
```

## Codex CLI

Добавьте следующее в ваш файл `config.toml` (который по умолчанию находится в `~/.codex/config.toml`; обратитесь к [документации по конфигурации](https://github.com/openai/codex/blob/main/docs/config.md) для более продвинутых настроек):

```toml
[mcp_servers.svelte]
command = "npx"
args = ["-y", "@sveltejs/mcp"]
```

## Gemini CLI

Чтобы включить локальную версию MCP в Gemini CLI, просто выполните следующую команду:

```bash
gemini mcp add -t stdio -s [scope] svelte npx -y @sveltejs/mcp
```

Поле `[scope]` должно быть `user`, `project` или `local`.

## OpenCode

Выполните команду:

```bash
opencode mcp add
```

и следуйте инструкциям, выбрав 'Local' в запросе 'Select MCP server type':

```bash
opencode mcp add

┌  Add MCP server
│
◇  Enter MCP server name
│  svelte
│
◇  Select MCP server type
│  Local
│
◆  Enter command to run
│  npx -y @sveltejs/mcp
```

## VS Code

- Откройте палитру команд
- Выберите «MCP: Добавить...»
- Выберите «Команда (stdio)»
- Введите `npx -y @sveltejs/mcp` в поле ввода и нажмите `Enter`
- Когда будет запрошен ввод имени, введите `svelte`
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
      "command": "npx",
      "args": ["-y", "@sveltejs/mcp"]
    }
  }
}
```

## Zed

- Откройте палитру команд
- Найдите и выберите «agent:open settings»
- В панели настроек найдите `Model Context Protocol (MCP) Servers`
- Нажмите на «Add Server»
- Выберите: «Add Custom Server»

Это откроет всплывающее окно с конфигурацией сервера MCP, где вы можете добавить следующую конфигурацию:

```json
{
  "svelte": {
    "command": "npx",
    "args": ["-y", "@sveltejs/mcp"]
  }
}
```

## Другие клиенты

Если среди перечисленных нет клиента MCP, который вы используете, обратитесь к документации этого клиента по настройке серверов `stdio` и укажите `npx` в качестве команды, а `-y @sveltejs/mcp` — в качестве аргументов.
