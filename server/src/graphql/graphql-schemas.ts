import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";

import { query } from "./root-query";

import { mutation } from "./root-mutation";

export const graphqlSchema = new GraphQLSchema({
  query: query,
  mutation: mutation,
});
