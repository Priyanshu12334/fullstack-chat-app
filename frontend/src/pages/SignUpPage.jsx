import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-base-100 via-base-200/20 to-base-100">
      <div className="w-full max-w-sm space-y-6 bg-base-200/30 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-base-300/80 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <div className="text-center">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessageSquare className="size-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2 text-base-content tracking-tight">Welcome to ChatCrypt</h1>
            <p className="text-sm text-base-content/60 mt-1 max-w-[280px] mx-auto leading-relaxed">
              Create your account and experience fast, secure, and real-time messaging.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium text-xs">Full Name</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="size-4.5 text-base-content/40" />
              </div>
              <input
                type="text"
                className="input input-bordered h-11 w-full !pl-10 rounded-xl text-sm transition-all focus:border-primary"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium text-xs">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="size-4.5 text-base-content/40" />
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
                <Lock className="size-4.5 text-base-content/40" />
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
                  <EyeOff className="size-4.5 text-base-content/40" />
                ) : (
                  <Eye className="size-4.5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary h-11 min-h-0 w-full rounded-xl text-sm font-medium mt-2 transition-all hover:opacity-90" disabled={isSigningUp}>
            {isSigningUp ? (
              <>
                <Loader2 className="size-4.5 animate-spin" />
                Loading...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-base-300/50">
          <p className="text-xs text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
