<script setup lang="ts">
interface HeroProps {
	data: {
		id: string;
		tagline: string;
		headline: string;
		description: string;
		layout: 'image_image_left' | 'image_center' | 'image_left';
		image: string;
		images_multi?: string[];
		translations_hero?: Array<{
			languages_code: string;
			tagline: string;
			headline: string;
			description: string;
		}>;
		button_group?: {
			buttons: Array<{
				id: string;
				label: string | null;
				variant: string | null;
				url: string | null;
				type: 'url' | 'page' | 'post';
				pagePermalink?: string | null;
				postSlug?: string | null;
			}>;
		};
	};
}

const { setAttr } = useVisualEditing();
const props = defineProps<HeroProps>();

// Get current language - must use the same useState key as LanguageSelector
const locale = useState<string>('locale', () => 'en-US');

// Compute translated content based on selected language
const translatedContent = computed(() => {
	const translation = props.data.translations_hero?.find((t) => t.languages_code === locale.value);
	
	return {
		tagline: translation?.tagline || props.data.tagline,
		headline: translation?.headline || props.data.headline,
		description: translation?.description || props.data.description,
	};
});

// Use images_multi if available, otherwise fallback to single image
const carouselImages = computed(() => {
	if (props.data.images_multi && props.data.images_multi.length > 0) {
		// Extract file IDs from the M2M junction table structure
		const images = props.data.images_multi
			.map((item: any) => item.directus_files_id?.id)
			.filter((id: string | undefined) => id !== undefined);
		return images;
	}
	const fallback = props.data.image ? [props.data.image] : [];
	return fallback;
});
</script>

<template>
	<section
		class="relative w-full mx-auto flex flex-col gap-6 md:gap-12"
		:class="{
			'items-center text-center': data.layout === 'image_center',
			'md:flex-row-reverse items-center': data.layout === 'image_left',
			'md:flex-row items-center': data.layout !== 'image_center' && data.layout !== 'image_left',
		}"
	>
		<div
			class="flex flex-col gap-4 w-full"
			:class="{
				'md:w-3/4 xl:w-2/3 items-center': data.layout === 'image_center',
				'md:w-1/2 items-start': data.layout !== 'image_center',
				'md:-mt-8': data.layout === 'image_right',
			}"
		>
			<Tagline
				:tagline="translatedContent.tagline"
				:data-directus="setAttr({ collection: 'block_hero', item: data.id, fields: 'tagline', mode: 'popover' })"
			/>
			<Headline
				:headline="translatedContent.headline"
				:data-directus="setAttr({ collection: 'block_hero', item: data.id, fields: 'headline', mode: 'popover' })"
			/>
			<Text
				v-if="translatedContent.description"
				:content="translatedContent.description"
				:data-directus="setAttr({ collection: 'block_hero', item: data.id, fields: 'description', mode: 'popover' })"
			/>

			<div
				v-if="data.button_group?.buttons?.length"
				class="mt-6"
				:class="{ 'flex justify-center': data.layout === 'image_center' }"
			>
				<ButtonGroup
					:buttons="data.button_group.buttons"
					:data-directus="
						setAttr({ collection: 'block_button_group', item: data.button_group?.id, fields: 'buttons', mode: 'modal' })
					"
				/>
			</div>
		</div>

		<div
			v-if="carouselImages.length > 0"
			class="relative w-full -mt-24"
			:style="{
				height: data.layout === 'image_center' ? '400px' : '562px',
				maxHeight: data.layout === 'image_center' ? '400px' : '562px',
				overflow: 'hidden'
			}"
			:class="{
				'md:w-3/4 xl:w-2/3': data.layout === 'image_center',
				'md:w-1/2': data.layout !== 'image_center',
			}"
		>
			<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden;">
				<ClientOnly v-if="carouselImages.length > 1">
					<template #default>
						<Carousel
							:value="carouselImages"
							:numVisible="1"
							:numScroll="1"
							:showNavigators="true"
							:showIndicators="true"
							circular
							:autoplayInterval="3000"
							style="height: 100%; width: 100%;"
							:pt="{
								root: { style: 'height: 100%; overflow: hidden;' },
								content: { style: 'height: 100%; overflow: hidden;' },
								itemsContainer: { style: 'height: 100%; overflow: hidden;' }
							}"
						>
							<template #item="slotProps">
								<div class="flex items-center justify-center w-full" style="height: 100%; overflow: hidden;">
									<DirectusImage
										:uuid="slotProps.data"
										:alt="translatedContent.tagline || translatedContent.headline || 'Hero Image'"
										:sizes="data.layout === 'image_center' ? '100vw' : '(max-width: 768px) 100vw, 50vw'"
										style="max-height: 100%; max-width: 100%; object-fit: contain; height: auto; width: auto;"
									:data-directus="
										setAttr({ collection: 'block_hero', item: data.id, fields: ['image', 'layout'], mode: 'modal' })
									"
								/>
							</div>
						</template>
					</Carousel>
				</template>
				<template #fallback>
					<!-- Show first image while carousel loads -->
					<div class="flex items-center justify-center w-full" style="height: 100%; max-height: 100%; overflow: hidden;">
						<DirectusImage
							:uuid="carouselImages[0]"
							:alt="translatedContent.tagline || translatedContent.headline || 'Hero Image'"
							:sizes="data.layout === 'image_center' ? '100vw' : '(max-width: 768px) 100vw, 50vw'"
							style="max-height: 100%; max-width: 100%; object-fit: contain; height: auto; width: auto;"
							:data-directus="
								setAttr({ collection: 'block_hero', item: data.id, fields: ['image', 'layout'], mode: 'modal' })
							"
						/>
					</div>
				</template>
			</ClientOnly>
			<DirectusImage
				v-else
				:uuid="carouselImages[0]"
				:alt="translatedContent.tagline || translatedContent.headline || 'Hero Image'"
				:sizes="data.layout === 'image_center' ? '100vw' : '(max-width: 768px) 100vw, 50vw'"
				style="max-height: 100%; max-width: 100%; object-fit: contain; height: auto; width: auto;"
				:data-directus="
					setAttr({ collection: 'block_hero', item: data.id, fields: ['image', 'layout'], mode: 'modal' })
				"
			/>
			</div>
		</div>
	</section>
</template>

<style scoped>
/* Hide scrollbars completely - apply globally to this component */
* {
	scrollbar-width: none !important; /* Firefox */
	-ms-overflow-style: none !important; /* IE and Edge */
}

*::-webkit-scrollbar {
	display: none !important; /* Chrome, Safari, Opera */
}

/* Ensure carousel respects parent height */
:deep(.p-carousel) {
	height: 100%;
	max-height: 100%;
}

:deep(.p-carousel-content-container),
:deep(.p-carousel-viewport),
:deep(.p-carousel-items-container),
:deep(.p-carousel-content),
:deep(.p-carousel-item-list) {
	height: 100%;
	max-height: 100%;
}

:deep(.p-carousel-item) {
	height: 100%;
	max-height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* Make carousel indicators round */
:deep(.p-carousel-indicator-button) {
	width: 12px;
	height: 12px;
	border-radius: 50%;
}

/* Position indicators higher */
:deep(.p-carousel-indicator-list) {
	margin-top: -40px;
	position: relative;
	z-index: 10;
}

/* Center navigation arrows vertically and make both visible */
:deep(.p-carousel-prev-button),
:deep(.p-carousel-next-button) {
	position: absolute !important;
	top: 50% !important;
	transform: translateY(-50%) !important;
	background: rgba(255, 255, 255, 0.7) !important;
	border-radius: 50% !important;
	width: 48px !important;
	height: 48px !important;
	display: flex !important;
	align-items: center !important;
	justify-content: center !important;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
	z-index: 20 !important;
	opacity: 1 !important;
	visibility: visible !important;
}

:deep(.p-carousel-prev-button) {
	left: 1rem !important;
}

:deep(.p-carousel-next-button) {
	right: 1rem !important;
}

:deep(.p-carousel-prev-button:hover),
:deep(.p-carousel-next-button:hover) {
	background: rgba(255, 255, 255, 0.9) !important;
}
</style>
