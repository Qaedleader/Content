import React from 'react';
import {Composition} from 'remotion';
import {ensureFonts} from './brand/fonts';
import {FPS, H, W} from './brand/tokens';
import {DURATION} from './episodes/no-money/ep';
import {NoMoneyAnymore} from './episodes/no-money/NoMoneyAnymore';
import {NoMoneyAnymoreV2} from './episodes/no-money-v2/NoMoneyAnymoreV2';
import {NoMoneyAnymoreV3} from './episodes/no-money-v3/NoMoneyAnymoreV3';
import {DURATION as NL_DURATION} from './episodes/neuralink/ep';
import {NeuralinkRemake} from './episodes/neuralink/NeuralinkRemake';
import {DURATION as ASML_DURATION} from './episodes/asml/ep';
import {Asml} from './episodes/asml/Asml';
import {DURATION as IG_DURATION} from './episodes/igalgo/ep';
import {IgAlgo} from './episodes/igalgo/IgAlgo';
import {DURATION as AA_DURATION} from './episodes/aiagent/ep';
import {AiAgent} from './episodes/aiagent/AiAgent';
import {DURATION as BN_DURATION} from './episodes/binance/ep';
import {Binance} from './episodes/binance/Binance';
import {DURATION as RG_DURATION} from './episodes/ramgold/ep';
import {RamGold} from './episodes/ramgold/RamGold';
import {RamGoldCover} from './episodes/ramgold/Cover';
import {DURATION as MA_DURATION} from './episodes/millionaire/ep';
import {Millionaire} from './episodes/millionaire/Millionaire';
import {MillionaireCover} from './episodes/millionaire/Cover';

ensureFonts();

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="NoMoneyAnymore" component={NoMoneyAnymore} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{withNarration: true}} />
		<Composition id="NoMoneyAnymoreV2" component={NoMoneyAnymoreV2} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{withNarration: true}} />
		<Composition id="NoMoneyAnymoreV3" component={NoMoneyAnymoreV3} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{withNarration: true}} />
		<Composition id="NeuralinkRemake" component={NeuralinkRemake} durationInFrames={NL_DURATION} fps={FPS} width={W} height={H} defaultProps={{withNarration: true}} />
		<Composition id="Asml" component={Asml} durationInFrames={ASML_DURATION} fps={FPS} width={W} height={H} defaultProps={{withNarration: true}} />
		<Composition id="IgAlgo" component={IgAlgo} durationInFrames={IG_DURATION} fps={FPS} width={W} height={H} defaultProps={{withNarration: true}} />
		<Composition id="AiAgent" component={AiAgent} durationInFrames={AA_DURATION} fps={FPS} width={W} height={H} defaultProps={{withNarration: true}} />
		<Composition id="Binance" component={Binance} durationInFrames={BN_DURATION} fps={FPS} width={W} height={H} defaultProps={{withNarration: true}} />
		<Composition id="RamGold" component={RamGold} durationInFrames={RG_DURATION} fps={FPS} width={W} height={H} defaultProps={{withNarration: true}} />
		<Composition id="RamGoldCover" component={RamGoldCover} durationInFrames={1} fps={FPS} width={W} height={H} defaultProps={{clean: false}} />
		<Composition id="Millionaire" component={Millionaire} durationInFrames={MA_DURATION} fps={FPS} width={W} height={H} defaultProps={{withNarration: true}} />
		<Composition id="MillionaireCover" component={MillionaireCover} durationInFrames={1} fps={FPS} width={W} height={H} defaultProps={{variant: 'A' as 'A' | 'B' | 'C'}} />
	</>
);
