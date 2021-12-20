import * as dotenv from "dotenv";
import {
  DocumentStatistic,
  DocumentType,
  LabelerAccuracy,
  LabelPairCount,
} from "./label-accuracy/interfaces";
import { getLabelAccuraciesCsvContent } from "./label-accuracy/get-label-accuracies-csv-content";
import { writeToCsv } from "./helpers/write-to-csv";
import { getLabelerAccuracies } from "./label-accuracy/get-labeler-accuracies";
import { getLabelPairCountsStatistic } from "./label-accuracy/get-label-pair-count-statistic";

dotenv.config();

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

const csvContent = getLabelAccuraciesCsvContent(labelerAccuracies);
writeToCsv(csvContent, "result.csv");

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
console.log(getLabelerAccuracies(documentStatistics));

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
