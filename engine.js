'use strict';
// ナショナルエコノミー風のルール（画面を持たない）。ブラウザでは NE、Node では module.exports で使う。
// 原作（基本版）に細部まで合わせてはいない。原作と違う・不確かな点は ponytail: / 不確か: のコメントで残している。
const NE = (() => {
  // 消費財。不確か: 原作の種類・価格とは異なる素直な 3 種（食料・資材・製品）。手札は枚数だけで持つ（山札なし）。
  const GOODS = { F: { name: '食料', price: 2 }, M: { name: '資材', price: 2 }, P: { name: '製品', price: 5 } };
  const KINDS = ['F', 'M', 'P'];
  // 建物。cost = 建設費、value = 終了時の資産価値、in = 使うときに捨てるカード、out = 得るカード、money = 得るお金、count = 枚数。
  // 不確か: 原作の建物カード（種類・効果・枚数）は覚えている範囲での置き換え。1 つの建物に労働者は 1 人。
  const BUILDINGS = {
    farm: { name: '農場', cost: 4, value: 3, in: {}, out: { F: 3 }, money: 0, count: 5 },
    forest: { name: '林場', cost: 4, value: 3, in: {}, out: { M: 3 }, money: 0, count: 5 },
    shop: { name: '商店', cost: 5, value: 4, in: {}, out: {}, money: 3, count: 4 },
    factory: { name: '工場', cost: 7, value: 6, in: { F: 1, M: 1 }, out: { P: 2 }, money: 0, count: 4 },
    bigfarm: { name: '大農場', cost: 9, value: 8, in: {}, out: { F: 4 }, money: 0, count: 2 },
  };
  // 公共の職場。cap = 同じラウンドに置ける労働者の数。
  const PUBLIC = [
    { id: 'day', name: '日雇い', cap: 2, desc: 'お金 +2' },
    { id: 'hire', name: '職業安定所', cap: 1, desc: '労働者 +1（次の回から）' },
    { id: 'market', name: '市場', cap: 2, desc: 'カードを 4 枚まで売る' },
    { id: 'build', name: '建設現場', cap: 1, desc: '建物を 1 つ建てる' },
    { id: 'bank', name: '銀行', cap: 1, desc: '5 借りる（負債 1）' },
  ];
  const ROUNDS = 9;
  const WAGE = [1, 1, 1, 1, 2, 2, 2, 3, 3]; // ラウンドごとの 1 人あたり賃金。不確か: 原作の賃金表ではない。
  const START_CASH = 10, START_WORKERS = 2, MAX_WORKERS = 5, LOAN = 5, LOAN_PENALTY = 7;
  const MAX_SELL = 4;

  const has = (hand, need) => KINDS.every((k) => (hand[k] || 0) >= (need[k] || 0));
  const sum = (o) => KINDS.reduce((t, k) => t + (o[k] || 0), 0);
  const worth = (o) => KINDS.reduce((t, k) => t + (o[k] || 0) * GOODS[k].price, 0);

  function create(n, humans = 1) {
    const s = {
      n, round: 1, starter: 0, turn: 0, over: false, log: [],
      supply: Object.fromEntries(Object.entries(BUILDINGS).map(([k, b]) => [k, b.count])),
      slots: {}, players: [],
    };
    for (let i = 0; i < n; i++) {
      s.players.push({
        name: i < humans ? 'あなた' : `CPU${i - humans + 1}`, human: i < humans,
        cash: START_CASH, loans: 0, workers: START_WORKERS, hired: 0, free: START_WORKERS, passed: false,
        hand: { F: 0, M: 0, P: 0 }, bld: [],
      });
    }
    PUBLIC.forEach((p) => { s.slots[p.id] = []; });
    return s;
  }

  const done = (p) => p.free <= 0 || p.passed;

  function legal(s) {
    const p = s.players[s.turn], out = [{ kind: 'pass' }];
    const room = (id) => s.slots[id].length < PUBLIC.find((x) => x.id === id).cap;
    if (room('day')) out.push({ kind: 'pub', id: 'day' });
    if (room('bank')) out.push({ kind: 'pub', id: 'bank' });
    if (room('hire') && p.workers + p.hired < MAX_WORKERS) out.push({ kind: 'pub', id: 'hire' });
    if (room('market')) {
      for (let f = 0; f <= p.hand.F; f++) for (let m = 0; m <= p.hand.M; m++) for (let q = 0; q <= p.hand.P; q++) {
        const t = f + m + q;
        if (t >= 1 && t <= MAX_SELL) out.push({ kind: 'pub', id: 'market', sell: { F: f, M: m, P: q } });
      }
    }
    if (room('build')) {
      for (const [id, b] of Object.entries(BUILDINGS)) if (s.supply[id] > 0 && b.cost <= p.cash) out.push({ kind: 'pub', id: 'build', b: id });
    }
    p.bld.forEach((b, idx) => { if (!b.used && has(p.hand, BUILDINGS[b.id].in)) out.push({ kind: 'own', idx }); });
    return out;
  }

  function same(a, b) {
    return a.kind === b.kind && a.id === b.id && a.idx === b.idx && a.b === b.b &&
      (!a.sell || KINDS.every((k) => a.sell[k] === b.sell[k]));
  }

  // 反映する。合法でなければ false（何も変えない）。
  function apply(s, a) {
    if (s.over || !legal(s).some((x) => same(x, a))) return false;
    const p = s.players[s.turn];
    if (a.kind === 'pass') {
      p.passed = true;
      s.log.push(`${p.name}: パス`);
    } else {
      p.free--;
      if (a.kind === 'pub') {
        s.slots[a.id].push(s.turn);
        if (a.id === 'day') { p.cash += 2; s.log.push(`${p.name}: 日雇いで 2`); }
        if (a.id === 'bank') { p.cash += LOAN; p.loans++; s.log.push(`${p.name}: 銀行で ${LOAN} 借りた`); }
        if (a.id === 'hire') { p.hired++; s.log.push(`${p.name}: 労働者を雇った`); }
        if (a.id === 'market') {
          p.cash += worth(a.sell);
          KINDS.forEach((k) => { p.hand[k] -= a.sell[k]; });
          s.log.push(`${p.name}: ${worth(a.sell)} で売った`);
        }
        if (a.id === 'build') {
          p.cash -= BUILDINGS[a.b].cost; s.supply[a.b]--; p.bld.push({ id: a.b, used: false });
          s.log.push(`${p.name}: ${BUILDINGS[a.b].name}を建てた`);
        }
      } else {
        const b = p.bld[a.idx], d = BUILDINGS[b.id];
        b.used = true;
        KINDS.forEach((k) => { p.hand[k] += (d.out[k] || 0) - (d.in[k] || 0); });
        p.cash += d.money;
        s.log.push(`${p.name}: ${d.name}を動かした`);
      }
    }
    advance(s);
    return true;
  }

  function advance(s) {
    if (s.players.every(done)) { endRound(s); return; }
    do { s.turn = (s.turn + 1) % s.n; } while (done(s.players[s.turn]));
  }

  function endRound(s) {
    const w = WAGE[s.round - 1];
    for (const p of s.players) {
      const pay = p.workers * w;
      if (p.cash < pay) { // 払えない分は負債（5 ずつ借りる）
        const k = Math.ceil((pay - p.cash) / LOAN);
        p.loans += k; p.cash += k * LOAN;
        s.log.push(`${p.name}: 賃金が足りず負債 +${k}`);
      }
      p.cash -= pay;
      p.workers += p.hired; p.hired = 0;
    }
    s.log.push(`ラウンド ${s.round} 終了（賃金 ${w}/人）`);
    if (s.round >= ROUNDS) { s.over = true; return; }
    s.round++;
    s.starter = (s.starter + 1) % s.n;
    s.turn = s.starter;
    PUBLIC.forEach((x) => { s.slots[x.id] = []; });
    for (const p of s.players) { p.free = p.workers; p.passed = false; p.bld.forEach((b) => { b.used = false; }); }
  }

  const score = (p) => p.bld.reduce((t, b) => t + BUILDINGS[b.id].value, 0) + p.cash - p.loans * LOAN_PENALTY;

  // CPU: 合法な手に点を付けて一番高いものを選ぶだけ（ponytail: 先読みなし）。
  function rate(s, a) {
    const p = s.players[s.turn], rem = ROUNDS - s.round + 1, wage = WAGE[s.round - 1] * p.workers;
    if (a.kind === 'pass') return 0;
    if (a.kind === 'own') { const d = BUILDINGS[p.bld[a.idx].id]; return worth(d.out) + d.money - worth(d.in) + 0.5; }
    if (a.id === 'day') return 2;
    if (a.id === 'bank') return p.cash < wage ? 3 : -2;
    if (a.id === 'hire') return rem >= 3 && p.bld.length > p.workers + p.hired && p.cash >= wage + 4 ? 4 : -1;
    if (a.id === 'market') return worth(a.sell) - 0.1 * sum(a.sell);
    const b = BUILDINGS[a.b], net = worth(b.out) + b.money - worth(b.in);
    return net * Math.min(rem - 1, 4) * 0.6 + b.value - b.cost * 0.5 - (b.cost > p.cash - wage ? 2 : 0);
  }
  function cpuPick(s) {
    let best = null, bs = -Infinity;
    for (const a of legal(s)) { const v = rate(s, a) + Math.random() * 0.6; if (v > bs) { bs = v; best = a; } }
    return best;
  }

  return { GOODS, KINDS, BUILDINGS, PUBLIC, ROUNDS, WAGE, LOAN_PENALTY, MAX_SELL, create, legal, apply, score, cpuPick, worth };
})();
if (typeof module !== 'undefined') module.exports = NE;
