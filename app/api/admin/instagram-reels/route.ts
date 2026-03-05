import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import InstagramReel from "@/models/InstagramReel";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};
    if (status) {
      query.status = status;
    }

    const reels = await InstagramReel.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(reels);
  } catch (error) {
    console.error("Admin GET /instagram-reels failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch reels" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    // Handle different input formats: full URL (reel/post/profile), username, or username with @
    let instagramUrl = (body.instagramUrl || '').trim();
    let username = (body.username || '').trim();

    console.log('Received Instagram URL:', instagramUrl);
    console.log('Received username:', username);

    // If instagramUrl is provided, validate and extract username
    if (instagramUrl) {
      // Check if it's a full URL
      if (instagramUrl.includes('instagram.com')) {
        // For reel URLs: https://www.instagram.com/reel/DPbeVJoia4C/
        // For post URLs: https://www.instagram.com/p/DPbeVJoia4C/
        // For profile URLs: https://www.instagram.com/username/
        
        // Check if it's a reel or post URL (these don't have username in the path)
        if (instagramUrl.includes('/reel/') || instagramUrl.includes('/p/')) {
          // For reel/post URLs, use the provided username or default
          if (!username) {
            username = '@jiocoder';
          }
          // Keep the URL as-is (it's already a valid reel/post URL)
          // Ensure URL is properly formatted
          if (!instagramUrl.startsWith('http')) {
            instagramUrl = `https://${instagramUrl}`;
          }
          console.log('Detected reel/post URL, keeping as-is:', instagramUrl);
        } else {
          // For profile URLs, extract username
          const match = instagramUrl.match(/instagram\.com\/([^\/\?]+)/);
          if (match && match[1] && !['reel', 'p', 'tv'].includes(match[1])) {
            const extractedUsername = match[1].replace('@', '');
            username = username || `@${extractedUsername}`;
          } else if (!username) {
            username = '@jiocoder';
          }
        }
      } else {
        // If it's not a full URL, treat it as a username and create URL
        const cleanUsername = instagramUrl.replace('@', '').trim();
        instagramUrl = `https://www.instagram.com/${cleanUsername}/`;
        username = username || `@${cleanUsername}`;
      }
    } else if (username) {
      // If only username is provided, create profile URL
      const cleanUsername = username.replace('@', '').trim();
      instagramUrl = `https://www.instagram.com/${cleanUsername}/`;
      username = username.startsWith('@') ? username : `@${username}`;
    } else {
      return NextResponse.json(
        { message: "Instagram URL or username is required" },
        { status: 400 }
      );
    }

    // Ensure username has @ prefix
    if (username && !username.startsWith('@')) {
      username = `@${username}`;
    }

    // Default username if still not set
    if (!username) {
      username = '@jiocoder';
    }

    console.log('Final Instagram URL:', instagramUrl);
    console.log('Final username:', username);

    const reel = await InstagramReel.create({
      title: body.title,
      instagramUrl: instagramUrl, // Use processed URL
      thumbnailUrl: body.thumbnailUrl || "",
      username: username || "@jiocoder",
      views: body.views || 0,
      likes: body.likes || 0,
      comments: body.comments || 0,
      shares: body.shares || 0,
      postedAt: body.postedAt ? new Date(body.postedAt) : new Date(),
      status: body.status || "active",
    });

    return NextResponse.json(reel, { status: 201 });
  } catch (error: any) {
    console.error("Admin POST /instagram-reels failed:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create reel" },
      { status: 500 }
    );
  }
}

