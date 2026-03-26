import { WebPageSchema } from '@/components/schemas';
import CollectionsHomeClient from './CollectionsHomeClient';

export default function CollectionsPage() {
  return (
    <>
      <h1 className="sr-only">Browse JioCoder collections</h1>
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
