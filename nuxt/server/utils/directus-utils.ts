export function getDirectusAssetURL(fileOrString: string | DirectusFile | null | undefined, preset?: string): string {
	if (!fileOrString) return '';

	const runtimeConfig = useRuntimeConfig();
	const directusUrl = runtimeConfig.public.directusUrl;

	const presetParam = preset ? `?key=${preset}` : '';

	if (typeof fileOrString === 'string') {
		return `${directusUrl}/assets/${fileOrString}${presetParam}`;
	}

	return `${directusUrl}/assets/${fileOrString.id}${presetParam}`;
}
