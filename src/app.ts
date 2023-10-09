import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import dataRouter from "./routes/data";
//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello client");
});
app.use(dataRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
