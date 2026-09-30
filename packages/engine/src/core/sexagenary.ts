/**
 * The 60 Jia-Zi cycle (六十甲子). Source: "Computing Elements of Bazi Chart" §5 (client document).
 * A stem and branch pair only if they share polarity, which is why there are 60 pairs, not 120.
 */
import { BRANCHES, branchIndex, isBranch, type Branch } from './branches';
import { STEMS, stemIndex, isStem, type Stem } from './stems';

/** One pillar's two characters, before Hidden Stems and Ten Gods are attached. */
export interface GanZhi {
  stem: Stem;
  branch: Branch;
}

/** 0 = 甲子, 10 = 甲戌, 59 = 癸亥. */
export function ganZhiFromIndex(index: number): GanZhi {
  const i = ((index % 60) + 60) % 60;
  return { stem: STEMS[i % 10]!, branch: BRANCHES[i % 12]! };
}

export function ganZhiIndex({ stem, branch }: GanZhi): number {
  const s = stemIndex(stem);
  const b = branchIndex(branch);
  if (s % 2 !== b % 2) {
    throw new RangeError(
      `${stem}${branch} is not in the 60 Jia-Zi cycle (stem and branch polarity differ)`,
    );
  }
  // Smallest i in 0..59 with i ≡ s (mod 10) and i ≡ b (mod 12).
  for (let i = s; i < 60; i += 10) if (i % 12 === b) return i;
  throw new RangeError(`unreachable: ${stem}${branch}`);
}

/** '戊辰' → { stem: '戊', branch: '辰' }. Throws on anything that is not a valid cycle member. */
export function parseGanZhi(text: string): GanZhi {
  const [stem, branch] = [...text];
  if (!stem || !branch || !isStem(stem) || !isBranch(branch) || [...text].length !== 2) {
    throw new RangeError(`"${text}" is not a stem-branch pair`);
  }
  const gz = { stem, branch };
  ganZhiIndex(gz); // validates polarity
  return gz;
}

export function formatGanZhi({ stem, branch }: GanZhi): string {
  return `${stem}${branch}`;
}
