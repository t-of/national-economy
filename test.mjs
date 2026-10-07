// node test.mjs — CPU だけで 2・3・4 人 各 300 局。毎手、お金とカードの数を確かめる。
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const NE = createRequire(import.meta.url)('./engine.js');
const GAMES = +process.argv[2] || 300;

function check(G) {
  const cash = G.players.reduce((s, p) => s + p.cash, 0) + G.house;
  assert.equal(cash, G.cash0 + G.sold, 'お金の合計');
  const goods = G.goods + G.players.reduce((s, p) => s + p.hand.filter((c) => c === 'g').length, 0);
  assert.equal(goods, NE.GOODS_COUNT, '消費財の枚数');
  const bld = G.deck.length + G.discard.length + (G.look ? G.look.length : 0) + G.pub.filter((s) => NE.BLD[s.key]).length
    + G.players.reduce((s, p) => s + p.bld.length + p.hand.filter((c) => c !== 'g').length, 0);
  assert.equal(bld, NE.BLD_TOTAL, '建物の枚数');
  G.players.forEach((p) => { assert.ok(p.cash >= 0 && p.workers + p.hired <= NE.maxWorkers(p), '現金・労働者'); });
}

// 場面: 2 つ建て・費用 0・勝利点
{
  const mk = (hand, key) => { const G = NE.create(2, NE.seeded(1)); const P = G.players[G.actor]; P.hand = hand; P.bld = [{ key, used: false }]; P.free = 1; return { G, P }; };
  let { G, P } = mk(['farm', 'farm', 'coffee'], 'twin');
  assert.ok(NE.apply(G, { kind: 'place', own: 0, build: 0, build2: 1, disc: [2] }), '2 つ建て');
  assert.deepEqual(P.bld.map((b) => b.key), ['twin', 'farm', 'farm']); assert.equal(P.hand.length, 0);
  ({ G, P } = mk(['farm', 'coffee', 'steel'], 'twin'));
  assert.ok(!NE.apply(G, { kind: 'place', own: 0, build: 0, build2: 2, disc: [1] }), '費用がちがう 2 枚は建てられない');
  ({ G, P } = mk(['bigfarm', 'coffee'], 'settler'));
  assert.ok(!NE.apply(G, { kind: 'place', own: 0, build: 1, disc: [] }), '開拓民は農業だけ');
  assert.ok(NE.apply(G, { kind: 'place', own: 0, build: 0, disc: [] }), '費用 0');
  assert.deepEqual(P.bld.map((b) => b.key), ['settler', 'bigfarm']);
  assert.equal(NE.buildCost('steel', 0), 4);
  NE.BLD.steel.costDown = (p) => p.bld.length; assert.equal(NE.buildCost('steel', 0, { bld: [1, 2] }), 2); delete NE.BLD.steel.costDown;
  ({ G, P } = mk([], 'farm'));
  G.vpLeft = 5; NE.giveVp(G, P, 4);
  assert.equal(NE.vpPts(P), 11, '4 枚 = 11 点'); assert.equal(G.vpLeft, 1);
  NE.giveVp(G, P, 3); assert.equal(P.vp, 5);
  G.vpLeft = 0; assert.equal(NE.giveVp(G, P, 2), 0, '尽きたら 0'); assert.equal(P.vp, 5);
}

const rows = [];
for (const n of [2, 3, 4]) {
  let sum = 0, win = 0, bld = 0, debt = 0, debtGames = 0, steps = 0, sold = 0;
  for (let seed = 1; seed <= GAMES; seed++) {
    const G = NE.create(n, NE.seeded(seed * 7919 + n));
    G.players.forEach((p) => { p.human = false; });
    let guard = 0, any = 0;
    while (!G.over) {
      assert.ok(++guard < 5000, `止まらない n=${n} seed=${seed}`);
      assert.ok(NE.apply(G, NE.cpuAct(G)), `不正な手 n=${n} seed=${seed}`);
      check(G);
    }
    steps += guard;
    G.players.forEach((p) => { const s = NE.score(p); sum += s; bld += p.bld.length; debt += p.debt; any += p.debt; });
    win += Math.max(...G.players.map(NE.score));
    sold += G.pub.filter((s) => NE.BLD[s.key]).length;
    if (any) debtGames++;
  }
  const m = GAMES * n;
  rows.push({ 人数: n, 局: GAMES, 平均点: +(sum / m).toFixed(1), 優勝点: +(win / GAMES).toFixed(1), 建物: +(bld / m).toFixed(1), 売った建物: +(sold / GAMES).toFixed(1), 未払い: +(debt / m).toFixed(2), 未払いのあった局: `${Math.round((100 * debtGames) / GAMES)}%`, 手数: Math.round(steps / GAMES) });
}
console.table(rows);
console.log('ok');
