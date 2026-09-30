import { orderForDisplay, type Pillar, type Settings } from '@bazi/engine';
import { elementOf, godTag, pinyinOf, whenReady, type Display } from '../i18n';

interface Props {
  pillar: Pillar;
  heading: string;
  display: Display;
  hiddenOrder: Settings['hiddenStemDisplay'];
  compact?: boolean;
  /** Small label beside the branch, e.g. the month's life stage. */
  note?: string;
}

/**
 * One pillar, in the FIXED layout Ray requires (CD1 minutes §2.7):
 * Ten God tag → Heavenly Stem (top) → Earthly Branch (centre) → Hidden Stems (below).
 * Colours and spacing are open to WS7's proposal; the vertical order is not.
 */
export function PillarColumn({
  pillar,
  heading,
  display,
  hiddenOrder,
  compact = false,
  note,
}: Props) {
  const hidden = whenReady(() => orderForDisplay(pillar.hidden, hiddenOrder), pillar.hidden);
  const { lang, pinyin } = display;

  return (
    <div className={`pillar${compact ? ' pillar--compact' : ''}`}>
      <div className="pillar__heading">{heading}</div>
      <div className="pillar__god">
        {pillar.stemGod ? godTag(pillar.stemGod, lang) : lang === 'zh' ? '日主' : 'DM'}
      </div>
      <Char char={pillar.stem} pinyin={pinyin} />
      <Char char={pillar.branch} pinyin={pinyin} />
      {note && <div className="pillar__note">{note}</div>}
      {pillar.void && <div className="pillar__void">空亡</div>}
      <div className="pillar__hidden">
        {hidden.map((h) => (
          <div key={h.stem} className={`hidden hidden--${h.qi}`}>
            <span className={`el-${elementOf(h.stem)}`}>{h.stem}</span>
            <small>{godTag(h.god, lang)}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function Char({ char, pinyin }: { char: Pillar['stem'] | Pillar['branch']; pinyin: boolean }) {
  return (
    <div className={`char el-${elementOf(char)}`}>
      {char}
      {pinyin && <small>{pinyinOf(char)}</small>}
    </div>
  );
}
