import { prop, getModelForClass } from "@typegoose/typegoose";

export class User {
	@prop({ required: true })
	public name: string;
}

export const UserModel = getModelForClass(User);
