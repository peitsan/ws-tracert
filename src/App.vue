<script setup lang="ts">

import { ref ,onMounted} from 'vue';
import  { parseTraceOutput } from './scripts/processWssRecv';
import  { message  } from 'ant-design-vue';

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
      let tmp = parseTraceOutput(event.data as string); //处理返回为JSON格式
      if(tmp.code == 1 || tmp.hop.length == 0) {
        console.log(`${inputRef.value}是本机地址(localhost)！`)
        message.warning(`${inputRef.value}是本机地址(localhost)！`);
      }
      else if(tmp.code == -1){
        console.log(`${inputRef.value}不是合法域名或者IP！`)
        message.warning(`${inputRef.value}不是合法域名或者IP！`);
      }
      else if(tmp.code == 500){
        console.log(`${inputRef.value}持续超时,提前结束！`)
        message.warning(`${inputRef.value}持续超时,提前结束！`);
      }
      else data.value.push(tmp);
      spin.value = false;  //关闭spin 
      
      if (event.data.error) {
        console.error(`Error: ${event.data.error}`);
      } else {
        // 在这里处理从服务器收到的 stdout 数据
        console.log(`stdout: ${event.data.stdout}`);
      }
    });
})

const submit = () => {
  spin.value = true;
  socket.send(inputRef.value);
  data.value = [];
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
      <a-input  style="width: 240px;height: 40px;" placeholder="请输入主机域名或者IP" v-model:value="inputRef" autofocus @change="(e: any) => {inputRef = e.target.value; console.log(e.target.value)}"/>
      <a-button type="primary" @click="submit()">查询</a-button>
    </div>
    <a-spin :spinning="spin" tip="Tracerting...">
      <a-alert
        v-if="spin"
        message="阁下请稍后..."
        :description="`服务器正在对主机${inputRef}进行Tracert操作`"
      ></a-alert>
      <a-alert
        v-if="!spin"
        message="请输入主机域名或者IP"
        :description="`支持公网、私网，支持IPV4、IPV6，支持域名解析~`"
      ></a-alert>
    </a-spin>
    <div>
      <a-table :columns="columns" :dataSource="data[0] ? data[0].hop: []" bordered>
          <template #bodyCell="{ column, record }">
              <span v-if="record[column.key] === '*'">No response</span>
              <span >{{ record[column.key] }}</span>
          </template>
  </a-table>
    </div>
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
