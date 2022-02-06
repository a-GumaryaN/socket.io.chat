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

import { groupeModel } from "../../db/mongooseSchemas";

export const groupe = new GraphQLObjectType({
  name: "groupeType",
  fields: () => ({
    _id: { type: GraphQLString },
    description: { type: GraphQLString },
    members: {
      type: GraphQLList(user),
      resolve: async (parent, args) => {
      },
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

export const inputGroupe = new GraphQLInputObjectType({
  name: "groupeInputType",
  fields: () => ({
    description: { type: GraphQLString },
    owner: { type: GraphQLString },
  }),
});
