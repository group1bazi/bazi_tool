"""Ten Profiles % (natal), model v2: season base + points per position, rooting, frames.

% = BASE[season state] + sum of POINTS[position][state] over every appearance of the Ten God
      + ROOT[state] for each visible stem whose same stem also sits hidden in a branch (通根)
      + a bonus when all three branches of the god's element frame (三合) are in the chart,
capped at 100; 0 when the god is absent. The Day Master adds no stem points when it is rooted
in the month branch. Linear in its 42 numbers, so the fitted values read as a points table.
Validated leave-one-sample-out. Usage: python model_v2.py ../data/samples.csv
"""
import sys
from collections import defaultdict
import numpy as np
from ws3_lib import *

FRAMES = {4: '申子辰', 0: '亥卯未', 1: '寅午戌', 3: '巳酉丑'}  # element -> 三合 frame (middle branch is the 2nd)


def features(r):
    dm, m = r['day'][0], r['month'][1]
    srcs = []  # (pillar, is_stem, hidden level, stem)
    for p in PILLARS:
        srcs.append((p, True, 0, r[p][0]))
        srcs += [(p, False, i, s) for i, s in enumerate(HIDDEN[r[p][1]])]
    branches = [r[p][1] for p in PILLARS]
    out = {}
    for g in GODS:
        mine = [x for x in srcs if ten_god(dm, x[3]) == g]
        if not mine:
            out[g] = None
            continue
        st = season_state(mine[0][3], m)
        f = defaultdict(float)
        f[('BASE', st)] = 1
        for p, is_stem, lvl, s in mine:
            if is_stem:
                roots = [x for x in mine if not x[1] and x[3] == s]
                month_rooted = p == 'day' and any(x[0] == 'month' for x in roots)
                f[('DM_MONTH_ROOTED' if month_rooted else 'STEM', st)] += 1
                if roots: f[('ROOT', st)] += 1
            else:
                f[(('M_' if p == 'month' else 'H_') + ('MAIN' if lvl == 0 else 'OTHER'), st)] += 1
        el = element(mine[0][3])
        if el in FRAMES:
            if all(b in branches for b in FRAMES[el]): f[('FRAME_FULL', 'any')] += 1  # half frames tested: no effect
        out[g] = f
    return out


def fit(X, y, iters=30):
    """Least absolute error (IRLS); a target of 100 is a cap, so predicting more than 100 there is not an error."""
    w = np.linalg.solve(X.T @ X + 1e-3 * np.eye(X.shape[1]), X.T @ y)
    for _ in range(iters):
        p = X @ w
        wt = 1 / np.maximum(np.abs(p - y), 0.5)
        wt[(y >= 100) & (p >= 100)] = 1e-3
        w = np.linalg.solve(X.T @ (wt[:, None] * X) + 1e-3 * np.eye(X.shape[1]), X.T @ (wt * y))
    return w


rows = load(sys.argv[1])
F = [features(r) for r in rows]
keys = sorted({k for f in F for g in GODS if f[g] for k in f[g]})
X, Y, S, present = [], [], [], []
for r, f in zip(rows, F):
    for g in GODS:
        X.append([f[g][k] if f[g] else 0 for k in keys]); Y.append(float(r['natal_' + g]))
        S.append(r['sample_id']); present.append(f[g] is not None)
X, Y, S, present = np.array(X), np.array(Y), np.array(S), np.array(present)

pred = np.zeros_like(Y)
for sid in sorted(set(S), key=int):
    tr, te = (S != sid) & present, (S == sid) & present
    pred[te] = X[te] @ fit(X[tr], Y[tr])
pred = np.clip(np.round(pred), 0, 100)
err = np.abs(pred - Y)
top = sum(Y[S == s][np.argmax(pred[S == s])] == Y[S == s].max() for s in set(S))
rc = [np.corrcoef(np.argsort(np.argsort(pred[S == s])), np.argsort(np.argsort(Y[S == s])))[0, 1] for s in sorted(set(S))]
print(f"Model v2, leave-one-out over {len(Y)} values ({len(keys)} numbers fitted):")
print(f"   mean abs error {err.mean():.1f} pts | within 2: {np.mean(err <= 2)*100:.0f}% | within 5: {np.mean(err <= 5)*100:.0f}% | within 10: {np.mean(err <= 10)*100:.0f}%")
print(f"   exact: {int((err == 0).sum())} (of which zeros {int(((err == 0) & (Y == 0)).sum())})")
print(f"   strongest profile correct: {top}/30 | rank order (mean Spearman per chart): {np.mean(rc):.2f}")

w = fit(X[present], Y[present])
print("\nFitted points (all 30 charts):")
names = sorted({k[0] for k in keys}, key=lambda c: ['BASE', 'STEM', 'DM_MONTH_ROOTED', 'ROOT', 'H_MAIN', 'H_OTHER', 'M_MAIN', 'M_OTHER'].index(c) if not c.startswith('FRAME') else 99)
for c in names:
    if c.startswith('FRAME'):
        print(f"   {c:16s} {w[keys.index((c, 'any'))]:+.0f}  (seen {int(X[present][:, keys.index((c, 'any'))].sum())}x)")
        continue
    cells = [f"{st}:{w[keys.index((c, st))]:5.1f}" if (c, st) in keys else f"{st}:    -" for st in STATES]
    print(f"   {c:16s}", '  '.join(cells))
