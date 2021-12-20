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
  originId: string;
  documentType: DocumentType;
  ownerDisplayName: string;
}

export interface LabelPairCount {
  firstLabel: string;
  secondLabel: string;
  count: number;
}

export interface AgreementTable {
  firstDocument: TextDocument;
  secondDocument: TextDocument;
  labelPairCounts: LabelPairCount[];
}

export interface DocumentStatistic {
  document: TextDocument;
  labelAccuracies: LabelAccuracy[];
}
