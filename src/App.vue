<script setup lang="ts">
// import Route from './components/Route.vue';

import { ref ,onMounted} from 'vue';
import  { parseTraceOutput } from './scripts/processWssRecv';

const inputRef = ref('')
const data = ref<any[]>([]); //存放ws返回数据
const spin = ref<boolean>(false); //spin状态
const socket = new WebSocket('ws://localhost:8080');

onMounted(() => {
  console.log("Server is ready:")
  socket.addEventListener('open', () => {
    console.log('Conneted to server');
  });
  socket.addEventListener('message', (event) => {
      console.log(`Received message => ${event.data}`);
      // 处理从服务器收到的消息
      // ts-ignore
      data.value.push(parseTraceOutput(event.data as string)); //处理返回为JSON格式
      console.log(data.value);
      spin.value = false;  //关闭spin 
      
      if (event.data.error) {
        console.error(`Error: ${event.data.error}`);
      } else {
        // 在这里处理从服务器收到的 stdout 数据
        console.log(`stdout: ${event.data.stdout}`);
        // 你可以将 stdout 数据插入到页面中，例如使用 DOM 操作或其他前端框架
        // 例如，使用一个 div 元素显示 stdout 内容：
        // const outputDiv = document.getElementById('output') as HTMLElement ;
        
      }
    });
})

const submit = () => {
  spin.value = true;
  socket.send(inputRef.value);
}
const columns = [
        {
          title: 'Hop',
          dataIndex: 'hop',
          key: 'hop'
        },
        {
          title: 'IP',
          dataIndex: 'ip',
          key: 'ip'
        },
        {
          title: 'RTT 1',
          dataIndex: 'rtt1',
          key: 'rtt1'
        },
        {
          title: 'RTT 2',
          dataIndex: 'rtt2',
          key: 'rtt2'
        },
        {
          title: 'RTT 3',
          dataIndex: 'rtt3',
          key: 'rtt3'
        }
      ];
</script>

<template>
    <div>
      <Input  style="width: 240px;height: 40px;" placeholder="请输入主机域名或者IP" v-model:value="inputRef" autofocus @change="(e: any) => {inputRef = e.target.value; console.log(e.target.value)}"/>
      <Button type="primary" @click="submit()">查询</Button>
    </div>
    <Spin :spinning="spin" tip="Tracerting...">
      <Alert
        message="提示："
        :description="`服务器正在对主机${inputRef}进行Tracert操作，请稍后...}`"
      ></Alert>
    </Spin>
    <div>
      <Table :columns="columns" :dataSource="data[0] ? data[0].hop: []" bordered>
          <template #bodyCell="{ record }">
            <span v-if="record.rtt1 === '*'">No response</span>
            <span v-else>{{ record.rtt1 }}</span>
          </template>
  </Table>
    </div>
      <!-- <Route :render="data" /> -->
</template>

<style scoped>
#output {
  margin-top: 20px;
  width: 240px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
}
</style>
