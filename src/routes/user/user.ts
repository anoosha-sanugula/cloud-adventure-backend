import express from "express";
import { createUser } from "../../user/createUser.controller";
import { loginUser } from "../../user/loginUser.controller";
import { upload } from "../../user/createUser.controller";
const userRoutes = express();
userRoutes.use(express.urlencoded({ extended: true }));
userRoutes.use(express.json());

userRoutes.post("/users", upload.single("profile_image"), createUser);
userRoutes.post("/user", loginUser);
export default userRoutes;
