import { createApp } from 'vue';
import './style.css';
import app from './App.vue';
import { Input, Button, Spin, Alert, Table } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

const antComponents = [Input, Button, Spin, Alert, Table];

const App = createApp(app);

// Use Ant Design Vue components
antComponents.forEach((component) => {
    App.use(component);
});

App.mount('#app');
