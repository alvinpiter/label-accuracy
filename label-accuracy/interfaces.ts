export interface LabelAccuracy {
  label: string;
  numberOfMatches: number;
  numberOfReviewerLabels: number;
}

export interface LabelerAccuracy {
  labeler: string;
  labelAccuracies: LabelAccuracy[];
}

export enum DocumentType {
  REVIEW = "REVIEW",
  DOCUMENT = "DOCUMENT",
}

export interface TextDocument {
  id: string;
  type: DocumentType;
  ownerDisplayName: string;
}

export type LabelPairCount = [string, string, number];

export interface AgreementTable {
  firstDocument: TextDocument;
  secondDocument: TextDocument;
  labelPairCounts: LabelPairCount[];
}

export interface DocumentStatistic {
  document: TextDocument;
  labelAccuracies: LabelAccuracy[];
}
