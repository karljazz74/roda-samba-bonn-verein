<script setup lang="ts">
import Text from '~/components/base/Text.vue';

interface RichTextProps {
	data: {
		id?: string;
		tagline?: string;
		headline?: string;
		content?: string;
		alignment?: 'left' | 'center' | 'right';
		className?: string;
		translations?: Array<{
			languages_code: string;
			tagline: string;
			headline: string;
			content: string;
		}>;
	};
}

const props = withDefaults(defineProps<RichTextProps>(), {
	data: () => ({
		alignment: 'left',
	}),
});

const { setAttr } = useVisualEditing();

// Get current language - must use the same useState key as LanguageSelector
const locale = useState<string>('locale', () => 'en-US');

// Compute translated content based on selected language
const translatedContent = computed(() => {
	const translation = props.data.translations?.find((t) => t.languages_code === locale.value);
	
	return {
		tagline: translation?.tagline || props.data.tagline,
		headline: translation?.headline || props.data.headline,
		content: translation?.content || props.data.content,
	};
});
</script>

<template>
	<div
		:class="[
			'mx-auto max-w-[600px] space-y-6',
			{
				'text-center': data.alignment === 'center',
				'text-right': data.alignment === 'right',
				'text-left': data.alignment === 'left',
			},
			data.className,
		]"
	>
		<Tagline
			v-if="translatedContent.tagline"
			:tagline="translatedContent.tagline"
			:data-directus="
				setAttr({
					collection: 'block_richtext',
					item: data.id,
					fields: 'tagline',
					mode: 'popover',
				})
			"
		/>
		<Headline
			v-if="translatedContent.headline"
			:headline="translatedContent.headline"
			:data-directus="
				setAttr({
					collection: 'block_richtext',
					item: data.id,
					fields: 'headline',
					mode: 'popover',
				})
			"
		/>
		<Text
			v-if="translatedContent.content"
			:content="translatedContent.content"
			:data-directus="
				setAttr({
					collection: 'block_richtext',
					item: data.id,
					fields: 'content',
					mode: 'drawer',
				})
			"
		/>
	</div>
</template>
