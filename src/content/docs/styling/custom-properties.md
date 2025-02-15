---
title: Пользовательские свойства
origin: https://svelte.dev/docs/svelte/custom-properties
sidebar:
  order: 2
---

Вы можете передавать пользовательские CSS-свойства — как статические, так и динамические — в компоненты:

```svelte
<Slider
  bind:value
  min={0}
  max={100}
  --track-color="black"
  --thumb-color="rgb({r} {g} {b})"
/>
```

Приведённый выше код по сути преобразуется в следующий:

```svelte
<svelte-css-wrapper style="display: contents; --track-color: black; --thumb-color: rgb({r} {g} {b})">
  <Slider
    bind:value
    min={0}
    max={100}
  />
</svelte-css-wrapper>
```

Для элемента SVG вместо этого будет использоваться `<g>`:

```svelte
<g style="--track-color: black; --thumb-color: rgb({r} {g} {b})">
  <Slider
    bind:value
    min={0}
    max={100}
  />
</g>
```

Внутри компонента мы можем читать эти пользовательские свойства (и предоставлять значения по умолчанию) с помощью [`var(...)`](https://developer.mozilla.org/ru/docs/Web/CSS/Using_CSS_custom_properties):

```svelte
<style>
  .track {
    background: var(--track-color, #aaa);
  }

  .thumb {
    background: var(--thumb-color, blue);
  }
</style>
```

Вам не _обязательно_ указывать значения непосредственно на компоненте; пока пользовательские свойства определены на родительском элементе, компонент может их использовать. Обычно пользовательские свойства определяются на элементе `:root` в глобальном стилевом файле, чтобы они применялись ко всему вашему приложению.

:::note
Хотя дополнительный элемент не повлияет на макет, он _повлияет_ на любые CSS-селекторы, которые (например) используют комбинатор `>` для нацеливания на элемент, находящийся непосредственно внутри контейнера компонента.
:::
