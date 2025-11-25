import Navbar from "./components/Navbar";

import { LoginPage, HomePage, SignupPage, ProfilePage } from "./pages/index";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/Auth.Store.js";
import { useThemeStore } from "./store/useTheme.Store.js";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        {/* Redirect authenticated users to the home page */}
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to={authUser ? "/" : "/login"} />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;