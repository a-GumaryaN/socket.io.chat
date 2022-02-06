import { chanelModel } from "../db/mongooseSchemas";
import {
  chanelInterface,
  chatRoomInterface,
  groupeInterface,
} from "../interfaces/interface";
import {
  messageModel,
  chatRoomModel,
  groupeModel,
} from "../db/mongooseSchemas";

const log = console.log;

class User {
  public username: string;
  public socketId: string;
  public ownChanels: chanelInterface[] = [];
  public subscribedChanels: chanelInterface[] = [];
  public joinedGroupes: groupeInterface[] = [];
  public ownGroupes: groupeInterface[] = [];
  public chatRooms: chatRoomInterface[] = [];

  constructor(username, socketId) {
    this.username = username;
    this.socketId = socketId;
  }

  public async init(socket) {
    await this.getChanels(socket);
    await this.getGroupes(socket);
    await this.getChatRooms(socket);
  }

  //________________chanel's_managing_parts_____________

  private async getChanels(socket) {
    this.ownChanels = await chanelModel.find({ owner: this.username });
    this.subscribedChanels = await chanelModel.find({
      subscribers: [this.username],
    });
    this.ownChanels.map((item) => {
      socket.join(item._id);
      console.log(`${this.username} join to ${item._id}`);
    });
    this.subscribedChanels.map((item) => {
      socket.join(item._id);
      console.log(`${this.username} join to ${item._id}`);
    });
  }

  private isInOwnChanels(chanelName: string): boolean {
    let result = false;
    this.ownChanels.map((item) => {
      if (item._id === chanelName) {
        result = true;
      }
    });
    return result;
  }

  //________________groupe's_managing_parts_____________

  private getGroupes = async (socket) => {
    this.joinedGroupes = await groupeModel.find({
      members: this.username,
    });
    this.ownGroupes = await groupeModel.find({
      owner: this.username,
    });
    this.joinedGroupes.map((item) => {
      socket.join(item._id);
      log(`${this.username} join to ${item._id}`);
    });
    this.ownGroupes.map((item) => {
      socket.join(item._id);
      log(`${this.username} join to ${item._id}`);
    });
  };

  private isJoinedGroupe(groupeName: string): boolean {
    let result = false;
    this.joinedGroupes.map((item) => {
      if (item._id === groupeName) {
        result = true;
        log("item => " + item);
      }
    });
    return result;
  }

  //__________________chatRoom's_managing_parts__________________

  private getChatRooms = async (socket) => {
    this.chatRooms = await chatRoomModel.find({
      or: [{ user1: this.username }, { user2: this.username }],
    });
    this.chatRooms.map((item) => {
      socket.join(item._id);
      socket.to(item._id);
      log(`${this.username} joined to ${item._id}`);
    });
  };

  private makeChatRoom = async (user2, next) => {
    const newChatRoom = new chatRoomModel({
      _id: this.username + user2,
      user1: this.username,
      user2,
    });
    const result = await newChatRoom.save();
    next();
  };

  private isChatRoomExist = (user2): boolean | object => {
    let result: boolean | object = false;
    log(this.chatRooms);
    this.chatRooms.map((item) => {
      if (user2 === item.user1 || user2 === item.user2) {
        result = item;
        log(item);
      }
    });
    return result;
  };

  public send = {
    chanel: async (socket, msg) => {
      if (this.isInOwnChanels(msg.communicateName)) {
        socket
          .to(msg.communicateName)
          .emit("sendMessage", { ...msg, msgOwner: this.username });
        const newMessage = new messageModel({
          _id: this.username + msg.time,
          time: msg.time,
          communicateName: msg.communicateName,
          msg: msg.msg,
          msgOwner: this.username,
        });
        newMessage.save().then(() => {
          log("message saved...");
        });
        log("message sended...");
      } else {
        log("user not owner of chanel...");
        socket.emit("error", { error: "user not owner of chanel..." });
      }
    },
    groupe: async (socket, msg) => {
      if (this.isJoinedGroupe(msg.communicateName)) {
        socket
          .to(msg.communicateName)
          .emit("sendMessage", { ...msg, msgOwner: this.username });
        const newMessage = new messageModel({
          _id: this.username + msg.time,
          time: msg.time,
          communicateName: msg.communicateName,
          msg: msg.msg,
          msgOwner: this.username,
        });
        newMessage.save().then(() => {
          log("message saved...");
        });
        log("message sended...");
      } else {
        log("user not subscriber of chanel...");
        socket.emit("error", { error: "user not subscriber of chanel..." });
      }
    },
    chatRoom: async (socket, msg) => {
      const checkExist: any = this.isChatRoomExist(msg.communicateName);
      if (checkExist) {
        socket.to(checkExist._id).emit("sendMessage", msg);
        await chatRoomModel.updateOne(
          { _id: checkExist._id },
          {
            $push: {
              messages: {
                msgOwner: this.username,
                time: msg.time,
                msg: msg.msg,
              },
            },
          }
        );
        log("message sended...");
        log("message saved...");
      } else {
        const newChatRoom = new chatRoomModel({
          _id: this.username + msg.communicateName,
          user1: this.username,
          user2: msg.communicateName,
          messages: [
            {
              msgOwner: this.username,
              time: msg.time,
              msg: msg.msg,
            },
          ],
        });
        await newChatRoom.save();
        socket.to(this.username + msg.communicateName).emit(msg);
        log("message sended...");
        log("message saved...");
      }
    },
  };
}

export default User;
