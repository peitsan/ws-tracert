# 功能优化
   
   - 区分IPv4、IPv6、 内外网，公私网。
   - 友好的交互（防抖、加载缓冲等）
   - 使用andv组件库美化页面
   - 编写 server.js脚本方便启动。

# 使用步骤

   - 克隆仓库

   > 通过 `git clone https://github.com/peitsan/ws-tracert.git` 下载仓库到本地。

   - 安装依赖

   > 通过 `npm i --save-dev` 编译安装依赖。建议使用`pnpm`。

   - 首次使用先进行打包。

   > 通过 `pnpm build`或 `npm run build`构建前端页面资源。

   - 启动服务脚本

   > 通过 `pnpm/npm run server`启动服务。
   > 通过 `pnpm/npm vite` 进入前端页面热重载。
   > 通过 `pnpm/npm dev` 进入命令行开发模式。

   **注意：** 前端页面是打包后挂在到2023端口的，在修改前端页面代码后，必须打包后才能在 `server` 或 `dev` 模式下查看修改效果，在 `vite` 模式下可以热修改，但无法调试服务接口。

# 实现思路

   - ws需要实现实时的双向通信，状态一直保持，需要开两个服务
   
   - 查询Tracert, 通过 exec()运行命令行脚本， 参数 --host host/IP (process.argv)
   
   - pnpm server后  启动vite：2023 前端页面 启动 ws：8080服务器 挂起监听

   - 2023 页面挂起服务， ws隧道与8080 复用， 接受 ws.message

   - 页面 参数 -> 函数（参数 -> ws.send(参数)）

      - ws服务器监听接收到页面的send后 执行exec ，ws
      - exec是一个promise回话，获取error后 通过ws.message告知页面
      - ws服务器需要双向监听端口变化

   - 其中 2023端口挂在 vite打包后的前端页面 用于跑服务器接受ws请求

# 參考文献：

   - [1] [nodejs-traceroute](https://github.com/zulhilmizainuddin/nodejs-traceroute), zulhilmizainuddin, url: https://github.com/zulhilmizainuddin/nodejs-traceroute, 2022.

   - [2] [depspy](https://github.com/DepSpy/depspy/), [cheerioInf]( https://github.com/cheerioInf)、[peitsan]( https://github.com/peitsan)、[RunningLiLi](https://github.com/RunningLiLi)、[xiyueyezibile]( https://github.com/xiyueyezibile)、[seasonHL](https://github.com/seasonHL)、[Shamaralyy]( https://github.com/Shamaralyy)、[hongfeij](https://github.com/hongfeij), url: https://github.com/DepSpy/depspy/, 2023.
   
   - [3] [使用 Vue 和 WebSocket 和 Node.js 实现 即时通讯](https://juejin.cn/post/7234541707332239415), BUG高级开发工程师, url:https://juejin.cn/post/7234541707332239415, 2023.
   