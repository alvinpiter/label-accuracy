import * as dotenv from "dotenv";
import { groupBy, uniq } from "lodash";
import Papa from "papaparse";
import fs from "fs";

const OUTPUT_FOLDER = `_output`;

dotenv.config();

interface LabelAccuracy {
  label: string;
  numberOfMatches: number;
  numberOfReviewerLabels: number;
}

interface LabelerAccuracy {
  labeler: string;
  labelAccuracies: LabelAccuracy[];
}

function writeLabelAccuraciesToCSV(
  labelerAccuracies: LabelerAccuracy[],
  csvName: string
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

  const csvContentAsString = Papa.unparse(csvRows);

  try {
    if (!fs.existsSync(OUTPUT_FOLDER)) {
      fs.mkdirSync(OUTPUT_FOLDER);
    }

    fs.writeFileSync(`${OUTPUT_FOLDER}/${csvName}`, csvContentAsString);
  } catch (err) {
    console.log(`Error while writing CSV: ${JSON.stringify(err)}`);
  }
}

const labelerAccuracies: LabelerAccuracy[] = [
  {
    labeler: "labeler1",
    labelAccuracies: [
      { label: "label1", numberOfMatches: 5, numberOfReviewerLabels: 10 },
      { label: "label2", numberOfMatches: 3, numberOfReviewerLabels: 10 },
      { label: "label3", numberOfMatches: 2, numberOfReviewerLabels: 10 },
    ],
  },
  {
    labeler: "labeler2",
    labelAccuracies: [
      { label: "label2", numberOfMatches: 2, numberOfReviewerLabels: 10 },
      { label: "label1", numberOfMatches: 1, numberOfReviewerLabels: 10 },
      { label: "label3", numberOfMatches: 7, numberOfReviewerLabels: 10 },
    ],
  },
  {
    labeler: "labeler3",
    labelAccuracies: [
      { label: "label2", numberOfMatches: 1, numberOfReviewerLabels: 10 },
      { label: "label1", numberOfMatches: 1, numberOfReviewerLabels: 10 },
      { label: "label3", numberOfMatches: 8, numberOfReviewerLabels: 10 },
    ],
  },
];

writeLabelAccuraciesToCSV(labelerAccuracies, "result.csv");

enum DocumentType {
  REVIEW = "REVIEW",
  DOCUMENT = "DOCUMENT",
}

interface TextDocument {
  id: string;
  originId: string;
  documentType: DocumentType;
  ownerDisplayName: string;
}

interface LabelPairCount {
  firstLabel: string;
  secondLabel: string;
  count: number;
}

interface AgreementTable {
  firstDocument: TextDocument;
  secondDocument: TextDocument;
  labelPairCounts: LabelPairCount[];
}

interface DocumentStatistic {
  document: TextDocument;
  labelAccuracies: LabelAccuracy[];
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

function getLabelerAccuracies(
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

const documentStatistics: DocumentStatistic[] = [
  {
    document: {
      id: "doc1",
      originId: "origin",
      documentType: DocumentType.DOCUMENT,
      ownerDisplayName: "alvin",
    },
    labelAccuracies: [
      { label: "label1", numberOfMatches: 1, numberOfReviewerLabels: 2 },
      { label: "label2", numberOfMatches: 1, numberOfReviewerLabels: 1 },
    ],
  },
  {
    document: {
      id: "doc1",
      originId: "origin",
      documentType: DocumentType.DOCUMENT,
      ownerDisplayName: "alvin",
    },
    labelAccuracies: [
      { label: "label1", numberOfMatches: 2, numberOfReviewerLabels: 3 },
      { label: "label3", numberOfMatches: 3, numberOfReviewerLabels: 3 },
    ],
  },
];

console.log("Labeler accuracy");
console.log(getLabelerAccuracy(documentStatistics));

function getDocumentStatistics(
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

function getLabelPairCountsStatistic(labelPairCounts: LabelPairCount[]) {
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

const labelPairCounts: LabelPairCount[] = [
  { firstLabel: "first", secondLabel: "second", count: 1 },
  { firstLabel: "first", secondLabel: "third", count: 2 },
  { firstLabel: "fourth", secondLabel: "second", count: 3 },
  { firstLabel: "fourth", secondLabel: "third", count: 4 },
  { firstLabel: "fifth", secondLabel: "fifth", count: 16 },
];

console.log("Label pair count statistic");
console.log(getLabelPairCountsStatistic(labelPairCounts));

const projectId = process.argv[2];
if (projectId === undefined) {
  throw new Error("Project ID is not set");
}

console.log(`Project ID: ${projectId}`);
