import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";

import { chanel } from "../chanel/chanel-schema";

import { chanelModel } from "../../db/mongooseSchemas";

import { removeTags } from "../../modules/XSS";

export const user = new GraphQLObjectType({
  name: "userType",
  fields: () => ({
    _id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    birthDate: { type: GraphQLString },
    chanels: {
      type: GraphQLList(chanel),
      resolve: async (parent, args) => {
        const _id = removeTags(parent._id);
        const result:any = await chanelModel.find({ owner: _id });
        return result;
      },
    },
  }),
});

export const inputUser = new GraphQLInputObjectType({
  name: "inputUser",
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    birthDate: { type: GraphQLString }
  },
});