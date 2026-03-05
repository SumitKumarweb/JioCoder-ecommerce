import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CommunityVideo from "@/models/CommunityVideo";

// Helper function to extract YouTube video ID
function extractYouTubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Only fetch published videos for public display
    const videos = await CommunityVideo.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(12) // Limit to 12 videos for homepage
      .lean();

    // Transform CommunityVideo to match CommunityReview interface expected by the component
    const reviews = videos.map((video) => ({
      _id: video._id,
      authorName: video.uploadedBy,
      content: video.description || video.title,
      rating: 5, // Default rating
      image: video.thumbnailUrl || (video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be') 
        ? `https://img.youtube.com/vi/${extractYouTubeId(video.videoUrl)}/maxresdefault.jpg`
        : video.videoUrl), // Use thumbnail or generate YouTube thumbnail
      videoUrl: video.videoUrl, // Store video URL for linking
      likes: video.likes.toString() || '0',
      comments: 0, // Can be added later if needed
    }));

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("GET /community-reviews failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch community reviews" },
      { status: 500 }
    );
  }
}
