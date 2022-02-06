import chatRoom from "./chatRoom-schema";
import { GraphQLString } from "graphql";
import { chatRoomModel } from "../../db/mongooseSchemas";
import { userInfo } from "../../server";
const chatRoomQuery = {
  chatRoom: {
    type: chatRoom,
    args: { secondUserId: { type: GraphQLString } },
    resolve: async (parent, args) => {
      if (!userInfo.username) return { error: "access denied..." };
      const secondUserId = args.secondUserId;
      const result = await chatRoomModel.findOne({
        $or: [
          { _id: secondUserId + userInfo.username },
          { _id: userInfo.username + secondUserId },
        ],
      });
      return { result };
    },
  },
};

export default chatRoomQuery;
