'use client';

import { useState, useEffect } from 'react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin?: () => void;
}

export default function ResetPasswordModal({ isOpen, onClose, onBackToLogin }: ResetPasswordModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Password validation checks
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[@#$%^&*]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const isFormValid = hasMinLength && hasNumber && hasSpecialChar && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      // Handle password reset here
      console.log('Password updated successfully');
      // You can add success message or redirect logic here
      onClose();
      onBackToLogin?.();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 sm:p-6 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white w-full max-w-md rounded-2xl modal-shadow border border-slate-100 overflow-hidden transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-accent-green/10 text-accent-green rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl font-bold">lock_reset</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Set New Password</h2>
            <p className="text-slate-500 text-sm mt-2">Create a strong, secure password for your account.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest" htmlFor="new-password">
                New Password
              </label>
              <div className="relative group">
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-accent-green focus:border-accent-green outline-none transition-all placeholder:text-slate-400"
                  id="new-password"
                  placeholder="••••••••"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showNewPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-black uppercase text-slate-400 tracking-widest"
                htmlFor="confirm-password"
              >
                Confirm New Password
              </label>
              <div className="relative group">
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-accent-green focus:border-accent-green outline-none transition-all placeholder:text-slate-400"
                  id="confirm-password"
                  placeholder="••••••••"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200 pb-2 mb-2">
                Password Requirements
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs font-medium">
                  <span
                    className={`material-symbols-outlined text-sm fill-1 ${
                      hasMinLength ? 'text-accent-green' : 'text-slate-400'
                    }`}
                  >
                    {hasMinLength ? 'check_circle' : 'circle'}
                  </span>
                  <span className={hasMinLength ? 'text-slate-600' : 'text-slate-400'}>
                    At least 8 characters
                  </span>
                </li>
                <li className="flex items-center gap-2 text-xs font-medium">
                  <span
                    className={`material-symbols-outlined text-sm fill-1 ${
                      hasNumber ? 'text-accent-green' : 'text-slate-400'
                    }`}
                  >
                    {hasNumber ? 'check_circle' : 'circle'}
                  </span>
                  <span className={hasNumber ? 'text-slate-600' : 'text-slate-400'}>Includes one number</span>
                </li>
                <li className="flex items-center gap-2 text-xs font-medium">
                  <span
                    className={`material-symbols-outlined text-sm ${
                      hasSpecialChar ? 'text-accent-green fill-1' : 'text-slate-400'
                    }`}
                  >
                    {hasSpecialChar ? 'check_circle' : 'circle'}
                  </span>
                  <span className={hasSpecialChar ? 'text-slate-600' : 'text-slate-400'}>
                    One special character (@#$%^&*)
                  </span>
                </li>
                <li className="flex items-center gap-2 text-xs font-medium">
                  <span
                    className={`material-symbols-outlined text-sm ${
                      passwordsMatch ? 'text-accent-green fill-1' : 'text-slate-400'
                    }`}
                  >
                    {passwordsMatch ? 'check_circle' : 'circle'}
                  </span>
                  <span className={passwordsMatch ? 'text-slate-600' : 'text-slate-400'}>Passwords must match</span>
                </li>
              </ul>
            </div>

            <button
              className={`w-full font-bold py-4 rounded-lg transition-all shadow-lg active:scale-[0.98] ${
                isFormValid
                  ? 'bg-accent-green hover:bg-green-600 text-primary shadow-green-500/20'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
              type="submit"
              disabled={!isFormValid}
            >
              Update Password
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBackToLogin?.();
                }}
                className="text-xs font-bold text-slate-400 hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

