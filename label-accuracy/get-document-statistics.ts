import { uniq } from "lodash";
import { getLabelPairCountsStatistic } from "./get-label-pair-count-statistic";
import { AgreementTable, DocumentStatistic, DocumentType } from "./interfaces";

export function getDocumentStatistics(
  agreementTables: AgreementTable[]
): DocumentStatistic[] {
  const result: DocumentStatistic[] = [];

  for (const agreementTable of agreementTables) {
    const { firstDocument, secondDocument, labelPairCounts } = agreementTable;

    //Only process agreement table between labeler's document and reviewer's document
    if (
      firstDocument.documentType === DocumentType.DOCUMENT &&
      secondDocument.documentType === DocumentType.REVIEW
    ) {
      const firstDocumentLabels = uniq(
        labelPairCounts.map((labelPairCount) => labelPairCount.firstLabel)
      );

      const labelPairCountsStatistic =
        getLabelPairCountsStatistic(labelPairCounts);

      result.push({
        document: firstDocument,
        labelAccuracies: firstDocumentLabels.map((label) => ({
          label,
          numberOfMatches: labelPairCountsStatistic.matchCountMap[label] || 0,
          numberOfReviewerLabels:
            labelPairCountsStatistic.rowSumMap[label] || 0,
        })),
      });
    }
  }

  return result;
}
