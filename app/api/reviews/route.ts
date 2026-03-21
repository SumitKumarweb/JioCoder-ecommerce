import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import User from '@/models/User';

// ─── GET /api/reviews?productId=xxx ───────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ message: 'productId is required' }, { status: 400 });
  }

  try {
    await connectDB();

    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .lean();

    // Aggregate stats
    const total = reviews.length;
    const avgRating =
      total > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / total) * 10) / 10
        : 0;

    // Distribution: counts for 5→1
    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter((r) => r.rating === star).length;
      return {
        star,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    });

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: String(r._id),
        userName: r.userName,
        userInitials: r.userInitials,
        rating: r.rating,
        comment: r.comment,
        helpfulCount: r.helpfulCount,
        createdAt: r.createdAt,
        userId: r.userId,
      })),
      stats: { total, avgRating, distribution },
    });
  } catch (err) {
    console.error('GET /api/reviews error:', err);
    return NextResponse.json({ message: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// ─── POST /api/reviews ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, userId, rating, comment } = body;

    if (!productId || !userId || !rating || !comment) {
      return NextResponse.json(
        { message: 'productId, userId, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    if (comment.trim().length < 10) {
      return NextResponse.json(
        { message: 'Review must be at least 10 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify the user actually exists
    const user = await User.findById(userId).select('name email').lean();
    if (!user) {
      return NextResponse.json({ message: 'User not found. Please log in again.' }, { status: 401 });
    }

    const userName = (user.name?.trim()) || user.email.split('@')[0];
    const words = userName.split(/\s+/).filter(Boolean);
    const userInitials = words.length >= 2
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : userName.slice(0, 2).toUpperCase();

    // Upsert: update if already reviewed, insert if first time
    const review = await Review.findOneAndUpdate(
      { productId, userId },
      {
        $set: {
          userName,
          userInitials,
          rating: Number(rating),
          comment: comment.trim(),
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({
      message: 'Review submitted successfully',
      review: {
        id: String(review._id),
        userName: review.userName,
        userInitials: review.userInitials,
        rating: review.rating,
        comment: review.comment,
        helpfulCount: review.helpfulCount,
        createdAt: review.createdAt,
        userId: review.userId,
      },
    });
  } catch (err: any) {
    console.error('POST /api/reviews error:', err);
    return NextResponse.json({ message: 'Failed to submit review' }, { status: 500 });
  }
}

// ─── PATCH /api/reviews  (mark helpful) ──────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { reviewId } = await req.json();
    if (!reviewId) {
      return NextResponse.json({ message: 'reviewId is required' }, { status: 400 });
    }

    await connectDB();
    const updated = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ helpfulCount: updated.helpfulCount });
  } catch (err) {
    console.error('PATCH /api/reviews error:', err);
    return NextResponse.json({ message: 'Failed to update review' }, { status: 500 });
  }
}
