"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-[#D4A843] to-[#FFE699] bg-clip-text text-transparent mb-2">
            Lumière
          </h1>
          <p className="text-sm text-[#6B6B6B]">Admin Login</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#1A1A1A] border border-white/5 p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#6B6B6B] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lumiere.com"
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-white/5 text-white text-sm focus:outline-none focus:border-[#D4A843]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#6B6B6B] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-white/5 text-white text-sm focus:outline-none focus:border-[#D4A843]/50 transition-colors"
              />
            </div>
            <button className="w-full mt-2 py-4 bg-gradient-to-r from-[#D4A843] to-[#B8922E] text-black font-semibold text-sm uppercase tracking-wider rounded-full hover:shadow-[0_0_40px_rgba(212,168,67,0.3)] transition-all duration-500">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
