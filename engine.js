'use strict';
// ナショナルエコノミー風のルール（画面を持たない）。ブラウザでは NE、Node では module.exports で使う。
// 核: 建物カードを手札から建て、費用の枚数だけ手札の別のカードを捨てる（サンファン式）。
//
// 原作と違うかもしれない値（記憶があいまい。※）:
//   開始の手札 3 枚※、所持金 5・6・7・8（スタートプレイヤーから）※、手札の上限 5 枚※、賃金 2・2・3・3・4・4・5・5・6※
//   消費財 36 枚※、建物の枚数・費用・資産価値・効果のすべて※（下の BLD）
//   公共の職場が増える順序※、人数による職場の数（4 人のとき 2 人まで）※
//   銀行からお金をもらう建物（鉄工所・果樹園・鉄道・自動車工場）の額と、その分類※
//   市場 12・露店 6 の受け取り額※、農場（費用 1・価値 6）※、農場も売れる扱い※
//   賃金が払えないとき: 安く足りる建物から売る（自動）。負債は不足 1 金につき 1。1 点あたり −3（法律事務所 1 つにつき −1、最低 1）※
const NE = (() => {
  const ROUNDS = 9, MAX_WORKERS = 5, HAND_LIMIT = 5, START_HAND = 3, GOODS_COUNT = 36;
  const WAGE = [2, 2, 3, 3, 4, 4, 5, 5, 6];
  const START_CASH = [5, 6, 7, 8];
  // e: 効果。disc=捨てる枚数、draw=引く枚数、take=家計から受け取る上限、gain=銀行（無限）からもらう額、look=上から見る枚数、hire=増やす労働者、start=次のスタート、build=建てる（値は費用の割引）
  const PUB = {
    quarry: { name: '採石場', cap: 1, e: { draw: 1, start: true } },
    mine: { name: '鉱山', cap: 99, e: { draw: 1 } },
    school: { name: '学校', e: { hire: 1 } },
    carpenter: { name: '大工', e: { build: 0 } },
    stall: { name: '露店', e: { disc: 1, take: 6 } },
    market: { name: '市場', e: { disc: 2, take: 12 } },
    highschool: { name: '高等学校', e: { hire: 5 } },
  };
  const FIRST = ['quarry', 'mine', 'school', 'carpenter', 'stall'];
  const ADDED = ['carpenter', 'stall', 'market', 'highschool', 'stall', 'carpenter', 'market', 'stall', 'market']; // 各ラウンドのはじめに 1 枚
  // p: 常に効く効果（hand=手札上限+、wage=賃金合計−、law=負債の減点−）。nosell=売れない。
  const BLD = {
    farm: { name: '農場', cost: 1, value: 6, count: 3, e: { draw: 2 } },
    design: { name: '設計事務所', cost: 3, value: 5, count: 2, e: { look: 5 } },
    factory: { name: '工場', cost: 3, value: 6, count: 2, e: { disc: 2, draw: 4 } },
    burn: { name: '焼畑', cost: 1, value: 2, count: 3, e: { disc: 1, draw: 3 } },
    iron: { name: '鉄工所', cost: 2, value: 4, count: 2, e: { draw: 1, gain: 5 } },
    warehouse: { name: '倉庫', cost: 2, value: 4, count: 2, e: { draw: 1 }, p: { hand: 2 } },
    housing: { name: '社宅', cost: 2, value: 4, count: 2, e: null, p: { wage: 2 } },
    law: { name: '法律事務所', cost: 3, value: 5, count: 2, e: { draw: 1 }, p: { law: 1 } },
    bigfarm: { name: '大農園', cost: 4, value: 9, count: 2, e: { draw: 3 } },
    dept: { name: '百貨店', cost: 5, value: 9, count: 2, e: { disc: 3, take: 18 } },
    orchard: { name: '果樹園', cost: 2, value: 5, count: 2, e: { gain: 8 } },
    rail: { name: '鉄道', cost: 5, value: 10, count: 2, e: { draw: 3, gain: 7 } },
    car: { name: '自動車工場', cost: 6, value: 12, count: 2, e: { disc: 2, draw: 3, gain: 12 } },
    general: { name: 'ゼネコン', cost: 4, value: 7, count: 2, e: { build: 1 } },
    hq: { name: '本社ビル', cost: 6, value: 10, count: 1, e: null, nosell: true, bonus: (p) => p.bld.length },
    mansion: { name: '邸宅', cost: 7, value: 15, count: 1, e: null, nosell: true },
  };
  const defOf = (key) => PUB[key] || BLD[key];
  const isBld = (c) => c !== 'g';
  const cardName = (c) => (c === 'g' ? '消費財' : BLD[c].name);

  function effText(e) {
    if (!e) return '効果なし';
    const t = [];
    if (e.disc) t.push(`${e.disc} 枚捨てて`);
    if (e.build != null) t.push(e.build ? `建てる（費用 −${e.build}）` : '建てる');
    if (e.look) t.push(`山札の上 ${e.look} 枚から 1 枚取る`);
    if (e.draw) t.push(`${e.draw} 枚引く`);
    if (e.take) t.push(`家計から ${e.take}`);
    if (e.gain) t.push(`お金 +${e.gain}`);
    if (e.hire) t.push(e.hire > 1 ? '労働者を 5 人まで増やす' : '労働者 +1');
    if (e.start) t.push('次のスタート');
    return t.join(' ');
  }
  const passive = (p, k) => p.bld.reduce((s, b) => s + ((BLD[b.key].p || {})[k] || 0), 0);
  const handLimit = (p) => HAND_LIMIT + passive(p, 'hand');
  const penalty = (p) => Math.max(1, 3 - passive(p, 'law'));
  function score(p) {
    return p.bld.reduce((s, b) => s + BLD[b.key].value + (BLD[b.key].bonus ? BLD[b.key].bonus(p) : 0), 0) + p.cash - p.debt * penalty(p);
  }

  function shuffle(a, rng) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function draw(G) {
    if (!G.deck.length) { G.deck = shuffle(G.discard, G.rng); G.discard = []; }
    return G.deck.length ? G.deck.pop() : null;
  }
  const drawTo = (G, P, n) => { for (let i = 0; i < n; i++) { const c = draw(G); if (c) P.hand.push(c); } };
  const log = (G, s) => { G.log.push(s); if (G.log.length > 40) G.log.shift(); };

  function create(n, rng = Math.random) {
    const deck = [];
    for (let i = 0; i < GOODS_COUNT; i++) deck.push('g');
    for (const [k, d] of Object.entries(BLD)) for (let i = 0; i < d.count; i++) deck.push(k);
    const G = { n, rng, deck: shuffle(deck, rng), discard: [], house: 0, round: 0, log: [], pub: [], uid: 0, nextStart: 0, phase: 'place', actor: 0, turn: 0, trimQ: [], look: null, over: false, start: Math.floor(rng() * n) };
    G.nextStart = G.start;
    G.players = [];
    for (let i = 0; i < n; i++) {
      G.players.push({ name: i === 0 ? 'あなた' : `CPU${i}`, human: i === 0, cash: START_CASH[(i - G.start + n) % n], debt: 0, workers: 2, hired: 0, free: 0, hand: [], bld: [] });
      drawTo(G, G.players[i], START_HAND);
    }
    startRound(G);
    return G;
  }

  function addPub(G, key) {
    const cap = key === 'quarry' || key === 'mine' ? PUB[key].cap : (G.n === 4 ? 2 : 1);
    G.pub.push({ uid: ++G.uid, key, cap, occ: [] });
  }
  function startRound(G) {
    G.round++;
    if (G.round === 1) FIRST.forEach((k) => addPub(G, k));
    addPub(G, ADDED[G.round - 1]);
    G.pub.forEach((w) => { w.occ = []; });
    G.players.forEach((p) => { p.workers += p.hired; p.hired = 0; p.free = p.workers; p.bld.forEach((b) => { b.used = false; }); });
    G.start = G.nextStart; G.turn = G.actor = G.start; G.phase = 'place';
    log(G, `--- ラウンド ${G.round}（賃金 ${WAGE[G.round - 1]}/人、スタート: ${G.players[G.start].name}）`);
  }

  function payWages(G) {
    const w = WAGE[G.round - 1];
    for (let k = 0; k < G.n; k++) {
      const p = G.players[(G.start + k) % G.n];
      let due = Math.max(0, w * p.workers - passive(p, 'wage'));
      const pay = (amt) => { const x = Math.min(p.cash, amt); p.cash -= x; G.house += x; return amt - x; };
      due = pay(due);
      while (due > 0) {
        const idx = p.bld.map((b, i) => i).filter((i) => !BLD[p.bld[i].key].nosell);
        if (!idx.length) break;
        const enough = idx.filter((i) => BLD[p.bld[i].key].value >= due);
        const pick = enough.length ? enough.reduce((a, b) => (BLD[p.bld[a].key].value <= BLD[p.bld[b].key].value ? a : b)) : idx.reduce((a, b) => (BLD[p.bld[a].key].value >= BLD[p.bld[b].key].value ? a : b));
        const key = p.bld[pick].key;
        p.bld.splice(pick, 1);
        p.cash += BLD[key].value;
        G.pub.push({ uid: ++G.uid, key, cap: 1, occ: [] }); // 売った建物は公共の職場
        log(G, `${p.name} は賃金のため ${BLD[key].name} を売った（+${BLD[key].value}）`);
        due = pay(due);
      }
      if (due > 0) { p.debt += due; log(G, `${p.name} は負債 +${due}`); }
    }
  }

  function endRound(G) {
    payWages(G);
    if (G.round >= ROUNDS) { G.over = true; G.phase = 'over'; return; }
    G.trimQ = [];
    for (let k = 0; k < G.n; k++) { const i = (G.start + k) % G.n; if (G.players[i].hand.length > handLimit(G.players[i])) G.trimQ.push(i); }
    nextTrim(G);
  }
  function nextTrim(G) {
    while (G.trimQ.length) {
      const i = G.trimQ[0], p = G.players[i];
      const ex = p.hand.length - handLimit(p);
      if (p.human) { G.phase = 'trim'; G.actor = i; return; }
      applyTrim(G, i, cheapest(p.hand, ex, -1));
    }
    startRound(G);
  }
  function applyTrim(G, i, disc) {
    const p = G.players[i];
    disc.slice().sort((a, b) => b - a).forEach((x) => G.discard.push(p.hand.splice(x, 1)[0]));
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
    if (e.hire && P.workers + P.hired >= MAX_WORKERS) return false;
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
    const name = sp.s ? PUB[sp.s.key] ? PUB[sp.s.key].name : BLD[sp.s.key].name : BLD[sp.b.key].name;
    const built = bi == null ? null : P.hand[bi];
    const gone = disc.concat(bi == null ? [] : [bi]).sort((x, y) => y - x);
    gone.forEach((x) => { const c = P.hand.splice(x, 1)[0]; if (c !== built || x !== bi) G.discard.push(c); });
    P.free--;
    if (sp.s) sp.s.occ.push(pi); else sp.b.used = true;
    let msg = `${P.name}: ${name}`;
    if (built) { P.bld.push({ key: built, used: false }); msg += ` で ${BLD[built].name} を建てた`; }
    if (e.take) { const x = Math.min(e.take, G.house); P.cash += x; G.house -= x; msg += ` 家計から ${x}`; }
    if (e.gain) { P.cash += e.gain; msg += ` お金 +${e.gain}`; }
    if (e.draw) { drawTo(G, P, e.draw); msg += ` ${e.draw} 枚引く`; }
    if (e.hire) { const x = Math.min(e.hire, MAX_WORKERS - P.workers - P.hired); P.hired += x; msg += ` 労働者 +${x}`; }
    if (e.start) G.nextStart = pi;
    log(G, msg);
    if (e.look) {
      G.look = [];
      for (let i = 0; i < e.look; i++) { const c = draw(G); if (c) G.look.push(c); }
      if (G.look.length) { G.phase = 'pick'; return true; }
      G.look = null;
    }
    nextTurn(G);
    return true;
  }

  // CPU の手。置ける所から得そうな所を選び、建てられれば建てる
  function plan(G, w) {
    const sp = spot(G, G.actor, w);
    const P = G.players[G.actor], e = sp.e, hand = P.hand;
    let a = { kind: 'place', ...w, disc: [] }, s = 0;
    if (e.build != null) {
      let best = -Infinity;
      hand.forEach((c, i) => {
        if (!isBld(c) || buildCost(c, e.build) > hand.length - 1) return;
        const d = cheapest(hand, buildCost(c, e.build), i), lost = d.reduce((t, x) => t + keepValue(hand[x]), 0);
        const v = 6 + BLD[c].value * 1.3 - lost * 0.5 + (BLD[c].e ? 2 + (BLD[c].e.gain || 0) * 0.6 : 0);
        if (v > best) { best = v; a = { kind: 'place', ...w, build: i, disc: d }; }
      });
      s += best;
    } else if (e.disc) {
      a.disc = cheapest(hand, e.disc, -1);
      s -= a.disc.reduce((t, x) => t + keepValue(hand[x]) * 0.5 + 0.5, 0);
    }
    const due = WAGE[Math.min(G.round, ROUNDS) - 1] * P.workers, mw = P.cash < due ? 2.2 : 1; // 賃金が払えそうにないときはお金を欲しがる
    if (e.take) s += Math.min(e.take, G.house) * mw;
    if (e.gain) s += e.gain * mw * 1.2;
    if (e.draw) s += e.draw * 2;
    if (e.look) s += 6;
    if (e.start) s += 1;
    if (e.hire) {
      const add = Math.min(e.hire, MAX_WORKERS - P.workers - P.hired);
      s += P.workers + P.hired + add <= 3 && G.round <= 5 ? 4 * add : -6; // 労働者は 4 人まで。賃金が重くなる
    }
    return { a, s: s + G.rng() * 0.8 };
  }
  function cpuAct(G) {
    if (G.phase === 'pick') {
      let bi = 0, bv = -1;
      G.look.forEach((c, i) => { const v = c === 'g' ? 0.5 : BLD[c].value - BLD[c].cost * 0.3; if (v > bv) { bv = v; bi = i; } });
      return { kind: 'pick', i: bi };
    }
    const P = G.players[G.actor];
    const ws = G.pub.map((s) => ({ pub: s.uid })).concat(P.bld.map((b, i) => ({ own: i })));
    let best = null;
    for (const w of ws) { if (!canUse(G, w)) continue; const r = plan(G, w); if (!best || r.s > best.s) best = r; }
    return best.a;
  }

  return { ROUNDS, WAGE, MAX_WORKERS, PUB, BLD, create, canUse, needs, apply, cpuAct, score, effText, cardName, defOf, isBld, buildCost, handLimit, penalty };
})();
if (typeof module !== 'undefined') module.exports = NE;
