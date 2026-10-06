'use strict';
// ナショナルエコノミー風のルール（画面を持たない）。ブラウザでは NE、Node では module.exports で使う。
// 原作どおり（docs/private/specs/national-economy.md §1）。建物は開拓民・二胡市建設を除く 22 種 60 枚（この 2 つは段階 7 で足す）。
//
// 原作ではっきりしないので推定で置いている所（※）:
//   最終ラウンドの終わりは手札を捨てない（農協のため）※ / 建てた建物はそのラウンドからすぐ使える※
//   売るのは賃金が払えないときだけで、払えるまで売る（売れる建物がなければ未払い）※
//   焼畑は使ったら建物の捨て札へ※ / 設計事務所で取らなかった札は建物の捨て札へ※
//   労働組合の人数は研修中も数える※ / 家計の職場は何度でも（人数が埋まるまで）※
const NE = (() => {
  const ROUNDS = 9, MAX_WORKERS = 5, HAND_LIMIT = 5, START_HAND = 3, GOODS_COUNT = 24;
  const WAGE = [2, 2, 3, 3, 3, 4, 4, 5, 5];
  const START_CASH = [5, 6, 7, 8];
  const LEVELS = { weak: 4, normal: 0.8, strong: 0.8 }; // CPU の強さ → 手の選びのゆらぎ。つよいは段階 6 まで ふつう と同じ
  // e: 効果。disc=捨てる枚数、drawB=建物を引く、drawG=消費財を引く、fill=手札がその枚数になるまで消費財（それ以上なら使えない）、
  //    take=家計から受け取る額（家計にそれだけないと使えない）、look=建物の山の上から見て 1 枚取る、build=建てる（値は費用の割引）、
  //    then=建てたあと建物を引く、hire=労働者を増やす（研修中）、hireTo=その人数になるまで増やす（以上なら使えない）、now=増えた人がすぐ働く、
  //    start=次のスタート、one=使ったらなくなる、empty=手札が 0 のときの drawB
  const PUB = {
    quarry: { name: '採石場', cap: 1, e: { drawB: 1, start: true } },
    mine: { name: '鉱山', cap: 99, e: { drawB: 1 } },
    school: { name: '学校', e: { hire: 1 } },
    carpenter: { name: '大工', e: { build: 0 } },
    stall: { name: '露店', e: { disc: 1, take: 6 } },
    market: { name: '市場', e: { disc: 2, take: 12 } },
    highschool: { name: '高等学校', e: { hireTo: 4 } },
    super: { name: 'スーパーマーケット', e: { disc: 3, take: 18 } },
    univ: { name: '大学', e: { hireTo: 5 } },
    dept: { name: '百貨店', e: { disc: 4, take: 24 } },
    voc: { name: '専門学校', e: { hire: 1, now: true } },
    expo: { name: '万博', e: { disc: 5, take: 30 } },
  };
  const ADDED = ['stall', 'market', 'highschool', 'super', 'univ', 'dept', 'voc', 'expo']; // ラウンド 2〜9 のはじめに 1 枚
  // 建物。cat: agri=農業 ind=工業。fac=施設（置けない・売れない）。nosell=売れない。
  // 施設の効果: hand=手札上限+、maxw=労働者の上限+、law=終了時に捨てる未払い賃金の枚数、end=終了時の点（p を受ける）
  const goodsIn = (p) => p.hand.filter((c) => c === 'g').length;
  const BLD = {
    farm: { name: '農場', cost: 1, value: 6, count: 8, cat: 'agri', e: { drawG: 2 } },
    design: { name: '設計事務所', cost: 1, value: 8, count: 4, e: { look: 5 } },
    burn: { name: '焼畑', cost: 1, value: 0, count: 2, cat: 'agri', nosell: true, e: { drawG: 5, one: true } },
    coffee: { name: '珈琲店', cost: 1, value: 8, count: 2, e: { take: 5 } },
    factory: { name: '工場', cost: 2, value: 12, count: 8, cat: 'ind', e: { disc: 2, drawB: 4 } },
    builder: { name: '建設会社', cost: 2, value: 10, count: 4, e: { build: 1 } },
    orchard: { name: '果樹園', cost: 2, value: 10, count: 3, cat: 'agri', e: { fill: 4 } },
    warehouse: { name: '倉庫', cost: 2, value: 10, count: 3, fac: true, e: null, hand: 4, text: '手札の上限 +4' },
    housing: { name: '社宅', cost: 2, value: 8, count: 2, fac: true, e: null, maxw: 1, text: '労働者の上限 +1' },
    law: { name: '法律事務所', cost: 2, value: 8, count: 1, fac: true, e: null, law: 5, text: '終了時、未払い賃金を 5 枚まで捨てる' },
    bigfarm: { name: '大農園', cost: 3, value: 12, count: 3, cat: 'agri', e: { drawG: 3 } },
    restaurant: { name: 'レストラン', cost: 3, value: 16, count: 2, e: { disc: 1, take: 15 } },
    estate: { name: '不動産屋', cost: 3, value: 10, count: 2, fac: true, e: null, text: '終了時、建物 1 つにつき +3', end: (p) => 3 * p.bld.length },
    coop: { name: '農協', cost: 3, value: 12, count: 1, fac: true, e: null, text: '終了時、手札の消費財 1 枚につき +3', end: (p) => 3 * goodsIn(p) },
    steel: { name: '製鉄所', cost: 4, value: 20, count: 3, cat: 'ind', e: { drawB: 3 } },
    general: { name: 'ゼネコン', cost: 4, value: 18, count: 3, e: { build: 0, then: 2 } },
    chem: { name: '化学工場', cost: 4, value: 18, count: 2, cat: 'ind', e: { drawB: 2, empty: 4 } },
    union: { name: '労働組合', cost: 4, value: 0, count: 1, fac: true, e: null, text: '終了時、労働者 1 人につき +6', end: (p) => 6 * (p.workers + p.hired) },
    mansion: { name: '邸宅', cost: 4, value: 28, count: 1, fac: true, e: null, text: '効果なし' },
    car: { name: '自動車工場', cost: 5, value: 24, count: 3, cat: 'ind', e: { disc: 3, drawB: 7 } },
    rail: { name: '鉄道', cost: 5, value: 18, count: 1, fac: true, e: null, text: '終了時、工業の建物 1 つにつき +8', end: (p) => 8 * p.bld.filter((b) => BLD[b.key].cat === 'ind').length },
    hq: { name: '本社ビル', cost: 5, value: 20, count: 1, fac: true, e: null, text: '終了時、施設 1 つにつき +6', end: (p) => 6 * p.bld.filter((b) => BLD[b.key].fac).length },
  };
  for (const d of Object.values(BLD)) if (d.fac) d.nosell = true;
  const BLD_TOTAL = Object.values(BLD).reduce((s, d) => s + d.count, 0);
  const defOf = (key) => PUB[key] || BLD[key];
  const isBld = (c) => c !== 'g';
  const cardName = (c) => (c === 'g' ? '消費財' : BLD[c].name);

  function effText(e) {
    if (!e) return '効果なし';
    const t = [];
    if (e.disc) t.push(`${e.disc} 枚捨てて`);
    if (e.build != null) t.push(e.build ? `建てる（費用 −${e.build}）` : '建てる');
    if (e.then) t.push(`建物を ${e.then} 枚引く`);
    if (e.look) t.push(`建物の山の上 ${e.look} 枚から 1 枚取る`);
    if (e.drawB) t.push(e.empty ? `建物を ${e.drawB} 枚（手札 0 なら ${e.empty} 枚）引く` : `建物を ${e.drawB} 枚引く`);
    if (e.drawG) t.push(`消費財を ${e.drawG} 枚引く`);
    if (e.fill) t.push(`手札が ${e.fill} 枚になるまで消費財を引く`);
    if (e.take) t.push(`家計から $${e.take}`);
    if (e.hireTo) t.push(`労働者を ${e.hireTo} 人になるまで増やす`);
    if (e.hire) t.push(e.now ? '労働者 +1（すぐ働く）' : '労働者 +1');
    if (e.start) t.push('次のスタート');
    if (e.one) t.push('（使うとなくなる）');
    return t.join(' ');
  }
  const text = (key) => (BLD[key] && BLD[key].fac ? BLD[key].text : effText(defOf(key).e)); // 画面用: 建物・職場の説明
  const passive = (p, k) => p.bld.reduce((s, b) => s + (BLD[b.key][k] || 0), 0);
  const handLimit = (p) => HAND_LIMIT + passive(p, 'hand');
  const maxWorkers = (p) => MAX_WORKERS + passive(p, 'maxw');
  const total = (p) => p.workers + p.hired;
  const unpaid = (p) => Math.max(0, p.debt - passive(p, 'law')); // 法律事務所で捨てたあとの未払い賃金
  const penalty = () => 3;
  const endBonus = (p) => p.bld.reduce((s, b) => s + (BLD[b.key].end ? BLD[b.key].end(p) : 0), 0);
  const score = (p) => p.bld.reduce((s, b) => s + BLD[b.key].value, 0) + endBonus(p) + p.cash - unpaid(p) * penalty();

  // 種つき乱数（mulberry32）。保存するときは状態ごと持つ
  function seeded(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function shuffle(a, rng) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  // 建物の山から 1 枚。尽きたら捨て札を切り直す
  function drawOne(G) {
    if (!G.deck.length) { G.deck = shuffle(G.discard, G.rng); G.discard = []; }
    return G.deck.length ? G.deck.pop() : null;
  }
  const drawB = (G, P, n) => { for (let i = 0; i < n; i++) { const c = drawOne(G); if (c) P.hand.push(c); } };
  // 消費財は同じカードなので枚数だけ数える。山が空ならある分だけ
  const drawG = (G, P, n) => { const x = Math.min(n, G.goods); G.goods -= x; for (let i = 0; i < x; i++) P.hand.push('g'); };
  const discardCard = (G, c) => { if (c === 'g') G.goods++; else G.discard.push(c); };
  const log = (G, s) => { G.log.push(s); if (G.log.length > 40) G.log.shift(); };

  // level: 'weak' | 'normal' | 'strong'（今は ふつう と同じ手の選び方。ゆらぎだけ違う）
  function create(n, rng = Math.random, level = 'normal') {
    const deck = [];
    for (const [k, d] of Object.entries(BLD)) for (let i = 0; i < d.count; i++) deck.push(k);
    const G = { n, rng, level, deck: shuffle(deck, rng), discard: [], goods: GOODS_COUNT, sold: 0, house: 0, round: 0, log: [], pub: [], uid: 0, nextStart: 0, phase: 'place', actor: 0, turn: 0, trimQ: [], look: null, over: false, start: Math.floor(rng() * n), chooseSell: null };
    G.nextStart = G.start;
    G.players = [];
    G.cash0 = 0;
    for (let i = 0; i < n; i++) {
      const cash = START_CASH[(i - G.start + n) % n];
      G.cash0 += cash;
      G.players.push({ name: i === 0 ? 'あなた' : `CPU${i}`, human: i === 0, cash, debt: 0, workers: 2, hired: 0, free: 0, hand: [], bld: [] });
      drawB(G, G.players[i], START_HAND);
    }
    startRound(G);
    return G;
  }

  const addPub = (G, key, cap) => G.pub.push({ uid: ++G.uid, key, cap: cap || PUB[key].cap || 1, occ: [] });
  function startRound(G) {
    G.round++;
    if (G.round === 1) {
      ['quarry', 'mine', 'school'].forEach((k) => addPub(G, k));
      for (let i = 0; i < Math.max(1, G.n - 1); i++) addPub(G, 'carpenter'); // 1・2 人 1、3 人 2、4 人 3
    } else addPub(G, ADDED[G.round - 2]);
    G.pub.forEach((w) => { w.occ = []; });
    G.players.forEach((p) => { p.workers += p.hired; p.hired = 0; p.free = p.workers; p.bld.forEach((b) => { b.used = false; }); });
    G.start = G.nextStart; G.turn = G.actor = G.start; G.phase = 'place';
    log(G, `--- ラウンド ${G.round}（賃金 ${WAGE[G.round - 1]}/人、スタート: ${G.players[G.start].name}）`);
  }

  const sellable = (p) => p.bld.map((b, i) => i).filter((i) => !BLD[p.bld[i].key].nosell);
  // おすすめ: 足りる中で一番安いもの。足りるものがなければ一番高いもの。なければ -1
  function recommendSell(G, pi, missing) {
    const p = G.players[pi], idx = sellable(p), v = (i) => BLD[p.bld[i].key].value;
    if (!idx.length) return -1;
    const enough = idx.filter((i) => v(i) >= missing);
    return enough.length ? enough.reduce((a, b) => (v(a) <= v(b) ? a : b)) : idx.reduce((a, b) => (v(a) >= v(b) ? a : b));
  }
  // 賃金。売る建物は G.chooseSell(G, pi, 足りない額) が添字を返せばそれを使い、なければおすすめ（人が選ぶ画面は後の段階）
  function payWages(G) {
    const w = WAGE[G.round - 1];
    for (let k = 0; k < G.n; k++) {
      const pi = (G.start + k) % G.n, p = G.players[pi];
      const due = w * total(p); // 研修中（雇ったラウンド）も払う
      while (p.cash < due) {
        let i = G.chooseSell ? G.chooseSell(G, pi, due - p.cash) : -1;
        if (!sellable(p).includes(i)) i = recommendSell(G, pi, due - p.cash);
        if (i < 0) break;
        const key = p.bld[i].key;
        p.bld.splice(i, 1);
        p.cash += BLD[key].value; G.sold += BLD[key].value;
        addPub(G, key, 1); // 売った建物は公共の職場
        log(G, `${p.name} は賃金のため ${BLD[key].name} を売った（+${BLD[key].value}）`);
      }
      const x = Math.min(p.cash, due);
      p.cash -= x; G.house += x;
      if (x < due) { p.debt += due - x; log(G, `${p.name} は未払い賃金 +${due - x}`); }
    }
  }

  // ラウンドの終わり: 手札を捨てる → 賃金（→ 売る → 未払い）。最後のラウンドは手札を捨てない
  function endRound(G) {
    G.trimQ = [];
    if (G.round < ROUNDS) for (let k = 0; k < G.n; k++) { const i = (G.start + k) % G.n; if (G.players[i].hand.length > handLimit(G.players[i])) G.trimQ.push(i); }
    nextTrim(G);
  }
  function nextTrim(G) {
    while (G.trimQ.length) {
      const i = G.trimQ[0], p = G.players[i];
      if (p.human) { G.phase = 'trim'; G.actor = i; return; }
      applyTrim(G, i, cheapest(p.hand, p.hand.length - handLimit(p), -1));
    }
    payWages(G);
    if (G.round >= ROUNDS) { G.over = true; G.phase = 'over'; return; }
    startRound(G);
  }
  function applyTrim(G, i, disc) {
    const p = G.players[i];
    disc.slice().sort((a, b) => b - a).forEach((x) => discardCard(G, p.hand.splice(x, 1)[0]));
    G.trimQ.shift();
  }
  const keepValue = (c) => (c === 'g' ? 0 : BLD[c].value + 1);
  // 手札から捨てる n 枚の添字（価値の低い順。skip は除く）
  function cheapest(hand, n, skip) {
    return hand.map((c, i) => i).filter((i) => i !== skip).sort((a, b) => keepValue(hand[a]) - keepValue(hand[b])).slice(0, n);
  }

  function nextTurn(G) {
    for (let k = 1; k <= G.n; k++) {
      const i = (G.turn + k) % G.n;
      if (G.players[i].free > 0) { G.turn = G.actor = i; G.phase = 'place'; return; }
    }
    endRound(G);
  }

  // w = { pub: uid } か { own: 建物の添字 }。使える場所の情報（なければ null）
  function spot(G, pi, w) {
    const P = G.players[pi];
    if (w.pub != null) { const s = G.pub.find((x) => x.uid === w.pub); return s && s.occ.length < s.cap ? { e: defOf(s.key).e, s } : null; }
    const b = P.bld[w.own];
    return b && !b.used ? { e: BLD[b.key].e, b } : null;
  }
  // 画面が使う: 手札から捨てる枚数と、建てる効果か
  function needs(G, w) {
    const sp = spot(G, G.actor, w);
    return sp && sp.e ? { disc: sp.e.disc || 0, build: sp.e.build != null ? sp.e.build : null } : null;
  }
  const buildCost = (c, off) => Math.max(0, BLD[c].cost - off);
  function canUse(G, w) {
    if (G.phase !== 'place') return false;
    const P = G.players[G.actor], sp = spot(G, G.actor, w);
    if (!sp || !sp.e || P.free < 1) return false;
    const e = sp.e;
    if (e.disc && P.hand.length < e.disc) return false;
    if (e.take && G.house < e.take) return false;
    if (e.fill && P.hand.length >= e.fill) return false;
    if (e.hire && total(P) >= maxWorkers(P)) return false;
    if (e.hireTo && total(P) >= Math.min(e.hireTo, maxWorkers(P))) return false;
    if (e.build != null && !P.hand.some((c) => isBld(c) && buildCost(c, e.build) <= P.hand.length - 1)) return false;
    return true;
  }

  // 行動: { kind:'place', pub|own, disc:[手札の添字], build:手札の添字 } / { kind:'pick', i } / { kind:'trim', disc:[...] }。不正なら false
  function apply(G, a) {
    if (G.over) return false;
    const pi = G.actor, P = G.players[pi];
    const ok = (d, n) => Array.isArray(d) && d.length === n && new Set(d).size === n && d.every((x) => Number.isInteger(x) && x >= 0 && x < P.hand.length);
    if (a.kind === 'trim') {
      if (G.phase !== 'trim' || !ok(a.disc, P.hand.length - handLimit(P))) return false;
      applyTrim(G, pi, a.disc); nextTrim(G); return true;
    }
    if (a.kind === 'pick') {
      if (G.phase !== 'pick' || !(a.i >= 0 && a.i < G.look.length)) return false;
      P.hand.push(G.look[a.i]); G.look.forEach((c, i) => { if (i !== a.i) G.discard.push(c); });
      log(G, `${P.name} は ${P.human ? cardName(G.look[a.i]) : '1 枚'} を取った`);
      G.look = null; nextTurn(G); return true;
    }
    if (a.kind !== 'place' || !canUse(G, a)) return false;
    const sp = spot(G, pi, a), e = sp.e;
    const disc = a.disc || [];
    let bi = null;
    if (e.build != null) {
      bi = a.build;
      if (!Number.isInteger(bi) || !P.hand[bi] || !isBld(P.hand[bi]) || disc.includes(bi)) return false;
      if (!ok(disc, buildCost(P.hand[bi], e.build))) return false;
    } else if (!ok(disc, e.disc || 0)) return false;
    // 実行
    const name = sp.s ? defOf(sp.s.key).name : BLD[sp.b.key].name;
    const built = bi == null ? null : P.hand[bi];
    disc.concat(bi == null ? [] : [bi]).sort((x, y) => y - x).forEach((x) => { const c = P.hand.splice(x, 1)[0]; if (x !== bi) discardCard(G, c); });
    P.free--;
    if (sp.s) sp.s.occ.push(pi); else sp.b.used = true;
    let msg = `${P.name}: ${name}`;
    if (built) { P.bld.push({ key: built, used: false }); msg += ` で ${BLD[built].name} を建てた`; }
    if (e.take) { P.cash += e.take; G.house -= e.take; msg += ` 家計から ${e.take}`; }
    const nb = e.drawB ? (e.empty && !P.hand.length ? e.empty : e.drawB) : 0;
    if (nb) { drawB(G, P, nb); msg += ` 建物 ${nb} 枚`; }
    if (e.then) { drawB(G, P, e.then); msg += ` 建物 ${e.then} 枚`; }
    const ng = (e.drawG || 0) + (e.fill ? e.fill - P.hand.length : 0);
    if (ng) { const before = G.goods; drawG(G, P, ng); msg += ` 消費財 ${before - G.goods} 枚`; }
    if (e.hire || e.hireTo) {
      const x = e.hireTo ? Math.min(e.hireTo, maxWorkers(P)) - total(P) : Math.min(e.hire, maxWorkers(P) - total(P));
      if (e.now) { P.workers += x; P.free += x; } else P.hired += x;
      msg += ` 労働者 +${x}`;
    }
    if (e.start) G.nextStart = pi;
    if (e.one && sp.b) { P.bld.splice(P.bld.indexOf(sp.b), 1); G.discard.push(sp.b.key); }
    log(G, msg);
    if (e.look) {
      G.look = [];
      for (let i = 0; i < e.look; i++) { const c = drawOne(G); if (c) G.look.push(c); }
      if (G.look.length) { G.phase = 'pick'; return true; }
      G.look = null;
    }
    nextTurn(G);
    return true;
  }

  // 効果そのものの値打ち（建てるときの目安にも使う）
  const effVal = (e, P) => (e.drawB ? (e.empty && !P.hand.length ? e.empty : e.drawB) * 2.2 : 0) + (e.then || 0) * 2.2 + (e.drawG || 0) * 1.2 + (e.fill ? Math.max(0, e.fill - P.hand.length) * 1.2 : 0) + (e.look ? 6 : 0) + (e.take || 0) * 0.8;

  // CPU の手。置ける所から得そうな所を選び、建てられれば建てる
  function plan(G, w) {
    const sp = spot(G, G.actor, w);
    const P = G.players[G.actor], e = sp.e, hand = P.hand;
    const due = WAGE[Math.min(G.round, ROUNDS) - 1] * total(P), mw = P.cash < due ? 3 : 1.5; // 賃金が払えそうにないときはお金を欲しがる
    let a = { kind: 'place', ...w, disc: [] }, s = 0;
    if (e.build != null) {
      let best = -Infinity;
      const left = (ROUNDS - G.round + 1) / ROUNDS;
      hand.forEach((c, i) => {
        if (!isBld(c) || buildCost(c, e.build) > hand.length - 1) return;
        const d = cheapest(hand, buildCost(c, e.build), i), lost = d.reduce((t, x) => t + keepValue(hand[x]), 0);
        const B = BLD[c];
        const bonus = B.end ? B.end({ ...P, bld: P.bld.concat({ key: c }), hand: hand.filter((x, j) => j !== i && !d.includes(j)) }) - B.end(P) : 0;
        const v = 6 + B.value * 1.3 + bonus - lost * 0.5 + (B.e ? effVal(B.e, P) * 0.4 * left : 0);
        if (v > best) { best = v; a = { kind: 'place', ...w, build: i, disc: d }; }
      });
      s += best + (e.then || 0) * 2.2;
    } else if (e.disc) {
      a.disc = cheapest(hand, e.disc, -1);
      s -= a.disc.reduce((t, x) => t + keepValue(hand[x]) * 0.5 + 0.5, 0);
    }
    if (e.take) s += e.take * mw;
    s += effVal({ ...e, take: 0 }, P);
    if (e.start) s += 1;
    if (e.hire || e.hireTo) {
      const add = e.hireTo ? Math.min(e.hireTo, maxWorkers(P)) - total(P) : 1;
      s += total(P) + add <= 3 && G.round <= 5 ? 3 * add : -8; // 労働者は 4 人まで。賃金が重くなる
    }
    return { a, s: s + G.rng() * (LEVELS[G.level] || LEVELS.normal) };
  }
  function cpuAct(G, level) {
    if (level) G.level = level;
    const P = G.players[G.actor];
    if (G.phase === 'trim') return { kind: 'trim', disc: cheapest(P.hand, P.hand.length - handLimit(P), -1) };
    if (G.phase === 'pick') {
      let bi = 0, bv = -1;
      G.look.forEach((c, i) => { const v = BLD[c].value - BLD[c].cost * 0.3; if (v > bv) { bv = v; bi = i; } });
      return { kind: 'pick', i: bi };
    }
    const ws = G.pub.map((s) => ({ pub: s.uid })).concat(P.bld.map((b, i) => ({ own: i })));
    let best = null;
    for (const w of ws) { if (!canUse(G, w)) continue; const r = plan(G, w); if (!best || r.s > best.s) best = r; }
    return best.a;
  }

  return { ROUNDS, WAGE, MAX_WORKERS, GOODS_COUNT, BLD_TOTAL, PUB, BLD, create, seeded, canUse, needs, apply, cpuAct, score, effText, text, cardName, defOf, isBld, buildCost, handLimit, maxWorkers, penalty, unpaid, endBonus, sellable, recommendSell };
})();
if (typeof module !== 'undefined') module.exports = NE;
