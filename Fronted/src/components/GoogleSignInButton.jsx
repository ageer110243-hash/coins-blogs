import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore.js";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function GoogleSignInButton() {
  const googleLogin = useAuthStore((s) => s.googleLogin);

  // Silently renders nothing if Google Sign-In isn't configured, instead of
  // showing a broken/disabled button.
  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <>
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs text-ink-faint">or continue with</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (!credentialResponse.credential) {
              toast.error("Google sign-in didn't return a credential");
              return;
            }
            googleLogin(credentialResponse.credential);
          }}
          onError={() => toast.error("Google sign-in failed")}
          theme="outline"
          shape="pill"
          width="320"
        />
      </div>
    </>
  );
}

export default GoogleSignInButton;
