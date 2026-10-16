"""Ten Profiles % (natal), model v1: position x season, saturating.

Each stem of a Ten God adds points by WHERE it sits (visible stem / main or other hidden stem / month branch)
and HOW STRONG its element is in the birth season (旺相休囚死). % = 100 * (1 - exp(-points)).
Validated leave-one-sample-out. Usage: python model_v1.py ../data/samples.csv
"""
import sys
from collections import Counter, defaultdict
import numpy as np
from ws3_lib import *

rows = load(sys.argv[1])
K = len(CLASSES) * len(STATES)


def features(r):
    dm, m = r['day'][0], r['month'][1]
    F = {g: np.zeros(K) for g in GODS}
    for c, s in sources(r):
        F[ten_god(dm, s)][CLASSES.index(c) * 5 + STATES.index(season_state(s, m))] += 1
    return F


X, Y, S = [], [], []
for r in rows:
    F = features(r)
    for g in GODS:
        X.append(F[g]); Y.append(float(r['natal_' + g])); S.append(r['sample_id'])
X, Y, S = np.array(X), np.array(Y), np.array(S)
present = X.sum(1) > 0

# 1. Zero rule
print(f"Zero rule: {int(np.sum((Y == 0) == ~present))}/{len(Y)} values are 0 exactly when the Ten God is absent")

# 2. Single-source lookup table (a Ten God that appears once in the whole chart)
single = X.sum(1) == 1
tab = defaultdict(list)
for x, y in zip(X[single], Y[single]):
    tab[int(np.argmax(x))].append(int(y))
ok = sum(Counter(v).most_common(1)[0][1] for v in tab.values())
print(f"Single-source values that equal the lookup table: {ok}/{int(single.sum())}")
for i, c in enumerate(CLASSES):
    print(f"   {c:8s}", '  '.join(f"{st}:{Counter(tab[i*5+j]).most_common(1)[0][0] if tab[i*5+j] else '-':>3}" for j, st in enumerate(STATES)))

# 3. Leave-one-sample-out fit on every value
pred = np.zeros_like(Y)
for sid in sorted(set(S), key=int):
    tr = S != sid
    pred[~tr] = predict(X[~tr], fit_saturating(X[tr], Y[tr]))
pred[~present] = 0
err = np.abs(np.round(pred) - Y)
multi = X.sum(1) >= 2
top = sum(Y[S == s][np.argmax(pred[S == s])] == Y[S == s].max() for s in set(S))
print(f"\nModel v1, leave-one-out over {len(Y)} values:")
print(f"   mean abs error {err.mean():.1f} pts | within 5: {np.mean(err <= 5)*100:.0f}% | within 10: {np.mean(err <= 10)*100:.0f}%")
print(f"   exact: {int((err == 0).sum())} (of which zeros {int(((err == 0) & (Y == 0)).sum())})")
print(f"   single-source values: mean abs error {err[single].mean():.1f} | multi-source values: {err[multi].mean():.1f}")
print(f"   strongest profile correct: {top}/30")
rc = [np.corrcoef(np.argsort(np.argsort(pred[S == s])), np.argsort(np.argsort(Y[S == s])))[0, 1] for s in sorted(set(S))]
print(f"   rank order of the 10 profiles (mean Spearman per chart): {np.mean(rc):.2f}")
w = fit_saturating(X, Y)
print("\nFitted points per source (all 30 charts) -> % if it were the only source:")
for i, c in enumerate(CLASSES):
    print(f"   {c:8s}", '  '.join(f"{st}:{w[i*5+j]:.2f}({predict(np.eye(K)[i*5+j], w):.0f})" for j, st in enumerate(STATES)))
