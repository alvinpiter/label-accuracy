import { groupBy } from "lodash";
import {
  DocumentStatistic,
  LabelAccuracy,
  LabelerAccuracy,
} from "./interfaces";

export function getLabelerAccuracies(
  documentStatistics: DocumentStatistic[]
): LabelerAccuracy[] {
  const documentStatisticsGroupedByDocumentId = groupBy(
    documentStatistics,
    (documentStatistic) => documentStatistic.document.id
  );

  return Object.values(documentStatisticsGroupedByDocumentId).map(
    (documentStatistics) => getLabelerAccuracy(documentStatistics)
  );
}

function getLabelerAccuracy(
  documentStatistics: DocumentStatistic[]
): LabelerAccuracy {
  const labelAccuraciesMap: Record<string, Omit<LabelAccuracy, "label">> = {};

  for (const documentStatistic of documentStatistics) {
    for (const labelAccuracy of documentStatistic.labelAccuracies) {
      if (!labelAccuraciesMap[labelAccuracy.label]) {
        labelAccuraciesMap[labelAccuracy.label] = {
          numberOfMatches: 0,
          numberOfReviewerLabels: 0,
        };
      }

      const newNumberOfMatches =
        labelAccuraciesMap[labelAccuracy.label].numberOfMatches +
        labelAccuracy.numberOfMatches;
      const newNumberOfReviewerLabels =
        labelAccuraciesMap[labelAccuracy.label].numberOfReviewerLabels +
        labelAccuracy.numberOfReviewerLabels;

      labelAccuraciesMap[labelAccuracy.label] = {
        numberOfMatches: newNumberOfMatches,
        numberOfReviewerLabels: newNumberOfReviewerLabels,
      };
    }
  }

  return {
    labeler: documentStatistics[0].document.ownerDisplayName,
    labelAccuracies: Object.entries(labelAccuraciesMap).map(
      ([label, value]) => ({
        label,
        numberOfMatches: value.numberOfMatches,
        numberOfReviewerLabels: value.numberOfReviewerLabels,
      })
    ),
  };
}
