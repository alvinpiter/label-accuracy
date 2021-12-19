import { generateAccessToken } from "./generate-access-token";
import { GraphQLClient } from "graphql-request";

export async function graphQLClientConstructor() {
  const host = process.env.DATASAUR_HOST!;
  const clientId = process.env.CLIENT_ID!;
  const clientSecret = process.env.CLIENT_SECRET!;

  const accessToken = await generateAccessToken(
    `${host}/api/oauth/token`,
    clientId,
    clientSecret
  );

  return new GraphQLClient(`${host}/graphql`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
}
