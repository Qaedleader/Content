// Brand tokens — "Paper Workshop" identity (see 00_VISUAL_IDENTITY_RESEARCH/VISUAL_IDENTITY_REPORT.md).
// Yellow is the signature accent and, by convention, marks *productive capacity* (machines, energy, output).

export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const C = {
	yellow: '#F2B630',
	yellowShade: '#C98F12',
	yellowLight: '#F8D27A',
	paper: '#F4ECDD',
	paperShade: '#E6DAC4',
	paperWhite: '#FBF8F1',
	kraft: '#A57C52',
	kraftDark: '#7A5A3A',
	charcoal: '#262321',
	charcoalSoft: '#3A3532',
	navy: '#1F2C3F',
	navyDeep: '#141E2D',
	navyLight: '#2E4260',
	teal: '#2F7C78',
	tealDark: '#22605D',
	terracotta: '#C65A3E',
	sage: '#9FB08B',
	sageDark: '#6F8460',
	steel: '#9AA5AE',
	steelDark: '#5D6871',
	fire: '#F07B2A',
	fireHot: '#FFD08A',
	white: '#FFFFFF',
} as const;

export const FONT = {
	display: 'Alexandria', // headlines, index-card titles
	caption: 'BalooBhaijaan2', // word strips (subtitles)
	hero: 'Lalezar', // big paper-cut hero words
	label: 'IBMPlexArabic', // small labels, credits
	mono: 'JetBrainsMono', // numbers on counters / UI
} as const;

// Layout safe zones for Reels (1080×1920)
export const SAFE = {
	titleY: 205, // centre of the index-card title
	stageTop: 330,
	stageBottom: 1250,
	captionY: 1395, // centre line of the caption strips
	uiBottom: 1560, // below this: Reels UI (no information)
	uiRight: 950, // right of this: like/comment buttons (no information)
} as const;

export const SHADOW = {
	contact: 'drop-shadow(0px 7px 6px rgba(20,14,8,0.38)) drop-shadow(0px 2px 1.5px rgba(20,14,8,0.35))',
	lifted: 'drop-shadow(0px 22px 18px rgba(20,14,8,0.30)) drop-shadow(0px 4px 3px rgba(20,14,8,0.30))',
	soft: 'drop-shadow(0px 4px 4px rgba(20,14,8,0.30))',
} as const;
