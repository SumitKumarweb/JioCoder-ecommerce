'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export function useResetPasswordModal() {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check for reset password token or reset parameter in URL
    const token = searchParams.get('token');
    const reset = searchParams.get('reset');
    const resetPassword = searchParams.get('resetPassword');

    // Open modal if any of these parameters exist
    if (token || reset === 'true' || resetPassword === 'true') {
      setIsOpen(true);
    }
  }, [searchParams]);

  return {
    isOpen,
    setIsOpen,
  };
}

