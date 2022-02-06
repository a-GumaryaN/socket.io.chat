import * as express from "express";
import { createServer } from "http";
import { connect } from "mongoose";
import { Server } from "socket.io";
import { socket } from "./api/socket-module";
import { auth } from "./modules/auth";
import { secret } from "./modules/modules";
import { removeTags } from "./modules/XSS";
import { graphqlHTTP } from "express-graphql";
import { graphqlSchema } from "./graphql/graphql-schemas";

class server {
  public app: any;
  private server: any;
  private portNumber: number = 3000;
  private dbUrl = "mongodb://localhost:27017/mydb";
  public io: any;
  public userInfo: { username: string } = {
    username: null,
  };

  constructor(portNumber: number, dbUrl: string) {
    this.dbUrl = dbUrl;
    this.portNumber = portNumber;
  }

  public init = async () => {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server);
    
    await connect(this.dbUrl).then(() => {
      console.log(`successfully connected to the database...`);
    });

    this.app.use("/test1", (req, res) => {
      res.sendFile(__dirname + "/test1.html");
    });

    //file for test server:
    this.app.use("/test2", (req, res) => {
      res.sendFile(__dirname + "/test2.html");
    });

    socket(this.io);

    this.app.use("", (req, res, next) => {
      const inputToken: any = req.headers.token;

      if (inputToken) {
        const token = removeTags(inputToken);

        const authResult = auth(token, secret);

        if (authResult.error) {
          return authResult.error;
        }

        this.userInfo.username = authResult.username;

        console.log("entered...");
      }
      next();
    });

    this.app.use(
      "/graphql",
      graphqlHTTP({
        schema: graphqlSchema,
        graphiql: true,
      })
    );

    this.app.use("", (req, res) => {
      res.send("route not found...");
    });
  };

  public listen = async () => {
    await this.server.listen(this.portNumber, () => {
      console.log(`listening on ${this.portNumber}`);
    });
  };

  public route = (route, action) => {
    this.server.app.use(route, (req, res) => {
      action(req, res);
    });
  };
}

export default server;
