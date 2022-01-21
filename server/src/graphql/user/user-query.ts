import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";

import { userModel, chanelModel, messageModel } from "../../db/mongooseSchemas";

import { removeTags } from "../../modules/XSS";

import { secret, hasher } from "../../modules/modules";

import { result } from "../dependencies";

import { userInfo } from "../../server";

import { sign } from "jsonwebtoken";

import { user } from "./user-schema";

const userQuery = {
  user: {
    type: user,
    args: {
      username: { type: GraphQLString },
    },
    resolve: async (parent, args) => {
      const _id = removeTags(args.username);
      const result: any = await userModel.findOne({ _id });
      result.username = result._id;
      return result;
    },
  },
  login: {
    type: result,
    args: {
      username: { type: GraphQLString },
      password: { type: GraphQLString },
    },
    resolve: async (parent, args) => {
      const _id = removeTags(args.username),
        password = hasher("md5", removeTags(args.password), "utf-8", "hex");

      const result = await userModel.findOne({ _id });

      if (!result) return { error: "user not fount..." };

      if (result.password !== password) return { error: "invalid password..." };

      const token: string = sign({ _id, password }, secret, {
        expiresIn: "100d",
      });

      return { result: token };
    },
  },
};

export default userQuery;
