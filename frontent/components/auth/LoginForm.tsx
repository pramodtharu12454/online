"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Login successful");

        // Store the token in localStorage (or cookies)
        localStorage.setItem("accessToken", data.accessToken);

        // Optionally store user data
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to home page
        router.push("/");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="border border-black rounded-xl p-8 bg-white shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Sign In
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 border border-black rounded-lg p-6 bg-white"
        >
          {/* Email Field */}
          <div className="space-y-1">
            <label htmlFor="email" className="font-medium text-gray-800">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border border-black rounded w-full py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label htmlFor="password" className="font-medium text-gray-800">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 border border-black rounded w-full py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border border-black" />
              <span className="text-gray-700">Remember me</span>
            </label>
            <a href="/forgot-password" className="text-black hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 rounded transition"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* OR Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white px-2 text-xs text-gray-400 font-semibold">
              OR
            </span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full border border-black text-black hover:bg-gray-100 font-semibold transition"
          >
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full border border-black text-black hover:bg-gray-100 font-semibold transition"
          >
            Continue with Facebook
          </Button>
        </div>

        {/* Sign Up Redirect */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don&#39;t have an account?{" "}
          <a href="/register" className="text-black hover:underline font-bold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
