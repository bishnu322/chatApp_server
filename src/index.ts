import express, { Request, Response } from "express";
import "dotenv/config";
import { DB_CONNECTION } from "./config/db.config";

const app = express();
const PORT = process.env.PORT || 9000;
const DB_URI = process.env.DB_URI ?? "";

app.get("/", (req: Request, res: Response) => {
  res.send("hi there");
});

// invoking the database uri link from env file
DB_CONNECTION(DB_URI as string);

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
