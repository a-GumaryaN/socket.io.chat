import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";

import { userModel, groupeModel, messageModel } from "../../db/mongooseSchemas";

import { removeTags } from "../../modules/XSS";

import { result } from "../dependencies";

import { inputGroupe } from "./groupe-schema";

import { userInfo } from "../../server";

export const groupeMutation = {
  addGroupe: {
    type: result,
    args: {
      groupeName: { type: GraphQLString },
      members: { type: GraphQLList(GraphQLString) },
    },
    resolve: async (parent, args) => {
      if (!userInfo.username) return { error: "access denied..." };

      const groupeName = removeTags(args.groupeName),
        checkExist = await groupeModel.findOne({ _id: groupeName });

      if (checkExist) return { error: "groupe exist..." };

      const members = [];

      args.members.map((item) => {
        members.push(removeTags(item));
      });

      const newGroupe = new groupeModel({
        _id: groupeName,
        owner: userInfo.username,
        members,
      });

      const result = await newGroupe.save();

      return { result };
    },
  },
  joinToGroupe: {
    type: result,
    args: {
      groupeName: { type: GraphQLString },
    },
    resolve: async (parent, args) => {
      if (!userInfo.username) return { error: "access denied..." };

      const groupeName = removeTags(args.groupeName),
        checkExist = await groupeModel.findOne({ _id: groupeName });

      checkExist.members.map((item) => {
        if (item === userInfo.username)
          return { error: "members exist in groupe members..." };
      });

      const result = await groupeModel.updateOne(
        {
          _id: groupeName,
        },
        {
          $push: { members: [userInfo.username] },
        }
      );

      return { result };
    },
  },
  updateGroupe: {
    type:result
  },
  addMember: {},
};

// export default groupeMutation;
