import { gql, GraphQLClient } from "graphql-request";

const ME_QUERY = gql`
  query Me {
    me {
      email
      username
      name
    }
  }
`;

interface User {
  email: string;
  username?: string;
  name?: string;
}

export async function me(graphQLClient: GraphQLClient): Promise<User> {
  const response = await graphQLClient.request(ME_QUERY);
  return response.me as User;
}
