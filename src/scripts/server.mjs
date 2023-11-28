import { exec } from 'child_process';
import chalk from 'chalk'
const { yellow, cyan } = chalk

async function run() {
 await new Promise((resolve, reject) => {
    console.log(yellow("开始构建打包页面..."));
   exec('pnpm build', (error, stdout, stderr) => {
     if (error) {
       console.error(`exec error: ${error}`);
       reject(error);
     }
     console.log(`stdout: ${stdout}`);
     console.error(`stderr: ${stderr}`);
     resolve();
   });
 });

 await new Promise((resolve, reject) => {
   console.log(cyan("构建成功，启动服务器中..."));
   exec('ts-node src/scripts/createServer.ts', (error, stdout, stderr) => {
     if (error) {
       console.error(`exec error: ${error}`);
       reject(error);
     }
     console.log(`stdout: ${stdout}`);
     console.error(`stderr: ${stderr}`);
     resolve();
   });
 });
}

run().catch(console.error);