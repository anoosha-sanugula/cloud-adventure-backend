import { DataTypes } from "sequelize";
import { sequelize } from "../server";

export const Users = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    original_profile_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resized_profile_url: {
      type: DataTypes.STRING
    },
  },
  {
    timestamps: false,
  }
);
