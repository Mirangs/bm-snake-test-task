import { Router } from "express";
import { controllers } from "../controllers";

export const users = Router();

users.get("/", controllers.users.getUsers);
users.get("/:id", controllers.users.getUserById);
users.post("/", controllers.users.createUser);
