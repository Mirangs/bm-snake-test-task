import express from "express";
import config from "config";
import log4js from "log4js";
import bodyParser from "body-parser";

import { connectToMongo } from "./helpers/connectToMongo";
import apiRoutes from "./routes";

log4js.configure(config.get("log4js"));
const log = log4js.getLogger("app");

const app = express();

connectToMongo();

app.use(bodyParser.json());

app.use("/api", apiRoutes);

app.use((_, res) => {
	return res.status(404).json({ error: "Not found" });
});

const port: number = config.get("port");
app.listen(port, () => {
	log.debug(`Server is running on http://localhost:${port}`);
});
