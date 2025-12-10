import express, { Request, Response } from "express";
import "dotenv/config";
import { DB_CONNECTION } from "./config/db.config";
import cookieParser from "cookie-parser";
import cors from "cors";

// all the routes import
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";

const app = express();
const PORT = process.env.PORT || 9000;
const DB_URI = process.env.DB_URI ?? "";

// invoking the database uri link from env file
DB_CONNECTION(DB_URI as string);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("hi there");
});

//all the routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
