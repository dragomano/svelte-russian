---
title: "<svelte:boundary>"
origin: https://svelte.dev/docs/svelte/svelte-boundary
sidebar:
  order: 0
---

```svelte
<svelte:boundary onerror={handler}>...</svelte:boundary>
```

:::note
Эта функция была добавлена в 5.3.0
:::

Границы позволяют «отделить» части вашего приложения, чтобы вы могли:

- **отображать интерфейс**, который должен показываться во время первоначального выполнения [`await`](/template-syntax/await-expressions)-выражений
- **обрабатывать ошибки**, возникающие при рендеринге или выполнении эффектов, и предоставлять интерфейс для отображения при возникновении ошибки

Если граница обрабатывает ошибку (с помощью сниппета `failed` или обработчика `onerror`, или обоих), её текущее содержимое будет удалено.

:::note
Ошибки, возникающие вне процесса рендеринга (например, в обработчиках событий, после `setTimeout` или асинхронных операциях), _не_ перехватываются границами обработки ошибок.
:::

## Параметры

Чтобы граница выполняла свою функцию, должен быть предоставлен хотя бы один из следующих элементов.

### `pending`

Этот сниппет будет показан при первом создании границы и останется видимым до тех пор, пока все выражения [`await`](/template-syntax/await-expressions) внутри границы не разрешатся ([демонстрация](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE21QQW6DQAz8ytY9BKQVpFdKkPqDHnorPWzAaSwt3tWugUaIv1eE0KpKD5as8YxnNBOw6RAKKOOAVrA4up5bEy6VGknOyiO3xJ8qMnmPAhpOZDFC8T6BXPyiXADQ258X77P1FWg4moj_4Y1jQZZ49W0CealqruXUcyPkWLVozQXbZDC2R606spYiNo7bqA7qab_fp2paFLUElD6wYhzVa3AdRUySgNHZAVN1qDZaLRHljTp0vSTJ9XJjrSbpX5f0eZXN6zLXXOa_QfmurIVU-moyoyH5ib87o7XuYZfOZe6vnGWmx1uZW7lJOq9upa-sMwuUZdkmmfIbfQ1xZwwaBL8ECgk9zh8axJAdiVsoTsZGnL8Bg4tX_OMBAAA=)):

```svelte
<svelte:boundary>
  <p>{await delayed('привет!')}</p>

  {#snippet pending()}
    <p>загрузка...</p>
  {/snippet}
</svelte:boundary>
```

### `failed`

Если предусмотрен сниппет `failed`, он будет отображаться при возникновении ошибки внутри границы, получая доступ к объекту `error` и функции `reset` для повторного создания содержимого ([демонстрация](https://svelte.dev/playground/hello-world#H4sIAAAAAAAAE3VRy26DMBD8lS2tFCIh6JkAUlWp39Cq9EBg06CAbdlLArL87zWGKk8ORnhmd3ZnrD1WtOjFXqKO2BDGW96xqpBD5gXerm5QefG39mgQY9EIWHxueRMinLosti0UPsJLzggZKTeilLWgLGc51a3gkuCjKQ7DO7cXZotgJ3kLqzC6hmex1SZnSXTWYHcrj8LJjWTk0PHoZ8VqIdCOKayPykcpuQxAokJaG1dGybYj4gw4K5u6PKTasSbjXKgnIDlA8VvUdo-pzonraBY2bsH7HAl78mKSHZpgIcuHjq9jXSpZSLixRlveKYQUXhQVhL6GPobXAAb7BbNeyvNUs4qfRg3OnELLj5hqH9eQZqCnoBwR9lYcQxuVXeBzc8kMF8yXY4yNJ5oGiUzP_aaf_waTRGJib5_Ad3P_vbCuaYxzeNpbU0eUMPAOKh7Yw1YErgtoXyuYlPLzc10_xo_5A91zkQL_AgAA)):

```svelte
<svelte:boundary>
  <FlakyComponent />

  {#snippet failed(error, reset)}
    <button onclick={reset}>упс! попробовать ещё раз</button>
  {/snippet}
</svelte:boundary>
```

:::note
Как и в случае со [сниппетами, передаваемыми в компоненты](/template-syntax/snippet/#передача-сниппетов-в-компоненты), сниппет `failed` может быть передан явно как свойство...

```svelte
<svelte:boundary {failed}>...</svelte:boundary>
```

...или неявно, объявив его непосредственно внутри границы, как в примере выше.
:::

### `onerror`

Если предоставлена функция `onerror`, она будет вызвана с теми же двумя аргументами: `error` и `reset`. Это полезно для отслеживания ошибок с помощью сервиса отчётов об ошибках...

```svelte
<svelte:boundary onerror={(e) => report(e)}>
  ...
</svelte:boundary>
```

...или для использования `error` и `reset` за пределами самой границы:

```svelte
<script>
  let error = $state(null);
  let reset = $state(() => {});

  function onerror(e, r) {
    error = e;
    reset = r;
  }
</script>

<svelte:boundary {onerror}>
  <FlakyComponent />
</svelte:boundary>

{#if error}
  <button onclick={() => {
    error = null;
    reset();
  }}>
    упс! попробовать ещё раз
  </button>
{/if}
```

Если ошибка происходит внутри функции `onerror` (или если вы повторно выбрасываете ошибку), она будет обработана родительской границей, если таковая существует.

## Использование `transformError`

По умолчанию границы ошибок никак не влияют на сервер — если во время рендеринга возникает ошибка, весь рендеринг завершится неудачей.

Начиная с версии 5.51 вы можете управлять этим поведением для границ ошибок с помощью сниппета `failed`, вызвав функцию [`render(...)`](/runtime/imperative-component-api/#render) с параметром `transformError`.

:::note
Если вы используете Svelte через фреймворк, такой как SvelteKit, то, скорее всего, у вас нет прямого доступа к вызову `render(...)` — фреймворк должен настроить `transformError` за вас. SvelteKit добавит поддержку этого в ближайшем будущем через хук [`handleError`](/kit/advanced/hooks/#handleerror).
:::

Функция `transformError` должна возвращать объект, который можно сериализовать в JSON. Этот объект будет использован для рендеринга сниппета `failed`. Он будет сериализован и применён для гидратации сниппета в браузере:

```js
import { render } from 'svelte/server';
import App from './App.svelte';

const { head, body } = await render(App, {
  transformError: (error) => {
    // логируем оригинальную ошибку вместе со стек-трейсом...
    console.error(error);

    // ...и возвращаем очищенную, удобную для пользователя ошибку,
    // которая будет отображена в сниппете `failed`
    return {
      message: 'An error occurred!'
    };
  };
});
```

Если `transformError` выбросит исключение (или перевыбросит ошибку), то вызов `render(...)` в целом завершится неудачей с этой ошибкой.

:::note
Ошибки, возникающие во время серверного рендеринга, могут содержать конфиденциальную информацию в полях `message` и `stack`. Рекомендуется очищать (редактировать) эти данные, а не отправлять их в браузер в неизменённом виде.
:::

Если у границы ошибок задан обработчик `onerror`, он будет вызван во время гидратации с десериализованным объектом ошибки.

Функции [`mount`](/runtime/imperative-component-api/#mount) и [`hydrate`](/runtime/imperative-component-api/#hydrate) также принимают опцию `transformError`, которая по умолчанию является функцией идентичности (возвращает переданное значение без изменений). Как и в случае с `render`, эта функция преобразует ошибку времени рендеринга перед тем, как она будет передана в сниппет `failed` или обработчик `onerror`.
