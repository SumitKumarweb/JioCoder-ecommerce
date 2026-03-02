'use client';

import { useState, useEffect } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onForgotPassword?: () => void;
}

export default function LoginModal({ isOpen, onClose, onForgotPassword }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = '';
      }, 300);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(`${activeTab} form submitted`);
  };

  return (
    <div
      className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 md:p-6 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* Main Modal Container */}
      <div
        className={`bg-white w-full max-w-[1000px] h-[95vh] max-h-[95vh] sm:max-h-[650px] flex flex-col md:flex-row overflow-hidden rounded-t-2xl sm:rounded-xl modal-shadow transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Pane: Branding & Visuals (40%) */}
        <div className="hidden md:flex flex-col justify-between w-[40%] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 relative overflow-hidden">
          {/* Abstract background pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"></path>
                </pattern>
              </defs>
              <rect fill="url(#grid)" height="100%" width="100%"></rect>
            </svg>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="bg-primary p-1.5 rounded-lg">
                <span className="material-symbols-outlined text-slate-900 text-2xl font-bold">
                  bolt
                </span>
              </div>
              <h1 className="text-white text-2xl font-bold tracking-tight">JioCoder</h1>
            </div>
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              Join the Community
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              Get exclusive access to the latest tech drops and limited editions in India.
            </p>
          </div>
          <div className="relative z-10 mt-auto">
            {/* Illustrative Keyboard Icon / Visual */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-primary text-6xl mb-4">
                keyboard
              </span>
              <div className="text-center">
                <p className="text-white font-medium">Mechanical Masterpieces</p>
                <p className="text-slate-400 text-sm">Curated collection for enthusiasts</p>
              </div>
            </div>
            <div className="mt-8 flex gap-2">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <div className="h-1 w-4 bg-slate-700 rounded-full"></div>
              <div className="h-1 w-4 bg-slate-700 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Pane: Authentication Form (60%) */}
        <div className="flex-1 flex flex-col bg-white p-5 sm:p-6 md:p-8 lg:p-14 overflow-y-auto min-h-0">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 mb-10">
            <button
              onClick={() => setActiveTab('login')}
              className={`pb-4 px-6 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'login'
                  ? 'border-primary text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`pb-4 px-6 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'signup'
                  ? 'border-primary text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Signup
            </button>
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-slate-500 mb-8">
              {activeTab === 'login'
                ? 'Please enter your details to access your account.'
                : 'Sign up to get started with JioCoder.'}
            </p>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {activeTab === 'signup' && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                      person
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="John Doe"
                      type="text"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                    mail
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="name@company.com"
                    type="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  {activeTab === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onForgotPassword?.();
                      }}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                    lock
                  </span>
                  <input
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {activeTab === 'signup' && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                      lock
                    </span>
                    <input
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      required
                    />
                  </div>
                </div>
              )}

              <button
                className="w-full bg-primary hover:bg-primary/90 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] mt-4"
                type="submit"
              >
                {activeTab === 'login' ? 'Login to JioCoder' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-400 font-medium tracking-widest">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <img
                  alt="Google"
                  className="w-5 h-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVwhD4OysbarwOAvsTY1JW-mS11Pna-6-vbdxV9w4YSuGX-vex8on885yW5I-SPLsCHyi0mxU9P92PwNdhgnTz2o91vtzc9_U880HUXd1cysBrAe7IAjZNxgl3n4QrHR8LPcc-vg_sG4irolMQSsoovdegzD4UsvjGi2JiPisB3y0Djet9dlXTV9B6jx5gMx7xmnJNDNqEBDPgQ7OZsIL676C6ZFp8cqpyxvROoLphzHDs6NJVGHDYCuE0pi4mW6JBFN4dBbW6MlXy"
                />
                <span className="text-sm font-bold text-slate-700">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl text-slate-900">ios</span>
                <span className="text-sm font-bold text-slate-700">Apple</span>
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {activeTab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
                className="text-primary font-bold hover:underline"
              >
                {activeTab === 'login' ? 'Create an account' : 'Login'}
              </button>
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors z-50"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
      </div>
    </div>
  );
}

