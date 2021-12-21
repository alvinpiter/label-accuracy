import { gql, GraphQLClient } from "graphql-request";

const GET_JOB_QUERY = gql`
  query GetJob($jobId: String!) {
    getJob(jobId: $jobId) {
      id
      status
      errors {
        id
        stack
        args
      }
      result
    }
  }
`;

export enum JobStatus {
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
  NONE = "NONE",
  QUEUED = "QUEUED",
  IN_PROGRESS = "IN_PROGRESS",
}

interface JobError {
  id: string;
  stack: string;
  args: unknown;
}

interface Job {
  id: string;
  status: JobStatus;
  errors: JobError[];
  result?: unknown;
}

export async function getJob(
  graphQLClient: GraphQLClient,
  jobId: string
): Promise<Job> {
  const response = await graphQLClient.request(GET_JOB_QUERY, { jobId });
  return response.getJob as Job;
}
