/** Browser localStorage keys for logged-in shopper profile (see LoginModal) */
export const LS_USER_ID = 'userId';
export const LS_USER_EMAIL = 'userEmail';
export const LS_USER_NAME = 'userName';
export const LS_USER_AVATAR = 'userAvatar'; // data URL or https image URL
/** Optional JSON array of saved address objects */
export const LS_SAVED_ADDRESSES = 'jiocoder_saved_addresses';

export function defaultAvatarUrl(displayName: string): string {
  const name = displayName.trim() || 'User';
  // Slate-800 bg, neutral professional fallback (matches dashboard palette)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f172a&color=f1f5f9&size=256&bold=true`;
}
