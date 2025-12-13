---
title: "{#each ...}"
origin: https://svelte.dev/docs/svelte/each
sidebar:
  order: 2
---

```svelte
{#each expression as name}...{/each}
```

```svelte
{#each expression as name, index}...{/each}
```

Итерацию по значениям можно выполнять с помощью блока `each`. Значения, о которых идёт речь, могут быть массивами, массивоподобными объектами (т. е. любыми объектами со свойством `length`) или итерируемыми объектами, такими как `Map` и `Set` — иными словами, всем тем, что можно использовать с `Array.from`.

Если значение равно `null` или `undefined`, оно обрабатывается так же, как пустой массив (что приведёт к рендерингу [блоков `else`](#блоки-else), где это применимо).

```svelte
<h1>Список покупок</h1>
<ul>
  {#each items as item}
    <li>{item.name} x {item.qty}</li>
  {/each}
</ul>
```

Блок `each` также может указывать _индекс_, аналогичный второму аргументу в функции обратного вызова `array.map(...)`:

```svelte
{#each items as item, i}
  <li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

## Блоки `each` с привязкой по ключам

```svelte
{#each expression as name (key)}...{/each}
```

```svelte
{#each expression as name, index (key)}...{/each}
```

Если предоставлено выражение _key_, которое должно уникально идентифицировать каждый элемент списка, Svelte использует его для выполнения сравнения списка при изменении данных, а не добавления или удаления элементов в конце. Ключ может быть любым объектом, но рекомендуется использовать строки и числа, так как они позволяют сохранять идентичность, когда сами объекты изменяются:

```svelte
{#each items as item (item.id)}
  <li>{item.name} x {item.qty}</li>
{/each}

<!-- или с дополнительным значением индекса -->
{#each items as item, i (item.id)}
  <li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

Вы можете свободно использовать деструктуризацию и паттерны rest в блоках `each`:

```svelte
{#each items as { id, name, qty }, i (id)}
  <li>{i + 1}: {name} x {qty}</li>
{/each}

{#each objects as { id, ...rest }}
  <li><span>{id}</span><MyComponent {...rest} /></li>
{/each}

{#each items as [id, ...rest]}
  <li><span>{id}</span><MyComponent values={rest} /></li>
{/each}
```

## Блоки `each` без элемента

```svelte
{#each expression}...{/each}
```

```svelte
{#each expression, index}...{/each}
```

Если вы хотите просто отрендерить что-то `n` раз, вы можете опустить часть `as` ([демонстрация](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE3WR0W7CMAxFf8XKNAk0WsSeUEaRpn3Guoc0MbQiJFHiMlDVf18SOrZJ48259_jaVgZmxBEZZ28thgCNFV6xBdt1GgPj7wOji0t2EqI-wa_OleGEmpLWiID_6dIaQkMxhm1UdwKpRQhVzWSaVORJNdvWpqbhAYVsYQCNZk8thzWMC_DCHMZk3wPSThNQ088I3mghD9UwSwHwlLE5PMIzVFUFq3G7WUZ2OyUvU3JOuZU332wCXTRmtPy1NgzXZtUFp8WFw9536uWqpbIgPEaDsJBW90cTOHh0KGi2XsBq5-cT6-3nPauxXqHnsHJnCFZ3CvJVkyuCQ0mFF9TZyCQ162WGvteLKfG197Y3iv_pz_fmS68Hxt8iPBPj5HscP8YvCNX7uhYCAAA=)):

```svelte
<div class="chess-board">
  {#each { length: 8 }, rank}
    {#each { length: 8 }, file}
      <div class:black={(rank + file) % 2 === 1}></div>
    {/each}
  {/each}
</div>
```

## Блоки `else`

```svelte
{#each expression as name}...{:else}...{/each}
```

Блок `each` также может иметь часть `{:else}`, которая рендерится, если список пуст:

```svelte
{#each todos as todo}
  <p>{todo.text}</p>
{:else}
  <p>Сегодня задач нет!</p>
{/each}
```
