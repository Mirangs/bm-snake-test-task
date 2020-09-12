import { prop, getModelForClass } from "@typegoose/typegoose";
import mongoose from "mongoose";

class Ratings {
	@prop({ required: true })
	public user_id: mongoose.Schema.Types.ObjectId;

	@prop({ required: true, default: 0 })
	public rating: number;
}

export const RatingModel = getModelForClass(Ratings, {
	schemaOptions: { collection: "users_ratings" },
});
