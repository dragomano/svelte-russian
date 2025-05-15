---
title: "{@debug ...}"
origin: https://svelte.dev/docs/svelte/@debug
sidebar:
  order: 10
---

Тег `{@debug ...}` предлагает альтернативу `console.log(...)`. Он регистрирует значения определённых переменных каждый раз, когда они изменяются, и приостанавливает выполнение кода, если у вас открыты инструменты разработчика.

```svelte
<script>
	let user = {
		firstname: 'Ада',
		lastname: 'Лавлейс'
	};
</script>

{@debug user}

<h1>Привет, {user.firstname}!</h1>
```

`{@debug ...}` принимает список имён переменных, разделённых запятыми (не произвольные выражения).

```svelte
<!-- Компилируется -->
{@debug user}
{@debug user1, user2, user3}

<!-- Не скомпилируется -->
{@debug user.firstname}
{@debug myArray[0]}
{@debug !isReady}
{@debug typeof user === 'object'}
```

Тег `{@debug}` без аргументов вставляет оператор `debugger`, который срабатывает при _любом_ изменении состояния, в отличие от указанных переменных.
