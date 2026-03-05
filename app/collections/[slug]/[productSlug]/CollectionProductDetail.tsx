'use client';

import ProductDetail from '@/components/ProductDetail';

interface CollectionProductDetailProps {
  productId: string;
  collectionSlug: string;
}

export default function CollectionProductDetail({ productId, collectionSlug }: CollectionProductDetailProps) {
  return <ProductDetail productId={productId} collectionSlug={collectionSlug} />;
}

