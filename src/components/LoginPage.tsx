import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, Building2, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  darkMode: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, darkMode }) => {
  const [username, setUsername] = useState('boonhuat7311');
  const [password, setPassword] = useState('boonhuat7311');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (username === 'boonhuat7311' && password === 'boonhuat7311') {
        onLoginSuccess();
      } else {
        setError('Invalid username or password. Please use boonhuat7311 / boonhuat7311.');
        setLoading(false);
      }
    }, 600);
  };

  const handleQuickFill = () => {
    setUsername('boonhuat7311');
    setPassword('boonhuat7311');
    setError('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 ${
      darkMode ? 'bg-[#1E2630] text-[#F3F4F6]' : 'bg-[#F5F7FA] text-[#1F2937]'
    }`}>
      {/* Background Abstract Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl ${
          darkMode ? 'bg-blue-900/20' : 'bg-blue-200/50'
        }`} />
        <div className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl ${
          darkMode ? 'bg-indigo-900/20' : 'bg-sky-200/50'
        }`} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-500/15 rounded-full" />
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className={`p-8 rounded-2xl shadow-xl backdrop-blur-md border transition-all duration-300 ${
          darkMode 
            ? 'bg-[#2A3441]/90 border-[#3A4654] shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
            : 'bg-white/95 border-[#DCE3EA] shadow-[0_10px_30px_rgba(0,0,0,0.05)]'
        }`}>
          {/* Header Logo & Title */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-blue-600 items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
              BH
            </div>
            <div>
              <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-[#F3F4F6]' : 'text-[#1F2937]'}`}>
                Boon Huat Hardware & Supplies
              </h1>
              <p className={`text-xs mt-1 ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
                Enterprise Accounts Payable & AI Resolution System
              </p>
            </div>
          </div>

          {error && (
            <div className={`mb-6 p-3 rounded-xl text-xs flex items-center space-x-2 border ${
              darkMode ? 'bg-red-900/30 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${
                darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'
              }`}>
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border transition-colors focus:outline-none focus:ring-2 ${
                    darkMode 
                      ? 'bg-[#1E2630] border-[#3A4654] text-[#F3F4F6] focus:border-[#4F8EF7] focus:ring-[#4F8EF7]/20' 
                      : 'bg-[#F5F7FA] border-[#DCE3EA] text-[#1F2937] focus:border-[#3B82F6] focus:ring-[#3B82F6]/20'
                  }`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`block text-xs font-semibold uppercase tracking-wider ${
                  darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'
                }`}>
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs font-medium border transition-colors focus:outline-none focus:ring-2 ${
                    darkMode 
                      ? 'bg-[#1E2630] border-[#3A4654] text-[#F3F4F6] focus:border-[#4F8EF7] focus:ring-[#4F8EF7]/20' 
                      : 'bg-[#F5F7FA] border-[#DCE3EA] text-[#1F2937] focus:border-[#3B82F6] focus:ring-[#3B82F6]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleQuickFill}
                className={`text-[11px] font-medium underline transition-colors ${
                  darkMode ? 'text-[#7DB5FF] hover:text-white' : 'text-[#3B82F6] hover:text-blue-800'
                }`}
              >
                Auto-fill credentials
              </button>
              <span className={`text-[11px] ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
                Secure SSL Session
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Enterprise ERP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer security notice */}
          <div className={`mt-8 pt-4 border-t text-center text-[11px] flex items-center justify-center space-x-1.5 ${
            darkMode ? 'border-[#3A4654] text-[#CBD5E1]' : 'border-[#DCE3EA] text-[#6B7280]'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Authorized Personnel Only • Enterprise Audit Logging Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
