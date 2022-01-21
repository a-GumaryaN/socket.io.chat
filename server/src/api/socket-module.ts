import { auth } from "../modules/auth";

import { secret } from "../modules/modules";

import { removeTags } from "../modules/XSS";

import { messageModel, userModel } from "../db/mongooseSchemas";

import { result } from "../modules/auth";

import User from "./userClass";

let connectedUser = [],
  user: any;

const log = console.log;

export const socket = (io: any) => {
  const clientNamespace = io.of("/socket");

  //authentication part
  //authorization the input message owner
  clientNamespace.use((socket: any, next) => {
    //---> User authentication
    const token: string = removeTags(socket.handshake.headers.token);
    const authResult: result = auth(token, secret);

    if (authResult.error) {
      socket.emit("error", { error: authResult.error });
    } else {
      log(`${authResult.username} is connected...`);

      user = new User(authResult.username, socket.id);

      connectedUser.push(user);

      user.init(socket, user.joinToOwnChanels, user.joinToSubscribeChanels);

      next();
    }
  });

  clientNamespace.on("connection", (socket) => {
    socket.on("sendMessage", (msg) => {
      user.send[msg.type]
        ? user.send[msg.type](socket, msg)
        : socket.emit('error', { error: "invalid input data type..." });
    });

    socket.on("disconnect", () => {
      let index: number = 0;
      connectedUser.map((item) => {
        index++;
        if (item.socketId === socket.id) {
          log(`${item.username} disconnected...`);
          connectedUser = connectedUser.splice(index);
        }
      });
    });
  });
};

/*msg ==> {
    type:"groupe" , 
    communicateName:"chanel,
    chatRoom,groupe", 
    msg:"message" , 
    time:"absolute"}*/
