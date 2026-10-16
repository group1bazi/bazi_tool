"""6 Aspects: what the 30 samples show so far (natal and 2026 bars). Aggregates only.

Usage: python aspects_v0.py ../data/samples.csv
"""
import sys
from collections import Counter, defaultdict
import numpy as np
from ws3_lib import *

rows = load(sys.argv[1])
nat = np.array([[float(r['aspect_natal_' + a]) for a in ASPECTS] for r in rows])
ann = np.array([[float(r['aspect_annual_' + a]) for a in ASPECTS] for r in rows])
dlt = np.array([[float(r['aspect_delta_' + a]) for a in ASPECTS] for r in rows])
print(f"Printed change = 2026 bar - natal bar: {int(np.sum(dlt == ann - nat))}/{dlt.size}")
print(f"Natal values: multiples of 5 from {nat.min():.0f} to {nat.max():.0f}; 2026: {ann.min():.0f} to {ann.max():.0f}")

# Which single chart feature fixes each aspect? (consistency among charts that share the feature)
def consistency(key, col):
    groups = defaultdict(list)
    for r, v in zip(rows, col): groups[key(r)].append(v)
    n = sum(len(g) for g in groups.values() if len(g) > 1)
    ok = sum(Counter(g).most_common(1)[0][1] for g in groups.values() if len(g) > 1)
    return ok, n, groups

keys = {f'{p} branch': (lambda p: lambda r: r[p][1])(p) for p in PILLARS}
for j, a in enumerate(ASPECTS):
    res = {k: consistency(f, nat[:, j])[:2] for k, f in keys.items()}
    best = max(res, key=lambda k: res[k][0] / res[k][1])
    print(f"{a:13s} best single key: {best} ({res[best][0]}/{res[best][1]} consistent)")
ok, n, g = consistency(lambda r: r['month'][1], nat[:, 1])
print("Natal Financial by month branch:", {b: sorted({int(x) for x in v}) for b, v in sorted(g.items(), key=lambda kv: BRANCHES.index(kv[0]))})

# Linear mix of the Ten Profiles or Five Structures? (leave-one-out, rounded to 5)
P = np.array([[float(r['natal_' + g]) for g in GODS] for r in rows])
SK = ['self', 'inspiration', 'action', 'discipline', 'knowledge']
St = np.array([[float(r['struct_natal_' + s]) for s in SK] for r in rows])
for name, F in [('Ten Profiles', P), ('Five Structures', St)]:
    maes = []
    for j in range(6):
        X1 = np.c_[F, np.ones(len(F))]; pred = np.zeros(len(F))
        for i in range(len(F)):
            m = np.arange(len(F)) != i
            pred[i] = X1[i] @ np.linalg.lstsq(X1[m], nat[m, j], rcond=None)[0]
        maes.append(np.mean(np.abs(np.round(pred / 5) * 5 - nat[:, j])))
    print(f"Linear mix of the {name}: mean abs error {np.mean(maes):.1f} (predicting the average: "
          f"{np.mean(np.abs(nat - nat.mean(0))):.1f})")
