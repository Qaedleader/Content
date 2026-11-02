// 36.2 – 48.9 s · Chapter H/I: the real secret (knowing how, not owning tools) → follow the series → comment question.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, kf, pop, prog, slam} from '../../../brand/anim';
import {Backdrop} from '../../../brand/paper';
import {C, FONT, SHADOW} from '../../../brand/tokens';
import {HeroWord, Label, TitleCard} from '../../../brand/type';
import {wf} from '../ep';
import {appear, EdTag, GoldDust, GridStage, Ico, K, Money3D, NeuralNet, PixelRow, Stage} from '../kit';

/* ---------------- 36.22 – 41.32 s · «بس السر مش بالأداة، السر إنك تعرف تستخدمها صح…» ---------------- */
const SKILLS = ['مهارة', 'حكم صحيح', 'تنفيذ', 'فهم'];
export const Secret: React.FC<{f: number}> = ({f}) => {
	const a = wf(98);
	const s1 = wf(99); // «السر»
	const not = wf(100); // «مش بالأداة»
	const s2 = wf(102); // «السر إنك تعرف»
	const right = wf(106); // «صح»
	const learn = wf(107); // «وتتعلم من أشخاص»
	const right2 = wf(113); // «صح.»
	const toolOut = prog(f, not + 4, not + 12);
	return (
		<AbsoluteFill>
			<Backdrop color={C.paper} pattern="dots" ink="rgba(38,35,33,0.07)" light={0.2} />
			<TitleCard frame={f} at={s1 - 2} text="السر الحقيقي" size={52} seed={31} />
			{/* card 1: having tools */}
			<div style={{position: 'absolute', left: 110, top: 400, width: 860, transform: `translateY(${(1 - pop(f, s1 + 2, {damping: 15})) * -200}px) rotate(${-1.5 + toolOut * -2}deg) scale(${1 - 0.12 * toolOut})`, opacity: Math.min(1, prog(f, s1 + 2, s1 + 6)) * (1 - 0.45 * toolOut), filter: `grayscale(${toolOut})`}}>
				<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 24, background: C.paperWhite, borderRadius: 10, padding: '26px 34px', filter: SHADOW.lifted}}>
					<div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 46, color: C.charcoal, flex: 1}}>إنك تملك أدوات AI</div>
					{f >= not ? <div style={{transform: `scale(${slam(f, not)})`}}>{Ico.cross(78, K.red)}</div> : null}
				</div>
				<div style={{position: 'absolute', left: 20, right: 20, top: '50%', height: 8, background: K.red, transformOrigin: '100% 50%', transform: `scaleX(${prog(f, not + 2, not + 10, EASE.out)})`, borderRadius: 4}} />
			</div>
			{/* card 2: knowing how */}
			{f >= s2 ? (
				<div style={{position: 'absolute', left: 80, top: 640, width: 920, transform: `scale(${0.6 + 0.4 * pop(f, s2, {damping: 12})}) rotate(1deg)`}}>
					<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 24, background: C.yellow, borderRadius: 12, padding: '34px 40px', filter: SHADOW.lifted}}>
						<div style={{flex: 1}}>
							<div style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 54, color: C.charcoal, lineHeight: 1.2, whiteSpace: 'nowrap'}}>إنك تعرف تستخدمها صح</div>
						</div>
						{f >= right ? <div style={{transform: `scale(${slam(f, right)})`}}>{Ico.check(96, C.charcoal)}</div> : null}
					</div>
				</div>
			) : null}
			{/* what actually matters */}
			{f >= learn ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
					<div style={{...appear(f, learn)}}>
						<Label text="وتتعلم من ناس بيعرفوا فعلاً" size={40} bg={C.charcoal} fg={C.paper} seed={7} rot={-1} />
					</div>
					<div dir="rtl" style={{display: 'flex', gap: 14}}>
						{SKILLS.map((s, i) => (
							<div key={s} style={{transform: `scale(${pop(f, learn + 8 + i * 4)})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 36, color: C.charcoal, background: C.paperWhite, border: `4px solid ${C.charcoal}`, borderRadius: 8, padding: '8px 20px 10px', filter: SHADOW.soft}}>
								{s}
							</div>
						))}
					</div>
				</div>
			) : null}
			{f >= right2 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center', transform: `scale(${0.6 + 0.4 * slam(f, right2)}) rotate(-3deg)`}}>
					<div dir="rtl" style={{fontFamily: FONT.hero, fontSize: 64, color: C.terracotta, border: `6px solid ${C.terracotta}`, borderRadius: 10, padding: '0 26px 4px', background: 'rgba(251,248,241,0.8)'}}>
						الأداة لحالها مش ميزة
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/* ---------------- 41.32 – 46.36 s · «تابعوني.. رح أبدأ سلسلة أعلمكم فيها كيف فعلاً تعملوا كل إشي بالذكاء الاصطناعي» ---------------- */
const EPS = [
	{n: '01', t: 'أساسيات'},
	{n: '02', t: 'برمجة'},
	{n: '03', t: 'محتوى'},
	{n: '04', t: 'تسويق'},
	{n: '05', t: 'بيزنس'},
];
export const Follow: React.FC<{f: number}> = ({f}) => {
	const a = wf(114); // «تابعوني»
	const series = wf(117); // «سلسلة»
	const how = wf(120); // «كيف فعلاً»
	const all = wf(123); // «كل إشي»
	const ai = wf(125); // «بالذكاء الاصطناعي»
	const tap = a + 12;
	const followed = f >= tap + 3;
	const btnUp = prog(f, series - 4, series + 6);
	return (
		<AbsoluteFill>
			<Stage f={f} seed={9} />
			<GoldDust f={f} n={30} seed={21} o={0.6} />
			<EdTag f={f} at={series} text="سلسلة جديدة" date="الذكاء الاصطناعي · خطوة بخطوة" y={110} />
			{f < series ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 420, display: 'flex', justifyContent: 'center', transform: `scale(${0.55 + 0.45 * slam(f, a)}) rotate(-2deg)`, opacity: 1 - prog(f, series - 4, series)}}>
					<HeroWord text="تابعوني" size={170} strip={C.charcoal} />
				</div>
			) : null}
			{/* follow button */}
			<div style={{position: 'absolute', left: 0, right: 0, top: kf(btnUp, [0, 1], [760, 1180]), display: 'flex', justifyContent: 'center', transform: `scale(${(0.6 + 0.4 * pop(f, a)) * (f >= tap && f < tap + 4 ? 0.92 : 1) * kf(btnUp, [0, 1], [1, 0.72])})`}}>
				<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 20, background: followed ? C.paperWhite : C.yellow, borderRadius: 60, padding: '22px 56px 26px', boxShadow: followed ? '0 0 0 rgba(0,0,0,0)' : '0 0 50px rgba(242,182,48,0.55)', filter: SHADOW.lifted}}>
					{followed ? Ico.check(64, C.charcoal) : Ico.plus(56, C.charcoal)}
					<span style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 72, color: C.charcoal}}>{followed ? 'تمت المتابعة' : 'تابعني'}</span>
				</div>
			</div>
			{f >= tap - 6 && f < tap + 14 ? (
				<div style={{position: 'absolute', left: 640 - 40, top: kf(f, [tap - 6, tap], [980, 820], EASE.out), width: 80, height: 80, borderRadius: 40, background: 'rgba(255,255,255,0.35)', border: '4px solid rgba(255,255,255,0.85)', transform: `scale(${f >= tap ? 1 + (f - tap) * 0.12 : 1})`, opacity: f >= tap ? 1 - (f - tap) / 14 : 1}} />
			) : null}
			{/* the series: episode cards fan in */}
			{f >= series ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
					<div style={{transform: `scale(${0.6 + 0.4 * slam(f, series)}) rotate(-2deg)`}}>
						<HeroWord text="سلسلة جديدة" size={124} strip={C.charcoal} />
					</div>
					<div dir="rtl" style={{display: 'flex', gap: 14, marginTop: 30}}>
						{EPS.map((e, i) => {
							const at = how - 6 + i * 4;
							const p = pop(f, at, {damping: 13, stiffness: 230});
							const hot = f >= all && i === Math.floor((f - all) / 4) % EPS.length;
							return (
								<div key={e.n} style={{width: 176, height: 260, borderRadius: 12, background: hot ? C.yellow : K.panel, border: `3px solid ${hot ? C.yellow : 'rgba(242,182,48,0.55)'}`, transform: `translateY(${(1 - p) * 300}px) rotate(${(i - 2) * 2}deg)`, opacity: Math.min(1, p * 1.5), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0 22px', boxShadow: '0 20px 30px rgba(0,0,0,0.45)'}}>
									<div style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 64, color: hot ? C.charcoal : C.yellow}}>{e.n}</div>
									<div style={{width: 70, height: 70, opacity: 0.9}}>
										<NeuralNet f={f} draw={1} w={70} h={70} layers={[2, 3, 2]} color={hot ? C.charcoal : K.ai} seed={i + 2} pulse={0} />
									</div>
									<div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 30, color: hot ? C.charcoal : C.paper}}>{e.t}</div>
								</div>
							);
						})}
					</div>
					<div style={{marginTop: 16, ...appear(f, ai)}}>
						<Label text="كل إشي · بالذكاء الاصطناعي" size={44} bg={C.paperWhite} seed={8} rot={-1} />
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/* ---------------- 46.36 – 48.90 s · «اكتبوا لي بالتعليقات شو أول شي بدكم تتعلموه؟» + final frame ---------------- */
const IDEAS = ['برمجة؟', 'صناعة محتوى؟', 'تسويق؟', 'أتمتة شغلي؟'];
export const Comment: React.FC<{f: number; end: number}> = ({f, end}) => {
	const a = wf(127); // «اكتبوا لي»
	const cm = wf(129); // «بالتعليقات»
	const q = wf(130); // «شو أول»
	const qText = 'شو أول إشي بدكم تتعلموه بالذكاء الاصطناعي؟';
	return (
		<AbsoluteFill>
			<GridStage f={f} tint="rgba(242,182,48,0.07)" />
			<GoldDust f={f} n={24} seed={31} o={0.5} />
			{/* the question card */}
			<div style={{position: 'absolute', left: 70, right: 70, top: 330, transform: `translateY(${(1 - pop(f, a, {damping: 15})) * -260}px)`, opacity: prog(f, a, a + 5)}}>
				<div dir="rtl" style={{position: 'relative', background: C.paperWhite, borderRadius: 14, padding: '40px 46px 44px', filter: SHADOW.lifted}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
						{Ico.chat(48, C.charcoal)}
						<span style={{fontFamily: FONT.label, fontWeight: 700, fontSize: 30, color: C.steelDark}}>سؤال الحلقة · جاوب بالتعليقات</span>
					</div>
					<div style={{marginTop: 22, fontFamily: FONT.display, fontWeight: 900, fontSize: 70, lineHeight: 1.3, color: C.charcoal, minHeight: 280}}>
						{f >= cm ? qText.slice(0, Math.max(0, Math.round((f - cm) * 1.6))) : ''}
						{f >= cm && (f - cm) * 1.6 < qText.length ? <span style={{color: C.yellowShade}}>▍</span> : null}
					</div>
					<div style={{position: 'absolute', left: 40, bottom: -30, width: 60, height: 60, background: C.paperWhite, transform: 'rotate(45deg)'}} />
				</div>
			</div>
			{/* the comment field */}
			<div dir="rtl" style={{position: 'absolute', left: 70, right: 70, top: 870, display: 'flex', alignItems: 'center', gap: 16, background: K.panel, border: `3px solid ${f >= cm ? C.yellow : K.panelLine}`, borderRadius: 40, padding: '18px 30px', opacity: prog(f, cm - 4, cm + 4)}}>
				<span style={{flex: 1, fontFamily: FONT.label, fontWeight: 700, fontSize: 32, color: 'rgba(244,236,221,0.6)'}}>أضف تعليقاً…</span>
				<span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 30, color: C.charcoal, background: C.yellow, borderRadius: 24, padding: '4px 22px 6px'}}>نشر</span>
			</div>
			{/* idea chips (prompts, not real comments) */}
			<div dir="rtl" style={{position: 'absolute', left: 70, right: 70, top: 990, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center'}}>
				{IDEAS.map((t, i) => (
					<div key={t} style={{transform: `scale(${pop(f, q + 6 + i * 5)})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 32, color: C.paper, border: `3px solid rgba(244,236,221,0.4)`, borderRadius: 30, padding: '6px 24px 8px', background: 'rgba(255,255,255,0.05)'}}>
						{t}
					</div>
				))}
			</div>
			{/* final lockup: $1M → AI (the thesis in one line) */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 1165, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, direction: 'ltr', opacity: prog(f, end - 36, end - 26), transform: `translateY(${(1 - prog(f, end - 36, end - 24, EASE.out)) * 30}px)`}}>
				<Money3D text="$1M" size={64} depth={6} glow={0.5} />
				<span style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 52, color: C.paper}}>+</span>
				<span style={{fontFamily: FONT.mono, fontWeight: 800, fontSize: 60, color: K.ai, textShadow: `0 0 20px ${K.aiGlow}`}}>AI</span>
				<div style={{marginLeft: 10}}>
					<PixelRow n={5} lit={Math.min(5, Math.max(0, Math.floor((f - end + 30) / 4)))} size={14} gap={5} />
				</div>
			</div>
		</AbsoluteFill>
	);
};
