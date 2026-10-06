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
let ui = null; // 人の手番の途中の選択: { mode: 'sell', sell } か { mode: 'build' }
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
const handText = (hand) => NE.KINDS.map((k) => `${NE.GOODS[k].name}${hand[k]}`).join(' ');
const needText = (o) => NE.KINDS.filter((k) => o[k]).map((k) => `${NE.GOODS[k].name}${o[k]}`).join('+');

function title() {
  clearTimeout(timer);
  G = null; ui = null;
  stage.replaceChildren(h('div', 'title', null, [
    h('h2', null, 'ナショナルエコノミー風'),
    h('p', 'muted', '労働者を置いて資源・お金・建物を集める。9 ラウンド後、建物の資産価値＋現金−負債で勝負。'),
    h('p', null, '人数を選んではじめる'),
    h('div', 'row', null, [2, 3, 4].map((n) => btn(`${n} 人`, 'big', () => start(n)))),
    h('details', 'rules', null, [h('summary', null, '遊び方'), h('div', null, null, [
      h('p', null, '手番ごとに労働者 1 人を、公共の職場か自分の建物に置く（置ける数は決まっている）。置いたらすぐ効果が出る。'),
      h('p', null, '全員の労働者がなくなる（またはパス）とラウンド終了。労働者 1 人ごとに賃金を払い、足りない分は 5 借りて負債になる（終了時 −7 点）。'),
      h('p', null, `賃金は ${NE.WAGE.join('・')} と上がる。労働者は職業安定所で増やせる（次のラウンドから、最大 5 人）。`),
      h('p', null, '建物は建設現場で建てる。自分の建物に置くと、カードを使ってカードやお金を得る。カードは市場で売る。'),
    ])]),
  ]));
}

function start(n) {
  G = NE.create(n, 1);
  ui = null;
  render();
}

function mine() { return G && !G.over && G.players[G.turn].human; }

function place(a) {
  ui = null;
  NE.apply(G, a);
  render();
}

function clickPublic(id) {
  if (id === 'market') ui = { mode: 'sell', sell: { F: 0, M: 0, P: 0 } };
  else if (id === 'build') ui = { mode: 'build' };
  else return place({ kind: 'pub', id });
  render();
}

function render() {
  clearTimeout(timer);
  if (!G) return title();
  const legal = mine() ? NE.legal(G) : [];
  const me = G.players[0];
  const kids = [];
  kids.push(h('div', 'info', `ラウンド ${Math.min(G.round, NE.ROUNDS)} / ${NE.ROUNDS}　賃金 ${NE.WAGE[Math.min(G.round, NE.ROUNDS) - 1]}/人　` + (G.over ? '終了' : `手番: ${G.players[G.turn].name}`)));

  // 公共の職場
  const pub = h('div', 'public');
  for (const p of NE.PUBLIC) {
    const occ = G.slots[p.id];
    const dots = h('span', 'dots');
    for (let i = 0; i < p.cap; i++) {
      const d = h('i');
      if (i < occ.length) d.style.background = COLORS[occ[i]];
      dots.append(d);
    }
    const ok = legal.some((a) => a.kind === 'pub' && a.id === p.id);
    const b = btn('', 'slot', () => clickPublic(p.id), !ok || !!ui);
    b.append(h('b', null, p.name), h('small', null, p.desc), dots);
    pub.append(b);
  }
  kids.push(pub);

  // 選択中のパネル
  if (ui && mine()) kids.push(choicePanel(me));

  // プレイヤー
  G.players.forEach((p, i) => {
    const bs = h('div', 'blds');
    p.bld.forEach((b, idx) => {
      const d = NE.BUILDINGS[b.id];
      const ok = legal.some((a) => a.kind === 'own' && a.idx === idx);
      const c = btn('', 'bld', () => place({ kind: 'own', idx }), !p.human || !ok || !!ui);
      c.classList.toggle('used', b.used);
      c.append(h('b', null, d.name), h('small', null, `${needText(d.in) || '無料'} → ${needText(d.out) || ''}${d.money ? `お金${d.money}` : ''}`));
      bs.append(c);
    });
    if (!p.bld.length) bs.append(h('small', 'muted', '建物なし'));
    const box = h('section', 'player', null, [
      h('div', 'ph', null, [
        h('b', null, p.name + (i === G.turn && !G.over ? ' ◀' : '')),
        h('span', null, `点 ${NE.score(p)}`),
      ]),
      h('div', 'stats', `現金 ${p.cash}　負債 ${p.loans}　労働者 ${p.free}/${p.workers}${p.hired ? `（+${p.hired}）` : ''}${p.passed ? '　パス' : ''}`),
      h('div', 'stats', `手札: ${handText(p.hand)}`),
      bs,
    ]);
    box.style.borderColor = COLORS[i];
    kids.push(box);
  });

  if (mine() && !ui) kids.push(btn('パス（残りの労働者を使わない）', 'pill', () => place({ kind: 'pass' })));
  kids.push(h('div', 'log', G.log.slice(-6).join('\n')));
  if (G.over) kids.push(overPanel());
  stage.replaceChildren(...kids);

  if (!G.over && !mine()) timer = setTimeout(() => { NE.apply(G, NE.cpuPick(G)); render(); }, 650);
}

function choicePanel(me) {
  if (ui.mode === 'sell') {
    const s = ui.sell, total = NE.KINDS.reduce((t, k) => t + s[k], 0);
    const row = h('div', 'row');
    for (const k of NE.KINDS) {
      row.append(h('div', 'cnt', null, [
        h('div', null, `${NE.GOODS[k].name}（${NE.GOODS[k].price}）`),
        h('div', 'row', null, [
          btn('−', 'step', () => { s[k]--; render(); }, s[k] <= 0),
          h('b', null, `${s[k]}/${me.hand[k]}`),
          btn('＋', 'step', () => { s[k]++; render(); }, s[k] >= me.hand[k] || total >= NE.MAX_SELL),
        ]),
      ]));
    }
    return h('section', 'choice', null, [
      h('div', null, `売るカードを選ぶ（${NE.MAX_SELL} 枚まで）→ ${NE.worth(s)} 円`),
      row,
      h('div', 'row', null, [
        btn('売る', 'big', () => place({ kind: 'pub', id: 'market', sell: { ...s } }), total < 1),
        btn('やめる', 'pill', () => { ui = null; render(); }),
      ]),
    ]);
  }
  const list = h('div', 'blds');
  for (const [id, d] of Object.entries(NE.BUILDINGS)) {
    const ok = G.supply[id] > 0 && d.cost <= me.cash;
    const c = btn('', 'bld', () => place({ kind: 'pub', id: 'build', b: id }), !ok);
    c.append(h('b', null, `${d.name}（${d.cost}円）`), h('small', null, `価値${d.value}　${needText(d.in) || '無料'} → ${needText(d.out)}${d.money ? `お金${d.money}` : ''}　残${G.supply[id]}`));
    list.append(c);
  }
  return h('section', 'choice', null, [h('div', null, '建てる建物を選ぶ'), list, btn('やめる', 'pill', () => { ui = null; render(); })]);
}

function overPanel() {
  const order = G.players.map((p, i) => ({ p, i, s: NE.score(p) })).sort((a, b) => b.s - a.s);
  return h('section', 'choice', null, [
    h('h2', null, order[0].p.human ? 'あなたの勝ち！' : `${order[0].p.name} の勝ち`),
    ...order.map((o, r) => h('div', null, `${r + 1} 位 ${o.p.name}　${o.s} 点（建物 ${o.p.bld.length}・現金 ${o.p.cash}・負債 ${o.p.loans}）`)),
    btn('もう一度', 'big', title),
  ]);
}

title();
