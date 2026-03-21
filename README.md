This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Backend API

This project uses **Next.js Route Handlers** as its backend with **MongoDB** for database storage.

### MongoDB Setup

**Project Details:**
- **Project Name**: JioCoder
- **Project ID**: `69a6bf316c74219f0cc1ad19`
- **Timezone**: `+05:30` (New Delhi, India)
- **Default Database**: `jiocoder`

1. **Install dependencies** (already done):
   ```bash
   npm install mongoose
   ```

2. **Configure MongoDB connection**:
   - Create a `.env.local` file in the root directory
   - Add your MongoDB Atlas connection string:
     ```env
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/jiocoder?retryWrites=true&w=majority
     ```
   - **Get your connection string from MongoDB Atlas**:
     1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
     2. Select your cluster (Project: JioCoder)
     3. Click "Connect" → "Connect your application"
     4. Copy the connection string
     5. Replace `<password>` with your database user password
     6. Replace `<database-name>` with `jiocoder` (or your preferred database name)
   - For **local MongoDB**: Use `mongodb://localhost:27017/jiocoder`

3. **Database connection**:
   - Connection utility: `lib/db.ts`
   - Configuration: `config/database.ts` (contains project-specific settings)
   - Automatically handles connection caching and reconnection
   - Configured for India timezone (+05:30, Asia/Kolkata)
   - Used in all API routes

### API Endpoints

- **Health check**
  - **URL**: `/api/health`
  - **Method**: `GET`
  - **Description**: Returns server status, database connection status, uptime, and timestamp.

- **Products**
  - **URL**: `/api/products`
  - **Method**: `GET`
  - **Description**: Returns products list (currently using sample data, ready for MongoDB integration).

### Running the backend

Backend APIs are served by the Next.js dev server:

```bash
npm run dev
```

Then visit `http://localhost:3000/api/health` or `http://localhost:3000/api/products`.

### Using MongoDB Models

Example model is available at `models/Product.ts`. To use it in your API routes:

```typescript
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  await connectDB();
  const products = await Product.find({});
  return NextResponse.json({ products });
}
```

### SEO verification (optional)

Add to `.env.local` (values from Google Search Console, Yandex, Bing Webmaster):

```env
GOOGLE_SITE_VERIFICATION=your-google-token
YANDEX_SITE_VERIFICATION=your-yandex-token
BING_SITE_VERIFICATION=your-bing-msvalidate-token
```

Also set `NEXT_PUBLIC_SITE_URL` to your canonical origin (e.g. `https://www.jiocoder.com`) for metadata, sitemap, and structured data.

The root layout sets **`alternates.languages`** (`en-IN`, `x-default`) and Open Graph **`alternateLocale`** for clearer international signals. Key section pages (`/code`, `/studio`, `/code/*`) mirror the same pattern where configured.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Community group chat (Socket.IO)

Group messages use **Socket.IO** for real-time delivery when you run the custom server:

- **Dev / prod**: `npm run dev` and `npm start` run `tsx server.ts` (Next.js + Socket.IO on the same port, default `3000`).
- **Without sockets**: `npm run dev:next-only` uses plain `next dev` — chat falls back to REST + ~15s polling (no instant updates).
- **Deploy**: Serverless platforms (e.g. Vercel) cannot run this WebSocket server. Host on a **Node** process (VPS, Railway, Render, Docker) with `npm run build && npm start`.
- **Separate API domain**: set `NEXT_PUBLIC_SOCKET_URL` to your site origin (e.g. `https://api.example.com`) so the browser connects to the correct host.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
