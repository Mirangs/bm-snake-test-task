import { Router } from "express";
import { controllers } from "../controllers";

export const users = Router();

users.get("/", controllers.users.getUsers);
users.post("/", controllers.users.createUser);
