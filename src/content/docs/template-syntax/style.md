---
title: "style:"
origin: https://svelte.dev/docs/svelte/style
sidebar:
  order: 16
---

Директива `style:` предоставляет сокращенный способ установки нескольких стилей на элемент.

```svelte
<!-- Эти выражения эквивалентны -->
<div style:color="red">...</div>
<div style="color: red;">...</div>
```

Значение может содержать произвольные выражения:

```svelte
<div style:color={myColor}>...</div>
```

Допускается сокращённая форма:

```svelte
<div style:color>...</div>
```

На одном элементе можно установить несколько стилей:

```svelte
<div style:color style:width="12rem" style:background-color={darkMode ? 'black' : 'white'}>...</div>
```

Чтобы пометить стиль как важный, используйте модификатор `|important`:

```svelte
<div style:color|important="red">...</div>
```

Когда директивы `style:` комбинируются с атрибутами `style`, директивы будут иметь приоритет — даже над свойствами с `!important`:

```svelte
<div style:color="red" style="color: blue">Это будет красным</div>
<div style:color="red" style="color: blue !important">Это всё равно будет красным</div>
```
