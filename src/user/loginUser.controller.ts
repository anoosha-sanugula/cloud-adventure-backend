import { NextFunction, Request, Response } from "express";
import { Users } from "../models/User";
import { User } from "../classes/user/user";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import "dotenv/config";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    return res
      .status(500)
      .json({ message: "Access token secret is not configured" });
  }

  jwt.verify(token, accessTokenSecret as string, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    (req as any).user_details = user;
    next();
  });
}

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "All fields are required" });
  try {
    let existUser: any = await Users.findOne({
      where: {
        username: username,
      },
    });
    if (!existUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    // const user = new User(
    //   existUser.dataValues.username,
    //   existUser.dataValues.email,
    //   existUser.dataValues.password,
    //   existUser.dataValues.country
    // );
    // const passwordMatch = await argon2.verify(
    //   existUser.dataValues.password,
    //   password
    // );
    // if (!passwordMatch) {
    //   res.status(400).json({ message: "Incorrect Password" });
    //   return;
    // }
    // const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    // if (!accessTokenSecret) {
    //   return res
    //     .status(500)
    //     .json({ message: "Access token secret is not configured" });
    // }
    // let user_details = { username: user.username };
    // const accessToken = jwt.sign({ user_details }, accessTokenSecret);
    // return res.status(200).json({
    //   message: "User retrieved successfully",
    //   data: user,
    //   accessToken,
    // });
  } catch (e) {
    return res.status(500).json({ message: "Error while user retrieving" });
  }
};
