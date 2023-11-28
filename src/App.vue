<script setup lang="ts">
// import Route from './components/Route.vue';

import { ref ,onMounted} from 'vue';

const inputRef = ref('')
const data = ref({});
const socket = new WebSocket('ws://localhost:8080');

onMounted(() => {
  console.log("Server is ready:")
  socket.addEventListener('open', () => {
    console.log('Request to server');
  });
  socket.addEventListener('message', (event) => {
    // 接受服务器发送数据
    console.log('Message from server: ', event.data);
    data.value = event.data
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
