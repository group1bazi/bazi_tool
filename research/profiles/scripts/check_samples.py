import csv, json, itertools, math, statistics as st, sys
P = sys.argv[1]
rows = [r for r in csv.DictReader(open(P, encoding='utf-8-sig')) if (r.get('sample_id') or '').strip().isdigit()]
STEMS = '甲乙丙丁戊己庚辛壬癸'; BR = '子丑寅卯辰巳午未申酉戌亥'
def idx60(p):
    s, b = STEMS.index(p[0]), BR.index(p[1])
    for k in range(60):
        if k % 10 == s and k % 12 == b: return k
def p60(k): k %= 60; return STEMS[k % 10] + BR[k % 12]
def tengod(dm, x):
    d, e = STEMS.index(dm)//2, STEMS.index(x)//2
    same = (STEMS.index(dm) % 2) == (STEMS.index(x) % 2)
    if d == e: return 'F' if same else 'RW'
    if (d+1) % 5 == e: return 'EG' if same else 'HO'
    if (d+2) % 5 == e: return 'IW' if same else 'DW'
    if (e+2) % 5 == d: return '7K' if same else 'DO'
    if (e+1) % 5 == d: return 'IR' if same else 'DR'
GODS = ['F','RW','EG','HO','DW','IW','DO','7K','DR','IR']
res = {}
def score(name, ok, n): res[name] = (ok, n)
# 1 hidden-stem keying consistency per branch
seen = {}
for r in rows:
    for col in ['year','month','day','hour']:
        b = r[col][1]; h = r['hidden_'+col]
        seen.setdefault(b, []).append(h)
incons = {b: sorted(set(v)) for b, v in seen.items() if len(set(v)) > 1}
score('Hidden stems keyed identically for the same branch (120 branches)', sum(len(v) for b,v in seen.items() if b not in incons), sum(len(v) for v in seen.values()))
# 2 day master
score('Day Master = day stem', sum(r['day_master'] == r['day'][0] for r in rows), len(rows))
# 3 voids
def voids(day):
    k = idx60(day); start = k - k % 10
    return BR[(start+10) % 12] + BR[(start+11) % 12]
score('空亡 (void) branches from the day pillar', sum(set(voids(r['day'])) == set(r['voids']) for r in rows), len(rows))
# 4 luck direction
def direction(r):
    yang = STEMS.index(r['year'][0]) % 2 == 0
    return 'forward' if (yang and r['gender'] == 'M') or (not yang and r['gender'] == 'F') else 'backward'
score('Luck direction (gender + year-stem polarity)', sum(direction(r) == r['luck_direction'] for r in rows), len(rows))
# 5 first luck pillar and sequence
def seq(r):
    k = idx60(r['month']); s = 1 if direction(r) == 'forward' else -1
    return [p60(k + s*i) for i in range(1, 10)]
score('First luck pillar (next/previous month pillar)', sum(seq(r)[0] == r['luck_first_pillar'] for r in rows), len(rows))
score('Full luck-pillar sequence as keyed', sum(r['luck_pillars'].split()[:len(r['luck_pillars'].split())] == seq(r)[:len(r['luck_pillars'].split())] for r in rows), len(rows))
# 6 Gua (year of the year pillar, Li Chun boundary)
def gua(r):
    by = int(r['birth_date'][:4]); y = by if (by - 4) % 60 == idx60(r['year']) else by - 1
    assert (y - 4) % 60 == idx60(r['year'])
    yy = y % 100
    if r['gender'] == 'M': g = ((100 - yy) if y < 2000 else (99 - yy)) % 9
    else: g = ((yy - 4) if y < 2000 else (yy + 6)) % 9
    g = g or 9
    if g == 5: g = 2 if r['gender'] == 'M' else 8
    return g
score('Life Gua number', sum(gua(r) == int(r['gua_number']) for r in rows), len(rows))
# 7 printed main profile = highest natal %
score('Main profile = highest natal profile %', sum(max(GODS, key=lambda g: float(r['natal_'+g])) == r['main_profile'] for r in rows), len(rows))
SK = ['self','inspiration','action','discipline','knowledge']
score('Main structure = highest natal structure value', sum(max(SK, key=lambda s: float(r['struct_natal_'+s])) == r['main_structure'] for r in rows), len(rows))
out = {'checks': res, 'hidden_inconsistent': incons, 'lunar_js_all_match': sum(r['lunar_js_check'] == 'all match' for r in rows), 'n': len(rows),
       'gua_miss': [r['sample_id'] for r in rows if gua(r) != int(r['gua_number'])],
       'void_miss': [r['sample_id'] for r in rows if set(voids(r['day'])) != set(r['voids'])],
       'luck_miss': [r['sample_id'] for r in rows if seq(r)[0] != r['luck_first_pillar'] or direction(r) != r['luck_direction']],
       'mainprof_miss': [r['sample_id'] for r in rows if max(GODS, key=lambda g: float(r['natal_'+g])) != r['main_profile']]}
json.dump(out, open(sys.argv[2], 'w'), ensure_ascii=False, indent=1) if len(sys.argv) > 2 else None
for k,(a,b) in res.items(): print(f'{a}/{b}  {k}')
print({k:v for k,v in out.items() if k not in ('checks',)})
