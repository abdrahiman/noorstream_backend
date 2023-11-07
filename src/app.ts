import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import dataRouter from "./routes/data";
import cors from "cors";
//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8080;

app.get("/", (req: Request, res: Response) => {
    res.send("Yo !");
});

const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/data", dataRouter);

app.use("/search:query", dataRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
