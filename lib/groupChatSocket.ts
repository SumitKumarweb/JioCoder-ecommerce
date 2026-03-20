import type { Server, Socket } from "socket.io";
import { createGroupChatMessage, dtoToWire } from "@/lib/communityGroupMessageService";
import { getSocketIO, groupChatRoom } from "@/lib/socketSingleton";

export function broadcastGroupChatMessage(slug: string, dto: ReturnType<typeof dtoToWire>) {
  const io = getSocketIO();
  if (!io) return;
  io.to(groupChatRoom(slug)).emit("new-message", dto);
}

export function registerGroupChatSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    socket.on(
      "join-group",
      async (payload: { slug?: string; userId?: string }, ack?: (r: unknown) => void) => {
        const slug = typeof payload?.slug === "string" ? payload.slug.trim() : "";
        const userId = typeof payload?.userId === "string" ? payload.userId.trim() : "";
        if (!slug || !userId) {
          ack?.({ ok: false, error: "slug and userId required" });
          return;
        }
        const { verifyGroupMembership } = await import("@/lib/verifyGroupMembership");
        const v = await verifyGroupMembership(slug, userId);
        if (!v.ok) {
          ack?.({ ok: false, error: v.error });
          return;
        }

        await socket.join(groupChatRoom(slug));
        ack?.({ ok: true });
      }
    );

    socket.on("leave-group", (payload: { slug?: string }) => {
      const slug = typeof payload?.slug === "string" ? payload.slug.trim() : "";
      if (slug) void socket.leave(groupChatRoom(slug));
    });

    socket.on(
      "send-message",
      async (
        payload: {
          slug?: string;
          userId?: string;
          body?: string;
          code?: string;
          imageUrl?: string;
        },
        ack?: (r: unknown) => void
      ) => {
        const slug = typeof payload?.slug === "string" ? payload.slug.trim() : "";
        const userId = typeof payload?.userId === "string" ? payload.userId.trim() : "";
        const body = typeof payload?.body === "string" ? payload.body : "";
        const code = typeof payload?.code === "string" ? payload.code : "";
        const imageUrl =
          typeof payload?.imageUrl === "string" && payload.imageUrl.trim()
            ? payload.imageUrl.trim()
            : undefined;

        if (!slug || !userId) {
          ack?.({ ok: false, error: "slug and userId required" });
          return;
        }

        const created = await createGroupChatMessage({
          slug,
          userId,
          body: body.trim(),
          code: code.trim(),
          imageUrl,
        });

        if (!created.ok) {
          ack?.({ ok: false, error: created.error });
          return;
        }

        const wire = dtoToWire(created.dto);
        io.to(groupChatRoom(slug)).emit("new-message", wire);
        ack?.({ ok: true, message: wire });
      }
    );
  });
}
