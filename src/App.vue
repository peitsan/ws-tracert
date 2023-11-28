<script setup lang="ts">
import Route from './components/Route.vue';

import { ref ,onMounted} from 'vue';

const inputRef = ref('')
const data = ref({});
const socket = new WebSocket('ws://localhost:8080');

onMounted(() => {
  socket.addEventListener('open', () => {
    socket.send('baidu.com');
  });
  socket.addEventListener('message', (event) => {
    // 接受服务器发送数据
    console.log('Message from server: ', event.data);
    data.value = event.data
  });
})

const submit = () => {
  socket.send('github.com');
}

// socket.addEventListener('message', (event) => {
//   // 接受服务器发送数据
//  console.log('Message from server: ', event.data);
// });


</script>

<template>
    <div>
      <Input v-model="inputRef" />
      <Button type="primary" @click="submit()">查询</Button>
    </div>
      <Route :render="data" />
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
