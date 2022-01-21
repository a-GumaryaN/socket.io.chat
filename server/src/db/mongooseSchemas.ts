import { Schema, model } from "mongoose";

import {
  userInterface,
  groupeInterface,
  messageInterface,
  chanelInterface,
  chatRoom,
  personPermissions,
  lastUpdate,
} from "../interfaces/interface";

const personPermissionSchema = new Schema<personPermissions>({
  canOtherSeeMyProfilePicture: { type: Boolean },
  canOtherAddMeToACommunicate: { type: Boolean },
});

const lastUpdateSchema = new Schema<lastUpdate>({
  communication: { type: String },
  time: { type: String },
});

const userSchema = new Schema<userInterface>({
  _id: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  birthDate: { type: String },
  age: { type: Number },
  blockedPersons: { type: [String] },
  permissions: { type: personPermissionSchema },
  lastTimeOnline: { type: String },
  lastUpdate: { type: [lastUpdateSchema] },
});

const chatRoomSchema = new Schema<chatRoom>({
  _id: { type: String },
  user1: { type: String },
  user2: { type: String },
});

const chanelSchema = new Schema<chanelInterface>({
  _id: { type: String, required: true },
  subscribers: { type: [String] },
  description: { type: String, default: "not set" },
  owner: { type: String },
});

const groupeSchema = new Schema<groupeInterface>({
  _id: { type: String, required: true },
  users: { type: [String] },
  description: { type: String, default: "not set" },
  owner: { type: String },
});

const messageSchema = new Schema<messageInterface>({
  _id: { type: String },
  time: { type: String, required: true },
  communicateName: { type: String, required: true },
  msg: { type: String, required: true },
  msgOwner: { type: String, required: true },
});

export const userModel = model("users", userSchema);
export const chanelModel = model("chanel", chanelSchema);
export const groupModel = model("group", groupeSchema);
export const chatRoomModel = model("chatRoom", chatRoomSchema);
export const messageModel = model("message", messageSchema);
