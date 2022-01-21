import { GraphQLString } from "graphql";

import { chanelModel } from "../../db/mongooseSchemas";

import { removeTags } from "../../modules/XSS";

import { chanel } from "../chanel/chanel-schema";

const chanelQuery = {
  chanel: {
    type: chanel,
    args: {
      chanelName: { type: GraphQLString },
    },
    resolve: async (parent, args) => {
      const _id = removeTags(args.chanelName);
      const result: any = await chanelModel.findOne({ _id });
      result.chanelName = result._id;
      return result;
    },
  },
};

export default chanelQuery;
