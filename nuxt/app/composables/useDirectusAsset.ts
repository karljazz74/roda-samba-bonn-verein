interface DirectusFile {
	id: string;
	[key: string]: any;
}

export function useDirectusAsset(fileOrString: string | DirectusFile | null | undefined, preset?: string): string {
	if (!fileOrString) return '';

	const runtimeConfig = useRuntimeConfig();
	const directusUrl = runtimeConfig.public.directusUrl;

	if (!directusUrl) {
		console.error('[useDirectusAsset] directusUrl is not defined in runtimeConfig.public');
		if (import.meta.client) {
			console.error('[useDirectusAsset] Available config keys:', Object.keys(runtimeConfig.public));
		}
		return '';
	}

	const presetParam = preset ? `?key=${preset}` : '';

	if (typeof fileOrString === 'string') {
		return `${directusUrl}/assets/${fileOrString}${presetParam}`;
	}

	return `${directusUrl}/assets/${fileOrString.id}${presetParam}`;
}
