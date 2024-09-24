import express from "express";
import "dotenv/config";
import { DatabaseConnection } from "./core/Database/config.js";
import indexRoute from "./core/IndexRoute.js";

const app = express();
const PORT = process.env.PORT || 4500;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/v1/status", (req, res) => {
  return res.status(200).json({ status: "OK", message: "Server is running" });
});

app.use("/api/v1", indexRoute);

DatabaseConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
