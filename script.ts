import * as dotenv from "dotenv";
import { AgreementTable } from "./label-accuracy/interfaces";
import { getLabelAccuraciesCsvContent } from "./label-accuracy/get-label-accuracies-csv-content";
import { OUTPUT_FOLDER, writeToCsv } from "./helpers/write-to-csv";
import { getLabelerAccuracies } from "./label-accuracy/get-labeler-accuracies";
import { graphQLClientConstructor } from "./helpers/graphql-client-constructor";
import { calculateAgreementTables } from "./graphql/calculate-agreement-tables";
import { getJob, JobStatus } from "./graphql/get-job";
import { getDocumentStatistics } from "./label-accuracy/get-document-statistics";

dotenv.config();

async function main() {
  const projectId = process.argv[2];
  if (projectId === undefined) {
    throw new Error("Project ID is not set");
  }

  console.log("\nInitiating GraphQL client...");
  const graphQLClient = await graphQLClientConstructor();
  console.log("GraphQL client is ready.");

  console.log(`\nFetching labels agreement tables for project ${projectId}...`);
  const jobId = await calculateAgreementTables(graphQLClient, projectId);

  let agreementTables: AgreementTable[] = [];
  while (true) {
    console.log(`Waiting for the labels agreement tables to be ready...`);

    const job = await getJob(graphQLClient, jobId);
    if (job.status === JobStatus.DELIVERED) {
      console.log("Labels agreement tables are ready.");
      agreementTables = job.result! as AgreementTable[];
      break;
    }

    if (job.status === JobStatus.FAILED) {
      throw new Error(`An error occured: ${JSON.stringify(job.errors)}`);
    }

    //sleep for 200ms
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log(`\nCalculating labels accuracy matrix...`);
  const documentStatistics = getDocumentStatistics(agreementTables);
  const labelerAccuracies = getLabelerAccuracies(documentStatistics);
  console.log(`Labels accuracy matrix is ready.`);

  const csvName = `labels-accuracy-matrix-${projectId}.csv`;
  const csvPath = `${OUTPUT_FOLDER}/${csvName}`;
  console.log(`\nWriting the labels accuracy matrix to ${csvPath}...`);
  const csvContent = getLabelAccuraciesCsvContent(labelerAccuracies);
  writeToCsv(csvContent, csvName);
  console.log(`The labels accuracy matrix is available at ${csvPath}.`);
  console.log();
}

main();
