import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";

import { user } from "../user/user-schema";

import { userModel } from "../../db/mongooseSchemas";

import { removeTags } from "../../modules/XSS";

export const chanel = new GraphQLObjectType({
  name: "chanelType",
  fields: () => ({
    _id: { type: GraphQLString },
    description: { type: GraphQLString },
    subscribers: {
      type: GraphQLList(user),
      resolve: async (parent, args) => {},
    },
    owner: {
      type: user,
      resolve: async (parent, args) => {
        const _id = removeTags(parent.owner);
        const result = await userModel.findOne({ _id });
        return result;
      },
    },
  }),
});

export const inputChanel = new GraphQLInputObjectType({
  name: "chanelInputType",
  fields: () => ({
    description: { type: GraphQLString },
    owner: { type: GraphQLString },
  }),
});
