import mongoose, { Document } from "mongoose";
import dbConnect from "@/lib/dbConnect";

export interface IUser extends Document {
  username?: string;
  email: string;
  password?: string;
  provider: "credentials" | "google";
  googleId?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    provider: { type: String, required: true, enum: ["credentials", "google"] },
    googleId: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

// Check if the model already exists to prevent recompilation
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;