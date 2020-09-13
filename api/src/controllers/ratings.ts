import { RequestHandler } from "express";
import log4js from "log4js";
import validator from "validator";
import { UserModel } from "../models/user";
import { RatingModel } from "../models/ratings";

const log = log4js.getLogger("usersController");

const getRatings: RequestHandler = async (_, res) => {
	try {
		const ratings = await UserModel.aggregate([
			{
				$lookup: {
					from: "users_ratings",
					localField: "_id",
					foreignField: "user_id",
					as: "user_rating",
				},
			},
			{
				$unwind: {
					path: "$user_rating",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					name: 1,
					rating: "$user_rating.rating",
				},
			},
			{
				$match: {
					rating: {
						$gt: 0,
					},
				},
			},
		]).sort({ rating: -1 });
		return res.status(200).json({ ratings });
	} catch (err) {
		log.error(`Error at getRating: ${err}`);
		return res.status(500).json({ error: "Something went wrong" });
	}
};

const saveRating: RequestHandler = async (req, res) => {
	try {
		const { rating, userId } = req.body;

		if (!rating || !userId) {
			return res
				.status(400)
				.json({ error: "Need to provide rating and userId fields" });
		}

		if (rating < 0) {
			return res
				.status(400)
				.json({ error: "Need should be more than 0" });
		}

		if (!validator.isMongoId(userId)) {
			return res.status(400).json({ error: "Invalid userId" });
		}

		const isUserFound = await UserModel.findById(userId);
		if (!isUserFound) {
			return res.status(400).json({ error: "User not found" });
		}

		const ratingFound = await RatingModel.findOne({ user_id: userId });
		if (!ratingFound) {
			const created = await RatingModel.create({
				user_id: userId,
				rating,
			});
			return res.status(201).json({ success: true, data: created });
		}

		const totalRating = ratingFound.rating + rating;
		const updated = await ratingFound.updateOne({ rating: totalRating });
		const userLevel = isUserFound.level;
		if (userLevel < 10 && userLevel) {
			await isUserFound.update({
				level: userLevel + 1,
			});
		}
		return res.status(200).json({ success: true, data: updated });
	} catch (err) {
		log.error(`Error at saveRating: ${err}`);
		return res.status(500).json({ error: "Something went wrong" });
	}
};

export const ratings = {
	getRatings,
	saveRating,
};
