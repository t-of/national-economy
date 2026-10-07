// カードの絵。1 枚ずつ別の絵（viewBox 0 0 280 168、線は #1d1d1d 2px、色は種類の色の濃淡 3 段と黒・生成り）
// main.js が <svg viewBox="0 0 280 168" stroke="#1d1d1d" stroke-width="2" stroke-linejoin="round"> の中に入れる
const ART = {
  g: `
<rect width="280" height="168" fill="#efe9da" stroke="none"/>
<rect x="0" y="140" width="280" height="28" fill="#a69b7e"/>
<rect x="34" y="78" width="84" height="62" fill="#d9d2c0"/>
<path d="M34 99h84M34 120h84M34 78l84 62" fill="none"/>
<path d="M136 140c-10-38 12-56 18-60l-6-9h30l-6 9c6 4 28 22 18 60z" fill="#fbf9f4"/>
<path d="M150 82h22" fill="none"/>
<rect x="206" y="96" width="38" height="44" rx="6" fill="#a69b7e"/>
<rect x="210" y="86" width="30" height="10" fill="#1d1d1d"/>
<path d="M214 112h22" fill="none"/>
`,
  mine: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<path d="M-2 170V92L70 30l70 42 60-32 82 62v68z" fill="#8f8f8a"/>
<path d="M70 30l-14 30 16-8 10 14M200 40l-10 24 14-6" fill="none"/>
<path d="M118 158v-46a24 24 0 0 1 48 0v46z" fill="#1d1d1d"/>
<rect x="106" y="104" width="10" height="56" fill="#fbf9f4"/>
<rect x="168" y="104" width="10" height="56" fill="#fbf9f4"/>
<rect x="100" y="96" width="84" height="10" fill="#fbf9f4"/>
<rect x="-2" y="156" width="284" height="14" fill="#3a3a3a"/>
<path d="M126 156L60 170M158 156L104 170" fill="none" stroke="#fbf9f4"/>
<path d="M24 120h60l-7 24H31z" fill="#3a3a3a"/>
<path d="M30 120l8-10 8 6 10-12 8 8 10-6 6 14" fill="#8f8f8a"/>
<circle cx="38" cy="148" r="6" fill="#fbf9f4"/>
<circle cx="70" cy="148" r="6" fill="#fbf9f4"/>
`,
  farm: `
<rect width="280" height="168" fill="#fbe7a1" stroke="none"/>
<circle cx="222" cy="40" r="20" fill="#f2c230"/>
<path d="M-2 114Q140 98 282 110v60H-2z" fill="#e0b02a"/>
<path d="M-2 132l284-8v46H-2z" fill="#f2c230"/>
<path d="M20 170l70-44M70 170l50-46M120 170l30-47M170 170l10-48M220 170l-10-49M270 170l-30-50" fill="none" stroke="#c7951a" stroke-width="3"/>
<rect x="44" y="78" width="54" height="34" fill="#fbf9f4"/>
<path d="M38 80l33-24 33 24z" fill="#1d1d1d"/>
<rect x="62" y="92" width="18" height="20" fill="#c7951a"/>
<path d="M62 92l18 20M80 92l-18 20" fill="none"/>
<path d="M196 122V90M212 120V84M228 118V92" fill="none"/>
<ellipse cx="196" cy="86" rx="4" ry="9" fill="#c7951a"/>
<ellipse cx="212" cy="80" rx="4" ry="9" fill="#c7951a"/>
<ellipse cx="228" cy="88" rx="4" ry="9" fill="#c7951a"/>
`,
  factory: `
<rect width="280" height="168" fill="#c9d8f0" stroke="none"/>
<circle cx="64" cy="28" r="10" fill="#fbf9f4"/>
<circle cx="80" cy="18" r="12" fill="#fbf9f4"/>
<circle cx="100" cy="12" r="9" fill="#fbf9f4"/>
<rect x="52" y="36" width="16" height="70" fill="#163a75"/>
<rect x="212" y="50" width="12" height="56" fill="#163a75"/>
<path d="M20 152V96l40-20v20l40-20v20l40-20v20l40-20v20l40-20v20l40-20v76z" fill="#2456a6"/>
<rect x="32" y="110" width="20" height="14" fill="#c9d8f0"/>
<rect x="72" y="110" width="20" height="14" fill="#c9d8f0"/>
<rect x="112" y="110" width="20" height="14" fill="#c9d8f0"/>
<rect x="152" y="110" width="20" height="14" fill="#c9d8f0"/>
<rect x="192" y="110" width="20" height="14" fill="#c9d8f0"/>
<rect x="232" y="110" width="20" height="14" fill="#c9d8f0"/>
<rect x="120" y="132" width="32" height="20" fill="#163a75"/>
<rect x="-2" y="152" width="284" height="18" fill="#163a75"/>
`,
  coffee: `
<rect width="280" height="168" fill="#cde6df" stroke="none"/>
<rect x="40" y="26" width="200" height="140" fill="#fbf9f4"/>
<rect x="40" y="26" width="200" height="26" fill="#12524a"/>
<path d="M30 52h220v20H30z" fill="#fbf9f4"/>
<path d="M30 52h22v20H30zM74 52h22v20H74zM118 52h22v20h-22zM162 52h22v20h-22zM206 52h22v20h-22z" fill="#1f7a6b"/>
<path d="M30 72a11 8 0 0 0 22 0 11 8 0 0 0 22 0 11 8 0 0 0 22 0 11 8 0 0 0 22 0 11 8 0 0 0 22 0 11 8 0 0 0 22 0 11 8 0 0 0 22 0 11 8 0 0 0 22 0 11 8 0 0 0 22 0 11 8 0 0 0 22 0z" fill="#1f7a6b"/>
<rect x="56" y="92" width="96" height="58" fill="#cde6df"/>
<path d="M82 112h40v12a20 16 0 0 1-40 0z" fill="#fbf9f4"/>
<path d="M122 115a7 7 0 0 1 0 14" fill="none"/>
<path d="M94 106c-5-5 5-9 0-14M108 106c-5-5 5-9 0-14" fill="none"/>
<rect x="168" y="92" width="52" height="74" fill="#1f7a6b"/>
<circle cx="208" cy="130" r="3" fill="#fbf9f4"/>
<rect x="-2" y="160" width="284" height="10" fill="#12524a"/>
`,
  rail: `
<rect width="280" height="168" fill="#f3cfc7" stroke="none"/>
<path d="M-2 110Q60 78 120 102T282 92v78H-2z" fill="#e9a596"/>
<circle cx="90" cy="46" r="8" fill="#fbf9f4"/>
<circle cx="74" cy="34" r="10" fill="#fbf9f4"/>
<circle cx="52" cy="26" r="12" fill="#fbf9f4"/>
<rect x="-2" y="114" width="284" height="10" fill="#8a2416"/>
<rect x="24" y="124" width="20" height="46" fill="#8a2416"/>
<rect x="100" y="124" width="20" height="46" fill="#8a2416"/>
<rect x="176" y="124" width="20" height="46" fill="#8a2416"/>
<rect x="252" y="124" width="20" height="46" fill="#8a2416"/>
<rect x="70" y="76" width="80" height="24" fill="#c63d2a"/>
<rect x="84" y="56" width="12" height="20" fill="#1d1d1d"/>
<rect x="140" y="56" width="42" height="44" fill="#c63d2a"/>
<rect x="136" y="50" width="50" height="6" fill="#1d1d1d"/>
<rect x="150" y="64" width="22" height="14" fill="#f3cfc7"/>
<path d="M70 100L56 114h14z" fill="#1d1d1d"/>
<circle cx="92" cy="106" r="8" fill="#1d1d1d"/>
<circle cx="124" cy="106" r="8" fill="#1d1d1d"/>
<circle cx="166" cy="108" r="6" fill="#1d1d1d"/>
<path d="M92 106h74" fill="none" stroke="#fbf9f4"/>
`,
  burn: `
<rect width="280" height="168" fill="#fbe7a1" stroke="none"/>
<circle cx="160" cy="52" r="10" fill="#e0b02a"/>
<circle cx="178" cy="38" r="13" fill="#e0b02a"/>
<circle cx="202" cy="28" r="15" fill="#e0b02a"/>
<circle cx="234" cy="26" r="12" fill="#e0b02a"/>
<rect x="-2" y="112" width="284" height="58" fill="#c7951a"/>
<path d="M-2 132l284-6M-2 150l284-6" fill="none" stroke="#e0b02a" stroke-width="3"/>
<ellipse cx="56" cy="136" rx="30" ry="8" fill="#1d1d1d"/>
<ellipse cx="226" cy="140" rx="34" ry="9" fill="#1d1d1d"/>
<ellipse cx="140" cy="140" rx="52" ry="12" fill="#1d1d1d"/>
<path d="M104 134C100 112 120 106 122 90c8 8 12 14 12 4 4-16 16-18 18-32 14 20 26 34 20 56 6-2 8-6 10-10 8 14 6 24-2 28z" fill="#f2c230"/>
<path d="M130 136c-8-12 2-18 6-28 6 8 18 12 10 28z" fill="#fbf9f4"/>
<path d="M44 134c-4-10 4-14 6-24 8 8 12 16 8 24z" fill="#f2c230"/>
<path d="M214 138c-4-10 4-16 6-24 8 8 14 16 8 24z" fill="#f2c230"/>
<path d="M16 124V108M24 126V104M254 128V110M264 126V106" fill="none"/>
`,
  orchard: `
<rect width="280" height="168" fill="#fbe7a1" stroke="none"/>
<circle cx="236" cy="30" r="16" fill="#f2c230"/>
<rect x="-2" y="108" width="284" height="62" fill="#f2c230"/>
<path d="M-2 108h284" fill="none"/>
<rect x="51" y="98" width="10" height="46" fill="#c7951a"/>
<circle cx="56" cy="70" r="26" fill="#e0b02a"/>
<circle cx="40" cy="86" r="16" fill="#e0b02a"/>
<circle cx="72" cy="86" r="16" fill="#e0b02a"/>
<rect x="135" y="98" width="10" height="46" fill="#c7951a"/>
<circle cx="140" cy="70" r="26" fill="#e0b02a"/>
<circle cx="124" cy="86" r="16" fill="#e0b02a"/>
<circle cx="156" cy="86" r="16" fill="#e0b02a"/>
<rect x="219" y="98" width="10" height="46" fill="#c7951a"/>
<circle cx="224" cy="70" r="26" fill="#e0b02a"/>
<circle cx="208" cy="86" r="16" fill="#e0b02a"/>
<circle cx="240" cy="86" r="16" fill="#e0b02a"/>
<path d="M46 66a5 5 0 1 0 10 0a5 5 0 1 0-10 0M62 78a5 5 0 1 0 10 0a5 5 0 1 0-10 0M36 86a5 5 0 1 0 10 0a5 5 0 1 0-10 0M130 64a5 5 0 1 0 10 0a5 5 0 1 0-10 0M146 80a5 5 0 1 0 10 0a5 5 0 1 0-10 0M120 88a5 5 0 1 0 10 0a5 5 0 1 0-10 0M214 66a5 5 0 1 0 10 0a5 5 0 1 0-10 0M230 80a5 5 0 1 0 10 0a5 5 0 1 0-10 0M204 88a5 5 0 1 0 10 0a5 5 0 1 0-10 0" fill="#c7951a"/>
<path d="M20 152h30M96 156h30M166 152h30M236 156h30" fill="none" stroke="#c7951a" stroke-width="3"/>
`,
  bigfarm: `
<rect width="280" height="168" fill="#fbe7a1" stroke="none"/>
<circle cx="236" cy="28" r="16" fill="#f2c230"/>
<rect x="-2" y="106" width="284" height="64" fill="#e0b02a"/>
<path d="M-2 106h284" fill="none"/>
<path d="M-2 132l284-10v48H-2z" fill="#f2c230"/>
<path d="M0 170L60 120M60 170L96 124M120 170L132 124M180 170L170 124M240 170L206 124" fill="none" stroke="#c7951a" stroke-width="3"/>
<path d="M92 108V84l28-20 28 20v24z" fill="#c7951a"/>
<path d="M86 86l34-26 34 26" fill="none" stroke-width="5"/>
<rect x="108" y="88" width="24" height="20" fill="#fbf9f4"/>
<path d="M108 88l24 20M132 88l-24 20" fill="none"/>
<rect x="16" y="52" width="26" height="60" fill="#fbf9f4"/>
<path d="M16 52a13 13 0 0 1 26 0z" fill="#c7951a"/>
<path d="M16 76h26M16 94h26" fill="none"/>
<rect x="46" y="38" width="26" height="74" fill="#fbf9f4"/>
<path d="M46 38a13 13 0 0 1 26 0z" fill="#c7951a"/>
<path d="M46 64h26M46 88h26" fill="none"/>
<path d="M42 56h4v6h-4z" fill="#1d1d1d"/>
<rect x="188" y="116" width="6" height="14" fill="#1d1d1d"/>
<rect x="174" y="128" width="46" height="18" fill="#f2c230"/>
<rect x="216" y="112" width="30" height="36" fill="#fbf9f4"/>
<rect x="222" y="118" width="18" height="14" fill="#fbe7a1"/>
<rect x="212" y="106" width="38" height="6" fill="#1d1d1d"/>
<circle cx="236" cy="148" r="17" fill="#1d1d1d"/>
<circle cx="236" cy="148" r="6" fill="#e0b02a"/>
<circle cx="188" cy="154" r="11" fill="#1d1d1d"/>
<circle cx="188" cy="154" r="4" fill="#e0b02a"/>
`,
  steel: `
<rect width="280" height="168" fill="#c9d8f0" stroke="none"/>
<circle cx="112" cy="14" r="8" fill="#fbf9f4"/>
<circle cx="130" cy="8" r="9" fill="#fbf9f4"/>
<circle cx="150" cy="10" r="7" fill="#fbf9f4"/>
<path d="M30 150L96 56" fill="none" stroke-width="4"/>
<path d="M54 118l12-4 6 10-12 4z" fill="#163a75"/>
<rect x="124" y="20" width="14" height="22" fill="#163a75"/>
<path d="M96 150L88 100L104 42h56l16 58-8 50z" fill="#2456a6"/>
<path d="M92 108h80M98 78h68M104 56h56" fill="none"/>
<path d="M170 76h14v52h-10" fill="none" stroke-width="4"/>
<rect x="192" y="60" width="26" height="90" fill="#163a75"/>
<path d="M192 60a13 13 0 0 1 26 0z" fill="#163a75"/>
<rect x="224" y="76" width="26" height="74" fill="#163a75"/>
<path d="M224 76a13 13 0 0 1 26 0z" fill="#163a75"/>
<path d="M192 100h26M224 110h26" fill="none" stroke="#fbf9f4"/>
<rect x="-2" y="150" width="284" height="20" fill="#163a75"/>
<path d="M114 138h18v12h-18z" fill="#fbf9f4"/>
<path d="M114 144L70 146v4h44z" fill="#fbf9f4"/>
<path d="M22 112h52l-6 38H28z" fill="#163a75"/>
<path d="M22 112h52l-2 8H24z" fill="#fbf9f4"/>
<path d="M82 128l-6 6M92 124l4 8M70 132l-8 2" fill="none" stroke="#fbf9f4"/>
`,
  chem: `
<rect width="280" height="168" fill="#c9d8f0" stroke="none"/>
<circle cx="164" cy="14" r="8" fill="#fbf9f4"/>
<circle cx="180" cy="8" r="9" fill="#fbf9f4"/>
<rect x="148" y="30" width="32" height="118" fill="#2456a6"/>
<path d="M148 30a16 10 0 0 1 32 0z" fill="#2456a6"/>
<path d="M148 56h32M148 82h32M148 108h32" fill="none"/>
<path d="M192 44v12h-12M192 44h14" fill="none" stroke-width="4"/>
<path d="M44 116L34 148M96 116l10 32M70 122v26" fill="none" stroke-width="4"/>
<circle cx="70" cy="84" r="36" fill="#fbf9f4"/>
<path d="M34 84a36 10 0 0 0 72 0" fill="none"/>
<path d="M50 62a26 26 0 0 1 14-10" fill="none"/>
<rect x="104" y="120" width="46" height="8" fill="#fbf9f4"/>
<rect x="180" y="100" width="12" height="8" fill="#fbf9f4"/>
<rect x="196" y="86" width="52" height="62" fill="#163a75"/>
<path d="M196 86a26 14 0 0 1 52 0z" fill="#163a75"/>
<path d="M196 112h52" fill="none" stroke="#fbf9f4"/>
<circle cx="222" cy="130" r="5" fill="#fbf9f4"/>
<rect x="-2" y="148" width="284" height="22" fill="#163a75"/>
<path d="M18 148h20M110 148h20" fill="none" stroke="#fbf9f4"/>
`,
  car: `
<rect width="280" height="168" fill="#c9d8f0" stroke="none"/>
<rect x="16" y="32" width="46" height="30" fill="#fbf9f4"/>
<rect x="76" y="32" width="46" height="30" fill="#fbf9f4"/>
<rect x="236" y="32" width="36" height="30" fill="#fbf9f4"/>
<rect x="-2" y="-2" width="284" height="16" fill="#163a75"/>
<path d="M176 14h14l8 30h-14z" fill="#2456a6"/>
<circle cx="196" cy="46" r="8" fill="#fbf9f4"/>
<path d="M192 42l12 8-10 28-9-5z" fill="#2456a6"/>
<path d="M174 86l-8-4M180 88l-2 8M168 90l-8 2" fill="none"/>
<rect x="-2" y="130" width="284" height="16" fill="#2456a6"/>
<rect x="-2" y="146" width="284" height="24" fill="#163a75"/>
<path d="M92 128V110Q92 104 100 103L136 98L152 80H190L208 98L226 102Q234 104 234 110V128z" fill="#fbf9f4"/>
<path d="M143 97L155 84H169V97zM174 84H187L200 97H174z" fill="#c9d8f0"/>
<path d="M94 116h138" fill="none"/>
<circle cx="120" cy="128" r="12" fill="#1d1d1d"/>
<circle cx="120" cy="128" r="5" fill="#fbf9f4"/>
<circle cx="206" cy="128" r="12" fill="#1d1d1d"/>
<circle cx="206" cy="128" r="5" fill="#fbf9f4"/>
<rect x="22" y="116" width="26" height="14" fill="#2456a6"/>
<rect x="250" y="112" width="22" height="18" fill="#2456a6"/>
<path d="M24 138h20M64 138h20M150 138h20M240 138h20" fill="none" stroke="#c9d8f0"/>
`,
  design: `
<rect width="280" height="168" fill="#cde6df" stroke="none"/>
<rect x="-2" y="152" width="284" height="18" fill="#12524a"/>
<path d="M62 108L50 156M218 108l12 48M56 130h168" fill="none" stroke-width="4"/>
<path d="M54 54H226L244 108H36z" fill="#12524a"/>
<path d="M66 60H214L228 102H52z" fill="#1f7a6b"/>
<path d="M82 96V78l32-10 32 10v18zM96 96V86h12v10M122 80h16v8h-16z" fill="none" stroke="#fbf9f4" stroke-width="1.5"/>
<path d="M164 72h40M164 84h44M164 96h48" fill="none" stroke="#fbf9f4" stroke-width="1.5"/>
<path d="M150 98l30-22 6 6-30 22z" fill="#fbf9f4"/>
<path d="M150 98l-6 8 10-2z" fill="#1d1d1d"/>
<rect x="250" y="112" width="18" height="42" fill="#fbf9f4"/>
<ellipse cx="259" cy="112" rx="9" ry="4" fill="#cde6df"/>
<path d="M250 126h18" fill="none"/>
`,
  builder: `
<rect width="280" height="168" fill="#cde6df" stroke="none"/>
<circle cx="40" cy="36" r="12" fill="#fbf9f4"/>
<circle cx="58" cy="30" r="14" fill="#fbf9f4"/>
<rect x="-2" y="140" width="284" height="30" fill="#12524a"/>
<rect x="100" y="122" width="106" height="18" fill="#fbf9f4"/>
<rect x="100" y="84" width="50" height="38" fill="#fbf9f4"/>
<rect x="114" y="94" width="16" height="16" fill="#cde6df"/>
<path d="M162 84v38M178 84v38M194 84v38M206 84v38M150 84h56" fill="none"/>
<path d="M92 86L150 52V86z" fill="#12524a"/>
<path d="M150 52L208 86M170 64v22M190 76v10" fill="none"/>
<path d="M174 38v10" fill="none"/>
<rect x="156" y="48" width="36" height="7" fill="#1f7a6b"/>
<rect x="224" y="42" width="14" height="98" fill="#1f7a6b"/>
<path d="M224 62l14 14M238 62l-14 14M224 86l14 14M238 86l-14 14M224 110l14 14M238 110l-14 14" fill="none"/>
<rect x="132" y="28" width="132" height="10" fill="#1f7a6b"/>
<rect x="246" y="38" width="14" height="14" fill="#1d1d1d"/>
<rect x="210" y="14" width="12" height="14" fill="#fbf9f4"/>
<rect x="216" y="136" width="30" height="6" fill="#12524a"/>
<rect x="24" y="126" width="30" height="14" fill="#fbf9f4"/>
<rect x="30" y="112" width="30" height="14" fill="#fbf9f4"/>
<path d="M24 133h30M30 119h30" fill="none"/>
`,
  restaurant: `
<rect width="280" height="168" fill="#cde6df" stroke="none"/>
<rect x="-2" y="154" width="284" height="16" fill="#12524a"/>
<path d="M140 -2V22" fill="none"/>
<path d="M120 38L130 22h20l10 16z" fill="#12524a"/>
<path d="M130 38h20" fill="none" stroke="#fbf9f4"/>
<rect x="6" y="84" width="12" height="70" fill="#12524a"/>
<rect x="262" y="84" width="12" height="70" fill="#12524a"/>
<path d="M44 108h192v10H44z" fill="#fbf9f4"/>
<path d="M52 118h176v36H52z" fill="#1f7a6b"/>
<path d="M80 118v36M110 118v36M140 118v36M170 118v36M200 118v36" fill="none" stroke="#fbf9f4"/>
<path d="M100 108h80v-4H100z" fill="#cde6df"/>
<path d="M102 104a38 36 0 0 1 76 0z" fill="#fbf9f4"/>
<path d="M114 92a28 26 0 0 1 12-14" fill="none"/>
<circle cx="140" cy="64" r="5" fill="#12524a"/>
<path d="M62 76h16l-2 14q-6 4-12 0z" fill="#12524a"/>
<path d="M70 94v12M62 106h16" fill="none"/>
<path d="M118 112h44" fill="none"/>
<rect x="206" y="84" width="8" height="20" fill="#fbf9f4"/>
<path d="M210 82c-4-5 0-8 0-12 4 4 4 8 0 12z" fill="#fbf9f4"/>
<path d="M196 104h28" fill="none"/>
`,
  general: `
<rect width="280" height="168" fill="#cde6df" stroke="none"/>
<rect x="14" y="100" width="46" height="50" fill="#fbf9f4"/>
<path d="M22 108h10v8H22zM42 108h10v8H42zM22 126h10v8H22zM42 126h10v8H42z" fill="#cde6df"/>
<rect x="224" y="112" width="48" height="38" fill="#fbf9f4"/>
<path d="M232 120h10v8h-10zM252 120h10v8h-10z" fill="#cde6df"/>
<rect x="80" y="76" width="70" height="74" fill="#1f7a6b"/>
<path d="M88 84h12v10H88zM109 84h12v10h-12zM130 84h12v10h-12zM88 104h12v10H88zM109 104h12v10h-12zM130 104h12v10h-12zM88 124h12v10H88zM109 124h12v10h-12zM130 124h12v10h-12z" fill="#cde6df"/>
<path d="M84 76V44M115 76V44M146 76V44" fill="none" stroke-width="3"/>
<rect x="76" y="70" width="78" height="6" fill="#12524a"/>
<rect x="76" y="56" width="78" height="5" fill="#12524a"/>
<rect x="76" y="42" width="78" height="5" fill="#12524a"/>
<rect x="-2" y="148" width="284" height="22" fill="#12524a"/>
<rect x="182" y="42" width="14" height="106" fill="#1f7a6b"/>
<path d="M182 62l14 14M196 62l-14 14M182 86l14 14M196 86l-14 14M182 110l14 14M196 110l-14 14" fill="none"/>
<path d="M182 42h14l-7-18z" fill="#1f7a6b"/>
<rect x="96" y="24" width="152" height="8" fill="#1f7a6b"/>
<path d="M189 24L100 24M189 24L246 24" fill="none" stroke="#1d1d1d"/>
<rect x="228" y="32" width="14" height="14" fill="#1d1d1d"/>
<rect x="176" y="10" width="26" height="14" fill="#fbf9f4"/>
<path d="M114 32v38" fill="none"/>
<rect x="102" y="52" width="24" height="9" fill="#12524a"/>
<path d="M114 61V70" fill="none"/>
<rect x="176" y="144" width="26" height="6" fill="#1d1d1d"/>
`,
  stall: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="148" width="284" height="22" fill="#8f8f8a"/>
<rect x="82" y="68" width="6" height="74" fill="#3a3a3a"/>
<rect x="192" y="68" width="6" height="74" fill="#3a3a3a"/>
<path d="M72 64H208l10 28H62z" fill="#fbf9f4"/>
<path d="M72 64H94.7L88 92H62zM117.3 64H140l-0 28H114zM162.7 64H185.3L192 92H166z" fill="#3a3a3a"/>
<rect x="76" y="110" width="128" height="34" fill="#8f8f8a"/>
<path d="M76 118h128" fill="none"/>
<path d="M92 102a7 7 0 1 0 14 0a7 7 0 1 0-14 0M112 102a7 7 0 1 0 14 0a7 7 0 1 0-14 0" fill="#fbf9f4"/>
<path d="M150 108h40v2h-40zM152 98h16v10h-16z" fill="#3a3a3a"/>
<circle cx="96" cy="148" r="10" fill="#3a3a3a"/>
<circle cx="96" cy="148" r="4" fill="#fbf9f4"/>
<circle cx="184" cy="148" r="10" fill="#3a3a3a"/>
<circle cx="184" cy="148" r="4" fill="#fbf9f4"/>
<path d="M76 118L60 108M204 118l14-10" fill="none"/>
`,
  market: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<path d="M0 28Q70 50 140 30T280 28" fill="none"/>
<path d="M20 36l8 14 8-12zM54 42l8 14 8-14zM96 44l8 14 8-14zM164 44l8 14 8-14zM206 42l8 14 8-14zM244 36l8 14 8-12z" fill="#3a3a3a"/>
<rect x="-2" y="144" width="284" height="26" fill="#8f8f8a"/>
<rect x="10" y="62" width="84" height="22" fill="#fbf9f4"/>
<rect x="98" y="62" width="84" height="22" fill="#fbf9f4"/>
<rect x="186" y="62" width="84" height="22" fill="#fbf9f4"/>
<path d="M10 62h14v22H10zM38 62h14v22H38zM66 62h14v22H66zM98 62h14v22H98zM126 62h14v22h-14zM154 62h14v22h-14zM186 62h14v22h-14zM214 62h14v22h-14zM242 62h14v22h-14z" fill="#3a3a3a"/>
<rect x="12" y="84" width="5" height="60" fill="#3a3a3a"/>
<rect x="93" y="84" width="5" height="60" fill="#3a3a3a"/>
<rect x="181" y="84" width="5" height="60" fill="#3a3a3a"/>
<rect x="265" y="84" width="5" height="60" fill="#3a3a3a"/>
<rect x="17" y="114" width="76" height="30" fill="#8f8f8a"/>
<rect x="98" y="114" width="83" height="30" fill="#8f8f8a"/>
<rect x="186" y="114" width="79" height="30" fill="#8f8f8a"/>
<path d="M24 106a6 6 0 1 0 12 0a6 6 0 1 0-12 0M40 106a6 6 0 1 0 12 0a6 6 0 1 0-12 0M56 106a6 6 0 1 0 12 0a6 6 0 1 0-12 0M72 106a6 6 0 1 0 12 0a6 6 0 1 0-12 0M194 106a6 6 0 1 0 12 0a6 6 0 1 0-12 0M210 106a6 6 0 1 0 12 0a6 6 0 1 0-12 0M226 106a6 6 0 1 0 12 0a6 6 0 1 0-12 0M242 106a6 6 0 1 0 12 0a6 6 0 1 0-12 0" fill="#fbf9f4"/>
<path d="M110 106a7 7 0 1 0 14 0a7 7 0 1 0-14 0M128 106a7 7 0 1 0 14 0a7 7 0 1 0-14 0M146 106a7 7 0 1 0 14 0a7 7 0 1 0-14 0" fill="#3a3a3a"/>
<path d="M24 124h60M106 124h66M194 124h62" fill="none" stroke="#fbf9f4"/>
`,
  super: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="140" width="284" height="30" fill="#8f8f8a"/>
<rect x="24" y="64" width="232" height="76" fill="#fbf9f4"/>
<rect x="18" y="56" width="244" height="12" fill="#3a3a3a"/>
<rect x="100" y="34" width="80" height="22" fill="#3a3a3a"/>
<circle cx="140" cy="45" r="7" fill="#fbf9f4"/>
<rect x="34" y="82" width="62" height="46" fill="#d9d9d4"/>
<path d="M65 82v46M34 105h62" fill="none"/>
<rect x="184" y="82" width="62" height="46" fill="#d9d9d4"/>
<path d="M215 82v46M184 105h62" fill="none"/>
<rect x="104" y="70" width="72" height="10" fill="#3a3a3a"/>
<rect x="110" y="86" width="60" height="54" fill="#d9d9d4"/>
<path d="M140 86v54M110 100h60" fill="none"/>
<path d="M14 104H60l-6 26H22zM204 104h46l-6 26h-32z" fill="#fbf9f4"/>
<path d="M14 104L8 94M204 104l-6-10M28 104l2 26M38 104v26M48 104l-2 26M20 117h38M210 117h38" fill="none"/>
<circle cx="30" cy="138" r="4" fill="#1d1d1d"/>
<circle cx="48" cy="138" r="4" fill="#1d1d1d"/>
<circle cx="220" cy="138" r="4" fill="#1d1d1d"/>
<circle cx="238" cy="138" r="4" fill="#1d1d1d"/>
<path d="M90 156h24M166 156h24" fill="none" stroke="#fbf9f4"/>
`,
  dept: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="148" width="284" height="22" fill="#8f8f8a"/>
<rect x="14" y="76" width="252" height="72" fill="#fbf9f4"/>
<rect x="50" y="46" width="180" height="32" fill="#fbf9f4"/>
<rect x="116" y="22" width="48" height="26" fill="#fbf9f4"/>
<path d="M108 22L140 4l32 18z" fill="#3a3a3a"/>
<circle cx="140" cy="35" r="8" fill="#d9d9d4"/>
<path d="M140 35v-5M140 35l4 2" fill="none"/>
<path d="M8 76h264M44 46h192" fill="none" stroke-width="3"/>
<path d="M58 54h12v14H58zM78 54h12v14H78zM98 54h12v14H98zM170 54h12v14h-12zM190 54h12v14h-12zM210 54h12v14h-12zM24 86h12v14H24zM44 86h12v14H44zM64 86h12v14H64zM84 86h12v14H84zM184 86h12v14h-12zM204 86h12v14h-12zM224 86h12v14h-12zM244 86h12v14h-12z" fill="#8f8f8a"/>
<path d="M100 86h12v14h-12zM120 86h12v14h-12zM148 86h12v14h-12zM168 86h12v14h-12z" fill="#8f8f8a"/>
<rect x="30" y="112" width="12" height="32" fill="#3a3a3a"/>
<rect x="50" y="112" width="12" height="32" fill="#3a3a3a"/>
<rect x="218" y="112" width="12" height="32" fill="#3a3a3a"/>
<rect x="238" y="112" width="12" height="32" fill="#3a3a3a"/>
<rect x="94" y="106" width="92" height="8" fill="#3a3a3a"/>
<rect x="100" y="114" width="6" height="34" fill="#8f8f8a"/>
<rect x="174" y="114" width="6" height="34" fill="#8f8f8a"/>
<rect x="112" y="120" width="56" height="28" fill="#d9d9d4"/>
<path d="M140 120v28" fill="none"/>
<path d="M88 148h104" fill="none" stroke="#3a3a3a" stroke-width="4"/>
`,
  expo: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="146" width="284" height="24" fill="#8f8f8a"/>
<path d="M24 146a42 40 0 0 1 84 0z" fill="#fbf9f4"/>
<path d="M66 106V146M44 112L48 146M88 112L84 146M30 130h72" fill="none"/>
<path d="M66 106V90" fill="none"/>
<path d="M66 90l14 4-14 5z" fill="#3a3a3a"/>
<path d="M128 146L135 52H145L152 146z" fill="#3a3a3a"/>
<path d="M130 120L150 90M150 120L130 90M134 82L146 62M146 82L134 62" fill="none" stroke="#fbf9f4"/>
<ellipse cx="140" cy="48" rx="24" ry="8" fill="#fbf9f4"/>
<path d="M134 42L140 12L146 42z" fill="#8f8f8a"/>
<path d="M140 12V4" fill="none"/>
<rect x="176" y="106" width="86" height="40" fill="#8f8f8a"/>
<path d="M170 108Q219 66 268 108z" fill="#3a3a3a"/>
<rect x="196" y="120" width="46" height="26" fill="#d9d9d4"/>
<path d="M219 120v26" fill="none"/>
<path d="M198 92V74M219 82V62M240 92V74" fill="none"/>
<path d="M198 74l-12 4 12 5zM219 62l12 4-12 5zM240 74l-12 4 12 5z" fill="#fbf9f4"/>
<path d="M114 146l-20 22M166 146l22 22" fill="none" stroke="#fbf9f4" stroke-width="3"/>
`,
  warehouse: `
<rect width="280" height="168" fill="#f3cfc7" stroke="none"/>
<rect x="-2" y="140" width="284" height="30" fill="#e9a596"/>
<path d="M24 66l12-24h132l12 24z" fill="#c63d2a"/>
<rect x="24" y="66" width="156" height="74" fill="#fbf9f4"/>
<rect x="62" y="84" width="84" height="56" fill="#e9a596"/>
<path d="M62 98h84M62 112h84M62 126h84" fill="none"/>
<rect x="192" y="108" width="32" height="32" fill="#e9a596"/>
<rect x="224" y="108" width="32" height="32" fill="#c63d2a"/>
<rect x="208" y="76" width="32" height="32" fill="#c63d2a"/>
<path d="M192 108l32 32M224 140v-32l32 32M208 76l32 32M240 76l-32 32" fill="none"/>
<rect x="56" y="92" width="6" height="48" fill="#1d1d1d"/>
<path d="M62 138H38" fill="none" stroke-width="4"/>
<rect x="40" y="120" width="18" height="16" fill="#fbf9f4"/>
<rect x="66" y="116" width="36" height="20" fill="#c63d2a"/>
<path d="M78 116v-16h16v16" fill="#8a2416"/>
<circle cx="76" cy="138" r="7" fill="#1d1d1d"/>
<circle cx="98" cy="138" r="7" fill="#1d1d1d"/>
`,
  housing: `
<rect width="280" height="168" fill="#f3cfc7" stroke="none"/>
<rect x="-2" y="140" width="284" height="30" fill="#8a2416"/>
<rect x="172" y="76" width="74" height="64" fill="#e9a596"/>
<rect x="166" y="70" width="86" height="8" fill="#8a2416"/>
<rect x="184" y="90" width="18" height="18" fill="#fbf9f4"/>
<rect x="216" y="90" width="18" height="18" fill="#fbf9f4"/>
<rect x="200" y="112" width="18" height="28" fill="#c63d2a"/>
<rect x="96" y="22" width="26" height="16" fill="#8a2416"/>
<rect x="44" y="36" width="118" height="104" fill="#c63d2a"/>
<rect x="38" y="30" width="130" height="8" fill="#1d1d1d"/>
<rect x="58" y="50" width="20" height="22" fill="#f3cfc7"/>
<rect x="92" y="50" width="20" height="22" fill="#f3cfc7"/>
<rect x="126" y="50" width="20" height="22" fill="#f3cfc7"/>
<rect x="58" y="84" width="20" height="22" fill="#f3cfc7"/>
<rect x="92" y="84" width="20" height="22" fill="#f3cfc7"/>
<rect x="126" y="84" width="20" height="22" fill="#f3cfc7"/>
<path d="M54 76h28M122 76h28" fill="none"/>
<rect x="92" y="112" width="20" height="28" fill="#8a2416"/>
<rect x="58" y="116" width="20" height="16" fill="#f3cfc7"/>
<rect x="126" y="116" width="20" height="16" fill="#f3cfc7"/>
`,
  law: `
<rect width="280" height="168" fill="#f3cfc7" stroke="none"/>
<rect x="-2" y="150" width="284" height="20" fill="#8a2416"/>
<path d="M36 64L140 22l104 42z" fill="#e9a596"/>
<path d="M140 34v22M124 42h32M124 42l-8 12h16zM156 42l-8 12h16z" fill="#fbf9f4"/>
<rect x="36" y="64" width="208" height="10" fill="#c63d2a"/>
<rect x="64" y="74" width="16" height="54" fill="#fbf9f4"/>
<rect x="104" y="74" width="16" height="54" fill="#fbf9f4"/>
<rect x="160" y="74" width="16" height="54" fill="#fbf9f4"/>
<rect x="200" y="74" width="16" height="54" fill="#fbf9f4"/>
<rect x="134" y="86" width="12" height="42" fill="#8a2416"/>
<rect x="30" y="128" width="220" height="10" fill="#e9a596"/>
<rect x="20" y="138" width="240" height="12" fill="#c63d2a"/>
<rect x="218" y="116" width="30" height="12" fill="#c63d2a"/>
<rect x="222" y="106" width="26" height="10" fill="#fbf9f4"/>
<path d="M226 122h18" fill="none" stroke="#fbf9f4"/>
`,
  estate: `
<rect width="280" height="168" fill="#f3cfc7" stroke="none"/>
<rect x="-2" y="132" width="284" height="38" fill="#e9a596"/>
<path d="M38 112v20M70 112v20" fill="none"/>
<rect x="20" y="24" width="68" height="88" fill="#fbf9f4"/>
<rect x="28" y="32" width="24" height="28" fill="#f3cfc7"/>
<path d="M32 40h16M32 46h16M32 52h10" fill="none"/>
<rect x="58" y="40" width="24" height="32" fill="#e9a596"/>
<path d="M62 62l8-10 8 10z" fill="#c63d2a"/>
<rect x="30" y="68" width="22" height="34" fill="#c63d2a"/>
<path d="M34 76h14M34 82h14M34 88h8" fill="none" stroke="#fbf9f4"/>
<circle cx="40" cy="30" r="3" fill="#8a2416"/>
<circle cx="70" cy="46" r="3" fill="#8a2416"/>
<circle cx="41" cy="73" r="3" fill="#8a2416"/>
<rect x="100" y="120" width="88" height="10" fill="#8a2416"/>
<rect x="108" y="84" width="72" height="36" fill="#fbf9f4"/>
<path d="M100 86l44-34 44 34z" fill="#c63d2a"/>
<rect x="136" y="98" width="18" height="22" fill="#e9a596"/>
<rect x="116" y="92" width="14" height="12" fill="#f3cfc7"/>
<rect x="158" y="92" width="14" height="12" fill="#f3cfc7"/>
<rect x="164" y="60" width="10" height="16" fill="#8a2416"/>
<circle cx="226" cy="62" r="15" fill="#c63d2a"/>
<circle cx="226" cy="62" r="5" fill="#f3cfc7"/>
<rect x="222" y="76" width="8" height="52" fill="#c63d2a"/>
<rect x="230" y="104" width="12" height="7" fill="#c63d2a"/>
<rect x="230" y="116" width="9" height="7" fill="#c63d2a"/>
`,
  coop: `
<rect width="280" height="168" fill="#f3cfc7" stroke="none"/>
<rect x="-2" y="140" width="284" height="30" fill="#8a2416"/>
<rect x="190" y="58" width="38" height="82" fill="#e9a596"/>
<path d="M190 58a19 14 0 0 1 38 0z" fill="#c63d2a"/>
<rect x="150" y="38" width="40" height="102" fill="#fbf9f4"/>
<path d="M150 38a20 14 0 0 1 40 0z" fill="#c63d2a"/>
<path d="M170 24v-8M150 62h40M150 86h40M150 110h40M190 82h38M190 106h38" fill="none"/>
<rect x="26" y="86" width="112" height="54" fill="#fbf9f4"/>
<path d="M18 88l64-32 64 32z" fill="#c63d2a"/>
<rect x="64" y="104" width="36" height="36" fill="#e9a596"/>
<path d="M82 104v36M64 122h36" fill="none"/>
<circle cx="82" cy="76" r="7" fill="#f3cfc7"/>
<path d="M228 140v-12a12 10 0 0 1 24 0v12z" fill="#f3cfc7"/>
<path d="M252 140v-12a12 10 0 0 1 24 0v12z" fill="#e9a596"/>
<path d="M234 122v-12a12 10 0 0 1 24 0v12z" fill="#fbf9f4"/>
<path d="M236 128h8M260 128h8" fill="none"/>
`,
  union: `
<rect width="280" height="168" fill="#f3cfc7" stroke="none"/>
<rect x="-2" y="140" width="284" height="30" fill="#e9a596"/>
<rect x="124" y="20" width="5" height="120" fill="#fbf9f4"/>
<path d="M129 22h68l-12 16 12 16h-68z" fill="#c63d2a"/>
<circle cx="154" cy="38" r="8" fill="#fbf9f4"/>
<rect x="210" y="50" width="46" height="30" fill="#fbf9f4"/>
<rect x="231" y="80" width="4" height="36" fill="#8a2416"/>
<path d="M30 140V106a14 14 0 0 1 28 0v34z" fill="#c63d2a"/>
<circle cx="44" cy="84" r="10" fill="#fbf9f4"/>
<path d="M54 108l12-30 8 4-10 32z" fill="#c63d2a"/>
<circle cx="70" cy="76" r="6" fill="#fbf9f4"/>
<path d="M88 140V100a18 18 0 0 1 36 0v40z" fill="#8a2416"/>
<circle cx="106" cy="76" r="11" fill="#fbf9f4"/>
<path d="M150 140v-34a15 15 0 0 1 30 0v34z" fill="#e9a596"/>
<circle cx="165" cy="84" r="10" fill="#fbf9f4"/>
<path d="M176 108l12-28 8 4-10 30z" fill="#e9a596"/>
<circle cx="192" cy="78" r="6" fill="#fbf9f4"/>
<path d="M216 140v-30a16 16 0 0 1 32 0v30z" fill="#c63d2a"/>
<circle cx="232" cy="96" r="10" fill="#fbf9f4"/>
`,
  mansion: `
<rect width="280" height="168" fill="#f3cfc7" stroke="none"/>
<rect x="-2" y="140" width="284" height="30" fill="#8a2416"/>
<rect x="154" y="44" width="12" height="24" fill="#8a2416"/>
<rect x="20" y="96" width="56" height="44" fill="#fbf9f4"/>
<path d="M14 98l34-24 34 24z" fill="#8a2416"/>
<rect x="204" y="96" width="56" height="44" fill="#fbf9f4"/>
<path d="M198 98l34-24 34 24z" fill="#8a2416"/>
<rect x="70" y="70" width="140" height="70" fill="#fbf9f4"/>
<path d="M60 72l36-34h88l36 34z" fill="#c63d2a"/>
<path d="M118 70l22-28 22 28z" fill="#e9a596"/>
<rect x="34" y="108" width="14" height="18" fill="#f3cfc7"/>
<rect x="52" y="108" width="14" height="18" fill="#f3cfc7"/>
<rect x="214" y="108" width="14" height="18" fill="#f3cfc7"/>
<rect x="232" y="108" width="14" height="18" fill="#f3cfc7"/>
<rect x="84" y="84" width="16" height="22" fill="#f3cfc7"/>
<rect x="180" y="84" width="16" height="22" fill="#f3cfc7"/>
<rect x="84" y="112" width="16" height="22" fill="#f3cfc7"/>
<rect x="180" y="112" width="16" height="22" fill="#f3cfc7"/>
<path d="M128 140v-30a12 12 0 0 1 24 0v30z" fill="#c63d2a"/>
<circle cx="140" cy="86" r="8" fill="#f3cfc7"/>
<path d="M120 140h40v6h-40z" fill="#e9a596"/>
<circle cx="108" cy="146" r="10" fill="#e9a596"/>
<circle cx="172" cy="146" r="10" fill="#e9a596"/>
`,
  hq: `
<rect width="280" height="168" fill="#f3cfc7" stroke="none"/>
<rect x="-2" y="150" width="284" height="20" fill="#8a2416"/>
<rect x="30" y="74" width="72" height="76" fill="#e9a596"/>
<rect x="38" y="84" width="56" height="8" fill="#fbf9f4"/>
<rect x="38" y="104" width="56" height="8" fill="#fbf9f4"/>
<rect x="38" y="124" width="56" height="8" fill="#fbf9f4"/>
<rect x="178" y="56" width="70" height="94" fill="#e9a596"/>
<rect x="186" y="66" width="54" height="8" fill="#fbf9f4"/>
<rect x="186" y="86" width="54" height="8" fill="#fbf9f4"/>
<rect x="186" y="106" width="54" height="8" fill="#fbf9f4"/>
<rect x="186" y="126" width="54" height="8" fill="#fbf9f4"/>
<path d="M140 18V4" fill="none"/>
<rect x="102" y="18" width="76" height="132" fill="#c63d2a"/>
<rect x="96" y="14" width="88" height="8" fill="#8a2416"/>
<rect x="110" y="30" width="60" height="10" fill="#f3cfc7"/>
<rect x="110" y="50" width="60" height="10" fill="#f3cfc7"/>
<rect x="110" y="70" width="60" height="10" fill="#f3cfc7"/>
<rect x="110" y="90" width="60" height="10" fill="#f3cfc7"/>
<rect x="110" y="110" width="60" height="10" fill="#f3cfc7"/>
<path d="M125 28v94M140 28v94M155 28v94" fill="none"/>
<rect x="120" y="126" width="40" height="24" fill="#fbf9f4"/>
<path d="M140 126v24" fill="none"/>
<circle cx="140" cy="4" r="3" fill="#fbf9f4"/>
`,
  quarry: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<path d="M-2 56H48V76H76V96H104V124H176V96H204V76H232V56H282V170H-2z" fill="#8f8f8a"/>
<rect x="-2" y="56" width="50" height="6" fill="#d9d9d4"/>
<rect x="48" y="76" width="28" height="6" fill="#d9d9d4"/>
<rect x="76" y="96" width="28" height="6" fill="#d9d9d4"/>
<rect x="176" y="96" width="28" height="6" fill="#d9d9d4"/>
<rect x="204" y="76" width="28" height="6" fill="#d9d9d4"/>
<rect x="232" y="56" width="50" height="6" fill="#d9d9d4"/>
<rect x="104" y="124" width="72" height="46" fill="#3a3a3a"/>
<path d="M112 124l6-22 22-6 20 8 8 20z" fill="#d9d9d4"/>
<path d="M118 102l8 22M140 96l-2 28M160 104l-8 20" fill="none"/>
<path d="M54 148l10-14h22l8 14z" fill="#d9d9d4"/>
<path d="M64 134l6 14" fill="none"/>
<path d="M186 156l8-14h20l10 14z" fill="#d9d9d4"/>
<rect x="234" y="40" width="24" height="16" fill="#3a3a3a"/>
<rect x="258" y="44" width="14" height="12" fill="#8f8f8a"/>
<circle cx="244" cy="56" r="4" fill="#1d1d1d"/>
<circle cx="264" cy="56" r="4" fill="#1d1d1d"/>
`,
  school: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="140" width="284" height="30" fill="#8f8f8a"/>
<rect x="44" y="86" width="192" height="54" fill="#fbf9f4"/>
<rect x="38" y="78" width="204" height="10" fill="#3a3a3a"/>
<rect x="118" y="42" width="44" height="98" fill="#8f8f8a"/>
<path d="M110 44l30-30 30 30z" fill="#3a3a3a"/>
<circle cx="140" cy="62" r="12" fill="#fbf9f4"/>
<path d="M140 62v-8M140 62l6 4" fill="none"/>
<rect x="132" y="104" width="16" height="36" fill="#3a3a3a"/>
<rect x="58" y="98" width="18" height="20" fill="#d9d9d4"/>
<rect x="88" y="98" width="18" height="20" fill="#d9d9d4"/>
<rect x="174" y="98" width="18" height="20" fill="#d9d9d4"/>
<rect x="204" y="98" width="18" height="20" fill="#d9d9d4"/>
<path d="M140 14v-8" fill="none"/>
<path d="M18 140V120M30 140V120M42 140V120M10 126h40" fill="none"/>
<circle cx="260" cy="128" r="12" fill="#8f8f8a"/>
<path d="M260 140v-12" fill="none"/>
`,
  highschool: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="140" width="284" height="30" fill="#8f8f8a"/>
<ellipse cx="136" cy="156" rx="112" ry="8" fill="#d9d9d4"/>
<rect x="14" y="40" width="152" height="100" fill="#fbf9f4"/>
<rect x="8" y="32" width="164" height="10" fill="#3a3a3a"/>
<rect x="78" y="14" width="24" height="18" fill="#8f8f8a"/>
<path d="M90 14V4" fill="none"/>
<circle cx="90" cy="56" r="11" fill="#d9d9d4"/>
<path d="M90 56v-7M90 56l5 3" fill="none"/>
<rect x="26" y="52" width="16" height="18" fill="#d9d9d4"/>
<rect x="52" y="52" width="16" height="18" fill="#d9d9d4"/>
<rect x="112" y="52" width="16" height="18" fill="#d9d9d4"/>
<rect x="138" y="52" width="16" height="18" fill="#d9d9d4"/>
<rect x="26" y="88" width="16" height="18" fill="#d9d9d4"/>
<rect x="52" y="88" width="16" height="18" fill="#d9d9d4"/>
<rect x="112" y="88" width="16" height="18" fill="#d9d9d4"/>
<rect x="138" y="88" width="16" height="18" fill="#d9d9d4"/>
<rect x="76" y="100" width="28" height="40" fill="#3a3a3a"/>
<path d="M176 140V104Q224 70 272 104V140z" fill="#8f8f8a"/>
<path d="M200 90v50M224 82v58M248 90v50" fill="none"/>
<rect x="210" y="116" width="28" height="24" fill="#3a3a3a"/>
`,
  univ: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="148" width="284" height="22" fill="#8f8f8a"/>
<rect x="18" y="76" width="244" height="8" fill="#3a3a3a"/>
<rect x="24" y="84" width="232" height="56" fill="#fbf9f4"/>
<rect x="22" y="52" width="26" height="24" fill="#8f8f8a"/>
<path d="M18 52l17-16 17 16z" fill="#3a3a3a"/>
<rect x="232" y="52" width="26" height="24" fill="#8f8f8a"/>
<path d="M228 52l17-16 17 16z" fill="#3a3a3a"/>
<rect x="116" y="30" width="48" height="110" fill="#8f8f8a"/>
<path d="M110 32l30-30 30 30z" fill="#3a3a3a"/>
<circle cx="140" cy="52" r="13" fill="#fbf9f4"/>
<path d="M140 52v-9M140 52l7 4" fill="none"/>
<path d="M134 80v-8a6 6 0 0 1 12 0v8z" fill="#3a3a3a"/>
<path d="M34 130v-18a6 6 0 0 1 12 0v18zM60 130v-18a6 6 0 0 1 12 0v18zM86 130v-18a6 6 0 0 1 12 0v18zM182 130v-18a6 6 0 0 1 12 0v18zM208 130v-18a6 6 0 0 1 12 0v18zM234 130v-18a6 6 0 0 1 12 0v18z" fill="#3a3a3a"/>
<path d="M128 140v-24a12 12 0 0 1 24 0v24z" fill="#3a3a3a"/>
<rect x="100" y="140" width="80" height="8" fill="#d9d9d4"/>
`,
  voc: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="134" width="284" height="36" fill="#8f8f8a"/>
<rect x="14" y="20" width="124" height="64" fill="#fbf9f4"/>
<rect x="22" y="28" width="6" height="34" fill="#8f8f8a"/>
<rect x="16" y="24" width="18" height="10" fill="#3a3a3a" transform="translate(0 0)"/>
<circle cx="58" cy="34" r="8" fill="#8f8f8a"/>
<rect x="55" y="40" width="6" height="30" fill="#8f8f8a"/>
<rect x="55" y="26" width="6" height="8" fill="#fbf9f4"/>
<rect x="82" y="30" width="8" height="30" fill="#3a3a3a"/>
<path d="M86 32l30 2v14l-30 4z" fill="#d9d9d4"/>
<path d="M92 48l0 -4M100 48v-4M108 46v-4" fill="none"/>
<rect x="18" y="104" width="136" height="10" fill="#3a3a3a"/>
<rect x="26" y="114" width="8" height="20" fill="#3a3a3a"/>
<rect x="138" y="114" width="8" height="20" fill="#3a3a3a"/>
<rect x="50" y="78" width="6" height="36" fill="#8f8f8a" transform="rotate(45 53 96)"/>
<rect x="50" y="78" width="6" height="36" fill="#8f8f8a" transform="rotate(-45 53 96)"/>
<circle cx="53" cy="96" r="12" fill="#8f8f8a"/>
<circle cx="53" cy="96" r="4" fill="#fbf9f4"/>
<path d="M92 104a16 14 0 0 1 32 0z" fill="#fbf9f4"/>
<rect x="88" y="100" width="40" height="5" fill="#8f8f8a" transform="translate(0 0)"/>
<rect x="190" y="124" width="64" height="10" fill="#3a3a3a"/>
<rect x="216" y="44" width="10" height="80" fill="#8f8f8a"/>
<rect x="198" y="30" width="46" height="18" fill="#3a3a3a"/>
<rect x="210" y="18" width="22" height="12" fill="#8f8f8a"/>
<rect x="218" y="48" width="6" height="30" fill="#1d1d1d"/>
<rect x="196" y="96" width="50" height="8" fill="#8f8f8a"/>
<rect x="212" y="88" width="18" height="8" fill="#fbf9f4"/>
`,
  carpenter: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="136" width="284" height="34" fill="#8f8f8a"/>
<path d="M30 68L92 26l62 42z" fill="#fbf9f4"/>
<path d="M92 26v42M44 68l48-22M140 68L92 46" fill="none"/>
<rect x="32" y="76" width="8" height="52" fill="#8f8f8a"/>
<rect x="88" y="76" width="8" height="52" fill="#8f8f8a"/>
<rect x="144" y="76" width="8" height="52" fill="#8f8f8a"/>
<path d="M40 126L88 78M96 126l48-48" fill="none"/>
<rect x="28" y="68" width="128" height="8" fill="#3a3a3a"/>
<rect x="28" y="128" width="128" height="8" fill="#3a3a3a"/>
<rect x="176" y="124" width="88" height="12" fill="#8f8f8a"/>
<rect x="176" y="112" width="88" height="12" fill="#3a3a3a"/>
<rect x="184" y="100" width="72" height="12" fill="#8f8f8a"/>
<rect x="190" y="88" width="60" height="12" fill="#3a3a3a"/>
<path d="M242 56L186 60v12l4 6 4-6 4 6 4-6 4 6 4-6 4 6 4-6 4 6 4-6 4 6 4-6 4 6 4-6 4 6z" fill="#fbf9f4"/>
<rect x="242" y="50" width="16" height="28" fill="#3a3a3a"/>
<rect x="246" y="56" width="8" height="8" fill="#d9d9d4"/>
`,
  m_garden: `
<rect width="280" height="168" fill="#fbe7a1" stroke="none"/>
<circle cx="236" cy="34" r="18" fill="#f2c230"/>
<rect x="-2" y="104" width="284" height="66" fill="#e0b02a"/>
<path d="M-2 124h284M-2 144h284" fill="none" stroke="#c7951a" stroke-width="3"/>
<path d="M30 124V96M30 110c-12-4-14-14-12-20 10 2 14 10 12 20zM30 106c12-4 14-14 12-20-10 2-14 10-12 20z" fill="#fbf9f4"/>
<circle cx="86" cy="116" r="14" fill="#c63d2a"/>
<path d="M86 102c0-8 6-12 10-12" fill="none"/>
<path d="M120 100l14 40 14-40z" fill="#f2c230"/>
<path d="M126 100c-4-14 2-18 8-18s12 4 8 18" fill="#fbf9f4"/>
<path d="M176 100h40l-6 38h-28z" fill="#c7951a"/>
<path d="M184 100c0-18 8-26 12-26s12 8 12 26" fill="#fbf9f4"/>
<path d="M196 100V76M240 140V110M240 128c-10-2-12-12-10-18 10 2 12 8 10 18z" fill="none"/>
`,
  m_potato: `
<rect width="280" height="168" fill="#fbe7a1" stroke="none"/>
<circle cx="50" cy="36" r="18" fill="#f2c230"/>
<rect x="-2" y="96" width="284" height="74" fill="#c7951a"/>
<path d="M-2 116Q70 100 140 116T282 112M-2 140Q70 124 140 140T282 136" fill="none" stroke="#e0b02a" stroke-width="5"/>
<path d="M60 104c0-26-14-34-24-34 4 14 12 24 24 34zM60 104c4-22 18-30 28-28-6 12-16 22-28 28z" fill="#fbf9f4"/>
<path d="M200 104c0-26-14-34-24-34 4 14 12 24 24 34zM200 104c4-22 18-30 28-28-6 12-16 22-28 28z" fill="#fbf9f4"/>
<ellipse cx="120" cy="140" rx="30" ry="18" fill="#f2c230"/>
<ellipse cx="190" cy="148" rx="24" ry="14" fill="#f2c230"/>
<ellipse cx="238" cy="140" rx="22" ry="13" fill="#f2c230"/>
<path d="M110 134h.1M126 144h.1M184 144h.1M196 152h.1M232 136h.1M244 144h.1" fill="none" stroke-width="4" stroke-linecap="round"/>
`,
  m_grave: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<circle cx="214" cy="40" r="20" fill="#fbf9f4"/>
<rect x="-2" y="132" width="284" height="38" fill="#8f8f8a"/>
<path d="M44 132V86a22 22 0 0 1 44 0v46z" fill="#fbf9f4"/>
<path d="M66 80v32M54 92h24" fill="none"/>
<path d="M116 132V70h36v62z" fill="#3a3a3a"/>
<path d="M116 70l18-14 18 14z" fill="#8f8f8a"/>
<path d="M134 82v26" fill="none" stroke="#fbf9f4"/>
<path d="M182 132V100a20 20 0 0 1 40 0v32z" fill="#8f8f8a"/>
<path d="M192 132v-30M212 132v-30" fill="none" stroke="#fbf9f4"/>
<rect x="30" y="126" width="220" height="8" fill="#3a3a3a"/>
<path d="M248 132V92M248 104h-14M248 96h12" fill="none"/>
`,
  m_carp: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="140" width="284" height="30" fill="#8f8f8a"/>
<path d="M40 140V96h200v44z" fill="#fbf9f4"/>
<path d="M70 140V96M110 140V96M170 140V96M210 140V96" fill="none"/>
<rect x="124" y="110" width="32" height="30" fill="#3a3a3a"/>
<path d="M14 98Q70 90 100 62L140 38l40 24q30 28 86 36z" fill="#3a3a3a"/>
<path d="M140 38v-12M132 26h16" fill="none"/>
<path d="M30 96q14-4 24-12M250 96q-14-4-24-12" fill="none" stroke="#fbf9f4"/>
<rect x="30" y="96" width="220" height="8" fill="#8f8f8a"/>
<path d="M120 62h40M126 74h28" fill="none" stroke="#fbf9f4"/>
`,
  m_lottery: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<circle cx="110" cy="84" r="52" fill="#fbf9f4"/>
<circle cx="110" cy="84" r="52" fill="none" stroke="#3a3a3a" stroke-width="6" stroke-dasharray="10 8"/>
<path d="M110 32v104M58 84h104" fill="none" stroke="#8f8f8a"/>
<circle cx="86" cy="64" r="11" fill="#3a3a3a"/>
<circle cx="136" cy="104" r="11" fill="#8f8f8a"/>
<circle cx="130" cy="62" r="8" fill="#8f8f8a"/>
<path d="M110 136l-20 24h40z" fill="#3a3a3a"/>
<rect x="196" y="48" width="64" height="92" fill="#fbf9f4" transform="rotate(8 228 94)"/>
<path d="M204 72h48M204 90h48M204 108h30" fill="none" transform="rotate(8 228 94)"/>
<rect x="204" y="54" width="48" height="12" fill="#3a3a3a" transform="rotate(8 228 94)"/>
<circle cx="236" cy="124" r="10" fill="#8f8f8a"/>
<path d="M232 124h8" fill="none"/>
`,
  m_foodf: `
<rect width="280" height="168" fill="#c9d8f0" stroke="none"/>
<circle cx="60" cy="30" r="10" fill="#fbf9f4"/>
<circle cx="78" cy="20" r="12" fill="#fbf9f4"/>
<rect x="50" y="36" width="16" height="50" fill="#163a75"/>
<path d="M20 152V96h110v56z" fill="#2456a6"/>
<rect x="34" y="108" width="20" height="14" fill="#c9d8f0"/>
<rect x="68" y="108" width="20" height="14" fill="#c9d8f0"/>
<rect x="150" y="104" width="100" height="14" fill="#163a75"/>
<path d="M164 104V90h26v14M200 104V94h26v10" fill="#fbf9f4"/>
<path d="M164 90h26M200 94h26" fill="none"/>
<rect x="156" y="118" width="88" height="8" fill="#2456a6"/>
<circle cx="168" cy="136" r="9" fill="#fbf9f4"/>
<circle cx="200" cy="136" r="9" fill="#fbf9f4"/>
<circle cx="232" cy="136" r="9" fill="#fbf9f4"/>
<path d="M168 130v12M200 130v12M232 130v12" fill="none"/>
<rect x="-2" y="152" width="284" height="18" fill="#163a75"/>
`,
  m_fish: `
<rect width="280" height="168" fill="#fbe7a1" stroke="none"/>
<circle cx="236" cy="30" r="16" fill="#f2c230"/>
<rect x="-2" y="70" width="284" height="100" fill="#e0b02a"/>
<path d="M-2 90q20-8 40 0t40 0 40 0 40 0 40 0 40 0 40 0" fill="none" stroke="#fbf9f4" stroke-width="3"/>
<rect x="30" y="64" width="220" height="86" fill="#f2c230"/>
<rect x="44" y="78" width="192" height="60" fill="#c7951a"/>
<path d="M60 100c14-14 34-14 48 0-14 14-34 14-48 0zM108 100l14-10v20z" fill="#fbf9f4"/>
<circle cx="72" cy="97" r="2.5" fill="#1d1d1d"/>
<path d="M150 118c12-12 30-12 42 0-12 12-30 12-42 0zM192 118l12-9v18z" fill="#fbf9f4"/>
<circle cx="161" cy="115" r="2.5" fill="#1d1d1d"/>
<path d="M200 90a6 6 0 1 0 .1 0" fill="none" stroke="#fbf9f4"/>
<path d="M30 64v-8M90 64v-8M150 64v-8M210 64v-8" fill="none"/>
`,
  m_lab: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="136" width="284" height="34" fill="#8f8f8a"/>
<rect x="20" y="124" width="240" height="12" fill="#3a3a3a"/>
<path d="M70 124V84l-24-36V36h56v12L78 84v40z" fill="#fbf9f4"/>
<path d="M54 56h40" fill="none"/>
<path d="M56 62h36l-8 24-6 38H70z" fill="#8f8f8a" stroke="none"/>
<path d="M40 124h60l-22-48z" fill="#3a3a3a"/>
<path d="M150 124V70h50v54z" fill="#fbf9f4"/>
<path d="M150 98h50" fill="none"/>
<circle cx="175" cy="84" r="9" fill="#8f8f8a"/>
<path d="M175 70V58M168 58h14" fill="none"/>
<path d="M222 124l8-44h24l8 44z" fill="#fbf9f4"/>
<path d="M226 100h32" fill="none"/>
<path d="M226 100h32l-3 24h-26z" fill="#3a3a3a"/>
<circle cx="150" cy="40" r="6" fill="#fbf9f4"/>
<circle cx="170" cy="28" r="4" fill="#fbf9f4"/>
<circle cx="190" cy="40" r="5" fill="#fbf9f4"/>
`,
  m_iron: `
<rect width="280" height="168" fill="#c9d8f0" stroke="none"/>
<rect x="-2" y="140" width="284" height="30" fill="#163a75"/>
<path d="M30 140v-50l30-14 30 14v50z" fill="#2456a6"/>
<path d="M40 100h40" fill="none" stroke="#c9d8f0"/>
<ellipse cx="60" cy="100" rx="14" ry="8" fill="#f3cfc7"/>
<path d="M126 140l16-40h92l16 40z" fill="#163a75"/>
<rect x="118" y="86" width="140" height="14" fill="#2456a6"/>
<path d="M150 86l12-24h50l12 24z" fill="#fbf9f4"/>
<path d="M162 62h50" fill="none"/>
<path d="M170 52l10-14 8 10 8-18 8 22" fill="none" stroke="#f3cfc7" stroke-width="3"/>
<circle cx="176" cy="46" r="3" fill="#fbf9f4"/>
<path d="M104 140v-24h-20v24" fill="#2456a6"/>
<rect x="190" y="126" width="40" height="14" fill="#fbf9f4"/>
<path d="M196 126l10-4h18l6 4" fill="#c9d8f0"/>
`,
  m_diner: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="140" width="284" height="30" fill="#8f8f8a"/>
<path d="M30 140V76h220v64z" fill="#fbf9f4"/>
<path d="M22 76l10-26h216l10 26z" fill="#3a3a3a"/>
<path d="M62 50l-6 26M102 50l-4 26M142 50v26M182 50l4 26M222 50l6 26" fill="none" stroke="#fbf9f4"/>
<rect x="46" y="94" width="70" height="28" fill="#d9d9d4"/>
<path d="M81 94v28" fill="none"/>
<rect x="136" y="100" width="40" height="40" fill="#3a3a3a"/>
<rect x="190" y="100" width="44" height="12" fill="#8f8f8a"/>
<path d="M200 100c0-10 24-10 24 0" fill="#fbf9f4"/>
<path d="M200 112v28M224 112v28" fill="none"/>
<circle cx="214" cy="30" r="10" fill="#fbf9f4"/>
<path d="M208 30h12" fill="none"/>
`,
  m_buildco: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="144" width="284" height="26" fill="#8f8f8a"/>
<path d="M30 144V62h70v82z" fill="#fbf9f4"/>
<path d="M30 80h70M30 98h70M30 116h70M30 134h70M52 62v18M78 80v18M52 98v18M78 116v18" fill="none"/>
<path d="M120 144V36h12v108z" fill="#3a3a3a"/>
<path d="M126 36h120M126 36l-14 16M126 36l30-12" fill="none" stroke-width="3"/>
<path d="M126 44h120v8H126z" fill="#8f8f8a"/>
<path d="M226 52v34" fill="none"/>
<rect x="212" y="86" width="28" height="20" fill="#fbf9f4"/>
<path d="M212 96h28" fill="none"/>
<rect x="150" y="110" width="76" height="34" fill="#8f8f8a"/>
<path d="M150 110l12-14h52l12 14" fill="#fbf9f4"/>
<path d="M162 96v14M214 96v14" fill="none"/>
<circle cx="240" cy="40" r="0" fill="none"/>
`,
  m_prefab: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="144" width="284" height="26" fill="#8f8f8a"/>
<rect x="24" y="96" width="76" height="48" fill="#fbf9f4"/>
<path d="M18 96l44-30 44 30z" fill="#3a3a3a"/>
<rect x="52" y="112" width="20" height="32" fill="#8f8f8a"/>
<rect x="150" y="108" width="40" height="36" fill="#fbf9f4"/>
<path d="M146 108l24-18 24 18z" fill="#8f8f8a"/>
<rect x="206" y="108" width="40" height="36" fill="#fbf9f4"/>
<path d="M202 108l24-18 24 18z" fill="#8f8f8a"/>
<path d="M104 120h38M104 130h38" fill="none" stroke="#3a3a3a" stroke-width="3" stroke-dasharray="6 5"/>
<path d="M120 24v36M110 60h20l-10 14z" fill="#3a3a3a"/>
<path d="M120 24h60" fill="none" stroke-width="3"/>
<path d="M170 24v24" fill="none"/>
<rect x="158" y="48" width="26" height="22" fill="#fbf9f4"/>
<path d="M158 59h26M171 48v22" fill="none"/>
`,
  m_old: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="140" width="284" height="30" fill="#8f8f8a"/>
<path d="M14 140V66h56v74z" fill="#fbf9f4"/>
<path d="M8 66l34-26 34 26z" fill="#3a3a3a"/>
<rect x="30" y="86" width="14" height="18" fill="#8f8f8a"/>
<path d="M82 140V50h60v90z" fill="#8f8f8a"/>
<path d="M76 50l36-26 36 26z" fill="#3a3a3a"/>
<rect x="98" y="70" width="14" height="20" fill="#fbf9f4"/>
<rect x="118" y="70" width="14" height="20" fill="#fbf9f4"/>
<rect x="100" y="112" width="24" height="28" fill="#3a3a3a"/>
<path d="M156 140V80h50v60z" fill="#fbf9f4"/>
<path d="M156 80h50M156 100h50M156 120h50" fill="none"/>
<path d="M218 140V70h50v70z" fill="#3a3a3a"/>
<rect x="228" y="82" width="12" height="14" fill="#d9d9d4"/>
<rect x="228" y="108" width="12" height="14" fill="#d9d9d4"/>
<circle cx="190" cy="40" r="10" fill="#fbf9f4"/>
<path d="M190 34v6h5" fill="none"/>
`,
  m_ranch: `
<rect width="280" height="168" fill="#fbe7a1" stroke="none"/>
<circle cx="236" cy="30" r="16" fill="#f2c230"/>
<path d="M-2 104Q140 88 282 100v70H-2z" fill="#e0b02a"/>
<path d="M20 132h244M20 150h244" fill="none" stroke="#c7951a" stroke-width="3"/>
<rect x="30" y="64" width="64" height="48" fill="#fbf9f4"/>
<path d="M24 64l38-30 38 30z" fill="#c7951a"/>
<rect x="52" y="82" width="20" height="30" fill="#c7951a"/>
<path d="M52 82l20 30M72 82l-20 30" fill="none"/>
<path d="M112 130h84v-26a6 6 0 0 0-6-6h-72z" fill="#fbf9f4"/>
<path d="M130 100c-4-6-4-14 2-16l6 10M178 98l12-10 4 8" fill="#fbf9f4"/>
<path d="M196 100l22-10 8 8-10 10-14 10z" fill="#fbf9f4"/>
<circle cx="216" cy="98" r="2.5" fill="#1d1d1d"/>
<path d="M130 112c10-6 18 2 14 12M158 108c8-4 14 4 10 10" fill="#c7951a" stroke="none"/>
<path d="M124 130v18M144 130v18M172 130v18M188 130v18" fill="none"/>
<path d="M250 112V66M250 80h12M250 92h-12" fill="none"/>
<path d="M262 74h-24v10h24z" fill="#fbf9f4" transform="translate(0 10)"/>
`,
  m_station: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="144" width="284" height="26" fill="#3a3a3a"/>
<path d="M0 156h280" fill="none" stroke="#fbf9f4" stroke-dasharray="10 8"/>
<path d="M40 144V78h140v66z" fill="#fbf9f4"/>
<path d="M30 78l80-34 80 34z" fill="#3a3a3a"/>
<circle cx="110" cy="62" r="12" fill="#fbf9f4"/>
<path d="M110 54v8h6" fill="none"/>
<rect x="56" y="98" width="24" height="46" fill="#8f8f8a"/>
<rect x="140" y="98" width="24" height="46" fill="#8f8f8a"/>
<rect x="92" y="98" width="36" height="22" fill="#d9d9d4"/>
<path d="M196 144v-70h8v70M196 80h40" fill="#8f8f8a"/>
<path d="M236 80v34M226 114h20" fill="none"/>
<path d="M214 52h40v16h-40z" fill="#fbf9f4"/>
<path d="M222 60h24" fill="none"/>
<path d="M200 144l-8 14M214 144l8 14" fill="none" stroke="#fbf9f4"/>
`,
  m_acct: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="140" width="284" height="30" fill="#8f8f8a"/>
<path d="M30 140V60h120v80z" fill="#fbf9f4"/>
<path d="M24 60h132M30 52h120" fill="none"/>
<rect x="24" y="52" width="132" height="8" fill="#3a3a3a"/>
<path d="M52 140V70M90 140V70M128 140V70" fill="none"/>
<rect x="72" y="106" width="36" height="34" fill="#3a3a3a"/>
<rect x="176" y="40" width="76" height="96" rx="6" fill="#3a3a3a"/>
<rect x="186" y="50" width="56" height="22" fill="#fbf9f4"/>
<path d="M194 62h40" fill="none"/>
<path d="M190 86h10M214 86h10M236 86h2M190 104h10M214 104h10M236 104h2M190 120h10M214 120h10" fill="none" stroke="#fbf9f4" stroke-width="6" stroke-linecap="round"/>
<path d="M90 28v14M83 35h14" fill="none"/>
<circle cx="90" cy="35" r="14" fill="none" transform="translate(0 0)"/>
`,
  m_earth: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<circle cx="140" cy="150" r="96" fill="#fbf9f4"/>
<path d="M60 112c18-16 36-8 44-22 10-14 30-8 34-22 4 14-6 24 8 34 14 10 36-2 46 10-34-12-44 8-60 8-24 0-42-16-72-8z" fill="#8f8f8a"/>
<path d="M44 150h192" fill="none" stroke="#8f8f8a"/>
<rect x="78" y="40" width="30" height="40" fill="#3a3a3a"/>
<path d="M86 48h14M86 60h14" fill="none" stroke="#fbf9f4"/>
<rect x="124" y="26" width="30" height="54" fill="#8f8f8a"/>
<path d="M132 36h14M132 48h14M132 60h14" fill="none" stroke="#fbf9f4"/>
<rect x="170" y="48" width="30" height="32" fill="#3a3a3a"/>
<path d="M178 58h14" fill="none" stroke="#fbf9f4"/>
<path d="M60 80h170" fill="none" stroke-width="3"/>
<path d="M240 40v40M240 40h-24" fill="none" stroke-width="3"/>
<rect x="-2" y="152" width="284" height="18" fill="#8f8f8a"/>
`,
  m_brew: `
<rect width="280" height="168" fill="#fbe7a1" stroke="none"/>
<circle cx="40" cy="34" r="16" fill="#f2c230"/>
<rect x="-2" y="136" width="284" height="34" fill="#e0b02a"/>
<rect x="20" y="108" width="68" height="28" fill="#c7951a"/>
<path d="M20 108l12-14h44l12 14M20 122h68" fill="#c7951a"/>
<path d="M30 108v28M78 108v28" fill="none"/>
<ellipse cx="54" cy="108" rx="34" ry="0" fill="none"/>
<path d="M124 136V66a40 20 0 0 1 80 0v70z" fill="#c7951a"/>
<path d="M124 82h80M124 116h80" fill="none" stroke="#fbf9f4" stroke-width="4"/>
<path d="M124 66a40 20 0 0 1 80 0" fill="none"/>
<path d="M144 136V66M184 136V66" fill="none" stroke-width="1"/>
<circle cx="164" cy="100" r="9" fill="#fbf9f4"/>
<path d="M156 100h16" fill="none"/>
<path d="M230 136V58h20v78zM240 58c0-12-8-16-8-24M240 40c0-10 10-14 10-22" fill="#fbf9f4"/>
<path d="M232 28c0-6 6-8 6-14" fill="none" stroke-width="0"/>
<path d="M230 74h20M230 98h20" fill="none"/>
<path d="M104 136V96M104 106c-10-2-12-12-10-18 10 2 12 8 10 18zM104 100c10-2 12-12 10-18-10 2-12 8-10 18z" fill="#fbf9f4"/>
`,
  m_ship: `
<rect width="280" height="168" fill="#c9d8f0" stroke="none"/>
<circle cx="236" cy="30" r="12" fill="#fbf9f4"/>
<rect x="-2" y="132" width="284" height="38" fill="#2456a6"/>
<path d="M-2 146q20-8 40 0t40 0 40 0 40 0 40 0 40 0 40 0" fill="none" stroke="#c9d8f0" stroke-width="3"/>
<path d="M60 132l-16-34h160l-24 34z" fill="#163a75"/>
<rect x="84" y="76" width="70" height="22" fill="#fbf9f4"/>
<path d="M98 76V62h30v14M96 86h4M112 86h4M128 86h4M142 86h4" fill="#fbf9f4"/>
<rect x="164" y="66" width="10" height="32" fill="#2456a6"/>
<path d="M220 132V40h10v92M220 40h-30M190 40v30M190 60h8" fill="none" stroke-width="3"/>
<path d="M236 132V70h22v62z" fill="#163a75"/>
<path d="M240 60v10M254 60v10" fill="none"/>
<path d="M60 132h156" fill="none" stroke="#fbf9f4"/>
`,
  m_botan: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="140" width="284" height="30" fill="#8f8f8a"/>
<path d="M40 140V80a100 56 0 0 1 200 0v60z" fill="#fbf9f4"/>
<path d="M40 80h200M100 140V50M180 140V50M140 140V24M70 140V62M210 140V62" fill="none" stroke="#8f8f8a"/>
<path d="M40 140V80a100 56 0 0 1 200 0v60z" fill="none"/>
<path d="M118 140V108a22 22 0 0 1 44 0v32z" fill="#3a3a3a"/>
<path d="M140 98c-12-4-14-14-12-20 10 2 14 10 12 20zM140 94c12-4 14-14 12-20-10 2-14 10-12 20z" fill="#fbf9f4"/>
<path d="M140 108V94" fill="none"/>
<circle cx="64" cy="124" r="10" fill="#8f8f8a"/>
<circle cx="216" cy="124" r="10" fill="#8f8f8a"/>
<path d="M64 134v6M216 134v6" fill="none"/>
`,
  m_park: `
<rect width="280" height="168" fill="#c9d8f0" stroke="none"/>
<rect x="-2" y="140" width="284" height="30" fill="#163a75"/>
<path d="M20 140V86l24 12V86l24 12V86l24 12v42z" fill="#2456a6"/>
<rect x="30" y="112" width="12" height="12" fill="#c9d8f0"/>
<rect x="56" y="112" width="12" height="12" fill="#c9d8f0"/>
<rect x="82" y="112" width="12" height="12" fill="#c9d8f0"/>
<path d="M130 140V70h50v70z" fill="#fbf9f4"/>
<path d="M130 92h50M130 116h50" fill="none"/>
<rect x="146" y="30" width="14" height="40" fill="#163a75"/>
<path d="M150 22c-4-8 4-12 0-18M160 24c-4-8 4-12 0-18" fill="none" stroke="#fbf9f4" stroke-width="3"/>
<path d="M200 140V96h60v44z" fill="#2456a6"/>
<path d="M200 96l15-18 15 18 15-18 15 18" fill="#fbf9f4"/>
<rect x="216" y="116" width="16" height="24" fill="#c9d8f0"/>
<path d="M0 154h280" fill="none" stroke="#fbf9f4" stroke-dasharray="10 8"/>
`,
  m_amuse: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="140" width="284" height="30" fill="#8f8f8a"/>
<circle cx="130" cy="82" r="56" fill="#fbf9f4"/>
<circle cx="130" cy="82" r="56" fill="none" stroke="#3a3a3a" stroke-width="5"/>
<path d="M130 26v112M74 82h112M90 42l80 80M170 42l-80 80" fill="none" stroke="#8f8f8a"/>
<circle cx="130" cy="82" r="8" fill="#3a3a3a"/>
<rect x="116" y="26" width="0" height="0" fill="none"/>
<rect x="120" y="14" width="20" height="14" fill="#3a3a3a"/>
<rect x="64" y="72" width="20" height="14" fill="#8f8f8a"/>
<rect x="176" y="72" width="20" height="14" fill="#8f8f8a"/>
<rect x="120" y="128" width="20" height="14" fill="#3a3a3a"/>
<path d="M130 82l-34 58M130 82l34 58" fill="none" stroke-width="3"/>
<path d="M220 140V76l22-16 22 16v64z" fill="#fbf9f4"/>
<path d="M220 76h44M242 60V46l14 4-14 4" fill="#3a3a3a"/>
<rect x="234" y="108" width="16" height="32" fill="#3a3a3a"/>
`,
  m_museum: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="144" width="284" height="26" fill="#8f8f8a"/>
<rect x="24" y="134" width="232" height="10" fill="#3a3a3a"/>
<rect x="34" y="124" width="212" height="10" fill="#8f8f8a"/>
<path d="M30 54L140 20l110 34z" fill="#fbf9f4"/>
<path d="M30 54h220v12H30z" fill="#3a3a3a"/>
<path d="M44 66h28v58H44zM94 66h28v58H94zM158 66h28v58h-28zM208 66h28v58h-28z" fill="#fbf9f4"/>
<path d="M58 66v58M108 66v58M172 66v58M222 66v58" fill="none" stroke="#8f8f8a"/>
<circle cx="140" cy="46" r="9" fill="#8f8f8a"/>
<path d="M134 46h12M140 40v12" fill="none"/>
<path d="M130 124v-26a10 10 0 0 1 20 0v26z" fill="#3a3a3a"/>
`,
  m_port: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<circle cx="50" cy="34" r="14" fill="#fbf9f4"/>
<rect x="-2" y="112" width="284" height="58" fill="#8f8f8a"/>
<path d="M-2 130q20-8 40 0t40 0 40 0 40 0 40 0 40 0 40 0" fill="none" stroke="#fbf9f4" stroke-width="3"/>
<rect x="150" y="104" width="130" height="14" fill="#3a3a3a"/>
<path d="M30 112l-10-30h110l-14 30z" fill="#3a3a3a"/>
<rect x="44" y="60" width="34" height="22" fill="#fbf9f4"/>
<rect x="84" y="62" width="34" height="20" fill="#8f8f8a"/>
<path d="M60 60V44h14v16" fill="#fbf9f4"/>
<path d="M170 104V30h10v74M170 30h60M230 30v22M180 44l-10 12M224 52h12v10h-12z" fill="none" stroke-width="3"/>
<rect x="212" y="62" width="30" height="24" fill="#fbf9f4"/>
<path d="M212 74h30M227 62v24" fill="none"/>
<rect x="190" y="88" width="24" height="16" fill="#8f8f8a"/>
<rect x="244" y="88" width="24" height="16" fill="#8f8f8a"/>
`,
  m_oil: `
<rect width="280" height="168" fill="#c9d8f0" stroke="none"/>
<rect x="-2" y="144" width="284" height="26" fill="#163a75"/>
<ellipse cx="62" cy="108" rx="40" ry="10" fill="#fbf9f4"/>
<path d="M22 108v34a40 10 0 0 0 80 0v-34" fill="#2456a6"/>
<ellipse cx="62" cy="108" rx="40" ry="10" fill="#fbf9f4"/>
<ellipse cx="148" cy="100" rx="34" ry="9" fill="#fbf9f4"/>
<path d="M114 100v42a34 9 0 0 0 68 0v-42" fill="#fbf9f4"/>
<ellipse cx="148" cy="100" rx="34" ry="9" fill="#fbf9f4"/>
<path d="M114 120a34 9 0 0 0 68 0" fill="none"/>
<path d="M206 144V40h12v104M206 70h12M206 96h12" fill="#163a75"/>
<path d="M212 40c-4-10 6-14 2-24" fill="none" stroke="#fbf9f4" stroke-width="3"/>
<path d="M62 98V74h60l26 16M232 144V84h28v60z" fill="none" stroke-width="3"/>
<rect x="232" y="84" width="28" height="60" fill="#2456a6"/>
<path d="M232 104h28M232 124h28" fill="none" stroke="#c9d8f0"/>
<path d="M246 84V70" fill="none"/>
<path d="M240 70h12l-6-14z" fill="#fbf9f4"/>
`,
  m_bank: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<rect x="-2" y="144" width="284" height="26" fill="#8f8f8a"/>
<rect x="30" y="134" width="130" height="10" fill="#3a3a3a"/>
<path d="M36 52l59-28 59 28z" fill="#3a3a3a"/>
<path d="M44 60h102v70H44z" fill="#fbf9f4"/>
<path d="M62 60v70M84 60v70M106 60v70M128 60v70" fill="none" stroke="#8f8f8a"/>
<rect x="44" y="54" width="102" height="6" fill="#3a3a3a"/>
<circle cx="95" cy="40" r="7" fill="#fbf9f4"/>
<path d="M95 35v10M92 38h6M92 42h6" fill="none" stroke-width="1.5"/>
<path d="M180 144v-22h44v22M184 122v-10h36v10M190 112v-10h24v10" fill="#8f8f8a"/>
<ellipse cx="202" cy="96" rx="14" ry="5" fill="#f2c230"/>
<ellipse cx="202" cy="102" rx="14" ry="5" fill="#f2c230"/>
<path d="M188 96v6M216 96v6" fill="none"/>
<ellipse cx="244" cy="136" rx="14" ry="5" fill="#f2c230"/>
<ellipse cx="244" cy="130" rx="14" ry="5" fill="#f2c230"/>
<ellipse cx="244" cy="124" rx="14" ry="5" fill="#f2c230"/>
<path d="M230 124v12M258 124v12" fill="none"/>
`,
  m_cathedral: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<circle cx="236" cy="30" r="14" fill="#fbf9f4"/>
<rect x="-2" y="144" width="284" height="26" fill="#8f8f8a"/>
<path d="M90 144V70h100v74z" fill="#fbf9f4"/>
<path d="M90 70l50-30 50 30z" fill="#3a3a3a"/>
<path d="M140 40V14M132 22h16" fill="none" stroke-width="3"/>
<circle cx="140" cy="84" r="14" fill="#8f8f8a"/>
<path d="M126 84h28M140 70v28" fill="none" stroke="#fbf9f4"/>
<path d="M120 144v-30a20 20 0 0 1 40 0v30z" fill="#3a3a3a"/>
<path d="M50 144V60h40v84z" fill="#8f8f8a"/>
<path d="M44 60l26-34 26 34z" fill="#3a3a3a"/>
<path d="M62 84v24M78 84v24" fill="none" stroke="#fbf9f4" stroke-width="4"/>
<path d="M190 144V60h40v84z" fill="#8f8f8a"/>
<path d="M184 60l26-34 26 34z" fill="#3a3a3a"/>
<path d="M202 84v24M218 84v24" fill="none" stroke="#fbf9f4" stroke-width="4"/>
`,
  ruins: `
<rect width="280" height="168" fill="#d9d9d4" stroke="none"/>
<circle cx="224" cy="34" r="16" fill="#fbf9f4"/>
<rect x="-2" y="140" width="284" height="30" fill="#8f8f8a"/>
<path d="M40 140V70h22v70zM100 140V54h22v86zM160 140V90h22v50z" fill="#fbf9f4"/>
<path d="M34 70h34v-8H34zM94 54h34v-8H94z" fill="#fbf9f4"/>
<path d="M100 54h74l-10 14 10 12" fill="#8f8f8a"/>
<path d="M40 100h22M100 90h22M100 116h22" fill="none"/>
<path d="M196 140l10-18 14 6 12-12 14 24z" fill="#3a3a3a"/>
<path d="M170 140l6-10h14l6 10z" fill="#fbf9f4"/>
<circle cx="146" cy="130" r="7" fill="#3a3a3a"/>
<path d="M140 124l12 12M152 124l-12 12" fill="none" stroke="#fbf9f4"/>
`,
  g_relic: `
<rect width="280" height="168" fill="#efe9da" stroke="none"/>
<path d="M-2 130Q140 112 282 128v42H-2z" fill="#a69b7e"/>
<path d="M140 22l8 28 28 8-28 8-8 28-8-28-28-8 28-8z" fill="#fbf9f4" stroke="none"/>
<path d="M84 142l8-34h96l8 34z" fill="#3a3a3a"/>
<path d="M104 108c-6-20 4-36 36-36s42 16 36 36z" fill="#d9d2c0"/>
<path d="M140 72v-8M120 74l-8-8M160 74l8-8" fill="none"/>
<circle cx="140" cy="94" r="12" fill="#f2c230"/>
<path d="M134 94h12M140 88v12" fill="none" stroke-width="1.5"/>
<path d="M70 142h140" fill="none" stroke-width="3"/>
<circle cx="52" cy="112" r="3" fill="#fbf9f4"/><circle cx="234" cy="96" r="3" fill="#fbf9f4"/>
<path d="M44 150l8-8 8 8M224 152l8-8 8 8" fill="none"/>
`,
  g_village: `
<rect width="280" height="168" fill="#fbe7a1" stroke="none"/>
<circle cx="224" cy="38" r="18" fill="#f2c230"/>
<path d="M-2 110Q140 94 282 108v62H-2z" fill="#e0b02a"/>
<path d="M-2 140l284-8v38H-2z" fill="#f2c230"/>
<path d="M50 112V84l26-22 26 22v28z" fill="#fbf9f4"/>
<path d="M44 86l32-26 32 26z" fill="#c7951a"/>
<rect x="68" y="94" width="16" height="18" fill="#c7951a"/>
<path d="M120 112V90l20-18 20 18v22z" fill="#fbf9f4"/>
<path d="M114 92l26-22 26 22z" fill="#1d1d1d"/>
<rect x="134" y="98" width="12" height="14" fill="#c7951a"/>
<path d="M190 112V94l16-14 16 14v18z" fill="#fbf9f4"/>
<path d="M186 96l20-18 20 18z" fill="#c7951a"/>
<path d="M30 160l30-14M90 160l24-14M150 160l10-14M210 160l-8-14M260 160l-26-14" fill="none" stroke="#c7951a" stroke-width="3"/>
<circle cx="170" cy="130" r="5" fill="#fbf9f4"/><circle cx="184" cy="132" r="5" fill="#fbf9f4"/>
`,
  g_colony: `
<rect width="280" height="168" fill="#efe9da" stroke="none"/>
<rect x="-2" y="124" width="284" height="46" fill="#a69b7e"/>
<path d="M-2 124l284-4" fill="none"/>
<path d="M60 124V60" fill="none" stroke-width="3"/>
<path d="M60 60l50 10-50 14z" fill="#c63d2a"/>
<path d="M92 124V90l24-18 24 18v34z" fill="#fbf9f4"/>
<path d="M86 92l30-24 30 24z" fill="#3a3a3a"/>
<rect x="108" y="102" width="16" height="22" fill="#a69b7e"/>
<path d="M168 124V96l22-16 22 16v28z" fill="#d9d2c0"/>
<path d="M162 98l28-20 28 20z" fill="#3a3a3a"/>
<path d="M30 124l10-26 10 26z" fill="#fbf9f4"/>
<path d="M40 98v26M20 124l20-26 20 26" fill="none"/>
<path d="M236 124V84M226 90l10-8 10 8M228 124l8-10 8 10" fill="none"/>
<circle cx="236" cy="76" r="9" fill="#fbf9f4"/>
<path d="M232 76h8" fill="none" stroke-width="1.5"/>
<circle cx="76" cy="144" r="4" fill="#fbf9f4"/><circle cx="96" cy="146" r="4" fill="#fbf9f4"/><circle cx="116" cy="144" r="4" fill="#fbf9f4"/>
`,
  g_atelier: `
<rect width="280" height="168" fill="#c9d8f0" stroke="none"/>
<rect x="-2" y="144" width="284" height="26" fill="#163a75"/>
<rect x="30" y="44" width="220" height="100" fill="#fbf9f4"/>
<path d="M22 44l30-22h176l30 22z" fill="#2456a6"/>
<rect x="46" y="62" width="50" height="40" fill="#c9d8f0"/>
<path d="M71 62v40M46 82h50" fill="none"/>
<rect x="46" y="110" width="76" height="12" fill="#163a75"/>
<path d="M56 110V98l14-4 8 16" fill="#2456a6"/>
<circle cx="100" cy="102" r="6" fill="#fbf9f4"/>
<path d="M150 144V76h30v68z" fill="#2456a6"/>
<circle cx="165" cy="96" r="9" fill="#c9d8f0"/>
<path d="M165 90v12M159 96h12" fill="none"/>
<path d="M200 144V86h38v58z" fill="#d9d9d4"/>
<path d="M208 86V70h22v16M206 144l12-30 12 30" fill="#8f8f8a"/>
<path d="M214 100h10" fill="none"/>
`,
  g_steam: `
<rect width="280" height="168" fill="#c9d8f0" stroke="none"/>
<circle cx="70" cy="30" r="10" fill="#fbf9f4"/>
<circle cx="90" cy="20" r="13" fill="#fbf9f4"/>
<circle cx="116" cy="14" r="10" fill="#fbf9f4"/>
<rect x="64" y="38" width="16" height="64" fill="#163a75"/>
<rect x="60" y="34" width="24" height="8" fill="#1d1d1d"/>
<rect x="-2" y="152" width="284" height="18" fill="#163a75"/>
<rect x="30" y="96" width="120" height="56" fill="#2456a6"/>
<path d="M30 96h120" fill="none"/>
<circle cx="90" cy="124" r="22" fill="#fbf9f4"/>
<circle cx="90" cy="124" r="22" fill="none" stroke="#163a75" stroke-width="5"/>
<path d="M90 106v36M72 124h36M77 111l26 26M103 111l-26 26" fill="none"/>
<circle cx="90" cy="124" r="6" fill="#163a75"/>
<circle cx="190" cy="108" r="36" fill="#8f8f8a"/>
<circle cx="190" cy="108" r="12" fill="#fbf9f4"/>
<path d="M190 66v10M190 140v10M148 108h10M222 108h10M160 78l7 7M213 131l7 7M160 138l7-7M213 85l7-7" fill="none" stroke-width="6"/>
<path d="M190 96v12l8 6" fill="none"/>
<rect x="236" y="64" width="22" height="88" fill="#163a75"/>
<path d="M236 84h22M236 104h22" fill="none" stroke="#c9d8f0"/>
`,
  g_chicken: `
<rect width="280" height="168" fill="#fbe7a1" stroke="none"/>
<circle cx="236" cy="34" r="18" fill="#f2c230"/>
<path d="M-2 120Q140 104 282 118v52H-2z" fill="#e0b02a"/>
<path d="M-2 146l284-8v32H-2z" fill="#f2c230"/>
<rect x="30" y="64" width="86" height="56" fill="#fbf9f4"/>
<path d="M22 66l51-34 51 34z" fill="#c7951a"/>
<path d="M60 120V92a13 13 0 0 1 26 0v28z" fill="#1d1d1d"/>
<circle cx="73" cy="52" r="6" fill="#fbf9f4"/>
<path d="M146 148c-16 0-26-12-24-26 2-10 10-14 18-14 2-12 18-14 22-4 6-4 14 0 12 8 8 6 10 18 2 26-6 6-16 10-30 10z" fill="#fbf9f4"/>
<path d="M162 104c-2-8 4-12 8-8 2-8 12-6 10 2" fill="#c63d2a"/>
<path d="M182 112l12 4-12 4z" fill="#f2c230"/>
<circle cx="174" cy="112" r="2" fill="#1d1d1d"/>
<path d="M134 132c10 8 22 6 28-6" fill="none"/>
<path d="M148 148v10M162 148v10M142 158h12M156 158h12" fill="none" stroke-width="3"/>
<ellipse cx="226" cy="150" rx="9" ry="12" fill="#fbf9f4"/>
<ellipse cx="248" cy="154" rx="9" ry="12" fill="#fbf9f4"/>
`,
  g_sky: `
<rect width="280" height="168" fill="#efe9da" stroke="none"/>
<circle cx="220" cy="40" r="12" fill="#fbf9f4"/>
<rect x="-2" y="152" width="284" height="18" fill="#a69b7e"/>
<path d="M60 152V44h60v108z" fill="#d9d2c0"/>
<path d="M60 74h60M60 104h60M60 130h60M90 44v108" fill="none"/>
<path d="M60 44l30-16 30 16z" fill="#3a3a3a"/>
<path d="M90 28V14" fill="none" stroke-width="3"/>
<path d="M160 152V92h50v60z" fill="#fbf9f4"/>
<path d="M160 116h50M160 134h50M185 92v60" fill="none"/>
<path d="M156 92h58l-8-10h-42z" fill="#3a3a3a"/>
<path d="M130 152V30M130 30h110M130 30l30 22M240 30v22" fill="none" stroke-width="3"/>
<path d="M240 52v26" fill="none"/>
<rect x="228" y="78" width="24" height="12" fill="#3a3a3a"/>
<path d="M130 40h24M130 52h24" fill="none"/>
<path d="M130 152h-8M232 152h-10" fill="none"/>
`,
  g_cafe: `
<rect width="280" height="168" fill="#efe9da" stroke="none"/>
<rect x="-2" y="152" width="284" height="18" fill="#a69b7e"/>
<rect x="30" y="52" width="130" height="100" fill="#fbf9f4"/>
<path d="M22 52h146l-14-24H36z" fill="#3a3a3a"/>
<path d="M48 40h34v10H48z" fill="#fbf9f4" stroke-width="1.5"/>
<rect x="46" y="68" width="62" height="42" fill="#d9d2c0"/>
<path d="M77 68v42" fill="none"/>
<path d="M120 152V96h28v56z" fill="#3a3a3a"/>
<path d="M60 84h18M60 94h18" fill="none" stroke-width="1.5"/>
<path d="M186 152v-34M246 152v-34" fill="none" stroke-width="3"/>
<rect x="176" y="106" width="80" height="12" fill="#a69b7e"/>
<path d="M196 106l8-18h24l8 18z" fill="#fbf9f4"/>
<rect x="198" y="88" width="14" height="14" fill="#fbf9f4"/>
<rect x="214" y="78" width="14" height="14" fill="#1d1d1d"/>
<circle cx="205" cy="95" r="2" fill="#1d1d1d"/><circle cx="221" cy="85" r="2" fill="#fbf9f4"/>
<rect x="232" y="94" width="14" height="12" fill="#2456a6"/>
<rect x="172" y="140" width="16" height="12" fill="#a69b7e"/>
`,
};
