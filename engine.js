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
  const LEVELS = { weak: 7, normal: 0.8, strong: 0.8 }; // CPU の強さ → 手の選びのゆらぎ。つよいは段階 6 まで ふつう と同じ
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
  // 作品ごとの違い（p 無印 / m メセナ / g グローリー）。m・g の値は仕様 12-4（※は推定）
  const EDITION = {
    p: { goods: 24, vp: 0, pubStart: ['quarry', 'mine', 'school'] },
    m: { goods: 22, vp: 20, pubStart: ['quarry', 'mine', 'school'] },
    g: { goods: 30, vp: 30, pubStart: ['quarry', 'mine', 'school'] },
  };
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
  for (const d of Object.values(BLD)) { d.ed = 'p'; if (d.fac) d.nosell = true; }
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
  function create(n, rng = Math.random, level = 'normal', ed = 'p') {
    const deck = [];
    for (const [k, d] of Object.entries(BLD)) if (d.ed === ed) for (let i = 0; i < d.count; i++) deck.push(k);
    const E = EDITION[ed], G = { n, rng, level, ed, deck: shuffle(deck, rng), discard: [], goods: E.goods, vpLeft: E.vp, sold: 0, house: 0, round: 0, log: [], pub: [], uid: 0, nextStart: 0, phase: 'place', actor: 0, turn: 0, trimQ: [], look: null, over: false, start: Math.floor(rng() * n), chooseSell: null };
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
      EDITION[G.ed || 'p'].pubStart.forEach((k) => addPub(G, k));
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

  // CPU の評価は「点」で測る。現金 1 = 1 点、手札 1 枚 = 約 2〜3 点（市場で 1 枚 6 点になるが、場所は 1 つしかない）。
  const TUNE = { card: 3.5, act: 1.5, uses: 1.2, hireAct: 6, liq: 0.7, own: 2, margin: 1, bslot: 5 }; // card=手札 1 枚の点 act=ほかの手の基準 uses=建物の効果を使う回数の係数 hireAct=労働者 1 人の 1 ラウンドの稼ぎ liq=売れない建物の割引 own=自分の建物の下駄 margin=雇うときの現金の余裕 bslot=建てる職場の点
  const cardPts = (c) => (c === 'g' ? TUNE.card * 0.8 : TUNE.card + BLD[c].value * 0.06);
  // 残りラウンドが少ないほど、持っている札は使い道がなくなる
  const cardScale = (G) => Math.min(1, (ROUNDS - G.round + 0.5) / 3);
  // 効果 e を 1 回使ったときの値打ち（点）。手札の枚数は上限を超えた分を安く見る
  function effPts(G, P, e, extra) {
    const room = Math.max(0, handLimit(P) - P.hand.length + (extra || 0)), cs = cardScale(G);
    let n = 0, v = 0;
    const draw = (k, per) => { const x = Math.min(k, Math.max(0, room - n)); n += x; v += (x * per + (k - x) * 0.3) * cs; };
    if (e.drawB) draw(e.empty && !P.hand.length ? e.empty : e.drawB, TUNE.card + 0.4);
    if (e.then) draw(e.then, TUNE.card + 0.4);
    if (e.drawG) draw(e.drawG, TUNE.card * 0.8);
    if (e.fill) draw(Math.max(0, e.fill - P.hand.length), TUNE.card * 0.8);
    if (e.look) v += (TUNE.card + 3) * cs;
    if (e.build != null) v += TUNE.bslot * cs; // 大工の枠は少ないので、自分の建てる職場は貴重
    return v;
  }

  // CPU の手。置ける所を点で比べ、建てられれば建てる
  function plan(G, w) {
    const sp = spot(G, G.actor, w);
    const P = G.players[G.actor], e = sp.e, hand = P.hand;
    const cs = cardScale(G), left = ROUNDS - G.round;
    // 賃金の見込み: 払えず、売る建物でも足りないなら未払い（1 あたり 3 点）。売れば足りるなら少しだけ急ぐ
    const due = WAGE[G.round - 1] * total(P), deficit = due - P.cash;
    const sellVal = sellable(P).reduce((t, i) => t + BLD[P.bld[i].key].value, 0);
    const mw = deficit <= 0 ? 1 : deficit <= sellVal ? 1.2 : 2.2;
    let a = { kind: 'place', ...w, disc: [] }, s = 0;
    const liq = P.cash >= due * 1.5 ? 1 : TUNE.liq; // 売れない建物は賃金の足しにならない
    const lose = (d) => d.reduce((t, x) => t + cardPts(hand[x]) * cs, 0);
    if (e.build != null) {
      let best = -Infinity;
      hand.forEach((c, i) => {
        if (!isBld(c) || buildCost(c, e.build) > hand.length - 1) return;
        const d = cheapest(hand, buildCost(c, e.build), i), B = BLD[c];
        const rest = hand.filter((x, j) => j !== i && !d.includes(j));
        const bonus = B.end ? B.end({ ...P, bld: P.bld.concat({ key: c }), hand: rest }) - B.end(P) : 0;
        const uses = left * TUNE.uses + (G.round < ROUNDS ? 0.3 : 0); // ラウンド 9 は建てたそのラウンドでしか使えない
        const use = B.e ? Math.max(0, effPts(G, { ...P, hand: rest }, B.e) + (B.e.take || 0) * 0.5 - TUNE.act) * uses : 0;
        const v = TUNE.own + (B.nosell ? B.value * liq : B.value) + bonus + use - lose(d) - cardPts(c) * cs;
        if (v > best) { best = v; a = { kind: 'place', ...w, build: i, disc: d }; }
      });
      s += best + (e.then ? effPts(G, P, { drawB: e.then }, -1) : 0);
    } else if (e.disc) {
      a.disc = cheapest(hand, e.disc, -1);
      s -= lose(a.disc);
    }
    if (e.take) s += e.take * mw;
    s += effPts(G, P, { ...e, then: 0, take: 0 }, a.disc.length);
    if (e.start) s += 1;
    if (e.hire || e.hireTo) {
      const add = e.hireTo ? Math.min(e.hireTo, maxWorkers(P)) - total(P) : Math.min(e.hire, maxWorkers(P) - total(P));
      // 研修中の人は今ラウンドから賃金がかかり、働くのは次から
      const wages = WAGE.slice(G.round - 1).reduce((t, x) => t + x, 0);
      const need = total(P) + add > 4 ? 3 : 0; // 4 人を超えると仕事場が足りない
      s += add * (left * TUNE.hireAct - wages - need) - (P.cash < due + add * WAGE[G.round - 1] + TUNE.margin ? 30 : 0); // 賃金が払える見込みがなければ雇わない
    }
    return { a, s: s + G.rng() * (LEVELS[G.level] || LEVELS.normal) };
  }
  function cpuAct(G, level) {
    if (level) G.level = level;
    const P = G.players[G.actor];
    if (G.phase === 'trim') return { kind: 'trim', disc: cheapest(P.hand, P.hand.length - handLimit(P), -1) };
    if (G.phase === 'pick') {
      let bi = 0, bv = -Infinity;
      G.look.forEach((c, i) => { const v = BLD[c].value - BLD[c].cost * 3; if (v > bv) { bv = v; bi = i; } });
      return { kind: 'pick', i: bi };
    }
    const ws = G.pub.map((s) => ({ pub: s.uid })).concat(P.bld.map((b, i) => ({ own: i })));
    let best = null;
    for (const w of ws) { if (!canUse(G, w)) continue; const r = plan(G, w); if (!best || r.s > best.s) best = r; }
    return best.a;
  }

  return { ROUNDS, WAGE, MAX_WORKERS, GOODS_COUNT, BLD_TOTAL, PUB, BLD, EDITION, create, seeded, canUse, needs, apply, cpuAct, score, effText, text, cardName, defOf, isBld, buildCost, handLimit, maxWorkers, penalty, unpaid, endBonus, sellable, recommendSell };
})();
if (typeof module !== 'undefined') module.exports = NE;
