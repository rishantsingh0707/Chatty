import express from "express";
import { addFriend, searchByCode ,getFriendsList} from "../controller/user.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.middleware.js";

const router = express.Router();

// search user by code
router.get("/search/:code", searchByCode);

// add friend
router.post("/add-friend/:friendId",protectedRoute, addFriend);

router.get("/friends", protectedRoute, getFriendsList);

export default router;

