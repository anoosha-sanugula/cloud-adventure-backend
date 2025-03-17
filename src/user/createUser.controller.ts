import { Request, Response } from "express";
import { Users } from "../models/User";
import { User } from "../classes/user/user";
import jwt from "jsonwebtoken";
import "dotenv/config";
import multer from "multer";
import path from "path";
import fs from "fs";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: `${process.env.ACCESS_KEY_ID}`,
  secretAccessKey: `${process.env.SECRET_KEY}`,
  region: "ap-south-1",
});

const s3 = new AWS.S3();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });
export let new_user: User;
export const createUser = async (req: Request, res: Response): Promise<any> => {
  console.log("Backend data:", req.body);
  console.log("Uploaded file:", req.file);
  const { firstname, lastname, password } = req.body;

  if (!firstname || !lastname || !password || !req.file)
    return res.status(400).json({ message: "All fields are required" });
  try {
    let existUser = await Users.findOne({
      where: { firstname: firstname, lastname: lastname },
    });

    if (existUser) {
      return res.status(200).json({ message: "User already exist" });
    }
    const profileImage = req.file.path;
    const params = {
      Bucket: "cloud-adventure-profile-images",
      Key: req.file.originalname,
      Body: fs.createReadStream(profileImage),
      ContentType: req.file.mimetype,
    };
    console.log("hii before");
    const data: any = s3.upload(params, async (err: any, data: any) => {
      if (err) {
        console.error("Error uploading file to S3:", err);
        return res.status(500).send("Error uploading file to S3");
      }

      console.log("S3 upload successful:", data);
    });
    console.log("hii after");
    new_user = new User(firstname, lastname, password);
    await new_user.encryptPassword();

    await Users.create({
      firstname: new_user.firstname,
      lastname: new_user.lastname,
      password: new_user.password,
      original_profile_url: `https://${process.env.SOURCE_BUCKET}.s3.ap-south-1.amazonaws.com/${params.Key}`,
      resized_profile_url: `https://${process.env.DEST_BUCKET}.s3.ap-south-1.amazonaws.com/${params.Key}`,
    });
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
      return res
        .status(500)
        .json({ message: "Access token secret is not configured" });
    }
    let user_details = {
      firstname: new_user.firstname,
      lastname: new_user.lastname,
    };
    const accessToken = jwt.sign({ user_details }, accessTokenSecret);

    return res.status(201).json({
      message: "User created successfully",
      data: new_user,
      accessToken: accessToken,
    });
  } catch (e) {
    return res.status(500).json({ message: `Error while user creation` });
  }
};
