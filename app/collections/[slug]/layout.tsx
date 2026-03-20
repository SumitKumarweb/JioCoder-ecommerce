import type { Metadata } from 'next';
import connectDB from '@/lib/db';
import Collection from '@/models/Collection';
import { WebPageSchema } from '@/components/schemas';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    await connectDB();
    const collection = (await Collection.findOne({ slug })
      .select('name description heroImage slug')
      .lean()) as any;

    if (!collection) {
      return {
        title: 'Collection Not Found',
        robots: { index: false, follow: false },
      };
    }

    const name = collection.name as string;
    const desc =
      (collection.description as string) ||
      `Shop the ${name} collection at JioCoder — handpicked mechanical keyboards, gaming mice, and peripherals. Fast India-wide shipping.`;

    return {
      title: name,
      description: desc,
      keywords: [
        name,
        `buy ${name} India`,
        'mechanical keyboards India',
        'gaming peripherals',
        'JioCoder',
      ],
      alternates: {
        canonical: `/collections/${slug}`,
      },
      openGraph: {
        title: `${name} - JioCoder`,
        description: desc,
        url: `/collections/${slug}`,
        type: 'website',
        images: collection.heroImage
          ? [{ url: collection.heroImage as string, alt: name }]
          : undefined,
      },
      twitter: {
        card: collection.heroImage ? 'summary_large_image' : 'summary',
        title: `${name} - JioCoder`,
        description: desc,
        images: collection.heroImage
          ? [collection.heroImage as string]
          : undefined,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return {
      title: 'Collection',
      alternates: { canonical: `/collections/${slug}` },
    };
  }
}

export default async function CollectionDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let name = 'Collection';
  let description =
    'Curated mechanical keyboards and gaming peripherals at JioCoder — fast India-wide shipping.';

  try {
    await connectDB();
    const col = (await Collection.findOne({ slug }).select('name description').lean()) as {
      name?: string;
      description?: string;
    } | null;
    if (col?.name) name = col.name;
    if (col?.description) description = col.description;
  } catch {
    // keep fallbacks
  }

  return (
    <>
      <WebPageSchema
        path={`/collections/${slug}`}
        type="CollectionPage"
        name={name}
        description={description}
      />
      {children}
    </>
  );
}
