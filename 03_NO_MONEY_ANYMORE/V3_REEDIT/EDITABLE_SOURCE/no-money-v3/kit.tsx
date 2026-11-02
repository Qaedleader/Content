// V3 episode kit: small helpers shared by the V3 scenes (built only from brand parts, no V1 scene code).
import React from 'react';
import {pop} from '../../brand/anim';
import {FootagePrint, PhotoPrint} from '../../brand/media';
import {G, Icon} from '../../brand/props';
import {C, FONT, SHADOW} from '../../brand/tokens';

export const M1 = (n: string) => `episodes/no-money/media/${n}`; // V1 media (licensed, trimmed copies)
export const M3 = (n: string) => `episodes/no-money-v3/media/${n}`; // new V3 media

export type IconName = 'car' | 'house' | 'bread' | 'wheat' | 'shirt' | 'pill' | 'bolt' | 'gear' | 'worker' | 'phone' | 'beam' | 'robot' | 'ore' | 'furnace' | 'box';

/** Round paper product token (SVG). Origin = centre. */
export const Token: React.FC<{icon: IconName; r?: number; bg?: string; ring?: string; s?: number}> = ({icon, r = 62, bg = C.paperWhite, ring, s = 1}) => (
	<g transform={`scale(${s})`} filter="url(#sh)">
		<circle r={r} fill={bg} stroke={ring ?? 'rgba(30,20,10,0.22)'} strokeWidth={ring ? 8 : 2} />
		<Icon name={icon} s={(r / 62) * 0.6} />
	</g>
);

/** Real media window (photo or footage), taped print with credit. */
export const Win: React.FC<{
	src: string;
	x: number;
	y: number;
	w: number;
	h: number;
	f: number;
	at: number;
	credit: string;
	kind?: string;
	rot?: number;
	trim?: number;
	enter?: 'drop' | 'pop' | 'slideLeft' | 'slideRight' | 'none';
	seed?: number;
	kb?: {from: number; to: number; x0?: number; x1?: number; y0?: number; y1?: number};
	objectPosition?: string;
	out?: number;
}> = (p) => {
	const video = p.src.endsWith('.mp4');
	const common = {x: p.x, y: p.y, w: p.w, h: p.h, rot: p.rot ?? 0, frame: p.f, at: p.at, seed: p.seed ?? 1, enter: p.enter ?? 'pop', out: p.out, objectPosition: p.objectPosition, kb: p.kb ?? (video ? undefined : {from: 1.0, to: 1.08}), credit: {kind: p.kind ?? (video ? 'لقطات حقيقية' : 'صورة حقيقية'), text: p.credit}};
	return video ? <FootagePrint {...common} src={p.src} trim={p.trim ?? 0} /> : <PhotoPrint {...common} src={p.src} kbDur={90} />;
};

/** Numbered station tag (paper index tab). HTML. */
export const StationTag: React.FC<{n: string; text: string; f: number; at: number; x: number; y: number; dark?: boolean}> = ({n, text, f, at, x, y, dark}) => {
	if (f < at) return null;
	const p = pop(f, at);
	return (
		<div dir="rtl" style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'stretch', transform: `scale(${p}) rotate(-2deg)`, transformOrigin: 'left center', filter: SHADOW.contact}}>
			<div style={{background: C.yellow, padding: '8px 18px', fontFamily: FONT.display, fontWeight: 900, fontSize: 40, color: C.charcoal, borderRadius: '6px 0 0 6px'}}>{n}</div>
			<div style={{background: dark ? C.charcoal : C.paperWhite, padding: '8px 22px', fontFamily: FONT.display, fontWeight: 800, fontSize: 40, color: dark ? C.paper : C.charcoal, borderRadius: '0 6px 6px 0'}}>{text}</div>
		</div>
	);
};

/** Sinusoidal idle for living machinery. */
export const idle = (f: number, period: number, amp: number, phase = 0) => Math.sin((f / period) * Math.PI * 2 + phase) * amp;

/** Positioned SVG group helper re-export for brevity. */
export {G};
