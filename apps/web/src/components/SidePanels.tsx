import {
  BRANCH_INFO,
  MANSION_TERMS,
  NINE_STAR_TERMS,
  TEN_GODS,
  TEN_GOD_TERMS,
  formatGanZhi,
  type ChartResult,
  type Mansion,
} from '@bazi/engine';
import type { Display } from '../i18n';

/** Ray's "Personal Chart Details" — eight lookups, plus the chart's 空亡 pair. */
export function SupportingPanel({ chart, display }: { chart: ChartResult; display: Display }) {
  const s = chart.supporting;
  const zh = display.lang === 'zh';
  const rows: Array<[string, string, string]> = [
    ['Celestial Animal', '生肖', `${s.celestialAnimal} ${BRANCH_INFO[s.celestialAnimal].animal}`],
    ['Noble People', '贵人', s.noblePeople.join(' ')],
    ['Intelligence', '文昌', s.intelligence],
    ['Peach Blossom', '桃花', s.peachBlossom],
    ['Sky Horse', '驿马', s.skyHorse],
    ['Solitary', '孤辰', s.solitary],
    ['Life Palace', '命宫', formatGanZhi(s.lifePalace)],
    ['Conception Palace', '胎元', formatGanZhi(s.conceptionPalace)],
    ['Death & Emptiness', '空亡', chart.voids.join(' ')],
  ];
  return (
    <section className="panel">
      <h2>{zh ? '个人命盘资料' : 'Personal chart details'}</h2>
      <dl className="facts">
        {rows.map(([en, cn, value]) => (
          <div key={en}>
            <dt>{zh ? cn : en}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const DIRECTIONS_ZH: Record<string, string> = {
  N: '北',
  NE: '东北',
  E: '东',
  SE: '东南',
  S: '南',
  SW: '西南',
  W: '西',
  NW: '西北',
};
const GOOD: Mansion[] = ['shengQi', 'tianYi', 'yanNian', 'fuWei'];
const BAD: Mansion[] = ['huoHai', 'wuGui', 'liuSha', 'jueMing'];

/** Life Gua, Life Star and the eight direction sectors — requested by Ray on 30 Sep (RC-01). */
export function GuaPanel({ chart, display }: { chart: ChartResult; display: Display }) {
  const zh = display.lang === 'zh';
  const g = chart.gua;
  if (!g) {
    return (
      <section className="panel">
        <h2>{zh ? '命卦' : 'Life Gua'}</h2>
        <p className="muted">
          {zh ? '缺少性别，无法计算命卦' : 'Gender not given — the Gua needs it.'}
        </p>
      </section>
    );
  }
  const star = NINE_STAR_TERMS[g.lifeStar]!;
  const list = (sectors: Mansion[]) =>
    sectors.map((m) => (
      <div key={m}>
        <dt>{zh ? MANSION_TERMS[m].zh : MANSION_TERMS[m].en}</dt>
        <dd>{zh ? DIRECTIONS_ZH[g.directions[m]] : g.directions[m]}</dd>
      </div>
    ));
  return (
    <section className="panel">
      <h2>{zh ? '命卦 · 命星' : 'Life Gua · Life Star'}</h2>
      <p className="gua">
        <span className="gua__trigram">{g.trigram}</span>
        <span>
          {g.number} · {zh ? star.zh : star.en} · {star.element} ·{' '}
          {zh ? (g.group === 'east' ? '东四命' : '西四命') : `${g.group} group`}
        </span>
      </p>
      <h3>{zh ? '本命吉方' : 'Favourable'}</h3>
      <dl className="facts">{list(GOOD)}</dl>
      <h3>{zh ? '本命凶方' : 'Unfavourable'}</h3>
      <dl className="facts">{list(BAD)}</dl>
    </section>
  );
}

export function RelationshipsPanel({ chart, display }: { chart: ChartResult; display: Display }) {
  return (
    <section className="panel">
      <h2>{display.lang === 'zh' ? '刑冲合害' : 'Clashes, harmonies & punishments'}</h2>
      {chart.relationships.length === 0 ? (
        <p className="muted">None found.</p>
      ) : (
        <ul className="relations">
          {chart.relationships.map((r, i) => (
            <li key={i}>
              <strong>{r.kind}</strong> {r.chars.join('')}{' '}
              <span className="muted">({r.between.join(' · ')})</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Natal and annual Ten Profiles side by side, as on the reference chart. */
export function ProfilesPanel({ chart, display }: { chart: ChartResult; display: Display }) {
  const zh = display.lang === 'zh';
  if (!chart.profiles) {
    return (
      <section className="panel">
        <h2>{zh ? '五结构 · 十神' : 'Five Structures · Ten Profiles'}</h2>
        <p className="muted">Pending the WS3 percentage model (risk R1) — natal and annual.</p>
      </section>
    );
  }
  const { natal, annual } = chart.profiles;
  return (
    <section className="panel">
      <h2>{zh ? '十神' : 'Ten Profiles'}</h2>
      {TEN_GODS.map((g) => (
        <div key={g} className="bar">
          <span>{zh ? TEN_GOD_TERMS[g].zh : TEN_GOD_TERMS[g].en}</span>
          <meter min={0} max={100} value={natal.tenGods[g]} />
          <span>{natal.tenGods[g]}%</span>
          {annual && <span className="muted">{annual.tenGods[g]}%</span>}
        </div>
      ))}
    </section>
  );
}

/** "6 Aspects", natal vs annual — requested on 30 Sep; the method is still unknown (R11). */
export function AspectsPanel({ chart, display }: { chart: ChartResult; display: Display }) {
  const zh = display.lang === 'zh';
  return (
    <section className="panel">
      <h2>{zh ? '六个方面' : '6 Aspects'}</h2>
      {chart.aspects ? (
        <p className="muted">WS7: draw natal vs annual bars with the change under each.</p>
      ) : (
        <p className="muted">Pending the WS3 model (risk R11) — natal vs annual.</p>
      )}
    </section>
  );
}
