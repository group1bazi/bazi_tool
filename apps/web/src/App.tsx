import {
  NotImplementedError,
  computeChart,
  libraryCheck,
  type BirthInput,
  type ChartResult,
} from '@bazi/engine';
import { EXAMPLE_A_CHART } from '@bazi/engine/fixtures';
import { useMemo, useState } from 'react';
import { ChartGrid } from './components/ChartGrid';
import { EntryForm } from './components/EntryForm';
import {
  AspectsPanel,
  GuaPanel,
  ProfilesPanel,
  RelationshipsPanel,
  SupportingPanel,
} from './components/SidePanels';
import { LuckPillars, MonthStrip } from './components/TimePanels';
import type { Display } from './i18n';

const SAMPLE_NOTICE =
  'Showing the Example A sample chart (hand-checked data), not a live calculation.';

export function App() {
  const [chart, setChart] = useState<ChartResult>(EXAMPLE_A_CHART);
  const [notice, setNotice] = useState<string | null>(SAMPLE_NOTICE);
  const [display, setDisplay] = useState<Display>({ lang: 'en', pinyin: true });
  const check = useMemo(libraryCheck, []);
  const zh = display.lang === 'zh';

  function plot(input: BirthInput) {
    try {
      setChart(computeChart(input));
      setNotice(null);
    } catch (error) {
      if (!(error instanceof NotImplementedError)) throw error;
      setChart(EXAMPLE_A_CHART);
      setNotice(`Engine not finished — ${error.message}. ${SAMPLE_NOTICE}`);
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>{zh ? '八字排盘' : 'Bazi Chart Plotter'}</h1>
        <div className="toggles">
          <button
            type="button"
            onClick={() => setDisplay({ ...display, lang: zh ? 'en' : 'zh' })}
            aria-label="Switch label language"
          >
            {zh ? 'English' : '中文'}
          </button>
          <label className="inline">
            <input
              type="checkbox"
              checked={display.pinyin}
              onChange={(e) => setDisplay({ ...display, pinyin: e.target.checked })}
            />
            Pinyin
          </label>
        </div>
      </header>

      <main className="layout">
        <EntryForm lang={display.lang} onSubmit={plot} />
        <div className="results">
          {notice && <p className="notice">{notice}</p>}
          {chart.warnings.map((w) => (
            <p key={w.code} className="notice notice--warn">
              {w.message}
            </p>
          ))}
          <ChartGrid chart={chart} display={display} />
          <LuckPillars chart={chart} display={display} />
          <MonthStrip chart={chart} display={display} />
          <div className="columns">
            <SupportingPanel chart={chart} display={display} />
            <GuaPanel chart={chart} display={display} />
            <RelationshipsPanel chart={chart} display={display} />
            <ProfilesPanel chart={chart} display={display} />
            <AspectsPanel chart={chart} display={display} />
          </div>
        </div>
      </main>

      <footer className="muted">
        Calendar library check (spike S2, browser): {check.ok ? 'OK' : 'FAILED'} — {check.got}
      </footer>
    </div>
  );
}
