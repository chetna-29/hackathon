import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const AuthPage: React.FC = () => {
  const { role } = useParams<{ role: string }>(); // 'responder' or 'citizen'
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const isResponder = role === "responder";

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (isResponder) {
      navigate("/dashboard");
    } else {
      navigate("/citizen");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-4 font-sans text-gray-900 dark:text-gray-100 selection:bg-blue-100">
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:text-gray-100 text-sm font-medium transition-colors"
      >
        ← Back
      </button>

      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-medium tracking-tight mb-2">
            {isResponder ? "Responder sign in" : "Citizen sign in"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {isLogin ? "Enter your credentials to continue." : "Create a new account."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          )}

          {isResponder ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Organization ID
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone or Email
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors mt-2"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:text-gray-100 transition-colors"
          >
            {isLogin
              ? "Don't have an account? Create one."
              : "Already have an account? Sign in."}
          </button>
        </div>
      </div>
    </div>
  );
};
