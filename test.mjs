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
  assert.equal(G.dollLeft + G.players.reduce((t, p) => t + p.dolls, 0), NE.EDITION[G.ed].dolls || 0, '機械人形の数');
  G.players.forEach((p) => assert.ok(p.dolls <= 5 && p.dollFree <= p.dolls, '人形の上限'));
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

// 場面: グローリーの仕組み（人形・2 人同時・遺跡・2 択）。カードは G2 で入るので、試験用の建物を足して使う
{
  Object.assign(NE.BLD, {
    t_doll: { ed: 'x', name: '人形', cost: 0, value: 2, count: 0, fac: true, nosell: true, e: null, onBuild: { doll: 1 } },
    t_two: { ed: 'x', name: '二人', cost: 3, value: 14, count: 0, cat: 'agri', e: { drawG: 5, two: true } },
    t_vil: { ed: 'x', name: '農村', cost: 1, value: 6, count: 0, cat: 'agri', e: { choice: [{ drawG: 2 }, { disc: 2, drawB: 3 }] } },
    t_hq: { ed: 'x', name: '建てる', cost: 1, value: 6, count: 0, e: { build: 0 } },
  });
  const mk = (hand, keys, ed = 'g') => { const G = NE.create(2, NE.seeded(1), 'normal', ed); const P = G.players[G.actor]; P.hand = hand; P.bld = keys.map((key) => ({ key, used: false })); return { G, P }; };
  // 機械人形: 建てるとすぐ働く。賃金・労働者の数に数えない
  let { G, P } = mk(['t_doll', 'farm'], ['t_hq']);
  assert.ok(NE.apply(G, { kind: 'place', own: 0, build: 0, disc: [] }), '人形を建てる');
  assert.equal(P.dolls, 1); assert.equal(P.dollFree, 1); assert.equal(G.dollLeft, 4);
  G.turn = G.actor = G.players.indexOf(P); // 人形はすぐ働ける: 番が回っても残りがあれば置ける
  assert.ok(NE.apply(G, { kind: 'place', pub: G.pub[0].uid }), '置く（人形から先に使う）'); assert.equal(P.dollFree, 0); assert.equal(P.free, 1); // 建てるのに 1 人使った
  G.turn = G.actor = G.players.indexOf(P);
  assert.ok(NE.apply(G, { kind: 'place', pub: G.pub[1].uid }), '労働者を置く'); assert.equal(P.free, 0);
  // 賃金は労働者 2 人分だけ（人形は数えない）
  ({ G, P } = mk([], [])); G.players.forEach((p) => { p.human = false; p.free = 0; }); P.dolls = 3; P.dollFree = 0; P.cash = 4; P.free = 1;
  const q = G.pub.find((x) => x.key === 'quarry'); NE.apply(G, { kind: 'place', pub: q.uid });
  assert.equal(G.round, 2, 'ラウンドが進んだ'); assert.equal(P.debt, 0); assert.equal(P.cash, 0, '賃金 2×2 人だけ'); assert.equal(P.dollFree, 3, '次のラウンドは人形も働く');
  assert.equal(NE.maxWorkers(P), 5, '人形は労働者の上限に数えない');
  // 2 人同時の職場
  ({ G, P } = mk([], ['t_two'])); P.free = 2; P.dollFree = 0;
  assert.ok(NE.canUse(G, { own: 0 })); assert.ok(NE.apply(G, { kind: 'place', own: 0 }), '2 人使う'); assert.equal(P.hand.length, 5);
  assert.equal(P.free, 0);
  ({ G, P } = mk([], ['t_two'])); P.free = 1; P.dollFree = 0;
  assert.ok(!NE.canUse(G, { own: 0 }), '1 人では置けない');
  P.dollFree = 1; assert.ok(NE.apply(G, { kind: 'place', own: 0 }), '労働者 + 人形で 2 人'); assert.equal(P.free + P.dollFree, 0);
  // 遺跡: 消費財 1 枚 + 勝利点 1。グローリーだけ最初からある
  ({ G, P } = mk([], []));
  const ru = G.pub.find((s) => s.key === 'ruins'); assert.ok(ru, 'グローリーには遺跡がある');
  assert.ok(!NE.create(2, NE.seeded(1), 'normal', 'm').pub.some((s) => s.key === 'ruins'), 'メセナにはない');
  P.free = 1; assert.ok(NE.apply(G, { kind: 'place', pub: ru.uid })); assert.equal(P.hand.length, 1); assert.equal(P.vp, 1); assert.equal(G.vpLeft, 29);
  // 2 択
  ({ G, P } = mk(['farm', 'farm', 'coffee'], ['t_vil'])); P.free = 2;
  assert.ok(!NE.apply(G, { kind: 'place', own: 0 }), '選ばずには使えない');
  assert.ok(NE.needs(G, { own: 0 }).choice.length === 2);
  assert.ok(NE.apply(G, { kind: 'place', own: 0, opt: 0 }), '消費財 2 枚'); assert.equal(P.hand.length, 5);
  ({ G, P } = mk(['farm', 'farm', 'coffee'], ['t_vil'], 'm')); P.free = 2; // グローリーの山はまだ空なのでメセナで
  assert.ok(!NE.apply(G, { kind: 'place', own: 0, opt: 1, disc: [0] }), '2 枚捨てないと不可');
  assert.ok(NE.apply(G, { kind: 'place', own: 0, opt: 1, disc: [0, 1] }), '2 枚捨てて建物 3 枚'); assert.equal(P.hand.length, 4);
  ({ G, P } = mk(['farm'], ['t_vil'])); P.free = 2;
  assert.ok(!NE.canUse(G, { own: 0, opt: 1 }) && NE.canUse(G, { own: 0, opt: 0 }), '手札が足りない側は選べない');
  for (const k of ['t_doll', 't_two', 't_vil', 't_hq']) delete NE.BLD[k];
}

// 場面: グローリーのカード
{
  assert.equal(NE.edTotal('g'), 71, 'グローリーは 71 枚');
  const mk = (hand, keys, ed = 'g') => { const G = NE.create(2, NE.seeded(1), 'normal', ed); const P = G.players[G.actor]; P.hand = hand; P.bld = keys.map((key) => ({ key, used: false })); P.free = 2; P.dollFree = 0; return { G, P }; };
  // 機械人形: 5 体まで。尽きたらもらえない
  let { G, P } = mk(['g_doll', 'farm', 'farm', 'farm', 'farm'], ['g_colony']);
  assert.ok(NE.apply(G, { kind: 'place', own: 0, build: 0, disc: [1, 2, 3, 4] }), '人形を建てる'); assert.equal(P.dolls, 1);
  ({ G, P } = mk(['g_doll', 'farm', 'farm', 'farm', 'farm'], ['g_colony'])); G.dollLeft = 0;
  NE.apply(G, { kind: 'place', own: 0, build: 0, disc: [1, 2, 3, 4] }); assert.equal(P.dolls, 0, '尽きたらもらえない');
  // 遺物: 勝利点 2。尽きたら 0
  ({ G, P } = mk(['g_relic'], ['g_colony', 'g_atelier']));
  const g0 = G.goods; assert.ok(NE.apply(G, { kind: 'place', own: 0, build: 0 }), '遺物（費用 0）'); assert.equal(P.vp, 2); assert.equal(P.hand.length, 1, '植民団のあと消費財 1 枚'); assert.equal(G.goods, g0 - 1);
  // 農村・養鶏場・工房・美術館・ゲームカフェ
  ({ G, P } = mk(['farm', 'farm'], ['g_chicken', 'g_atelier', 'g_art', 'g_cafe']));
  assert.ok(NE.apply(G, { kind: 'place', own: 0 })); assert.equal(P.hand.length, 4, '偶数枚なら 2 枚');
  P.free = 2; P.hand = ['farm', 'farm', 'farm']; P.bld.forEach((b) => { b.used = false; }); G.turn = G.actor = G.players.indexOf(P);
  NE.apply(G, { kind: 'place', own: 0 }); assert.equal(P.hand.length, 6, '奇数枚なら 3 枚');
  ({ G, P } = mk(['farm'], ['g_atelier'])); 
  NE.apply(G, { kind: 'place', own: 0 }); assert.equal(P.hand.length, 2); assert.equal(P.vp, 1);
  ({ G, P } = mk(['farm', 'farm', 'farm', 'farm', 'farm'], ['g_art'])); G.house = 30; const c0 = P.cash;
  NE.apply(G, { kind: 'place', own: 0 }); assert.equal(P.cash, c0 + 14, '手札 5 枚で $14');
  ({ G, P } = mk(['farm', 'farm'], ['g_art'])); G.house = 30; const c3 = P.cash; NE.apply(G, { kind: 'place', own: 0 }); assert.equal(P.cash, c3 + 7, '手札が 5 枚でなければ $7');
  ({ G, P } = mk(['farm', 'farm', 'farm', 'farm', 'farm'], ['g_art'])); G.house = 10; assert.ok(!NE.canUse(G, { own: 0 }), '家計が足りないと使えない');
  ({ G, P } = mk([], ['g_cafe'])); G.house = 30; P.free = 1; const c1 = P.cash; NE.apply(G, { kind: 'place', own: 0 }); assert.equal(P.cash, c1 + 10, '最後なら $10');
  ({ G, P } = mk([], ['g_cafe'])); G.house = 30; const c2 = P.cash; NE.apply(G, { kind: 'place', own: 0 }); assert.equal(P.cash, c2 + 5, '労働者が残っていれば $5');
  // 摩天建設: 手札が 0 になったら建物 2 枚
  ({ G, P } = mk(['farm', 'farm', 'farm'], ['g_sky'])); // farm は費用 1
  assert.ok(NE.apply(G, { kind: 'place', own: 0, build: 0, disc: [1] }), '建てる'); assert.equal(P.hand.length, 1, '手札が残れば引かない');
  ({ G, P } = mk(['farm', 'farm'], ['g_sky'])); NE.apply(G, { kind: 'place', own: 0, build: 0, disc: [1] }); assert.equal(P.hand.length, 2, '0 枚になって 2 枚');
  // 転送装置・綿花農場: 2 人同時。費用 0
  ({ G, P } = mk(['steel', 'farm'], ['g_teleport'])); assert.ok(NE.apply(G, { kind: 'place', own: 0, build: 0 }), '費用 0'); assert.equal(P.free, 0);
  // モダニズム建設: 消費財 1 枚を 2 枚分
  ({ G, P } = mk(['steel', 'g', 'g', 'farm'], ['g_modern'])); // 費用 4
  assert.ok(!NE.apply(G, { kind: 'place', own: 0, build: 0, disc: [1] }), '2 枚分では足りない');
  assert.ok(!NE.apply(G, { kind: 'place', own: 0, build: 0, disc: [1, 2, 3] }), '無駄に捨てない');
  assert.ok(NE.apply(G, { kind: 'place', own: 0, build: 0, disc: [1, 2] }), '消費財 2 枚で費用 4'); assert.equal(P.hand.length, 1);
  // 割引
  ({ G, P } = mk([], [])); P.vp = 5;
  assert.deepEqual(['g_steam', 'g_refinery', 'g_green', 'g_loco'].map((k) => NE.buildCost(k, 0, P)), [1, 3, 4, 4]);
  P.vp = 1; assert.deepEqual(['g_steam', 'g_refinery', 'g_green', 'g_loco'].map((k) => NE.buildCost(k, 0, P)), [2, 5, 6, 7]);
  // 終了時の点（資産価値 +X）
  const E = (keys, f) => { ({ G, P } = mk([], keys)); f && f(P); return NE.endBonus(P); };
  assert.equal(E(['g_guild', 'farm', 'factory']), 20); assert.equal(E(['g_guild', 'farm']), 0);
  assert.equal(E(['g_temple']), 30); assert.equal(E(['g_temple', 'g_monument']), 0);
  assert.equal(E(['g_ivory'], (p) => { p.vp = 7; }), 22);
  assert.equal(E(['g_square'], (p) => { p.workers = 5; }), 18); assert.equal(E(['g_square'], (p) => { p.workers = 4; p.hired = 1; p.dolls = 3; }), 18);
  assert.equal(E(['g_harvest'], (p) => { p.hand = ['g', 'g', 'g', 'g']; }), 26);
  assert.equal(E(['g_coop', 'bigfarm', 'farm']), 0, '農業 18'); assert.equal(E(['g_coop', 'bigfarm', 'farm', 'farm']), 18, '農業 24');
  assert.equal(E(['g_expo', 'steel', 'factory']), 24, '工業 32'); assert.equal(E(['g_expo', 'steel']), 0);
}

const rows = [];
for (const [ed, n] of [['p', 2], ['p', 3], ['p', 4], ['m', 2], ['m', 3], ['m', 4], ['g', 2], ['g', 3], ['g', 4]]) {
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
