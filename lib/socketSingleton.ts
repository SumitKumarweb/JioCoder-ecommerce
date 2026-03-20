import type { Server } from "socket.io";

declare global {
  // eslint-disable-next-line no-var
  var __jiocoder_socket_io: Server | undefined;
}

export function setSocketIO(io: Server | undefined) {
  globalThis.__jiocoder_socket_io = io;
}

export function getSocketIO(): Server | undefined {
  return globalThis.__jiocoder_socket_io;
}

export function groupChatRoom(slug: string): string {
  return `group-chat:${slug.trim().toLowerCase()}`;
}
