---
title: "{@html ...}"
origin: https://svelte.dev/docs/svelte/@html
sidebar:
  order: 7
---

Чтобы вставить необработанный HTML в ваш компонент, используйте тег `{@html ...}`:

```svelte
<article>
  {@html content}
</article>
```

:::note Убедитесь, что вы либо экранируете переданную строку, либо заполняете её только значениями, которые находятся под вашим контролем, чтобы предотвратить [атаки XSS](https://owasp.org/www-community/attacks/xss/). Никогда не отображайте неочищенный контент.
:::

Выражение должно представлять собой корректный самостоятельный HTML — это не сработает, так как `</div>` не является допустимым HTML:

```svelte
{@html '<div>'}content{@html '</div>'}
```

Кроме того, это не скомпилирует код Svelte.

## Стилизация

Содержимое, отрендеренное таким образом, является «невидимым» для Svelte и, следовательно, не будет получать [ограниченные стили](/styling/scoped-styles). Другими словами, это не сработает, и стили для `a` и `img` будут считаться неиспользуемыми:

```svelte
<article>
  {@html content}
</article>

<style>
  article {
    a { color: hotpink }
    img { width: 100% }
  }
</style>
```

Вместо этого используйте модификатор `:global`, чтобы нацелиться на всё внутри `<article>`:

```svelte ":global"
<style>
  article :global {
    a { color: hotpink }
    img { width: 100% }
  }
</style>
```
