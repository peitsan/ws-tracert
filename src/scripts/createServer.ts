import express from "express";
import cors from "cors";
import { wsserver } from "./wss";
import { green, cyan, yellow} from "chalk";
import ws from 'ws';
import path from "path";
import { staticPath } from "../../index";

const app = express();
const root = path.join(staticPath, "ws-tracert/dist");

app.use(cors());

app.use(express.static(root));
  app.get("*", (_, res) => {
    res.sendFile(path.join(root, "index.html"));
  });

app.listen(2023, () => {
    console.log(yellow('Server started successfully on port 2023'));
    console.log(green("服务器启动成功:"), cyan("http://localhost:2023"));
  })

const wss = new ws.Server({ port: 8080 });

wsserver(wss);
  
