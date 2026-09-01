import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProfileModal from "./components/ProfileModal.jsx";
import GoogleAuthProvider from "./components/GoogleAuthProvider.jsx";
import HomePage from "./pages/HomePage.jsx";
import ExplorePage from "./pages/ExplorePage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import CreatePostPage from "./pages/CreatePostPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminPostsPage from "./pages/admin/AdminPostsPage.jsx";
import AdminBannersPage from "./pages/admin/AdminBannersPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";

// Pages that own their own full-viewport layout — the footer would either
// get pushed off-screen or introduce a second scrollbar, so it's skipped
// on these routes only.
const NO_FOOTER_PREFIXES = ["/chat", "/login", "/signup", "/forgot-password", "/reset-password", "/admin"];
// The admin panel has its own sidebar shell — the public site's top nav
// would just duplicate navigation and eat vertical space there.
const NO_NAVBAR_PREFIXES = ["/admin"];

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const location = useLocation();
  const showFooter = !NO_FOOTER_PREFIXES.some((prefix) => location.pathname.startsWith(prefix));
  const showNavbar = !NO_NAVBAR_PREFIXES.some((prefix) => location.pathname.startsWith(prefix));

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Without this, React Router just swaps the page content in place —
  // if you were scrolled down on the previous page, the new page opens
  // still scrolled down instead of starting at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
        {showNavbar && <Navbar />}
        <div key={location.pathname} className="page-enter">
        <Routes>
          {/* Public directory pages — Home / Explore / About / Post detail
              are browsable without logging in. */}
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />

          {/* Chat keeps its original behavior — just moved from "/" to
              "/chat" now that "/" is the marketing Home page. */}
          <Route
            path="/chat"
            element={authUser ? <ChatPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/create-post"
            element={authUser ? <CreatePostPage /> : <Navigate to="/login" />}
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
                <AdminLayout />
              ) : (
                <Navigate to={authUser ? "/" : "/login"} />
              )
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="posts" element={<AdminPostsPage />} />
            <Route path="banners" element={<AdminBannersPage />} />
          </Route>
          <Route
            path="/settings"
            element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
          />
        </Routes>
        </div>
        {showFooter && <Footer />}
        <ProfileModal />
        <Toaster position="top-center" />
      </div>
    </GoogleAuthProvider>
  );
}

export default App;
