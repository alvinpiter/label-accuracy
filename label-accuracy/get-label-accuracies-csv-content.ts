import { uniq } from "lodash";
import { LabelerAccuracy } from "./interfaces";

export function getLabelAccuraciesCsvContent(
  labelerAccuracies: LabelerAccuracy[]
) {
  const allLabelers = uniq(
    labelerAccuracies.map((labelerAccuracy) => labelerAccuracy.labeler)
  ).sort();

  const allLabels = uniq(
    labelerAccuracies.flatMap((labelerAccuracy) =>
      labelerAccuracy.labelAccuracies.map(
        (labelAccuracy) => labelAccuracy.label
      )
    )
  ).sort();

  /**
   * Example:
   *
   * {
   *  "labeler": {
   *    "label1": "0.5",
   *    "label2": "0.2"
   *  }
   * }
   *
   */
  const labelerLabelAccuracyMap: Record<string, { [label: string]: string }> =
    {};

  for (const labelerAccuracy of labelerAccuracies) {
    const labeler = labelerAccuracy.labeler;
    for (const labelAccuracy of labelerAccuracy.labelAccuracies) {
      if (!labelerLabelAccuracyMap[labeler]) {
        labelerLabelAccuracyMap[labeler] = {};
      }

      labelerLabelAccuracyMap[labeler][labelAccuracy.label] = (
        labelAccuracy.numberOfMatches / labelAccuracy.numberOfReviewerLabels
      ).toFixed(2);
    }
  }

  const csvRows: string[][] = [];

  //First row
  csvRows.push(["", ...allLabelers]);

  //The rest of the rows
  for (const label of allLabels) {
    const row: string[] = [];

    row.push(label);
    for (const labeler of allLabelers) {
      const accuracy =
        (labelerLabelAccuracyMap[labeler] &&
          labelerLabelAccuracyMap[labeler][label]) ||
        "0";

      row.push(accuracy);
    }

    csvRows.push(row);
  }

  return csvRows;
}
