/** localStorage keys for JioCoder Studio checkout (custom print orders) */
export const STUDIO_DRAFT_KEY = 'studioOrderDraft';
export const STUDIO_CHECKOUT_FORM_KEY = 'studioCheckoutFormData';
export const STUDIO_PAYMENT_KEY = 'studioPaymentData';

export interface StudioOrderDraft {
  designImageUrl: string;
  designImageName: string;
  size: string;
  material: string;
  overlayText?: string;
  overlayFont: string;
  overlayColor: string;
  price: number;
  quantity: number;
  total: number;
}

export interface StudioCheckoutFormData {
  fullName: string;
  email: string;
  mobile: string;
  pinCode: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  addressType: string;
}

export function loadStudioDraft(): StudioOrderDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STUDIO_DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as StudioOrderDraft;
    if (!d?.designImageUrl || !d.size || typeof d.total !== 'number') return null;
    return d;
  } catch {
    return null;
  }
}

export function clearStudioCheckoutStorage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STUDIO_DRAFT_KEY);
  localStorage.removeItem(STUDIO_CHECKOUT_FORM_KEY);
  localStorage.removeItem(STUDIO_PAYMENT_KEY);
}
