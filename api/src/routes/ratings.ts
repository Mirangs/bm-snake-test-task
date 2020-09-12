import { Router } from "express";
import { controllers } from "../controllers";

export const ratings = Router();

ratings.get("/", controllers.ratings.getRatings);
ratings.post("/", controllers.ratings.saveRating);
