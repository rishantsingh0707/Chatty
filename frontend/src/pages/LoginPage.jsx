import { useState } from "react";
import { useAuthStore } from "../store/Auth.Store.js";
import AuthImagePattern from "../components/AuthImagePattern";
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
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className=" max-w-md bg-[hsl(225,25%,16%)] w-sm p-6 rounded-xl space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-[hsl(225,27%,20%)] flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="size-8 text-[hsl(239,42%,59%)] hover:cursor-pointer" />
              </div>
              <h1 className="text-2xl font-bold mt-2 text-[hsl(214,9%,69%)]">Welcome Back</h1>
              <p className="text-base-content/60 text-[hsl(214,9%,69%)]">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[hsl(214,9%,69%)]">Email</span>
              </label>
              <div className="relative border-2 rounded border-[hsl(214,9%,69%)]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                  <Mail className="h-5 w-5 text-base-content/40 text-[hsl(214,9%,69%)]" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10 text-[hsl(214,9%,69%)]`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[hsl(214,9%,69%)]">Password</span>
              </label>
              <div className="relative border-2 rounded border-[hsl(214,9%,69%)]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                  <Lock className="h-5 w-5 text-base-content/40 text-[hsl(214,9%,69%)]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10 text-[hsl(214,9%,69%)]`}
                  placeholder="••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[hsl(214,9%,69%)]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn font-medium btn-primary w-full bg-[hsl(239,42%,59%)] text-[hsl(214,9%,69%)] rounded border-[hsl(239,42%,54%)] hover:bg-[hsl(239,42%,69%)] hover:text-black" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-4 animate-spin justify-center" />
                  <span>Loading...</span>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60 text-[hsl(214,9%,69%)]">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary hover:underline text-[hsl(239,42%,59%)] ">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <div className="hidden lg:flex flex-col justify-center items-center gap-10 bg-gray-800">
        <AuthImagePattern
          boxWidth="100px"
          boxHeight="100px"
          gap="10px"
          gridCols={3}
          borderRadius="rounded-lg"
        />
        <h2 className="text-2xl font-bold text-[hsl(214,9%,69%)]">Join our community</h2>
        <p className="text-base-content/60 text-[hsl(214,9%,69%)]">Connect with friends, share moments, and stay in touch with your loved ones.</p>
      </div>
    </div>
  );
};
export default LoginPage;