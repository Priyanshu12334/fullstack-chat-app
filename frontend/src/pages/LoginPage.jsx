import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-base-100 via-base-200/20 to-base-100">
      <div className="w-full max-w-sm space-y-6 bg-base-200/30 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-base-300/80 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <div className="text-center">
          <div className="flex flex-col items-center gap-2 group">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2 text-base-content tracking-tight">Welcome Back</h1>
            <p className="text-sm text-base-content/60 mt-1 max-w-[280px] mx-auto leading-relaxed">
              Sign in to ChatCrypt and continue your secure conversations in real time.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium text-xs">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4.5 w-4.5 text-base-content/40" />
              </div>
              <input
                type="email"
                className="input input-bordered h-11 w-full !pl-10 rounded-xl text-sm transition-all focus:border-primary"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium text-xs">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4.5 w-4.5 text-base-content/40" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered h-11 w-full !pl-10 rounded-xl text-sm transition-all focus:border-primary"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4.5 w-4.5 text-base-content/40" />
                ) : (
                  <Eye className="h-4.5 w-4.5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary h-11 min-h-0 w-full rounded-xl text-sm font-medium mt-2 transition-all hover:opacity-90" disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-base-300/50">
          <p className="text-xs text-base-content/60">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="link link-primary font-medium">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
