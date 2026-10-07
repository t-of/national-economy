// node test.mjs — CPU だけで 2・3・4 人 各 300 局。毎手、お金とカードの数を確かめる。
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const NE = createRequire(import.meta.url)('./engine.js');
const GAMES = +process.argv[2] || 300;

function check(G) {
  const cash = G.players.reduce((s, p) => s + p.cash, 0) + G.house;
  assert.equal(cash, G.cash0 + G.sold, 'お金の合計');
  const goods = G.goods + G.players.reduce((s, p) => s + p.hand.filter((c) => c === 'g').length + p.stash, 0);
  assert.equal(goods, NE.EDITION[G.ed].goods, '消費財の枚数');
  assert.equal(G.vpLeft + G.players.reduce((s, p) => s + p.vp, 0), NE.EDITION[G.ed].vp, '勝利点トークンの枚数');
  assert.ok(G.vpLeft >= 0, '勝利点が負');
  const bld = G.deck.length + G.discard.length + (G.look ? G.look.length : 0) + G.pub.filter((s) => NE.BLD[s.key]).length
    + G.players.reduce((s, p) => s + p.bld.length + p.hand.filter((c) => c !== 'g').length, 0);
  assert.equal(bld, NE.edTotal(G.ed), '建物の枚数');
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

// 場面: メセナ（醸造所・会計事務所・地球建設）
{
  const mk = (hand, keys) => { const G = NE.create(2, NE.seeded(1), 'normal', 'm'); const P = G.players[G.actor]; P.hand = hand; P.bld = keys.map((key) => ({ key, used: false })); P.free = 2; return { G, P }; };
  assert.equal(NE.edTotal('m'), 73, 'メセナは 73 枚'); assert.equal(NE.edTotal('p'), 64);
  // 醸造所: 消費財 4 枚を置き、次のラウンドのはじめに手札へ
  let { G, P } = mk([], ['m_brew']);
  const g0 = G.goods;
  assert.ok(NE.apply(G, { kind: 'place', own: 0 }), '醸造所');
  assert.equal(P.stash, 4);
  G.players.forEach((p) => { p.human = false; });
  for (let k = 0; G.round === 1 && k < 200; k++) NE.apply(G, NE.cpuAct(G));
  assert.equal(P.stash, 0, '次のラウンドで空になる'); assert.ok(P.hand.filter((c) => c === 'g').length >= 4, '取り置きが手札に入った');
  // 地球建設: 費用は合計。手札が尽きたら建物 3 枚
  ({ G, P } = mk(['m_garden', 'm_potato', 'farm', 'farm', 'farm'], ['m_earth']));
  assert.ok(!NE.apply(G, { kind: 'place', own: 0, build: 0, build2: 1, disc: [2, 3] }), '費用 2+1=3 は 2 枚では足りない');
  assert.ok(NE.apply(G, { kind: 'place', own: 0, build: 0, build2: 1, disc: [2, 3, 4] }), '2 つ建て（費用の合計）');
  assert.deepEqual(P.bld.map((b) => b.key), ['m_earth', 'm_garden', 'm_potato']); assert.equal(P.hand.length, 3, '手札が尽きて 3 枚');
  ({ G, P } = mk(['m_potato', 'm_lab', 'farm', 'farm', 'farm', 'farm', 'farm'], ['m_earth']));
  assert.ok(NE.apply(G, { kind: 'place', own: 0, build: 0, build2: 1, disc: [2, 3, 4, 5] }), '費用が違う 2 枚でもよい'); assert.equal(P.hand.length, 1);
  // 会計事務所: 勝利点の点が 2 倍
  ({ G, P } = mk([], ['m_acct']));
  P.vp = 4; G.vpLeft -= 4;
  assert.equal(NE.vpPts(P), 11); assert.equal(NE.score(P) - (P.cash - 0) - 12, 22, '勝利点 11 点が 2 倍');
  // 割引: 食品工場は農業があれば 1、大聖堂は勝利点 5 枚で 6
  ({ G, P } = mk([], ['m_potato']));
  assert.equal(NE.buildCost('m_foodf', 0, P), 1); P.bld = []; assert.equal(NE.buildCost('m_foodf', 0, P), 2);
  P.vp = 5; assert.equal(NE.buildCost('m_cathedral', 0, P), 6);
}

const rows = [];
for (const [ed, n] of [['p', 2], ['p', 3], ['p', 4], ['m', 2], ['m', 3], ['m', 4]]) {
  let sum = 0, win = 0, bld = 0, debt = 0, debtGames = 0, steps = 0, sold = 0;
  for (let seed = 1; seed <= GAMES; seed++) {
    const G = NE.create(n, NE.seeded(seed * 7919 + n), 'normal', ed);
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
  rows.push({ 作品: ed, 人数: n, 局: GAMES, 平均点: +(sum / m).toFixed(1), 優勝点: +(win / GAMES).toFixed(1), 建物: +(bld / m).toFixed(1), 売った建物: +(sold / GAMES).toFixed(1), 未払い: +(debt / m).toFixed(2), 未払いのあった局: `${Math.round((100 * debtGames) / GAMES)}%`, 手数: Math.round(steps / GAMES) });
}
console.table(rows);
console.log('ok');
