import { PILLAR_TERMS, type ChartResult } from '@bazi/engine';
import { label, type Display } from '../i18n';
import { PillarColumn } from './PillarColumn';

/** The natal chart. Columns read Hour | Day | Month | Year, left to right (client doc §1). */
export function ChartGrid({ chart, display }: { chart: ChartResult; display: Display }) {
  const order = ['hour', 'day', 'month', 'year'] as const;
  return (
    <section className="panel">
      <h2>{display.lang === 'zh' ? '八字命盘' : 'Natal chart'}</h2>
      <div className="grid">
        {order.map((pos) => {
          const pillar = chart.pillars[pos];
          const heading = label(PILLAR_TERMS[pos], display.lang);
          return pillar ? (
            <PillarColumn
              key={pos}
              pillar={pillar}
              heading={heading}
              display={display}
              hiddenOrder={chart.settings.hiddenStemDisplay}
            />
          ) : (
            <div key={pos} className="pillar pillar--missing">
              <div className="pillar__heading">{heading}</div>
              <p>{display.lang === 'zh' ? '时辰不详' : 'Hour unknown'}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
