// RAM_GOLD cover (9:16, 1080×1920). Same compositional system as the Video 10 cover: series tag → hero word on a charcoal strip →
// mono figure plate → yellow label strip → source line, all inside the 4:5 grid-safe band (y 285–1635). `clean` drops all text.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, FONT, SHADOW} from '../../brand/tokens';
import {HeroWord, Label} from '../../brand/type';
import {PaperGrade} from '../../brand/paper';
import {M} from './ep';
import {EdTag, G, GoldDust, RamCut} from './kit';

export const RamGoldCover: React.FC<{clean?: boolean}> = ({clean = false}) => {
	const f = 60; // fixed "time" for the dust / tag animations
	return (
		<AbsoluteFill style={{background: G.ink}}>
			<AbsoluteFill style={{opacity: 0.55}}>
				<Img src={staticFile(M('m_gold_bars.jpg'))} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(16px) brightness(0.42) saturate(1.25)', transform: 'scale(1.25)'}} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 34% at 50% 52%, rgba(242,182,48,0.34), rgba(7,9,12,0) 70%)'}} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 95% 75% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.8) 100%)'}} />
			{/* pixel grid floor lines (brand detail) */}
			<AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(242,182,48,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(242,182,48,0.07) 2px, transparent 2px)', backgroundSize: '90px 90px', WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,1) 100%)', maskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,1) 100%)'}} />
			<GoldDust f={f} n={40} seed={9} o={0.9} />
			{/* hero object: the real DDR5 RDIMM, half turned to gold (the wipe line is the transformation) */}
			<div style={{position: 'absolute', left: 540 - 640, top: (clean ? 960 : 935) - 155, width: 1280, height: 311, transform: 'rotate(-16deg)'}}>
				<RamCut w={1280} gold={clean ? 1 : 0.62} sweep={0.55} glow={1} tilt={6} />
			</div>
			{!clean ? (
				<>
					<EdTag f={f} at={0} text="حرب الذاكرة" date="الذكاء الاصطناعي · 2026" y={300} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 410, display: 'flex', justifyContent: 'center', transform: 'rotate(-2deg)'}}>
						<HeroWord text="الرام صار ذهب؟" size={150} face={G.goldHot} back={G.goldDeep} strip={C.charcoal} />
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 1170, display: 'flex', justifyContent: 'center'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(7,9,12,0.88)', border: `3px solid ${C.yellow}`, borderRadius: 10, padding: '10px 30px 12px', filter: SHADOW.lifted}}>
							<span dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 92, color: C.yellow, textShadow: `0 0 26px ${G.goldGlow}`, lineHeight: 1}}>
								DRAM +80%
							</span>
						</div>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 1330, display: 'flex', justifyContent: 'center', transform: 'rotate(-1.5deg)'}}>
						<Label text="حرب الذاكرة العالمية" size={66} bg={C.yellow} seed={4} />
					</div>
					<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: 1478, textAlign: 'center', fontFamily: FONT.label, fontWeight: 700, fontSize: 26, color: 'rgba(244,236,221,0.82)'}}>
						<span style={{color: C.yellow}}>المصدر: </span>TrendForce · سعر عقود DRAM في الربع الثاني 2026 مقارنة بالربع الأول
					</div>
				</>
			) : null}
			<PaperGrade frame={f} strength={0.42} vignette={0.3} />
		</AbsoluteFill>
	);
};
