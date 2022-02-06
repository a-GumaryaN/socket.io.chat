import { GraphQLString } from "graphql";
import { removeTags } from "../../modules/XSS";
import { result } from "../dependencies";
import { chatRoomModel } from "../../db/mongooseSchemas";
import { userInfo } from "../../server";

const chatRoomMutation = {
  deleteChatRoom: {
    type: result,
    args: {
      chatRoomSecondUser: { type: GraphQLString },
    },
    resolve: async (parent, args) => {
      const chatRoomSecondUser = removeTags(args.chatRoomSecondUser);
      const result = await chatRoomModel.deleteOne({
        $or: [
          { _id: userInfo.username + chatRoomSecondUser },
          { _id: chatRoomSecondUser + userInfo.username },
        ],
      });
    },
  },
};

export default chatRoomMutation;
