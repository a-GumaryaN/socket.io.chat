import { GraphQLObjectType } from "graphql";

import userQuery from "./user/user-query";

import chanelQuery from "./chanel/chanel-query";

import messageQuery from "./message/message-query";

import groupeQuery from "./groupe/groupe-query";

export const query = new GraphQLObjectType({
  name: "Query",
  fields: {
    ...userQuery,
    ...chanelQuery,
    ...messageQuery,
    ...groupeQuery,
  },
});
