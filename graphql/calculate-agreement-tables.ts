import { gql, GraphQLClient } from "graphql-request";

const CALCULATE_AGREEMENT_TABLES_MUTATION = gql`
  mutation CalculateAgreementTables($teamId: ID!, $projectId: ID!) {
    calculateAgreementTables(teamId: $teamId, projectId: $projectId) {
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
  teamId: string,
  projectId: string
): Promise<string> {
  const response = await graphQLClient.request(
    CALCULATE_AGREEMENT_TABLES_MUTATION,
    { teamId, projectId }
  );

  return response.calculateAgreementTables.id as string;
}
