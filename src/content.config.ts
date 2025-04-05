import { defineCollection, z } from 'astro:content';
import { docsLoader, i18nLoader } from "@astrojs/starlight/loaders";
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { topicSchema } from 'starlight-sidebar-topics/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: topicSchema.extend({
				origin: z.string().url().optional(),
			}),
		})
	}),
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
