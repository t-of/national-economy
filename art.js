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
};
