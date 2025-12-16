import express from "express";
import "dotenv/config";
import { DB_CONNECTION } from "./config/db.config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";

// routes
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import chatRouter from "./routes/chat.route";
import messageRouter from "./routes/message.route";

// creating server using express and socket.io
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const PORT = process.env.PORT || 9000;
const DB_URI = process.env.DB_URI ?? "";

// DB connection
DB_CONNECTION(DB_URI);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

interface IOnlineUser {
  socketId: string;
  userId: string;
}
interface IOnlineUser {
  userId: string;
  socketId: string;
}

let onlineUser: IOnlineUser[] = [];

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("addNewUser", (userId: string) => {
    // remove old socket if same user reconnects
    onlineUser = onlineUser.filter((u) => u.userId !== userId);

    onlineUser.push({
      userId,
      socketId: socket.id,
    });

    io.emit("getOnlineUser", onlineUser);
    console.log("online users:", onlineUser);
  });
  // sending message

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiver = onlineUser.find((user) => user.userId === receiverId);

    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", {
        senderId,
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUser", onlineUser);
    console.log("user disconnected", socket.id);
  });
});

// routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
