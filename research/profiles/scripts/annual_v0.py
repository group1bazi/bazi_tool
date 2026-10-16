"""2026 (annual) Ten Profiles %, model v0: natal chart + current luck pillar + 2026 pillar (丙午).

Same features as model_v1 (position x season of the birth month), with extra classes for the luck and
annual pillars. Usage: python annual_v0.py ../data/samples.csv
"""
import sys
import numpy as np
from ws3_lib import *

YEAR_2026 = '丙午'
rows = load(sys.argv[1])
EXTRA = ['LUCK_STEM', 'LUCK_MAIN', 'LUCK_OTHER', 'YEAR_STEM', 'YEAR_MAIN', 'YEAR_OTHER']
ALL = CLASSES + EXTRA
K = len(ALL) * 5


def features(r):
    dm, m = r['day'][0], r['month'][1]
    src = sources(r)
    for tag, p in [('LUCK', r['luck_current_2026'].split()[0]), ('YEAR', YEAR_2026)]:
        src.append((f'{tag}_STEM', p[0]))
        src += [(f'{tag}_{"MAIN" if i == 0 else "OTHER"}', s) for i, s in enumerate(HIDDEN[p[1]])]
    F = {g: np.zeros(K) for g in GODS}
    for c, s in src:
        F[ten_god(dm, s)][ALL.index(c) * 5 + STATES.index(season_state(s, m))] += 1
    return F


X, Y, N, S = [], [], [], []
for r in rows:
    F = features(r)
    for g in GODS:
        X.append(F[g]); Y.append(float(r['annual_' + g])); N.append(float(r['natal_' + g])); S.append(r['sample_id'])
X, Y, N, S = map(np.array, (X, Y, N, S))
present = X.sum(1) > 0
print(f"Zeros: {int((Y == 0).sum())}. Absent from natal + luck + 2026: {int(((Y == 0) & ~present).sum())}. "
      f"Present but 0: {int(((Y == 0) & present).sum())} (combinations / clashes: see models.md). "
      f"Absent but > 0: {int(((Y > 0) & ~present).sum())}")
pred = np.zeros_like(Y)
for sid in sorted(set(S), key=int):
    tr = S != sid
    pred[~tr] = predict(X[~tr], fit_saturating(X[tr], Y[tr]))
pred[~present] = 0
err = np.abs(np.round(pred) - Y)
print(f"Baseline (2026 % = natal %): mean abs error {np.mean(np.abs(N - Y)):.1f}")
print(f"Annual v0, leave-one-out: mean abs error {err.mean():.1f} | within 10: {np.mean(err <= 10)*100:.0f}%")
