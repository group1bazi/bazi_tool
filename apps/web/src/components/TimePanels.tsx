import { LIFE_STAGE_TERMS, type ChartResult } from '@bazi/engine';
import type { Display } from '../i18n';
import { PillarColumn } from './PillarColumn';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * Luck pillars run right → left with the annual pillar on the right-hand side (CD1 minutes §2.7).
 * `row-reverse` does the mirroring, so the data stays chronological.
 */
export function LuckPillars({ chart, display }: { chart: ChartResult; display: Display }) {
  const zh = display.lang === 'zh';
  const order = chart.settings.hiddenStemDisplay;
  return (
    <section className="panel">
      <h2>{zh ? '大运 · 流年' : 'Luck pillars · Annual pillar'}</h2>
      {!chart.luck && (
        <p className="muted">
          {zh ? '缺少性别，无法排大运' : 'Gender not given — luck pillars need it.'}
        </p>
      )}
      <div className="strip strip--rtl">
        <PillarColumn
          pillar={chart.annual}
          heading={String(chart.annual.year)}
          display={display}
          hiddenOrder={order}
          compact
        />
        {chart.luck?.pillars.map((p) => (
          <PillarColumn
            key={p.startYear}
            pillar={p}
            heading={`${p.startAge} · ${p.startYear}`}
            display={display}
            hiddenOrder={order}
            compact
          />
        ))}
      </div>
    </section>
  );
}

/**
 * The month strip. Both reference layouts read right → left, first month on the right; the Joey Yap
 * samples run FEB 4 … JAN 5 (next year) and label each month with the Day Master's life stage.
 */
export function MonthStrip({ chart, display }: { chart: ChartResult; display: Display }) {
  const zh = display.lang === 'zh';
  return (
    <section className="panel">
      <h2>{zh ? `${chart.annual.year} 流月` : `${chart.annual.year} months`}</h2>
      <div className="strip strip--rtl">
        {chart.monthly.map((m) => {
          const day = Number(m.starts.slice(8, 10));
          const year = m.starts.slice(0, 4);
          const nextYear = year !== String(chart.annual.year) ? ` (${year})` : '';
          const stage = LIFE_STAGE_TERMS[m.lifeStage];
          return (
            <PillarColumn
              key={m.starts}
              pillar={m}
              heading={`${MONTHS[m.month - 1]} ${day}${nextYear}`}
              note={zh ? stage.zh : stage.en}
              display={display}
              hiddenOrder={chart.settings.hiddenStemDisplay}
              compact
            />
          );
        })}
      </div>
    </section>
  );
}
