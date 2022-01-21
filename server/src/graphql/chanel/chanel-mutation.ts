import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";

import { userModel, chanelModel, messageModel } from "../../db/mongooseSchemas";

import { removeTags } from "../../modules/XSS";

import { result } from "../dependencies";

import { inputChanel } from "../../graphql/chanel/chanel-schema";

import { userInfo } from "../../server";

const chanelMutation = {
  addChanel: {
    type: result,
    args: {
      _id: { type: GraphQLString },
      description: { type: GraphQLString },
    },
    resolve: async (parent, args) => {
      if (!userInfo.username) return { error: "access denied..." };

      const _id = removeTags(args._id);

      const description = args.description
        ? removeTags(args.description)
        : null;

      const checkNotExist = await chanelModel.findOne({ _id });

      if (checkNotExist) return { error: "chanel exist..." };

      const newChanel = new chanelModel({
        _id: _id,
        owner: userInfo.username,
        description: description,
      });
      const result = await newChanel.save();

      if (result) return { result: "chanel added successfully..." };
    },
  },
  updateChanel: {
    type: result,
    args: {
      _id: { type: GraphQLString },
      update: { type: inputChanel },
    },
    resolve: async (parent, args) => {},
  },
  subscribe: {
    type: result,
    args: {
      subscriber_id: { type: GraphQLString },
      chanel_id: { type: GraphQLString },
    },
    resolve: async (parent, args) => {
      const subscriber_id = removeTags(args.subscriber_id),
        chanel_id = removeTags(args.chanel_id);

      if (userInfo.username !== subscriber_id)
        return {
          error: "Other users can no longer subscribe a user in a group",
        };

      //-->>> asked later...
      // const checkUserExist = await userModel.findOne({ _id: subscriber_id });
      // if (!checkUserExist) return { error: "user not exist..." };

      const checkChanelExist = await chanelModel.findOne({ _id: chanel_id });
      if (!checkChanelExist) return { error: "chanel not exist..." };
      if (checkChanelExist.owner === userInfo.username)
        return { error: "user can not subscribe his/her chanels..." };

      if (checkChanelExist.subscribers.includes(subscriber_id))
        return { error: "subscriber exist" };

      const result = await chanelModel.updateOne(
        { _id: chanel_id },
        { $push: { subscribers: subscriber_id } }
      );

      return { result: result.modifiedCount };
    },
  },
};

export default chanelMutation;
