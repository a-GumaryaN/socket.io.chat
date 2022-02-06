import { GraphQLObjectType, GraphQLString } from "graphql";
import { Schema, model } from "mongoose";
import { graphqlSchema } from "../graphql/graphql-schemas";

import {
  userInterface,
  groupeInterface,
  messageInterface,
  chanelInterface,
  chatRoomInterface,
  personPermissions,
  chatRoomMessageInterface,
  lastUpdate,
  groupePermissions,
} from "../interfaces/interface";

const personPermissionSchema = new Schema<personPermissions>({
  canOtherSeeMyProfilePicture: { type: Boolean },
  canOtherAddMeToACommunicate: { type: Boolean },
});

const lastUpdateSchema = new Schema<lastUpdate>({
  communityType:{type:String},
  communicationName: { type: String },
  time: { type: String },
});

const userSchema = new Schema<userInterface>({
  _id: { type: String, required: true },
  password: { type: String, required: true },
  userProfileImage: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  birthDate: { type: String },
  age: { type: Number },
  blockedPersons: { type: [String] },
  permissions: { type: personPermissionSchema },
  lastTimeOnline: { type: String }, //last time the user was online...
  lastUpdate: { type: [lastUpdateSchema] }, //last message time the user was seen that...
});

const chatRoomMessageSchema = new Schema<chatRoomMessageInterface>({
  time: { type: String, required: true },
  msg: { type: String, required: true },
  msgOwner: { type: String, required: true },
});

const chatRoomSchema = new Schema<chatRoomInterface>({
  _id: { type: String },
  user1: { type: String },
  user2: { type: String },
  messages: { type: [chatRoomMessageSchema] },
});

const chanelSchema = new Schema<chanelInterface>({
  _id: { type: String, required: true },
  subscribers: { type: [String] },
  chanelImage: { type: String },
  description: { type: String, default: "not set" },
  owner: { type: String },
});

const groupePermissionsSchema = new Schema<groupePermissions>({});

const groupeSchema = new Schema<groupeInterface>({
  _id: { type: String, required: true }, //id is groupe name
  members: { type: [String] },
  description: { type: String, default: "not set" },
  owner: { type: String },
  groupeImage: { type: String },
  permissions: { type: groupePermissionsSchema },
});

const messageSchema = new Schema<messageInterface>({
  _id: { type: String },
  time: { type: String, required: true },
  communicateName: { type: String, required: true },
  msg: { type: String, required: true },
  messageFiles: { type: [String] },
  msgOwner: { type: String, required: true },
});

export const userModel = model("users", userSchema);
export const chanelModel = model("chanel", chanelSchema);
export const groupeModel = model("groupe", groupeSchema);
export const chatRoomModel = model("chatRoom", chatRoomSchema);
export const messageModel = model("message", messageSchema);
