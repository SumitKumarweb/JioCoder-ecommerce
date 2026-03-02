'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ResetPasswordModal from './ResetPasswordModal';
import LoginModal from './LoginModal';

export default function ResetPasswordHandler() {
  const searchParams = useSearchParams();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Check for reset password token or reset parameter in URL
    const token = searchParams.get('token');
    const reset = searchParams.get('reset');
    const resetPassword = searchParams.get('resetPassword');

    // Open modal if any of these parameters exist
    if (token || reset === 'true' || resetPassword === 'true') {
      setIsResetModalOpen(true);
    }
  }, [searchParams]);

  return (
    <>
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onBackToLogin={() => setIsLoginModalOpen(true)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}

