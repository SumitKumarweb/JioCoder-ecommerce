import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Article - JioCoder',
  description:
    'Read in-depth articles about mechanical keyboards, developer tools, and tech setups on JioCoder blog.',
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

