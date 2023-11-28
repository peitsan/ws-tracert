# 思路整理

   - ws需要实现实时的双向通信，状态一直保持，需要开两个服务
   
   - 查询Tracent, 通过 exec()运行命令行脚本， 参数 --host host/IP (process.argv)
   
   - pnpm server后  启动vite：5173 前端页面 启动 ws：8080服务器 挂起监听

   - 5173 页面挂起服务与8080 复用， 接受 ws.message

   - 页面 参数 -> 函数（参数 -> ws.send(参数)）

      - ws服务器监听接收到页面的send后 执行exec ，ws
      - exec是一个promise回话，获取error后 通过ws.message告知页面
      - 