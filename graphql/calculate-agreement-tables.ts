import { gql, GraphQLClient } from "graphql-request";

const CALCULATE_AGREEMENT_TABLES_MUTATION = gql`
  mutation CalculateAgreementTables($projectId: ID!) {
    calculateAgreementTables(projectId: $projectId) {
      id
    }
  }
`;

/**
 *
 * @param graphQLClient
 * @returns a string denoting job ID
 */
export async function calculateAgreementTables(
  graphQLClient: GraphQLClient,
  projectId: string
): Promise<string> {
  const response = await graphQLClient.request(
    CALCULATE_AGREEMENT_TABLES_MUTATION,
    { projectId }
  );

  return response.calculateAgreementTables.id as string;
}
