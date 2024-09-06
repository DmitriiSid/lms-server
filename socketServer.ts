import { Server as SocketIOServer } from "socket.io";
import http from "http";

export const initSocketServer = (server: http.Server) => {
    const io = new SocketIOServer(server, {
        transports: ['websocket', 'polling'], // prioritize WebSocket over polling
        cors: {
            origin: process.env.NEXT_PUBLIC_SOCKET_SERVER_URI, // allow requests from this origin
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    io.on("connection", (socket) => {
        // console.log("A user connected");

        // Listen for 'notification' event from the frontend
        socket.on("notification", (data) => {
            // Broadcast the notification data to all connected clients (admin dashboard)
            io.emit("newNotification", data);
        });

        // socket.on("disconnect", () => {
        //     console.log("A user disconnected");
        // });
    });
};
