import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verifies a Google ID token (sent from the frontend's Google Sign-In
// button) and returns its payload — throws if the token is invalid,
// expired, or wasn't issued for our GOOGLE_CLIENT_ID.
export const verifyGoogleToken = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload(); // { sub, email, name, picture, email_verified, ... }
};
