"""LICENSES.md for the Neuralink remake: every real image/clip used, from its *.source.json sidecar
(original production sidecars in 02_NEURALINK/0x_*, new downloads in NEW_STYLE_REMAKE/03_MEDIA/raw)."""
import json, os, re
NL = r'D:/Content/02_NEURALINK'
USED = [  # (sidecar path relative to 02_NEURALINK, where/what in the remake, on-screen tag)
 ('NEW_STYLE_REMAKE/03_MEDIA/raw/n_nl_robot_cat.jpg', 'N2 2.5–3.9 s «أول إشي، رح نركّب»: Neuralink surgical robot (2020 event)', 'صورة حقيقية · روبوت الزرع · نيورالينك ٢٠٢٠'),
 ('03_REAL_FOOTAGE/commons/mri_7t_axial.webm', 'N2 3.9–5.0 s «بمخّك»: 7T MRI of a human brain on a paper monitor', 'صورة رنين حقيقية لمخ بشري'),
 ('04_PHOTOS/neurons/pyramidal_electrode.jpg', 'N2 5.0–6.6 s «بالخلايا العصبية»: real neuron micrograph (electrode illustrative)', 'خلية عصبية حقيقية + قطب (توضيحي)'),
 ('04_PHOTOS/historical/berger_eeg.png', 'N3 10.4–12.5 s «إشارات كهربائية»: first human EEG trace (1924)', 'أول تسجيل حقيقي لإشارات الدماغ · ١٩٢٤'),
 ('04_PHOTOS/historical/galvani_setup.png', 'N4 15.5–17.7 s «يرجّع معلومات لمخّك»: Galvani electrical stimulation plate (1791)', 'تحفيز كهربائي حقيقي · غالفاني ١٧٩١'),
 ('04_PHOTOS/pexels/px_humanoid_robot_35280158.jpg', 'N8 38.7–41.1 s «ونحطّها بروبوت»: a real humanoid robot today (no human memories)', 'روبوت حقيقي اليوم'),
 ('04_PHOTOS/neuralink_events/nl_unveiling.jpg', 'N10 48.6–54.3 s «شركة نيورالينك»: Elon Musk unveiling Neuralink (2019)', 'إطلاق نيورالينك ٢٠١٩'),
 ('04_PHOTOS/neuralink_events/nl_musk_future.jpg', 'N10 «تبعت إيلون ماسك»: Musk on stage with the Neuralink robot (2020)', 'صورة حقيقية · ماسك وروبوت نيورالينك ٢٠٢٠'),
 ('04_PHOTOS/neuralink_events/nl_noland_2024.jpg', 'N10 «قدرت تخلّي أشخاص»: Noland Arbaugh, first Neuralink participant (2024)', 'نولاند أربو · أول مريض ٢٠٢٤'),
 ('03_REAL_FOOTAGE/commons/bci_ecog_s009.ogv', 'N11 54.3–57.1 s «صرنا نقدر نتحكّم»: Pittsburgh ECoG study, brain-controlled robotic arm (2011)', 'تجربة حقيقية · جامعة بيتسبرغ ٢٠١١ — مش نيورالينك'),
 ('03_REAL_FOOTAGE/commons/bci_ecog_s010.ogv', 'N11 57.1–60.2 s «بمجرّد التفكير… وصار فعلاً»: the same study, high-five (fullscreen evidence)', 'لقطات حقيقية · تجربة جامعة بيتسبرغ'),
]
NOT_USED_NOTE = ('Downloaded/available but not used: n_braingate, n_utah_patent, n_flex_bci, n_hippocampus_gray, n_bci_types (time), '
                 'n_implant_future (rejected: AI-generated human face), all Pexels clips of people from the original production '
                 '(rejected under the "no irrelevant people" rule), eeg-cap portrait, Berger/Cajal portraits (people not mentioned in the narration).')
clean = lambda s: re.sub(r'\s+', ' ', re.sub('<[^>]+>', '', s or '')).strip()
L = ['# Media sources & licences — Neuralink remake (NEURALINK_NEW_STYLE_FINAL.mp4)', '',
     'Built from the provenance sidecars (`*.source.json`) written when each file was downloaded (licence and author read live from the',
     'Wikimedia Commons API; Pexels = Pexels License). Every real image/clip carries an on-screen tag + author + licence.', '',
     '**Official Neuralink media:** not used. Neuralink publishes no press kit with reuse terms (see the original production\'s LICENSES.md).',
     'All Neuralink-related photographs are third-party photographs under free licences.', '', '## Used', '']
for rel, what, tag in USED:
    p = os.path.join(NL, rel) + '.source.json'
    d = json.load(open(p, encoding='utf-8'))
    L += [f'### {os.path.basename(rel)}', f'- **Use:** {what} · tag «{tag}»',
          f"- **Source page:** {d.get('page') or d.get('url')}",
          f"- **Author / rights holder:** {clean(d.get('author'))}",
          f"- **Licence:** {d.get('licence')} ({d.get('licence_url') or ''})",
          f"- **Original file:** `02_NEURALINK/{rel}` · sha256 `{(d.get('sha256') or '')[:16]}…`", '']
L += ['## Not used', '', NOT_USED_NOTE, '', '## Original / in-house', '',
      '- **Narration:** the approved master `02_NEURALINK/01_AUDIO/Original/NeuralLink chip vid 2.m4a.mp4` (sha256 `EBE79AD1…1C44FCE`), copied byte-for-byte; unedited.',
      '- **All illustrations, diagrams, the paper brain-archive, implant, neurons, memory cards, cloud, phone, evidence board, chess monitor, textures:** original (Remotion/SVG, `_BRAND_SYSTEM/src/brand`). The implant drawing is illustrative (published 23 mm envelope only).',
      '- **Music and SFX:** original synthesis (`_BRAND_SYSTEM/tools/sfxlib.py`, `NEW_STYLE_REMAKE/04_SFX_MUSIC/audio_design.py`).',
      '- **Fonts (SIL OFL 1.1):** Alexandria, Baloo Bhaijaan 2, Lalezar, IBM Plex Sans Arabic, JetBrains Mono.',
      '- **Software:** Remotion 4.0.537 (Free License), FFmpeg, Python.', '',
      '## Notes', '',
      '- **ShareAlike items:** the Neuralink robot photo and the neuron micrograph are CC BY-SA. Credited on screen; see the original production for the same note.',
      '- **Identifiable people, all directly relevant:** Elon Musk (CC BY 2.0, Steve Jurvetson), Noland Arbaugh (CC BY 3.0, ClownChess), and the Pittsburgh study participant and researchers (CC BY 2.5, PLoS ONE supplementary video). Each is shown factually; no endorsement is implied.',
      '- The Pittsburgh study is explicitly labelled «مش نيورالينك».']
open(os.path.join(NL, 'NEW_STYLE_REMAKE', 'LICENSES.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n'); print('ok', len(USED))
