---
title: $derived
origin: https://svelte.dev/docs/svelte/$derived
sidebar:
  order: 2
---

Производное состояние объявляется с помощью руны `$derived`:

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
  {doubled}
</button>

<p>{count} вдвое больше — это {doubled}</p>
```

Выражение внутри `$derived(...)` должно быть свободно от побочных эффектов. Svelte не позволит изменения состояния (например, `count++`) внутри производных выражений.

Как и при использовании `$state`, вы можете пометить поля класса как `$derived`.

:::note
Код в компонентах Svelte выполняется только один раз при создании. Без руны `$derived` значение `doubled` сохраняло бы свое первоначальное значение, даже когда `count` изменяется.
:::

## `$derived.by`

Иногда вам нужно создать сложные производные, которые не помещаются в короткое выражение. В таких случаях вы можете использовать `$derived.by`, который принимает функцию в качестве аргумента.

```svelte
<script>
  let numbers = $state([1, 2, 3]);
  let total = $derived.by(() => {
    let total = 0;
    for (const n of numbers) {
      total += n;
    }
    return total;
  });
</script>

<button onclick={() => numbers.push(numbers.length + 1)}>
  {numbers.join(' + ')} = {total}
</button>
```

По сути, `$derived(expression)` эквивалентно `$derived.by(() => expression)`.

## Понимание зависимостей

Всё, что читается синхронно внутри выражения `$derived` (или тела функции `$derived.by`), считается _зависимостью_ производного состояния. Когда состояние изменяется, производное будет помечено как _грязное_ и пересчитано при следующем чтении.

Кроме того, если выражение содержит [`await`](/template-syntax/await-expressions), Svelte преобразует его так, что любое состояние _после_ `await` также отслеживается — другими словами, в подобном случае...

```js
let total = $derived(await a + b);
```

...отслеживаются и `a`, и `b`, даже если `b` читается только после того, как `a` разрешится, после первоначального выполнения. (Это не относится к `await` в функциях, вызываемых выражением, а только к самому выражению.)

Чтобы исключить часть состояния из обработки как зависимость, используйте [`untrack`](https://svelte.dev/docs/svelte/svelte#untrack).

## Переопределение производных значений

Производные выражения пересчитываются при изменении их зависимостей, но вы можете временно переопределить их значения, присвоив им новое значение (если они не объявлены с помощью `const`). Это может быть полезно для таких вещей, как _оптимистичный UI_, где значение вычисляется на основе «источника истины» (например, данных с сервера), но вы хотите сразу показать пользователю обратную связь:

```svelte
<script>
  let { post, like } = $props();

  let likes = $derived(post.likes);

  async function onclick() {
    // Немедленно увеличиваем счетчик `likes`...
    likes += 1;

    // и уведомляем сервер, который в конечном итоге обновит `post`
    try {
      await like();
    } catch {
      // Ошибка! Откатываем изменение
      likes -= 1;
    }
  }
</script>

<button {onclick}>🧡 {likes}</button>
```

:::note
До версии Svelte 5.25 производные значения были доступны только для чтения.
:::

## Производные значения и реактивность

В отличие от `$state`, который преобразует объекты и массивы в [глубоко реактивные прокси](/runes/state#глубокое-состояние), значения `$derived` остаются как есть. Например, [в таком случае](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE4VU22rjMBD9lUHd3aaQi9PdstS1A3t5XvpQ2Ic4D7I1iUUV2UjjNMX431eS7TRdSosxgjMzZ45mjt0yzffIYibvy0ojFJWqDKCQVBk2ZVup0LJ43TJ6rn2aBxw-FP2o67k9oCKP5dziW3hRaUJNjoYltjCyplWmM1JIIAn3FlL4ZIkTTtYez6jtj4w8WwyXv9GiIXiQxLVs9pfTMR7EuoSLIuLFbX7Z4930bZo_nBrD1bs834tlfvsBz9_SyX6PZXu9XaL4gOWn4sXjeyzftv4ZWfyxubpzxzg6LfD4MrooxELEosKCUPigQCMPKCZh0OtQE1iSxcsmdHuBvCiHZXALLXiN08EL3RRkaJ_kDVGle0HcSD5TPEeVtj67O4Nrg9aiSNtBY5oODJkrL5QsHtN2cgXp6nSJMWzpWWGasdlsGEMbzi5jPr5KFr0Ep7pdeM2-TCelCddIhDxAobi1jqF3cMaC1RKp64bAW9iFAmXGIHfd4wNXDabtOLN53w8W53VvJoZLh7xk4Rr3CoL-UNoLhWHrT1JQGcM17u96oES5K-kc2XOzkzqGCKL5De79OUTyyrg1zgwXsrEx3ESfx4Bz0M5UjVMHB24mw9SuXtXFoN13fYKOM1tyUT3FbvbWmSWCZX2Er-41u5xPoml45svRahl9Wb9aasbINJixDZwcPTbyTLZSUsAvrg_cPuCR7s782_WU8343Y72Qtlb8OYatwuOQvuN13M_hJKNfxann1v1U_B1KZ_D_mzhzhz24fw85CSz2irtN9w9HshBK7AQAAA==)...

```js
let items = $state([ /*...*/ ]);

let index = $state(0);
let selected = $derived(items[index]);
```

...вы можете изменять (или использовать `bind:` для) свойства `selected`, и это повлияет на базовый массив `items`. Если бы `items` _не_ был глубоко реактивным, изменение `selected` не имело бы эффекта.

## Деструктуризация

Если вы используете деструктуризацию с объявлением `$derived`, все полученные переменные будут реактивными — это...

```js
let { a, b, c } = $derived(stuff());
```

...примерно эквивалентно этому:

```js
let _stuff = $derived(stuff());
let a = $derived(_stuff.a);
let b = $derived(_stuff.b);
let c = $derived(_stuff.c);
```

## Обновление данных

Svelte использует механизм, известный как _реактивность с пуш-пулом_ — когда состояние изменяется, всё, что связано с этим состоянием (прямо или косвенно), немедленно получает уведомление об изменении (пуш), но производные значения не пересчитываются, пока они не будут фактически запрошены (пул).

Если новое значение производного совпадает с предыдущим по ссылке, обновления для зависимых компонентов будут пропущены. То есть, Svelte обновит текст внутри кнопки только тогда, когда изменится `large`, а не `count`, даже несмотря на то, что `large` зависит от `count`:

```svelte
<script>
  let count = $state(0);
  let large = $derived(count > 10);
</script>

<button onclick={() => count++}>
  {large}
</button>
```
