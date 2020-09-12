import mongoose from "mongoose";
import config from "config";
import log4js from "log4js";

const log = log4js.getLogger("connectToMongo");

export const connectToMongo = async () => {
	try {
		await mongoose.connect(
			config.get("mongoose.uri"),
			config.get("mongoose.options")
		);
		const { connection } = mongoose;
		log.debug(
			`Mongo successfully connected, mongodb://${connection.host}:${connection.port}/${connection.db.databaseName}`
		);

		connection.on("error", (err) => {
			log.error(`Error in mongo connection, ${err}`);
			process.exit(1);
		});
	} catch (err) {
		log.error(`Cannot connect to mongo, reason: ${err}`);
		process.exit(1);
	}
};
