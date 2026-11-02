"""Writes media_sources.json — the list of licensed media to fetch (see fetch_media.py)."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C = [  # key, Wikimedia Commons filename, dest folder, what
 ('nl_robot_2020', 'Neuralink_Robot.jpg', '04_PHOTOS/neuralink_events', 'Neuralink surgical robot, Aug 2020 event'),
 ('nl_musk_future', 'Elon_Musk_and_the_Neuralink_Future.jpg', '04_PHOTOS/neuralink_events', 'Musk on stage with robots, 2020'),
 ('nl_pig_pens', 'Neuralink_Pig_Pens.jpg', '04_PHOTOS/neuralink_events', 'Pig pens at 2020 demo'),
 ('nl_master_plan', 'Elon_Musk_presenting_the_Neuralink_master_plan.jpg', '04_PHOTOS/neuralink_events', 'Musk presenting master plan 2019'),
 ('nl_unveiling', 'Elon_Musk_unveiling_Neuralink.jpg', '04_PHOTOS/neuralink_events', 'Neuralink unveiling 2019'),
 ('nl_monkey_matrix', 'Monkey_in_the_Matrix_(52536941713).jpg', '04_PHOTOS/neuralink_events', '2022 show and tell'),
 ('nl_noland_2024', 'Noland_Arbaugh_in_2024.jpg', '04_PHOTOS/neuralink_events', 'Noland Arbaugh, first Neuralink participant'),
 ('nl_noland_rop', 'Noland_Arbaugh_on_ROP.jpg', '04_PHOTOS/neuralink_events', 'Noland Arbaugh, podcast still'),
 ('bci_ecog_s009', 'An-Electrocorticographic-Brain-Interface-in-an-Individual-with-Tetraplegia-pone.0055344.s009.ogv', '03_REAL_FOOTAGE/commons', 'ECoG BCI study video'),
 ('bci_ecog_s010', 'An-Electrocorticographic-Brain-Interface-in-an-Individual-with-Tetraplegia-pone.0055344.s010.ogv', '03_REAL_FOOTAGE/commons', 'ECoG BCI study video'),
 ('bci_krol_cursor', 'Brain-computer_interface_experiment.jpg', '04_PHOTOS/bci', 'EEG-cap participant steering a cursor'),
 ('bci_eeg_cap', 'EEG_Recording_Cap.jpg', '04_PHOTOS/bci', 'EEG cap close-up'),
 ('nih_memory_codes', "Cracking_the_brain's_memory_codes_(34276634144).jpg", '04_PHOTOS/bci', 'NIH memory-codes image'),
 ('dbs_render', "Deep_brain_stimulation_in_a_Parkinson's_Disease_patient.png", '04_PHOTOS/bci', 'DBS electrodes render'),
 ('mri_7t_axial', '7_Tesla_MRI_of_the_ex_vivo_human_brain_at_100_micron_resolution_(100_micron_MRI_acquired_FA25_axial).webm', '03_REAL_FOOTAGE/commons', '7T MRI ex vivo brain, axial'),
 ('axon_flythrough', 'Axonal_nerve_fibers_in_a_brain_-_the_neural_network_that_is_us.webm', '03_REAL_FOOTAGE/commons', 'Axonal fibres fly-through'),
 ('dti_sagittal', 'DTI-sagittal-fibers.jpg', '04_PHOTOS/brain', 'DTI tractography sagittal'),
 ('brain_jar_cbp', 'Human_Brain_Seized_in_Canada_Post_Shipment_(49565528636).jpg', '04_PHOTOS/brain', 'Real human brain specimen'),
 ('skull_cc0', 'Cranium_-_lateral_view.jpg', '04_PHOTOS/brain', 'Real skull lateral'),
 ('skull_nara', 'SKULL-LEFT_SIDE_-_NARA_-_524338.jpg', '04_PHOTOS/historical', '19th c. skull photograph, NARA'),
 ('nih_neural_comm', 'Neural_Communication_(50531098802).jpg', '04_PHOTOS/neurons', 'NIH neural communication'),
 ('nih_mouse_neurons', 'Mouse_Neurons_(48905111662).jpg', '04_PHOTOS/neurons', 'NIH mouse neurons'),
 ('cortical_neurons', 'Cortical_neurons.jpg', '04_PHOTOS/neurons', 'Cortical neurons'),
 ('pyramidal_40x', 'Pyramidal_hippocampal_neuron_40x.jpg', '04_PHOTOS/neurons', 'Pyramidal neuron 40x'),
 ('pyramidal_electrode', 'Pyramidal_hippocampal_neuron_with_fake_microelectrode.jpg', '04_PHOTOS/neurons', 'Pyramidal neuron with illustrative microelectrode'),
 ('brainbow', 'Brainbow_(Smith_2007).jpg', '04_PHOTOS/neurons', 'Brainbow neurons'),
 ('cajal_cortex', 'Cajal_cortex_drawings.png', '04_PHOTOS/historical', 'Cajal cortex drawings'),
 ('cajal_purkinje', 'PurkinjeCell.jpg', '04_PHOTOS/historical', 'Cajal Purkinje cell'),
 ('cajal_portrait', 'Santiago_Ramón_y_Cajal_(1852-1934)_portrait_(restored).jpg', '04_PHOTOS/historical', 'Cajal portrait'),
 ('cajal_lab', 'Santiago_Ramón_y_Cajal_dando_cátedra_en_su_laboratorio.jpg', '04_PHOTOS/historical', 'Cajal in his lab'),
 ('berger_eeg', '1st-eeg.png', '04_PHOTOS/historical', 'First human EEG trace, Hans Berger'),
 ('berger_photo', 'HansBerger_Univ_Jena.jpeg', '04_PHOTOS/historical', 'Hans Berger'),
 ('vesalius_brain', 'The_entire_human_brain_and_cerebellum,_by_Vesalius._Wellcome_L0003677.jpg', '04_PHOTOS/historical', 'Vesalius 1543 brain'),
 ('galvani_setup', 'Galvani_frog_legs_experiment_setup.png', '04_PHOTOS/historical', 'Galvani frog legs setup'),
 ('galvani_wellcome', 'Galvani,_De_viribus_electricitatis_in_motu_muscolari_Wellcome_L0029689.jpg', '04_PHOTOS/historical', 'Galvani De viribus plate'),
 ('eniac', 'Reprogramming_ENIAC.png', '04_PHOTOS/historical', 'ENIAC 1946'),
]
P = [  # Pexels photos: key, id, author, what
 ('px_profile_silhouette', 38452917, 'Henry de Guzman', 'man profile silhouette'),
 ('px_eyes_dark', 18870805, 'Ananya Singh', 'eyes in darkness'),
 ('px_eye_macro', 28491940, 'Paragi Sethia', 'human eye macro'),
 ('px_wheelchair_laptop', 6592672, 'Mikhail Nilov', 'person in wheelchair using laptop'),
 ('px_surgeon_head', 21810006, 'Isabella Mendes', 'surgeon operating on head'),
 ('px_brain_scan_finger', 4226119, 'Anna Shvets', 'finger pointing at brain scan'),
 ('px_humanoid_robot', 35280158, 'Magda Ehlers', 'humanoid robot b/w'),
 ('px_old_family_photos', 16865233, 'dilara irem', 'old family photographs'),
]
V = [  # Pexels videos: key, id, author, what
 ('pv_eye_closeup', 7299471, 'Kindel Media', 'extreme close-up eye'),
 ('pv_eye_move', 36171729, 'Fotoarte en merida', 'eye movement close-up'),
 ('pv_face_side', 7299419, 'Kindel Media', 'side view of a face'),
 ('pv_face_dark', 12377242, 'Danil Lysov', 'face in darkness'),
 ('pv_neurosurgery', 31059637, 'Viktors Duks', 'neurosurgery operating room'),
 ('pv_microscope', 8771135, 'Gustavo Fring', 'man using microscope'),
 ('pv_wheelchair_laptop', 6984797, 'SHVETS production', 'wheelchair user with laptop'),
 ('pv_typing', 34124550, 'Melquizedeque Almeida', 'hands typing'),
 ('pv_prosthetic_hand', 6153725, 'cottonbro studio', 'prosthetic hand moving'),
 ('pv_humanoid_robot', 35280160, 'Magda Ehlers', 'humanoid robot exhibition'),
 ('pv_elderly_frame', 8057924, 'Pavel Danilyuk', 'elderly man with picture frame'),
 ('pv_family_photos_box', 34393391, 'fish socks', 'vintage family photos in a box'),
 ('pv_city_night', 40074031, 'Altaf Shah', 'aerial city at night'),
 ('pv_clouds_blue', 33705707, 'Larkkid Dung', 'white clouds against deep blue sky'),
 ('pv_clouds_golden', 10740623, 'I Am Sorin', 'clouds flowing in golden sky'),
 ('pv_phone_woman', 8066973, 'Anna Tarazevich', 'woman using a smartphone'),
 ('pv_shocked_woman', 8627749, 'Pavel Danilyuk', 'shocked woman'),
 ('pv_thinking_woman', 8724310, 'Tima Miroshnichenko', 'woman in deep thought'),
 ('pv_eyes_closed_man', 7350049, 'Norma Mortenson', 'man with eyes closed touching face'),
 ('pv_ear_closeup', 7477554, 'Angela Roma', 'close-up of a human ear'),
 ('pv_alley_pov', 34653154, 'Cagatay Kozan', 'walking through a narrow alley (POV)'),
 ('pv_elderly_photo', 7546745, 'SHVETS production', 'elderly woman holding an old photo'),
 ('pv_dark_portrait', 35088454, 'khezez', 'dramatic close-up with shadow lighting'),
]
path = os.path.join(ROOT, 'media_sources.json')
out = json.load(open(path, encoding='utf-8')) if os.path.exists(path) else {}
for k, f, d, w in C:
    ext = f.rsplit('.', 1)[1].lower()
    out.setdefault(k, {'src': 'commons', 'file': f, 'dest': f'{d}/{k}.{ext}', 'what': w})
for k, i, a, w in P:
    out.setdefault(k, {'src': 'pexels', 'page': f'https://www.pexels.com/photo/{i}/', 'url': f'https://images.pexels.com/photos/{i}/pexels-photo-{i}.jpeg',
                       'author': a, 'dest': f'04_PHOTOS/pexels/{k}_{i}.jpg', 'what': w})
for k, i, a, w in V:
    out.setdefault(k, {'src': 'pexels', 'page': f'https://www.pexels.com/video/{i}/', 'url': f'https://www.pexels.com/download/video/{i}/',
                       'author': a, 'dest': f'03_REAL_FOOTAGE/pexels/{k}_{i}.mp4', 'what': w})
json.dump(out, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(out), 'entries')
