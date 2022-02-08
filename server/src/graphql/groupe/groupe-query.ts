import { GraphQLString } from "graphql";

import { chanelModel } from "../../db/mongooseSchemas";

import { removeTags } from "../../modules/XSS";

import { groupe } from "./groupe-schema";

export const groupeQuery = {
  chanel: {
    type: groupe,
    args: {
      groupeName: { type: GraphQLString },
    },
    resolve: async (parent, args) => {
      const _id = removeTags(args.groupeName);
      const result: any = await chanelModel.findOne({ _id });
      return result;
    },
  },
};

// export default groupeQuery;
