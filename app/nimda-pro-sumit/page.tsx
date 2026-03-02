import { redirect } from 'next/navigation';

export const metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function AdminPage() {
  redirect('/nimda-pro-sumit/login');
}
