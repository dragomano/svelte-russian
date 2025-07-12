---
title: Развёртывания с нулевой конфигурацией
origin: https://svelte.dev/docs/kit/adapter-auto
sidebar:
  order: 2
---

При создании нового проекта SvelteKit с помощью команды `npx sv create` по умолчанию устанавливается [`adapter-auto`](https://github.com/sveltejs/kit/tree/main/packages/adapter-auto). Этот адаптер автоматически устанавливает и использует подходящий адаптер для поддерживаемых сред при развёртывании:

- [`@sveltejs/adapter-cloudflare`](/kit/build-and-deploy/adapter-cloudflare) для [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [`@sveltejs/adapter-netlify`](/kit/build-and-deploy/adapter-netlify) для [Netlify](https://netlify.com/)
- [`@sveltejs/adapter-vercel`](/kit/build-and-deploy/adapter-vercel) для [Vercel](https://vercel.com/)
- [`svelte-adapter-azure-swa`](https://github.com/geoffrich/svelte-adapter-azure-swa) для [Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [`svelte-kit-sst`](https://github.com/sst/v2/tree/master/packages/svelte-kit-sst) для [AWS через SST](https://sst.dev/docs/start/aws/svelte)
- [`@sveltejs/adapter-node`](/kit/build-and-deploy/adapter-node) для [Google Cloud Run](https://cloud.google.com/run)

Рекомендуется установить соответствующий адаптер в `devDependencies` после выбора целевой среды, так как это добавит адаптер в ваш файл блокировки зависимостей и немного сократит время установки на CI.

## Конфигурация, специфичная для среды

Для добавления параметров конфигурации, таких как `{ edge: true }` в [`adapter-vercel`](/kit/build-and-deploy/adapter-vercel) и [`adapter-netlify`](/kit/build-and-deploy/adapter-netlify), необходимо установить соответствующий адаптер — `adapter-auto` не принимает никаких параметров.

## Добавление адаптеров сообщества

Вы можете добавить поддержку развёртываний с нулевой конфигурацией для дополнительных адаптеров, отредактировав файл [adapters.js](https://github.com/sveltejs/kit/blob/main/packages/adapter-auto/adapters.js) и создав запрос на включение изменений.
