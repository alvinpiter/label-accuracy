import { LabelPairCount } from "./interfaces";

export function getLabelPairCountsStatistic(labelPairCounts: LabelPairCount[]) {
  const rowSumMap: Record<string, number> = {};
  const colSumMap: Record<string, number> = {};
  const matchCountMap: Record<string, number> = {};

  for (const labelPairCount of labelPairCounts) {
    const { firstLabel, secondLabel, count } = labelPairCount;

    rowSumMap[firstLabel] = rowSumMap[firstLabel] || 0;
    rowSumMap[firstLabel] += count;

    colSumMap[secondLabel] = colSumMap[secondLabel] || 0;
    colSumMap[secondLabel] += count;

    if (firstLabel === secondLabel) {
      matchCountMap[firstLabel] = matchCountMap[firstLabel] || 0;
      matchCountMap[firstLabel] += count;
    }
  }

  return { rowSumMap, colSumMap, matchCountMap };
}
