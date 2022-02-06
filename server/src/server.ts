import Server from "./index";

const server = new Server(3000, "mongodb://localhost:27017/socketIo");

server.init();

export const userInfo = server.userInfo;

server.listen();
