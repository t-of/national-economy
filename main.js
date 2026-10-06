'use strict';

// localStorage はほかのアプリと共有される（同じ t-of.github.io のため）。
// キーは必ず 'national-economy.' で始める。
const STORE = 'national-economy.';

function load(key, fallback) {
  try {
    const v = localStorage.getItem(STORE + key);
    return v == null ? fallback : JSON.parse(v);
  } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(STORE + key, JSON.stringify(value)); } catch { /* 保存できなくても遊べる */ }
}

WebAppKit.init({ title: 'national-economy', text: '労働者を置いて資源とお金と建物を集め、9 ラウンドで国を育てる 1 人用ボードゲーム（CPU 対戦）。' });

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

// 音を使うときは、鳴らす前と音の設定を切り替えたときにこれを呼ぶ（RULES.md §5「音」）。
function setAudioSession(soundOn) {
  try { if (navigator.audioSession) navigator.audioSession.type = soundOn ? 'playback' : 'auto'; } catch { /* 対応していない */ }
}

// ---- ここからアプリ本体 ----
// ルールは engine.js（NE）。ここは画面と操作だけ。外から来る文字は使わないが、描画はすべて textContent。
const COLORS = ['#ffd35c', '#6cc6ff', '#ff8a7a', '#9be37a'];
const stage = document.getElementById('stage');
let G = null;
let ui = null; // 人の手番の途中の選択: { w, need, sel:[手札の添字], build } か { trim:true, sel }
let timer = 0;

function h(tag, cls, text, kids) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  (kids || []).forEach((k) => e.append(k));
  return e;
}
function btn(text, cls, fn, disabled) {
  const b = h('button', cls, text);
  b.type = 'button';
  b.disabled = !!disabled;
  b.addEventListener('click', fn);
  return b;
}
const cardInfo = (c) => (c === 'g' ? '建てられない。捨てて費用にする' : `費用${NE.BLD[c].cost} 価値${NE.BLD[c].value}${NE.BLD[c].nosell ? '（売れない）' : ''}　${NE.text(c)}`);

// 工業ポスター風のカード。種類で色とアイコンが決まる。狭い画面では CSS が効果の文を隠す（全文は title に入れてある）
const KIND = {
  g: ['#d9d2c0', '#1d1d1d', '共通', 'M3 7l9-4 9 4-9 4-9-4zm0 0v10l9 4 9-4V7M12 11v10'],
  agri: ['#f2c230', '#1d1d1d', '農業', 'M12 22V7M12 7c-2.5 0-3.5-2.5-3.5-4.5C11 2.5 12 4.5 12 7zm0 0c2.5 0 3.5-2.5 3.5-4.5C13 2.5 12 4.5 12 7zM12 13c-2.5 0-3.5-2.5-3.5-4.5 2.5 0 3.5 2 3.5 4.5zm0 0c2.5 0 3.5-2.5 3.5-4.5-2.5 0-3.5 2-3.5 4.5zM12 19c-2.5 0-3.5-2.5-3.5-4.5 2.5 0 3.5 2 3.5 4.5zm0 0c2.5 0 3.5-2.5 3.5-4.5-2.5 0-3.5 2-3.5 4.5z'],
  ind: ['#2456a6', '#fff', '工業', 'M3 21V11l5 3v-3l5 3v-3l5 3V4h3v17zM7 18h2M11 18h2M15 18h2'],
  fac: ['#c63d2a', '#fff', '施設', 'M4 21V6l8-3 8 3v15M2 21h20M9 21v-5h6v5M8 8h2M14 8h2M8 12h2M14 12h2'],
  shop: ['#1f7a6b', '#fff', '商業', 'M3 9l2-5h14l2 5M3 9h18M3 9v0a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0M5 12v9h14v-9M10 21v-5h4v5'],
  pub: ['#3a3a3a', '#fff', '公共', 'M3 21h18M4 10h16M12 3l9 7H3zM6 10v11M10 10v11M14 10v11M18 10v11'],
};
// 公共の職場は役目ごとにアイコンを変える（色は「公共」の灰色のまま）
const PICK = 'M3 10c5-5 13-5 18 0M12 7L6 21';
const CAP = 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6';
const PUB_ICON = {
  quarry: PICK, mine: 'M3 10c5-5 13-5 18 0M12 7L6 21M14 15h7l-1 5h-5z', school: CAP, highschool: CAP, univ: CAP, voc: CAP,
  carpenter: 'M13 3l8 8-3 3-8-8zM12 8l-9 9 3 3 9-9',
  stall: KIND.shop[3], market: KIND.shop[3], super: KIND.shop[3], dept: KIND.shop[3],
  expo: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18',
};
// 労働者のコマ（人の形）。used=置いたあと（中抜き）、temp=研修中（点線）
const MEEPLE = 'M12 2.5a3 3 0 110 6 3 3 0 010-6zM8.5 9.5h7l5 3.5-1.2 2-3.8-2 1.8 8.5h-3.6L12 17l-1.7 4.5H6.7l1.8-8.5-3.8 2-1.2-2z';
function meeple(color, cls) {
  const m = icon(MEEPLE);
  m.setAttribute('class', 'mp ' + (cls || ''));
  m.style.color = color;
  return m;
}
// 盤面の部品: お金・未払い賃金・点・山札などの札
function chip(cls, label, value, tip) {
  const c = h('span', 'chip ' + cls, null, [h('small', null, label), h('b', null, String(value))]);
  if (tip) c.title = tip;
  return c;
}

// 盤面の小さいカード（公共の職場・建てた建物）。色とアイコンは手札と同じ。foot は下の段（労働者の点や資産）
// big=手札と同じ大きさ（公共の職場）
function miniCard(key, fn, disabled, name, foot, big) {
  const d = NE.BLD[key];
  const k = KIND[!d ? 'pub' : d.fac ? 'fac' : d.cat || 'shop'];
  const b = btn('', big ? 'card pub' : 'card mini', fn, disabled);
  b.style.setProperty('--bg', k[0]);
  b.style.setProperty('--fg', k[1]);
  b.title = `${name}　${NE.text(key)}`;
  b.append(h('span', 'c-hd', null, [icon(d ? k[3] : PUB_ICON[key] || k[3]), h('small', null, k[2])]), h('span', 'c-nm', name), h('span', 'c-fx', NE.text(key)), h('span', 'c-ft', null, foot));
  return b;
}
function icon(d) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.6');
  svg.setAttribute('stroke-linejoin', 'round');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', d);
  svg.append(p);
  return svg;
}
function posterCard(c, cls, fn, disabled) {
  const d = c === 'g' ? null : NE.BLD[c];
  const k = KIND[c === 'g' ? 'g' : d.fac ? 'fac' : d.cat || 'shop'];
  const b = btn('', 'card ' + cls, fn, disabled);
  b.style.setProperty('--bg', k[0]);
  b.style.setProperty('--fg', k[1]);
  b.title = cardInfo(c);
  const svg = icon(k[3]);
  const hd = h('span', 'c-hd', null, [
    h('span', 'c-cost', null, [h('small', null, c === 'g' ? 'GOODS' : '建設'), document.createTextNode(c === 'g' ? '―' : d.cost)]),
    svg,
  ]);
  if (d && d.nosell) hd.append(h('span', 'c-ns', '売れない'));
  b.append(hd, h('span', 'c-nm', NE.cardName(c)),
    h('span', 'c-fx', c === 'g' ? '建物の費用として捨てる。点にはならない。' : NE.text(c)),
    h('span', 'c-ft', null, [
      h('span', null, c === 'g' ? '共通' : `${k[2]} ×${d.count}`),
      h('span', 'c-vp', null, d ? [h('small', null, '資産'), document.createTextNode(d.value)] : []),
    ]));
  return b;
}

function title() {
  clearTimeout(timer);
  G = null; ui = null;
  stage.replaceChildren(h('div', 'title', null, [
    h('h2', null, 'ナショナルエコノミー風'),
    h('p', 'muted', '手札の建物カードを、別の手札を捨てて建てる。9 ラウンド後、建物の資産価値＋現金−未払い賃金×3 で勝負。'),
    h('p', null, '人数を選んではじめる'),
    h('div', 'row', null, [2, 3, 4].map((n) => btn(`${n} 人`, 'big', () => start(n)))),
    h('details', 'rules', null, [h('summary', null, '遊び方'), h('div', null, null, [
      h('p', null, '手番ごとに労働者 1 人を、公共の職場か自分の建物に置いてすぐ効果を使う。全員が置き終えたら賃金を払う。'),
      h('p', null, '建物は「大工」などで建てる。手札の建物カードを選び、費用の枚数だけ別の手札を捨てる（消費財は捨てるためのカード）。'),
      h('p', null, '賃金は家計に入り、露店・市場などで家計から受け取れる。払えないときは建物を売り（公共の職場になる）、足りなければ負債。'),
      h('p', null, '手札は各ラウンドの終わりに 5 枚まで。'),
    ])]),
  ]));
}

function start(n) {
  G = NE.create(n);
  ui = null;
  render();
}

const mine = () => G && !G.over && G.players[G.actor].human;

function act(a) {
  ui = null;
  NE.apply(G, a);
  render();
}

function clickWork(w) {
  const need = NE.needs(G, w);
  if (!need.disc && need.build == null) return act({ kind: 'place', ...w });
  ui = { w, need, sel: [], build: null };
  render();
}

// 選ぶ枚数（まだ建てる建物を選んでいなければ null）
function want(me) {
  if (ui.trim) return me.hand.length - NE.handLimit(me);
  if (ui.need.build != null) return ui.build == null ? null : NE.buildCost(me.hand[ui.build], ui.need.build);
  return ui.need.disc;
}

function tapCard(i, me) {
  if (ui.need && ui.need.build != null && (ui.build == null || ui.build === i)) {
    ui.build = ui.build === i ? null : i; ui.sel = [];
  } else if (ui.sel.includes(i)) ui.sel = ui.sel.filter((x) => x !== i);
  else if (ui.sel.length < want(me)) ui.sel.push(i);
  render();
}

function render() {
  clearTimeout(timer);
  if (!G) return title();
  const my = mine();
  const me = G.players[0];
  if (my && G.phase === 'trim' && !ui) ui = { trim: true, sel: [] };
  const kids = [];
  const r = Math.min(G.round, NE.ROUNDS);
  // ラウンドカード（ラウンドと賃金）、家計、山札、手番
  const turn = G.over ? h('span', 'turn', '終了') : h('span', 'turn', null, [meeple(COLORS[G.actor]), h('span', null, `${G.players[G.actor].name} の番`)]);
  kids.push(h('div', 'top', null, [
    h('div', 'round', null, [
      h('span', 'r-no', null, [h('small', null, 'ROUND'), h('b', null, String(r)), h('span', null, `/${NE.ROUNDS}`)]),
      h('span', 'r-wage', null, [h('small', null, '賃金 / 人'), h('b', null, `$${NE.WAGE[r - 1]}`)]),
    ]),
    chip('coin', '家計', `$${G.house}`, '家計のお金。売ったり稼いだりするときここから受け取る'),
    chip('deck', '山札', G.deck.length, '建物の山札の残り'),
    turn,
  ]));

  // 公共の職場
  const pub = h('div', 'public');
  for (const s of G.pub) {
    const d = NE.defOf(s.key);
    const dots = h('span', 'dots');
    if (s.cap > 9) dots.append(h('small', null, `${s.occ.length} 人`));
    else for (let i = 0; i < s.cap; i++) {
      dots.append(i < s.occ.length ? meeple(COLORS[s.occ[i]]) : meeple('#1d1d1d', 'empty'));
    }
    const sold = NE.BLD[s.key] ? '（売られた）' : '';
    pub.append(miniCard(s.key, () => clickWork({ pub: s.uid }), !my || !!ui || !NE.canUse(G, { pub: s.uid }), d.name + sold, [dots], true));
  }
  kids.push(pub);

  if (my && G.phase === 'pick') kids.push(pickPanel());
  else if (ui) kids.push(choicePanel(me));

  // 自分の手札
  const sel = ui ? ui.sel : [];
  const hand = h('div', 'blds');
  me.hand.forEach((c, i) => {
    let ok = !!ui;
    if (ui && ui.need && ui.need.build != null && (ui.build == null || ui.build === i)) ok = c !== 'g' && NE.buildCost(c, ui.need.build) <= me.hand.length - 1;
    else if (ui && ui.need && ui.need.build != null && ui.build != null) ok = i !== ui.build;
    const b = posterCard(c, '', () => tapCard(i, me), !ok);
    b.classList.toggle('sel', sel.includes(i));
    b.classList.toggle('build', ui && ui.build === i);
    hand.append(b);
  });
  kids.push(h('section', 'player', null, [h('div', 'ph', null, [h('b', null, `手札 ${me.hand.length} 枚（上限 ${NE.handLimit(me)}）`)]), hand]));

  // プレイヤー
  G.players.forEach((p, i) => {
    const bs = h('div', 'blds');
    p.bld.forEach((b, idx) => {
      const d = NE.BLD[b.key];
      const ok = p.human && my && !ui && NE.canUse(G, { own: idx });
      const c = miniCard(b.key, () => clickWork({ own: idx }), !ok, d.name, [h('span', null, b.used ? '使用済み' : ''), h('span', 'c-vp', null, [h('small', null, '資産'), document.createTextNode(d.value)])]);
      c.classList.toggle('used', b.used);
      bs.append(c);
    });
    if (!p.bld.length) bs.append(h('small', 'muted', '建物なし'));
    const box = h('section', 'player', null, [
      h('div', 'ph', null, [
        h('b', null, p.name + (i === G.actor && !G.over ? ' ◀' : '') + (i === G.start ? '（スタート）' : '')),
        chip('vp', '勝利点', NE.score(p), '建物の資産 + 終了時の点 + 現金 − 未払い賃金×3'),
      ]),
      h('div', 'stats', null, [
        chip('coin', '現金', `$${p.cash}`),
        ...(p.debt ? [chip('debt', '未払い賃金', p.debt, `1 枚 −${NE.penalty()} 点`)] : []),
        h('span', 'workers', null, [
          ...Array.from({ length: p.workers }, (_, j) => meeple(COLORS[i], j < p.free ? '' : 'used')),
          ...Array.from({ length: p.hired }, () => meeple(COLORS[i], 'temp')),
        ]),
        chip('deck', '手札', p.hand.length),
      ]),
      bs,
    ]);
    box.style.borderColor = COLORS[i];
    kids.push(box);
  });

  kids.push(h('div', 'log', G.log.slice(-6).join('\n')));
  if (G.over) kids.push(overPanel());
  stage.replaceChildren(...kids);

  if (!G.over && !my) timer = setTimeout(() => { NE.apply(G, NE.cpuAct(G)); render(); }, 650);
}

function choicePanel(me) {
  const n = want(me);
  let msg;
  if (ui.trim) msg = `手札が多い。捨てるカードを ${n} 枚選ぶ（${ui.sel.length}/${n}）`;
  else if (ui.need.build != null && ui.build == null) msg = '建てる建物カードを手札から選ぶ';
  else if (ui.need.build != null) msg = `${NE.cardName(me.hand[ui.build])} を建てる。捨てるカードを ${n} 枚選ぶ（${ui.sel.length}/${n}）`;
  else msg = `捨てるカードを ${n} 枚選ぶ（${ui.sel.length}/${n}）`;
  const go = () => (ui.trim ? act({ kind: 'trim', disc: ui.sel }) : act({ kind: 'place', ...ui.w, disc: ui.sel, build: ui.build == null ? undefined : ui.build }));
  return h('section', 'choice', null, [
    h('div', null, msg),
    h('div', 'row', null, [
      btn('決める', 'big', go, n == null || ui.sel.length !== n),
      ui.trim ? h('span') : btn('やめる', 'pill', () => { ui = null; render(); }),
    ]),
  ]);
}

function pickPanel() {
  const list = h('div', 'blds');
  G.look.forEach((c, i) => {
    const b = posterCard(c, '', () => act({ kind: 'pick', i }));
    list.append(b);
  });
  return h('section', 'choice', null, [h('div', null, '山札の上から 1 枚取る（残りは捨て札）'), list]);
}

function overPanel() {
  const order = G.players.map((p, i) => ({ p, i, s: NE.score(p) })).sort((a, b) => b.s - a.s);
  return h('section', 'choice', null, [
    h('h2', null, order[0].p.human ? 'あなたの勝ち！' : `${order[0].p.name} の勝ち`),
    ...order.map((o, r) => h('div', null, `${r + 1} 位 ${o.p.name}　${o.s} 点（建物 ${o.p.bld.length}・現金 ${o.p.cash}・負債 ${o.p.debt}）`)),
    btn('もう一度', 'big', title),
  ]);
}

title();
