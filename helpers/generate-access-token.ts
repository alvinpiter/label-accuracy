import qs from "qs";
import axios from "axios";

export async function generateAccessToken(
  url: string,
  clientId: string,
  clientSecret: string
) {
  const requestPayload = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  };

  const response = await axios.post(url, qs.stringify(requestPayload), {
    headers: { "content-type": "application/x-www-form-urlencoded" },
    timeout: 10000,
  });

  return response.data.access_token;
}
