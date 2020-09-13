import { prop, getModelForClass } from "@typegoose/typegoose";

export class User {
	@prop({ required: true })
	public name: string;

	@prop({ default: 1 })
	public level: number;
}

export const UserModel = getModelForClass(User);
