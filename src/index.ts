import express, { Request, Response } from "express";

const app = express();
const PORT = 9000;

app.get("/", (req: Request, res: Response) => {
  res.send("hi there");
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
