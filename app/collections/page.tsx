import { WebPageSchema } from '@/components/schemas';
import CollectionsHomeClient from './CollectionsHomeClient';

export default function CollectionsPage() {
  return (
    <>
      <WebPageSchema
        path="/collections"
        type="CollectionPage"
        name="Curated Collections - JioCoder"
        description="Explore curated collections of mechanical keyboards, gaming setups, keycaps, and peripherals."
      />
      <CollectionsHomeClient />
    </>
  );
}
