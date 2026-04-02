<script setup lang="ts">
const LOCALES = [
	{ code: 'en-US', name: 'English', flag: 'circle-flags:us' },
	{ code: 'de-DE', name: 'German', flag: 'circle-flags:de' },
	{ code: 'es-ES', name: 'Spanish', flag: 'circle-flags:mx' },
	{ code: 'fr-FR', name: 'French', flag: 'circle-flags:fr' },
	{ code: 'it-IT', name: 'Italian', flag: 'circle-flags:it' },
	{ code: 'pt-BR', name: 'Portuguese', flag: 'circle-flags:br' },
];

const locale = useState<string>('locale', () => 'en-US');

const currentLanguage = computed(() => {
	return LOCALES.find((l) => l.code === locale.value) || LOCALES[0];
});

const isOpen = ref(false);

const selectLanguage = (langCode: string) => {
	locale.value = langCode;
	isOpen.value = false;
	// Store in localStorage if on client side
	if (process.client) {
		localStorage.setItem('locale', langCode);
	}
};

// Initialize from localStorage on client side
onMounted(() => {
	if (process.client) {
		const savedLocale = localStorage.getItem('locale');
		if (savedLocale) {
			locale.value = savedLocale;
		}
	}
});
</script>

<template>
	<div class="relative">
		<button
			@click="isOpen = !isOpen"
			class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
			aria-label="Select language"
		>
			<Icon :name="currentLanguage?.flag || 'heroicons:globe-alt'" class="w-5 h-5" />
			<span class="hidden sm:inline">{{ currentLanguage?.name || 'Language' }}</span>
			<svg
				class="w-4 h-4 transition-transform"
				:class="{ 'rotate-180': isOpen }"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		<Transition
			enter-active-class="transition ease-out duration-100"
			enter-from-class="transform opacity-0 scale-95"
			enter-to-class="transform opacity-100 scale-100"
			leave-active-class="transition ease-in duration-75"
			leave-from-class="transform opacity-100 scale-100"
			leave-to-class="transform opacity-0 scale-95"
		>
			<div
				v-if="isOpen"
				class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50"
			>
				<div class="py-1">
					<button
						v-for="lang in LOCALES"
						:key="lang.code"
						@click="selectLanguage(lang.code)"
						class="flex items-center gap-3 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
						:class="{
							'bg-gray-100 dark:bg-gray-700 font-semibold': lang.code === locale,
						}"
					>
						<Icon :name="lang.flag" class="w-5 h-5" />
						<span>{{ lang.name }}</span>
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
