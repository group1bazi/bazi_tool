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
- Count **whole calendar days** from the birth date to the date of the next 节 (forward) or back to the date of
  the previous 节 (backward). A birth *on* a 节's date counts as after that 节, whatever the time.
- Convert it: **3 days = 1 year**, rounded to the nearest year. That is the age printed above the first pillar.
- Worked example: Example A (6 Sep 1988, backward) → 立秋 on 7 Aug 1988 → 30 days → **10**.
- Ages are counted the Chinese way (虚岁): the pillar printed at age 10 starts in 1988 + 10 − 1 = 1997.
- This is the rule his software uses (found on the 30 samples, 30 Sep). The textbook version counts to the exact
  moment of the 节 and gives months and days (Example A: 9 years 9 months 20 days). *WS4: explain the difference
  in one sentence.*

## 4. The cycles after it
- Each pillar lasts 10 years, and the next one follows in the same direction.

## 5. How well this matches your software
- Match rate on the 30 samples: direction and all 9 pillars **30/30**, printed first age **30/30**.
- The exact-moment method would disagree on 16 of the 30, by up to 10 years for a birth a few hours before a 节
  on the same day (the software counts that birth as after the 节).
- The question for Ray: is he happy for the tool to use this rule?

*Sources: standard method (cite a reference text); lunar-javascript `getYun` (both methods); the 30 samples.*
