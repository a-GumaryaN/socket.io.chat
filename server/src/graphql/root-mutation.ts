import { GraphQLObjectType } from "graphql";

import userMutation from "./user/user-mutation";

import messageMutation from "./message/message-mutation";

import chanelMutation from "./chanel/chanel-mutation";

export const mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    ...userMutation,
    ...messageMutation,
    ...chanelMutation,
  },
});
