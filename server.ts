/**
 * Custom Next.js + Socket.IO server (required for real-time group chat).
 *
 * Run: `npm run dev` or `npm start` (after `npm run build`).
 * Plain `next dev` will NOT start Socket.IO — use this entrypoint.
 *
 * Serverless hosts (e.g. Vercel) do not support this pattern; use a Node VPS, Railway, Render, etc.
 */

import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { setSocketIO } from "./lib/socketSingleton";
import { registerGroupChatSocket } from "./lib/groupChatSocket";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url || "", true);
    void handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    path: "/socket.io/",
    cors: { origin: true, credentials: true },
    addTrailingSlash: false,
  });

  setSocketIO(io);
  registerGroupChatSocket(io);

  httpServer.listen(port, hostname, () => {
    console.log(`[jiocoder] Ready on http://${hostname}:${port} (Socket.IO at /socket.io/)`);
  });

  httpServer.on("error", (err) => {
    console.error("[jiocoder] HTTP server error", err);
  });
});
