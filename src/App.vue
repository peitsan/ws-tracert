<script setup lang="ts">
// import Route from './components/Route.vue';

import { ref ,onMounted} from 'vue';
interface wsres {
  error?: string;
  stdout: string;
  stderr?: string;
}
const inputRef = ref('')
const data = ref();
const socket = new WebSocket('ws://localhost:8080');

onMounted(() => {
  console.log("Server is ready:")
  socket.addEventListener('open', () => {
    console.log('Conneted to server');
  });
  socket.addEventListener('message', (event) => {
      console.log(`Received message => ${event.data}`);
      // 处理从服务器收到的消息
      data.value = JSON.parse(event.data) as wsres;
      if (data.value.error) {
        console.error(`Error: ${data.value.error}`);
      } else {
        // 在这里处理从服务器收到的 stdout 数据
        console.log(`stdout: ${data.value.stdout}`);
        // 你可以将 stdout 数据插入到页面中，例如使用 DOM 操作或其他前端框架
        // 例如，使用一个 div 元素显示 stdout 内容：
        const outputDiv = document.getElementById('output') as HTMLElement ;
        outputDiv.textContent = data.value.stdout;
      }
    });
})

const submit = () => {
  socket.send(inputRef.value);
}

</script>

<template>
    <div>
      <Input  style="width: 240px;height: 40px;" placeholder="请输入主机域名或者IP" v-model:value="inputRef" autofocus @change="(e: any) => {inputRef = e.target.value; console.log(e.target.value)}"/>
      <Button type="primary" @click="submit()">查询</Button>
    </div>
    <div id="output"></div>
      <!-- <Route :render="data" /> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
