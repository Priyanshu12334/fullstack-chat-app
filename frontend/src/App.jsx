import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader, MessageSquare, ShieldCheck } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div data-theme={theme} className="flex flex-col items-center justify-between h-screen bg-base-100 text-base-content p-8 transition-colors duration-300">
        <div></div>

        <div className="flex flex-col items-center gap-6 max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-pulse shadow-sm">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-base-content">ChatCrypt</h1>
            <p className="text-sm text-base-content/60 mt-1">Simple. Secure. Realtime.</p>
          </div>
          
          <div className="flex flex-col items-center gap-3 mt-4">
            <Loader className="size-6 animate-spin text-primary" />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-base-content/75 block">Verifying your session...</span>
              <span className="text-[11px] text-base-content/45 max-w-[250px] block leading-relaxed">
                Establishing a secure connection...
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-base-content/50">
          <ShieldCheck className="size-4 text-primary" />
          <span>Secure Authentication</span>
        </div>
      </div>
    );

  return (
    <div data-theme={theme} className="overflow-x-hidden">
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;
