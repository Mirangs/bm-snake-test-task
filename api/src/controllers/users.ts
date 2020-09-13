import { RequestHandler } from "express";
import log4js from "log4js";
import validator from "validator";
import { UserModel } from "../models/user";

const log = log4js.getLogger("usersController");

const getUsers: RequestHandler = async (_, res) => {
	try {
		const users = await UserModel.find();
		return res.status(200).json(users);
	} catch (err) {
		log.error(`Error at getUsers: ${err}`);
		return res.status(500).json({ error: "Something went wrong" });
	}
};

const createUser: RequestHandler = async (req, res) => {
	try {
		const { name } = req.body;
		if (!name) {
			return res.status(400).json({ error: "Need to provide name" });
		}

		if (name.length < 3) {
			return res
				.status(400)
				.json({ error: "Name should be at least 4 characters long" });
		}

		const isUserExists = await UserModel.findOne({ name });
		if (isUserExists) {
			return res.status(400).json({ error: "User already exists" });
		}

		const newUser = new UserModel({
			name,
		});
		await newUser.save();

		return res.status(201).json({ success: true, data: newUser });
	} catch (err) {
		log.error(`Error at createUser: ${err}`);
		return res.status(500).json({ error: "Something went wrong" });
	}
};

const getUserById: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ error: "Need to provide userId" });
		}

		if (!validator.isMongoId(id)) {
			return res.status(400).json({ error: "Invalid userId" });
		}

		const user = await UserModel.findById(id);
		return res.status(200).json({ data: user });
	} catch (err) {
		log.error(`Error at getUserById, ${err}`);
		return res.status(500).json({ error: "Something went wrong" });
	}
};

export const users = {
	getUsers,
	createUser,
	getUserById,
};
