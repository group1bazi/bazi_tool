# How your luck pillars and annual pillar are worked out — for Mr Ray Tham

**Status: OUTLINE — WS4 (Raees, backup Dave) to write by Wed 21 Oct for Customer Day 2.**
Ray asked on 30 Sep for an explanation of how the luck pillars are computed: the direction, the starting
age of the first cycle, and the cycles after it. He also asked for the annual pillar (RC-09). Write for a
practitioner, not a programmer: one page, one worked example, no code. Also make one slide from it for the deck.

## 1. The annual pillar
- The year pillar of the year you're looking at, counted from Li Chun (~4 Feb), not 1 January.
- Worked example: 2026 → 丙午 (from 4 Feb 2026, 04:02).

## 2. Direction
- Yang year stem (甲丙戊庚壬) + male, or yin year stem + female → **forward** through the 60 Jia-Zi from the month pillar.
- The other two cases → **backward**.
- Worked example: Example A, 戊 (yang) year, female → backward from 庚申: 己未, 戊午, 丁巳…

## 3. Starting age of the first cycle
- Count the time from birth to the next 节 (forward) or back to the previous 节 (backward).
- Convert it: **3 days = 1 year** (1 day = 4 months; 2 hours = 10 days). *WS4: state the variant we chose and why.*
- Worked example: Example A → 9 years 9 months 20 days, so the first luck pillar 己未 begins mid-1998.
- How the age is **printed** (real vs nominal age; rounding). *WS4: fill in from the 30-sample comparison.*

## 4. The cycles after it
- Each pillar lasts 10 years, and the next one follows in the same direction.

## 5. How well this matches your software
- Match rate on the 30 samples: first pillar __/30, printed first age __/30.
- Any cases that differ, and why. *(E.g. births a few hours before a 节 on the same day.)*
- The question for Ray: is he happy for the tool to use this rule?

*Sources: standard method (cite a reference text); lunar-javascript `getYun` (both methods); the 30 samples.*
