import * as dotenv from "dotenv";
import { me } from "./graphql/me";
import { graphQLClientConstructor } from "./helpers/graphql-client-constructor";
import { uniq } from "lodash";
import Papa from "papaparse";
import fs from "fs";

const OUTPUT_FOLDER = `_output`;

dotenv.config();

async function example() {
  const graphQLClient = await graphQLClientConstructor();
  const user = await me(graphQLClient);

  console.log(user);
}

example().catch((err) => console.log(err));

interface LabelAccuracy {
  label: string;
  accuracy: number;
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
   *    "label1": 0.5,
   *    "label2": 0.2
   *  }
   * }
   *
   */
  const labelerLabelAccuracyMap: Record<string, { [label: string]: number }> =
    {};

  for (const labelerAccuracy of labelerAccuracies) {
    const labeler = labelerAccuracy.labeler;
    for (const labelAccuracy of labelerAccuracy.labelAccuracies) {
      if (!labelerLabelAccuracyMap[labeler]) {
        labelerLabelAccuracyMap[labeler] = {};
      }

      labelerLabelAccuracyMap[labeler][labelAccuracy.label] =
        labelAccuracy.accuracy;
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
        0;
      row.push(accuracy.toFixed(2));
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

const labelerAccuracies = [
  {
    labeler: "labeler1",
    labelAccuracies: [
      { label: "label1", accuracy: 0.5 },
      { label: "label2", accuracy: 0.3 },
      { label: "label3", accuracy: 0.2 },
    ],
  },
  {
    labeler: "labeler2",
    labelAccuracies: [
      { label: "label2", accuracy: 0.2 },
      { label: "label1", accuracy: 0.1 },
      { label: "label3", accuracy: 0.7 },
    ],
  },
  {
    labeler: "labeler3",
    labelAccuracies: [
      { label: "label2", accuracy: 0.1 },
      { label: "label1", accuracy: 0.1 },
      { label: "label3", accuracy: 0.8 },
    ],
  },
];

writeLabelAccuraciesToCSV(labelerAccuracies, "result.csv");
