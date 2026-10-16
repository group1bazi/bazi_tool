"""Shared chart helpers for the WS3 research scripts (Ten Profiles %, 2026 %, 6 Aspects).

Research only: nothing here ships. Reads the private, git-ignored samples.csv and prints aggregates only.
"""
import csv
import numpy as np

STEMS = '甲乙丙丁戊己庚辛壬癸'
BRANCHES = '子丑寅卯辰巳午未申酉戌亥'
GODS = ['F', 'RW', 'EG', 'HO', 'DW', 'IW', 'DO', '7K', 'DR', 'IR']
PILLARS = ['year', 'month', 'day', 'hour']
ASPECTS = ['lifePurpose', 'financial', 'relationship', 'family', 'wellness', 'contribution']

# Hidden stems by qi level: main, middle, residual (same sets as every sample chart, 120/120 branches)
HIDDEN = {'子': '癸', '丑': '己癸辛', '寅': '甲丙戊', '卯': '乙', '辰': '戊乙癸', '巳': '丙庚戊',
          '午': '丁己', '未': '己丁乙', '申': '庚壬戊', '酉': '辛', '戌': '戊辛丁', '亥': '壬甲'}

# Season of each month branch (the 3 months of a season, earth months included): 0 wood .. 4 water
SEASON = {'寅': 0, '卯': 0, '辰': 0, '巳': 1, '午': 1, '未': 1, '申': 3, '酉': 3, '戌': 3, '亥': 4, '子': 4, '丑': 4}
STATES = ['死', '囚', '休', '相', '旺']  # dead, trapped, resting, growing, prosperous (weakest -> strongest)
CLASSES = ['STEM', 'H_MAIN', 'H_OTHER', 'M_MAIN', 'M_OTHER']


def element(stem):
    return STEMS.index(stem) // 2  # 0 wood, 1 fire, 2 earth, 3 metal, 4 water


def ten_god(dm, stem):
    d, e = element(dm), element(stem)
    same = STEMS.index(dm) % 2 == STEMS.index(stem) % 2
    if d == e: return 'F' if same else 'RW'
    if (d + 1) % 5 == e: return 'EG' if same else 'HO'
    if (d + 2) % 5 == e: return 'IW' if same else 'DW'
    if (e + 2) % 5 == d: return '7K' if same else 'DO'
    return 'IR' if same else 'DR'


def season_state(stem, month_branch):
    """旺相休囚死: the strength of the stem's element in the season of the birth month."""
    e, s = element(stem), SEASON[month_branch]
    if e == s: return '旺'           # the season's own element
    if (s + 1) % 5 == e: return '相'  # produced by the season
    if (e + 1) % 5 == s: return '休'  # produces the season (spent)
    if (e + 2) % 5 == s: return '囚'  # controls the season (held back)
    return '死'                        # controlled by the season


def sources(r):
    """Every stem in the natal chart, tagged with its position class. The Day Master counts as a visible stem."""
    out = [('STEM', r['day'][0])]
    for p in PILLARS:
        if p != 'day': out.append(('STEM', r[p][0]))
        for i, s in enumerate(HIDDEN[r[p][1]]):
            if p == 'month': out.append(('M_MAIN' if i == 0 else 'M_OTHER', s))
            else: out.append(('H_MAIN' if i == 0 else 'H_OTHER', s))
    return out


def load(path):
    return [r for r in csv.DictReader(open(path, encoding='utf-8-sig')) if (r.get('sample_id') or '').strip().isdigit()]


def fit_saturating(X, y, iters=200):
    """Least squares for y = 100 * (1 - exp(-X @ w)), w >= 0 (w = p**2), damped Gauss-Newton. numpy only."""
    p = np.full(X.shape[1], 0.7)
    lam = 1e-2
    def resid(p): return 100 * (1 - np.exp(-X @ (p * p))) - y
    r = resid(p); cost = r @ r
    for _ in range(iters):
        J = (100 * np.exp(-X @ (p * p)))[:, None] * X * (2 * p)[None, :]
        A = J.T @ J; g = J.T @ r
        step = np.linalg.solve(A + lam * np.diag(np.diag(A) + 1e-9), -g)
        r2 = resid(p + step); c2 = r2 @ r2
        if c2 < cost: p, r, cost, lam = p + step, r2, c2, lam / 3
        else: lam *= 4
        if lam > 1e8: break
    return p * p


def predict(X, w):
    return 100 * (1 - np.exp(-X @ w))
