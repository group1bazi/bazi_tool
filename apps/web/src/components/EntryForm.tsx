import { BRANCHES, BRANCH_INFO, type BirthInput, type Branch, type Gender } from '@bazi/engine';
import { useState, type FormEvent } from 'react';
import type { Lang } from '../i18n';

type TimeMode = 'exact' | 'slot' | 'unknown';

// 子 starts at 23:00; each branch covers two hours from there.
const SLOT_LABEL = (i: number) => {
  const start = (23 + 2 * i) % 24;
  const pad = (h: number) => String(h).padStart(2, '0');
  return `${pad(start)}:00–${pad((start + 1) % 24)}:59`;
};

/** Ray's form offers exact time, a two-hour slot, or "don't know" (CD1 minutes §2.9). */
export function EntryForm({
  lang,
  onSubmit,
}: {
  lang: Lang;
  onSubmit: (input: BirthInput) => void;
}) {
  const zh = lang === 'zh';
  const [date, setDate] = useState('1988-09-06');
  const [mode, setMode] = useState<TimeMode>('exact');
  const [time, setTime] = useState('01:30');
  const [slot, setSlot] = useState<Branch>('丑');
  const [gender, setGender] = useState<Gender | ''>('F');

  function submit(event: FormEvent) {
    event.preventDefault();
    onSubmit({
      date,
      time:
        mode === 'exact'
          ? { kind: 'exact', time }
          : mode === 'slot'
            ? { kind: 'slot', branch: slot }
            : { kind: 'unknown' },
      gender: gender || null,
    });
  }

  return (
    <form className="panel entry" onSubmit={submit}>
      <label>
        {zh ? '出生日期' : 'Birth date'}
        <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <fieldset>
        <legend>{zh ? '出生时间' : 'Birth time'}</legend>
        {(['exact', 'slot', 'unknown'] as const).map((m) => (
          <label key={m} className="inline">
            <input type="radio" name="mode" checked={mode === m} onChange={() => setMode(m)} />
            {
              {
                exact: zh ? '准确' : 'Exact',
                slot: zh ? '时辰' : '2-hour slot',
                unknown: zh ? '不详' : 'Unknown',
              }[m]
            }
          </label>
        ))}
        {mode === 'exact' && (
          <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} />
        )}
        {mode === 'slot' && (
          <select value={slot} onChange={(e) => setSlot(e.target.value as Branch)}>
            {BRANCHES.map((b, i) => (
              <option key={b} value={b}>
                {b} {BRANCH_INFO[b].animal} · {SLOT_LABEL(i)}
              </option>
            ))}
          </select>
        )}
      </fieldset>
      <label>
        {zh ? '性别' : 'Gender'}
        <select value={gender} onChange={(e) => setGender(e.target.value as Gender | '')}>
          <option value="F">{zh ? '女' : 'Female'}</option>
          <option value="M">{zh ? '男' : 'Male'}</option>
          <option value="">{zh ? '未提供' : 'Not given'}</option>
        </select>
      </label>
      <button type="submit">{zh ? '排盘' : 'Plot chart'}</button>
    </form>
  );
}
