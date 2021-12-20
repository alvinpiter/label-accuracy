import Papa from "papaparse";
import fs from "fs";

const OUTPUT_FOLDER = `_output`;

export function writeToCsv(csvRows: string[][], csvName: string) {
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
