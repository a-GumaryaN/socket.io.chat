import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";

import { userModel } from "../../db/mongooseSchemas";

import { removeTags } from "../../modules/XSS";

import { hasher } from "../../modules/modules";

import { inputUser } from "../user/user-schema";

import { result } from "../dependencies";

import { userInfo } from "../../server";

const userMutation = {
  addUser: {
    type: result,
    args: {
      _id: { type: GraphQLString },
      password: { type: GraphQLString },
    },
    resolve: async (parent, args) => {
      const _id = removeTags(args._id),
        password = hasher("md5", removeTags(args.password), "utf-8", "hex");

      const checkNotExist = await userModel.findOne({ _id });

      if (checkNotExist) return { error: "user registered..." };

      const newUser = new userModel({
        _id,
        password,
      });

      const result = await newUser.save();

      if (result) return { result: "user registered successfully..." };
    },
  },
  updateUser: {
    type: result,
    args: {
      updateUser: { type: inputUser },
    },
    resolve: async (parent, args) => {
      if (!userInfo.username) return { error: "access denied..." };

      const result = await userModel.updateOne(
        { _id: userInfo.username },
        args.updateUser
      );

      return { result: `modifiedCount:${result.modifiedCount}` };
    },
  },
};

export default userMutation;
