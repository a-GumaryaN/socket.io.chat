import { auth } from "../modules/auth";

import { secret } from "../modules/modules";

import { removeTags } from "../modules/XSS";

import { messageModel, userModel } from "../db/mongooseSchemas";

import { ss } from "socket.io-stream";

import { createWriteStream } from "fs";

import { result } from "../modules/auth";

import { basename } from "path";

import User from "./userClass";

let connectedUser = {},
  user: any;

const log = console.log;

const fileRoute = {
  user: "../uploads/user/",
  groupe: "../uploads/groupes/",
  chanels: "../uploads/chanels/",
  chatRooms: "../uploads/chatRooms/",
};

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

      connectedUser[socket.id] = new User(authResult.username, socket.id);

      connectedUser[socket.id].init(socket);

      next();
    }
  });

  clientNamespace.on("connection", (socket) => {
    socket.on("sendMessage", (msg) => {
      connectedUser[socket.id].send[msg.type]
        ? connectedUser[socket.id].send[msg.type](socket, msg)
        : () => {
            socket.emit("error", { error: "invalid communication type..." });
          };
    });

    socket.on("messageSeen", (msgData) => {
      console.log("pass");
    });

    socket.on("blocking", (msgData) => {
      userModel.findOne({
        _id: connectedUser[socket.id].username
      }).then((data)=>{
        data.blockedPersons.map(item=>{
          if(item===msgData.targetUser){
            socket.emit("error",{
              error:"user already blocked..."
            });
            return {error:"user already blocked..."}
          }
        })
      });
      userModel
        .updateOne(
          {
            _id: connectedUser[socket.id].username,
          },
          {
            $push: { blockedPersons: msgData.targetUser },
          }
        )
        .then((data) => {
          log(data);
        });
    });

    // msgData =>  {communityType:"chanel/groupe/chatRoom","communityName :"",time:"last message time seen"}

    //data => {communicateName:"chanel/groupe/user/chatRoom" , name , message?}

    // ss(socket).on("getFile", (stream, data) => {
    //   let filePath = "";
    //   if (fileRoute[data.communicateName]) {
    //     filePath = fileRoute[data.communicateName] + data.name;
    //   }else{
    //     socket.emit("error",{error:"invalid file type..."})
    //   }
    //   stream.pipe(createWriteStream(filePath));
    // });

    socket.on("disconnect", () => {
      const date = new Date();
      userModel
        .updateOne(
          { _id: connectedUser[socket.id].username },
          {
            lastTimeOnline: date.getTime().toString(),
          }
        )
        .then((data) => {
          log(`${connectedUser[socket.id].username} disconnected...`);
          delete connectedUser[socket.id];
        });
    });
  });
};

/*msg ==> {
    type:"chanel,
    chatRoom,groupe" , 
    communicateName:"chanelName,
    otherUserUserName,groupeName", 
    msg:"message" , 
    time:"absolute"}*/
