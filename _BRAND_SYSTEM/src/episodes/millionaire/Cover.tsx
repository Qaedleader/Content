// Millionaire × AI cover (9:16, 1080×1920). Three concepts; all keep headline + focal object inside the 4:5 grid-safe band (y 285–1635).
// A «gold & neural»: extruded $1,000,000 over a projection curve with a neural net above it (finance → AI in one frame).
// B «two worlds»: NYSE (traditional investing) above, NVIDIA DGX B200 (AI) below, split by a pixel seam; $1,000,000 bridges both.
// C «paper minimal»: cream paper, charcoal $1M, one AI chip — the brand's quiet editorial version.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {rand} from '../../brand/anim';
import {Backdrop, PaperGrade} from '../../brand/paper';
import {C, FONT, SHADOW} from '../../brand/tokens';
import {HeroWord, Label} from '../../brand/type';
import {M} from './ep';
import {EdTag, GoldDust, GridStage, GrowthChart, K, Money3D, NeuralNet} from './kit';

const Headline: React.FC<{top: number; face?: string; strip?: string; size?: number}> = ({top, face = C.yellow, strip = C.charcoal, size = 150}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', transform: 'rotate(-2deg)'}}>
		<HeroWord text="كيف تصير مليونير؟" size={size} face={face} strip={strip} />
	</div>
);

export const MillionaireCover: React.FC<{variant?: 'A' | 'B' | 'C'}> = ({variant = 'A'}) => {
	const f = 40;
	if (variant === 'B') {
		return (
			<AbsoluteFill style={{background: K.ink}}>
				<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1010, overflow: 'hidden'}}>
					<Img src={staticFile(M('m_nyse.jpg'))} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1) saturate(0.8) brightness(0.62) sepia(0.25)'}} />
				</div>
				<div style={{position: 'absolute', left: 0, top: 1010, width: 1080, height: 910, overflow: 'hidden'}}>
					<Img src={staticFile(M('m_dgx_b200.jpg'))} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.15) saturate(0.8) brightness(0.6) hue-rotate(-10deg)'}} />
					<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(127,214,255,0.18), rgba(7,9,12,0.6))'}} />
				</div>
				{/* pixel seam */}
				{Array.from({length: 18}).map((_, i) =>
					Array.from({length: 3}).map((__, r) =>
						rand(i * 7 + r * 31) > 0.35 ? <div key={`${i}-${r}`} style={{position: 'absolute', left: i * 60, top: 980 + r * 30, width: 30, height: 30, background: r === 1 ? C.yellow : rand(i + r) > 0.5 ? K.ai : C.paperWhite}} /> : null,
					),
				)}
				<AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)'}} />
				<EdTag f={f} at={0} text="من الاستثمار للذكاء الاصطناعي" date="سلسلة جديدة" y={300} />
				<Headline top={400} />
				<div style={{position: 'absolute', left: 0, right: 0, top: 930, display: 'flex', justifyContent: 'center'}}>
					<Money3D text="$1,000,000" size={150} depth={16} glow={1} shine={0.55} />
				</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: 1300, display: 'flex', justifyContent: 'center', transform: 'rotate(-1.5deg)'}}>
					<Label text="بالذكاء الاصطناعي" size={72} bg={K.ai} seed={4} />
				</div>
				<PaperGrade frame={f} strength={0.4} vignette={0.3} />
			</AbsoluteFill>
		);
	}
	if (variant === 'C') {
		return (
			<AbsoluteFill>
				<Backdrop color={C.paper} pattern="dots" ink="rgba(38,35,33,0.08)" light={0.25} />
				<EdTag f={f} at={0} text="خطة المليون" date="الذكاء الاصطناعي" y={300} />
				<Headline top={410} face={C.charcoal} strip={C.yellow} size={140} />
				<div style={{position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center'}}>
					<Money3D text="$1M" size={330} depth={22} face={`linear-gradient(180deg, ${C.charcoalSoft}, ${C.charcoal})`} side={C.yellowShade} glow={0} />
				</div>
				<div style={{position: 'absolute', left: 360, top: 1210, width: 360, height: 220, background: C.charcoal, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: SHADOW.lifted}}>
					<NeuralNet f={f} draw={1} w={300} h={170} layers={[3, 5, 5, 2]} color={K.ai} seed={4} />
				</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: 1470, display: 'flex', justifyContent: 'center'}}>
					<Label text="مش بالأداة · بطريقة استخدامها" size={40} bg={C.paperWhite} seed={2} />
				</div>
				<PaperGrade frame={f} strength={0.5} vignette={0.25} />
			</AbsoluteFill>
		);
	}
	return (
		<AbsoluteFill style={{background: K.ink}}>
			<GridStage f={f} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 30% at 50% 52%, rgba(242,182,48,0.35), rgba(7,9,12,0) 70%)'}} />
			<GoldDust f={f} n={40} seed={9} o={0.9} />
			<div style={{position: 'absolute', left: 80, top: 1080, opacity: 0.95}}>
				<GrowthChart w={920} h={330} t={1} f={f} showPaid={0} />
			</div>
			<div style={{position: 'absolute', left: 120, top: 640, mixBlendMode: 'screen', opacity: 0.55}}>
				<NeuralNet f={f} draw={1} w={840} h={300} seed={6} />
			</div>
			<EdTag f={f} at={0} text="خطة المليون" date="استثمار + ذكاء اصطناعي" y={300} />
			<Headline top={400} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', justifyContent: 'center'}}>
				<Money3D text="$1,000,000" size={150} depth={16} glow={1} shine={0.55} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1000, display: 'flex', justifyContent: 'center', transform: 'rotate(-1.5deg)'}}>
				<Label text="بالذكاء الاصطناعي" size={66} bg={K.ai} seed={4} />
			</div>
			<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: 1500, textAlign: 'center', fontFamily: FONT.label, fontWeight: 700, fontSize: 24, color: 'rgba(244,236,221,0.7)'}}>
				سيناريو افتراضي · مش وعد بربح
			</div>
			<PaperGrade frame={f} strength={0.42} vignette={0.3} />
		</AbsoluteFill>
	);
};
