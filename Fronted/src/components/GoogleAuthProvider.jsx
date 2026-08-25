import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Google Sign-In only works once a Google Cloud OAuth Client ID is set in
// VITE_GOOGLE_CLIENT_ID. Without it, we skip the provider entirely so the
// rest of the app (email/password auth) keeps working — GoogleSignInButton
// checks the same env var and simply doesn't render itself either.
function GoogleAuthProvider({ children }) {
  if (!GOOGLE_CLIENT_ID) return children;
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}

export default GoogleAuthProvider;
