//---------------------express-parts---------------------

import * as express from "express";
const app = express();

import { createServer } from "http";
export const server = createServer(app);

const port: number = 3000;

//---------------------database-parts---------------------

const dbUrl = "mongodb://localhost:27017/socketIo";

import { connect } from "mongoose";

connect(dbUrl).then(() => {
  console.log(`successfully connected to the database...`);
});

//---------------------socket.io-parts---------------------

import { Server } from "socket.io";

export const io = new Server(server);

//file for test server:
app.use("/test1", (req, res) => {
  res.sendFile(__dirname + "/test1.html");
});

//file for test server:
app.use("/test2", (req, res) => {
  res.sendFile(__dirname + "/test2.html");
});

import { socket } from "./api/socket-module";

socket(io);

//---------------------authentication-middleware-parts---------------------

import { auth } from "./modules/auth";

import { secret } from "./modules/modules";

import { removeTags } from "./modules/XSS";

export const userInfo: { username: string } = {
  username: null,
};

app.use("", (req, res, next) => {
  const inputToken: any = req.headers.token;

  if (inputToken) {
    const token = removeTags(inputToken);

    const authResult = auth(token, secret);

    if (authResult.error) {
      return authResult.error;
    }

    userInfo.username = authResult.username;

    console.log("entered...");
  }
  next();
});

//---------------------graphql-parts---------------------

import { graphqlHTTP } from "express-graphql";

import { graphqlSchema } from "./graphql/graphql-schemas";

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true,
  })
);

//---------------------404-error-parts---------------------

app.use("", (req, res) => {
  res.send("route not found...");
});

server.listen(port, () => {
  console.log(`listening on ${port}`);
});
