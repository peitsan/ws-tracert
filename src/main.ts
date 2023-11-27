import { createApp } from 'vue'
import './style.css' 
import App from './App.vue'
import { Input, Button} from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

createApp(App).mount('#app')


/* 会自动注册 Button 下的子组件, 例如 Button.Group */
app.use(Input).mount('#app');
app.use(Button).mount('#app');


app.config.globalProperties.$message = message;