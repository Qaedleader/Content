import React from 'react';
import {AbsoluteFill} from 'remotion';
import {rand} from './anim';
import {TEX} from './paper';
import {C, FONT, H, SHADOW, W} from './tokens';

/** Odometer-style counter built from paper digit tiles (LTR digits, used for figures like 99.9%). */
export const PaperCounter: React.FC<{
	value: number;
	decimals?: number;
	suffix?: string;
	prefix?: string;
	size?: number;
	tile?: string;
	ink?: string;
	minDigits?: number;
	seed?: number;
	group?: boolean;
	accentSuffix?: string;
}> = ({value, decimals = 0, suffix = '', prefix = '', size = 120, tile = C.paperWhite, ink = C.charcoal, minDigits = 1, seed = 1, group = false, accentSuffix = C.yellow}) => {
	let s = value.toFixed(decimals);
	const [int, dec] = s.split('.');
	let intS = int.padStart(minDigits, '0');
	if (group) intS = intS.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	s = dec !== undefined ? `${intS}.${dec}` : intS;
	const chars = (prefix + s).split('');
	return (
		<div dir="ltr" style={{display: 'inline-flex', alignItems: 'flex-end', gap: size * 0.06}}>
			{chars.map((ch, i) => {
				const narrow = ch === '.' || ch === ',';
				return (
					<div
						key={i}
						style={{
							position: 'relative',
							width: narrow ? size * 0.32 : size * 0.72,
							height: size * 1.12,
							background: narrow ? 'transparent' : tile,
							borderRadius: size * 0.08,
							transform: `rotate(${(rand(seed * 17 + i) - 0.5) * 4}deg)`,
							filter: narrow ? undefined : SHADOW.contact,
							overflow: 'hidden',
						}}
					>
						{!narrow ? <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${TEX.fibers()})`, backgroundSize: '512px', opacity: 0.5}} /> : null}
						{!narrow ? <div style={{position: 'absolute', left: 0, right: 0, top: '50%', height: 2, background: 'rgba(0,0,0,0.12)'}} /> : null}
						<div
							style={{
								position: 'absolute',
								inset: 0,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: FONT.display,
								fontWeight: 900,
								fontSize: size * 0.9,
								color: narrow ? tile : ink,
								lineHeight: 1,
								paddingTop: narrow ? size * 0.55 : 0,
							}}
						>
							{ch}
						</div>
					</div>
				);
			})}
			{suffix ? (
				<div
					style={{
						position: 'relative',
						width: size * 0.92,
						height: size * 1.12,
						background: accentSuffix,
						borderRadius: size * 0.08,
						filter: SHADOW.contact,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: FONT.display,
						fontWeight: 900,
						fontSize: size * 0.8,
						color: C.charcoal,
						transform: 'rotate(3deg)',
					}}
				>
					{suffix}
				</div>
			) : null}
		</div>
	);
};

/** Camera: transforms everything inside around the frame centre. Use for push-ins, pans and shakes. */
export const Camera: React.FC<{x?: number; y?: number; scale?: number; rot?: number; children?: React.ReactNode; origin?: string}> = ({x = 0, y = 0, scale = 1, rot = 0, children, origin}) => (
	<AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rot}deg)`, transformOrigin: origin ?? `${W / 2}px ${H / 2}px`}}>{children}</AbsoluteFill>
);

/** Full-frame SVG stage (1080×1920 user units). */
export const Stage: React.FC<{children?: React.ReactNode; width?: number; height?: number; style?: React.CSSProperties}> = ({children, width = W, height = H, style}) => (
	<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', ...style}}>
		{children}
	</svg>
);

/** Paper "wipe": a sheet slides across the frame (transition). progress 0..1 */
export const PaperWipe: React.FC<{p: number; color?: string; dir?: 'up' | 'left' | 'right'}> = ({p, color = C.paper, dir = 'up'}) => {
	if (p <= 0 || p >= 1) return null;
	const t = p < 0.5 ? p * 2 : (1 - p) * 2; // in then out
	const off = p < 0.5 ? (1 - t) : -(1 - t);
	const tr = dir === 'up' ? `translateY(${off * 110}%)` : dir === 'left' ? `translateX(${-off * 110}%)` : `translateX(${off * 110}%)`;
	return (
		<AbsoluteFill style={{transform: tr, filter: SHADOW.lifted}}>
			<AbsoluteFill style={{background: color}} />
			<AbsoluteFill style={{backgroundImage: `url(${TEX.grain()})`, backgroundSize: '1024px', mixBlendMode: 'multiply'}} />
		</AbsoluteFill>
	);
};
