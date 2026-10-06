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
