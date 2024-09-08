import { Server as SocketIOServer } from "socket.io";
import http from "http";


export const initSocketServer = (server: http.Server) => {
    const io = new SocketIOServer(server);

    io.on("connection", (socket) => {
        // Listen for 'notification' event from the frontend
        socket.on("notification", (data) => {
            // Broadcast the notification data to all connected clients (admin dashboard)
            io.emit("newNotification", data);
        });
    });
};

