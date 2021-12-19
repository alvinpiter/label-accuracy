import * as dotenv from "dotenv";
import { me } from "./graphql/me";
import { graphQLClientConstructor } from "./helpers/graphql-client-constructor";

dotenv.config();

async function example() {
  const graphQLClient = await graphQLClientConstructor();
  const user = await me(graphQLClient);

  console.log(user);
}

example().catch((err) => console.log(err));
