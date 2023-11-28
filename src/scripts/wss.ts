import { exec } from 'child_process';
import * as ws from 'ws';

export function wsserver(wss: ws.Server) {
 
    console.log("服务器启动成功")

    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        console.log(`Received message => ${message}`);
        // 运行traceroute命令
        const host = message; // 获取host参数
        exec('ts-node src/api/traceroute ' + host, function(err, stdout, stderr) {
          console.log(`stdout: ${stdout}`);
          if (err) {
            console.log(err);
            ws.send(err.message); // 将错误信息发送给前端
          } 
              ws.send(stdout); // 将输出发送给前端
              console.log(`stdout: ${stdout}`);
              console.error(`stderr: ${stderr}`);
              // 将输出发送到客户端
       wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(message);
              client.send(stdout);
            }
          });
        });
      })
    }
  )
}
