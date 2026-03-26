import CommunityHomeClient from './CommunityHomeClient';
import { WebPageSchema } from '@/components/schemas';

export default function CommunityPage() {
  return (
    <>
      <h1 className="sr-only">JioCoder coding community</h1>
      <WebPageSchema
        path="/community"
        name="Coder Community - JioCoder"
        description="Share posts, join coding groups, chat, and connect with other developers on JioCoder."
      />
      <CommunityHomeClient />
    </>
  );
}
