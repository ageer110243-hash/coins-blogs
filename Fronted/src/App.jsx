import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import Navbar from "./components/Navbar.jsx";
import ProfileModal from "./components/ProfileModal.jsx";
import GoogleAuthProvider from "./components/GoogleAuthProvider.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="grid h-svh place-items-center">
        <Loader className="animate-spin text-signal" size={28} />
      </div>
    );
  }

  return (
    <GoogleAuthProvider>
      <div className="min-h-svh bg-paper">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/forgot-password"
            element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />}
          />
          <Route
            path="/reset-password/:token"
            element={!authUser ? <ResetPasswordPage /> : <Navigate to="/" />}
          />
          <Route
            path="/admin"
            element={
              authUser?.role === "admin" ? (
                <AdminPage />
              ) : (
                <Navigate to={authUser ? "/" : "/login"} />
              )
            }
          />
          <Route
            path="/settings"
            element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
          />
        </Routes>
        <ProfileModal />
        <Toaster position="top-center" />
      </div>
    </GoogleAuthProvider>
  );
}

export default App;
