<script setup lang="ts">
interface DirectusImageProps {
	uuid: string;
	alt: string;
	width?: number;
	height?: number;
	preset?: string;
	[key: string]: any;
}

const props = withDefaults(defineProps<DirectusImageProps>(), {
	width: undefined,
	height: undefined,
	preset: '800w',
});

const src = computed(() => useDirectusAsset(props.uuid, props.preset));
</script>

<template>
	<img :src="src" v-bind="{ ...props, uuid: undefined }" />
</template>
