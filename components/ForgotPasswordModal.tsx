'use client';

import { useState, useEffect } from 'react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin?: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }: ForgotPasswordModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
      document.body.style.overflow = 'hidden';
      // Reset state when modal opens
      setEmailSent(false);
      setEmail('');
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
    console.log('Password reset link sent to:', email);
    setEmailSent(true);
  };

  const handleResend = () => {
    setEmailSent(false);
  };

  return (
    <div
      className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 md:p-6 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`relative bg-white w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl modal-shadow p-5 sm:p-6 md:p-8 text-center space-y-6 transform transition-all duration-300 border border-slate-100 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-20"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {!emailSent ? (
          <>
            {/* Background Blur Effects */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none rounded-2xl overflow-hidden">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-green rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-8">
                <div className="bg-accent-green p-2 rounded-xl">
                  <span className="material-symbols-outlined text-primary text-3xl font-bold">
                    keyboard
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-primary">JioCoder</h1>
              </div>

              {/* Heading */}
              <div className="space-y-3 mb-10">
                <h2 className="text-3xl font-bold text-slate-900">Reset your password</h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form className="w-full space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">
                        mail
                      </span>
                    </div>
                    <input
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl block pl-12 p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      id="email"
                      placeholder="e.g. name@example.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  type="submit"
                >
                  Send Reset Link
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-10 pt-8 border-t border-slate-100 w-full">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBackToLogin?.();
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Back to Login
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Success Icon */}
              <div className="relative mx-auto w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                <div className="bg-accent-green/10 p-5 rounded-full">
                  <span className="material-symbols-outlined text-accent-green text-5xl">mail</span>
                </div>
                <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-sm">
                  <span className="material-symbols-outlined text-accent-green text-2xl fill-1">check_circle</span>
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-primary tracking-tight">Check your email</h2>
                <p className="text-slate-500 text-sm leading-relaxed px-4">
                  We've sent a password reset link to{' '}
                  <span className="text-primary font-semibold">{email || 'user@example.com'}</span>. Please check
                  your inbox and follow the instructions.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-4 w-full">
                <button
                  type="button"
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  <img
                    alt="Gmail"
                    className="w-4 h-4"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2Abux5mCjeN_5Ym_7l26Bg2SmHuJl-pSUnqa4df3sP4Kr7NWJnw95cU7jyVFVWHCVMtL9R__dqyul8D0p075RdP5lXYEqnjnBYZxVZYHzVk3CHS8ZD6s4Hzdw42dzj4wu-acN32MMQ07m0RYBh2yJyyZXhoE-9W4URL8ksPbLRdGFFilzIVI5rIDG1lc2oxRT-g1lHLthXqgoJOpn_iC-auHh0ZOG2CdoJQpUVkEdDAQOoFyJ8aAQ4iTsAtyNA6Tcygb_xhguRR33"
                  />
                  Open Gmail
                </button>
                <div className="flex flex-col items-center gap-4">
                  <p className="text-xs text-slate-400">
                    Didn't receive the email?{' '}
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-accent-green font-bold hover:underline"
                    >
                      Resend email
                    </button>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBackToLogin?.();
                    }}
                    className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to login
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

