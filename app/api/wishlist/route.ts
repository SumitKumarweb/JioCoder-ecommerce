import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Wishlist from '@/models/Wishlist';
import User from '@/models/User';

// Get user's wishlist
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get user ID from Authorization header or query param
    const authHeader = req.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '') || req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID required' }, { status: 401 });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let wishlist = await Wishlist.findOne({ userId }).lean();

    if (!wishlist) {
      // Create empty wishlist if doesn't exist
      const newWishlist = await Wishlist.create({ userId, productIds: [] });
      wishlist = newWishlist.toObject();
    }

    return NextResponse.json({ productIds: wishlist.productIds || [] });
  } catch (error) {
    console.error('GET /wishlist failed:', error);
    return NextResponse.json({ message: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

// Add product to wishlist
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { productId, userId } = body;

    if (!productId || !userId) {
      return NextResponse.json({ message: 'Product ID and User ID required' }, { status: 400 });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, productIds: [productId] });
    } else {
      // Add product if not already in wishlist
      if (!wishlist.productIds.includes(productId)) {
        wishlist.productIds.push(productId);
        await wishlist.save();
      }
    }

    return NextResponse.json({ productIds: wishlist.productIds });
  } catch (error) {
    console.error('POST /wishlist failed:', error);
    return NextResponse.json({ message: 'Failed to add to wishlist' }, { status: 500 });
  }
}

// Remove product from wishlist
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const userId = searchParams.get('userId');

    if (!productId || !userId) {
      return NextResponse.json({ message: 'Product ID and User ID required' }, { status: 400 });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return NextResponse.json({ productIds: [] });
    }

    wishlist.productIds = wishlist.productIds.filter((id) => id !== productId);
    await wishlist.save();

    return NextResponse.json({ productIds: wishlist.productIds });
  } catch (error) {
    console.error('DELETE /wishlist failed:', error);
    return NextResponse.json({ message: 'Failed to remove from wishlist' }, { status: 500 });
  }
}

// Sync localStorage wishlist with server (when user logs in)
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, productIds } = body;

    if (!userId || !Array.isArray(productIds)) {
      return NextResponse.json({ message: 'User ID and productIds array required' }, { status: 400 });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, productIds });
    } else {
      // Merge: add localStorage items that aren't already in server wishlist
      const mergedIds = [...new Set([...wishlist.productIds, ...productIds])];
      wishlist.productIds = mergedIds;
      await wishlist.save();
    }

    return NextResponse.json({ productIds: wishlist.productIds });
  } catch (error) {
    console.error('PUT /wishlist failed:', error);
    return NextResponse.json({ message: 'Failed to sync wishlist' }, { status: 500 });
  }
}

