import { chanelModel } from "../db/mongooseSchemas";
import { chanelInterface, groupeInterface } from "../interfaces/interface";
import { messageModel } from "../db/mongooseSchemas";
import { groupModel } from "../db/mongooseSchemas";

const log = console.log;

class User {
  public username: string;
  public socketId: string;
  public ownChanels: chanelInterface[] = [];
  public subscribedChanels: chanelInterface[] = [];
  public subscribedGroupe: groupeInterface[] = [];

  constructor(username, socketId) {
    this.username = username;
    this.socketId = socketId;
  }

  public async init(socket, ...callBack: Function[]) {
    await this.getOwnChanels();
    await this.getSubscribeChanels();
    await this.getSubscribedGroupes();
    callBack.map((item) => item(socket));
  }

  //________________chanel's_managing_parts_____________

  public async getOwnChanels() {
    await chanelModel.find({ owner: this.username }).then((item) => {
      this.ownChanels = item;
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

  public joinToOwnChanels = (socket) => {
    this.subscribedChanels.map((item) => {
      socket.join(item._id);
      console.log(`${this.username} join to ${item._id}`);
    });
  };

  public joinToSubscribeChanels = (socket) => {
    this.ownChanels.map((item) => {
      socket.join(item._id);
      console.log(`${this.username} join to ${item._id}`);
    });
  };

  //________________groupe's_managing_parts_____________

  private getSubscribedGroupes = async () => {
    await groupModel.find({ subscribers: [this.username] }).then((data) => {
      this.subscribedGroupe = data;
    });
  };

  public joinToSubscribedGroupe = (socket) => {
    this.subscribedGroupe.map((item) => {
      socket.join(item._id);
      log(`${this.username} join to ${item._id}`);
    });
  };

  private isInSubscribedGroupe(chanelName: string): boolean {
    let result = false;
    this.subscribedGroupe.map((item) => {
      if (item._id === chanelName) {
        result = true;
      }
    });
    return result;
  }

  private async getSubscribeChanels() {
    await chanelModel
      .find({
        subscribers: [this.username],
      })
      .then((item) => {
        this.subscribedChanels = item;
      });
  }

  public send = {
    chanel: async (socket, msg) => {
      if (this.isInOwnChanels(msg.communicateName)) {
        socket.to(msg.communicateName).emit("sendMessage", msg);
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
      if (this.isInSubscribedGroupe(msg.communicateName)) {
        socket.to(msg.communicateName).emit("sendMessage", msg);
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
  };
}

export default User;
