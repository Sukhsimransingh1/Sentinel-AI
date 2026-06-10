import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShieldAlt, FaEnvelope, FaLock, FaUserPlus, FaSpinner, FaArrowLeft } from "react-icons/fa";

import { loginUser, registerUser } from "../services/authService";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setToken } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await loginUser(email, password);
      } else {
        data = await registerUser(name, email, password);
      }
      setToken(data.access_token);
      navigate("/dashboard");
    } catch {
      setError(isLogin ? "Invalid email or password" : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071226] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Hero */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <Link to="/" className="flex items-center gap-2 mb-8 text-slate-400 hover:text-white transition-colors">
            <FaArrowLeft />
            Back to Home
          </Link>
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-8">
            <FaShieldAlt className="text-4xl" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Sentinel AI</h1>
          <p className="text-xl text-slate-400 mb-8">
            AI-powered disaster intelligence platform for emergency preparedness and response
          </p>
          <div className="space-y-4">
            {[
              "Real-time incident reporting",
              "AI-powered emergency guidance",
              "Image-based disaster detection",
              "Secure and reliable",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-600/20 flex items-center justify-center">
                  <span className="text-cyan-500 text-xs">✓</span>
                </div>
                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <FaArrowLeft />
              Back to Home
            </Link>
          </div>

          <div className="bg-[#0B1D33] border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-slate-400">
                {isLogin ? "Sign in to your account" : "Get started with Sentinel AI"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="text-slate-300 text-sm block mb-2">Full Name</label>
                  <div className="relative">
                    <FaUserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-12 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-slate-300 text-sm block mb-2">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-12 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 text-sm block mb-2">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-12 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 transition rounded-xl py-3.5 font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </>
                ) : (
                  <>{isLogin ? "Sign In" : "Create Account"}</>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className="text-red-500 hover:text-red-400 font-semibold transition-colors"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
