import {continueRender, delayRender, staticFile} from 'remotion';

// All fonts are local files under public/brand/fonts (SIL OFL 1.1). Rendering waits until every face is loaded.
const FACES: [family: string, file: string, weight: string][] = [
	['Alexandria', 'brand/fonts/Alexandria.ttf', '100 900'],
	['BalooBhaijaan2', 'brand/fonts/BalooBhaijaan2.ttf', '400 800'],
	['Lalezar', 'brand/fonts/Lalezar-Regular.ttf', '400'],
	['IBMPlexArabic', 'brand/fonts/IBMPlexSansArabic-Bold.ttf', '700'],
	['JetBrainsMono', 'brand/fonts/JetBrainsMono.ttf', '100 800'],
];

let started = false;

export const ensureFonts = () => {
	if (started || typeof document === 'undefined') return;
	started = true;
	const handle = delayRender('Loading brand fonts');
	Promise.all(
		FACES.map(([family, file, weight]) =>
			new FontFace(family, `url(${staticFile(file)})`, {weight}).load().then((f) => {
				(document.fonts as unknown as {add: (f: FontFace) => void}).add(f);
			}),
		),
	)
		.then(() => continueRender(handle))
		.catch((e) => {
			console.error('Font loading failed', e);
			continueRender(handle);
		});
};
