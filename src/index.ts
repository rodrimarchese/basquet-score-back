import express from "express";
import { json } from "body-parser";

const app = express();
app.set("trust proxy", true);
app.use(json());

app.all("*", async (req, res) => {
  res.status(200).send("Hello World");
});

export { app };
