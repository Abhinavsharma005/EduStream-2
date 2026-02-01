
import express from "express";
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// LiveKit will handle video separately via its own Cloud.
// Socket.IO is kept for Chat and custom signaling if needed (though LiveKit has chat too).

app.prepare().then(async () => {
    // Mediasoup removed.

    const server = express();
    const httpServer = createServer(server);
    const io = new Server(httpServer, {
        cors: {
            origin: "*", // Adjust in production
            methods: ["GET", "POST"]
        }
    });

    // In-memory room user tracking
    const roomUsers = new Map<string, Set<string>>();

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("join-room", async (roomId, userId) => {
            socket.join(roomId);
            console.log(`User ${userId} joined room ${roomId}`);

            // Track user
            if (!roomUsers.has(roomId)) {
                roomUsers.set(roomId, new Set());
            }
            roomUsers.get(roomId)?.add(socket.id);

            // Broadcast exact count to everyone in room
            const count = roomUsers.get(roomId)?.size || 0;
            io.to(roomId).emit("update-participant-count", count);

            // Notify others
            socket.to(roomId).emit("user-joined", userId);
        });

        socket.on("send-message", (data) => {
            io.to(data.roomId).emit("new-message", data);
        });

        socket.on("disconnect", async () => {
            console.log("Client disconnected:", socket.id);

            // Remove user from all rooms they were in
            for (const [roomId, users] of roomUsers.entries()) {
                if (users.has(socket.id)) {
                    users.delete(socket.id);
                    if (users.size === 0) {
                        roomUsers.delete(roomId);
                    } else {
                        io.to(roomId).emit("update-participant-count", users.size);
                    }
                }
            }
        });
    });

    server.all(/.*/, (req, res) => {
        return handle(req, res);
    });

    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
        console.log(`> Ready on http://localhost:${PORT}`);
    });
});
