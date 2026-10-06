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
  kids.push(h('div', 'info', `ラウンド ${r} / ${NE.ROUNDS}　賃金 ${NE.WAGE[r - 1]}/人　家計 ${G.house}　山札 ${G.deck.length}　` + (G.over ? '終了' : `手番: ${G.players[G.actor].name}`)));

  // 公共の職場
  const pub = h('div', 'public');
  for (const s of G.pub) {
    const d = NE.defOf(s.key);
    const dots = h('span', 'dots');
    if (s.cap > 9) dots.append(h('small', null, `${s.occ.length} 人`));
    else for (let i = 0; i < s.cap; i++) {
      const dot = h('i');
      if (i < s.occ.length) dot.style.background = COLORS[s.occ[i]];
      dots.append(dot);
    }
    const sold = NE.BLD[s.key] ? '（売られた）' : '';
    const b = btn('', 'slot', () => clickWork({ pub: s.uid }), !my || !!ui || !NE.canUse(G, { pub: s.uid }));
    b.append(h('b', null, d.name + sold), h('small', null, NE.text(s.key)), dots);
    pub.append(b);
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
    const b = btn('', 'bld card', () => tapCard(i, me), !ok);
    b.classList.toggle('sel', sel.includes(i));
    b.classList.toggle('build', ui && ui.build === i);
    b.classList.toggle('goods', c === 'g');
    b.append(h('b', null, NE.cardName(c)), h('small', null, cardInfo(c)));
    hand.append(b);
  });
  kids.push(h('section', 'player', null, [h('div', 'ph', null, [h('b', null, `手札 ${me.hand.length} 枚（上限 ${NE.handLimit(me)}）`)]), hand]));

  // プレイヤー
  G.players.forEach((p, i) => {
    const bs = h('div', 'blds');
    p.bld.forEach((b, idx) => {
      const d = NE.BLD[b.key];
      const ok = p.human && my && !ui && NE.canUse(G, { own: idx });
      const c = btn('', 'bld', () => clickWork({ own: idx }), !ok);
      c.classList.toggle('used', b.used);
      c.append(h('b', null, d.name), h('small', null, `価値${d.value}　${NE.text(b.key)}`));
      bs.append(c);
    });
    if (!p.bld.length) bs.append(h('small', 'muted', '建物なし'));
    const box = h('section', 'player', null, [
      h('div', 'ph', null, [
        h('b', null, p.name + (i === G.actor && !G.over ? ' ◀' : '') + (i === G.start ? '（スタート）' : '')),
        h('span', null, `点 ${NE.score(p)}`),
      ]),
      h('div', 'stats', `現金 ${p.cash}　負債 ${p.debt}　労働者 ${p.free}/${p.workers}${p.hired ? `（+${p.hired}）` : ''}　手札 ${p.hand.length}`),
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
    const b = btn('', 'bld card', () => act({ kind: 'pick', i }));
    b.classList.toggle('goods', c === 'g');
    b.append(h('b', null, NE.cardName(c)), h('small', null, cardInfo(c)));
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
