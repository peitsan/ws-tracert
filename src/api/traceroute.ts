import Traceroute from '../tsnode/index';
// import ws from 'ws';

const args = process.argv.slice(2); // 获取命令行参数

function traceroute(host: string) {
    try {
    const tracer = new Traceroute();
    tracer
        .on('pid', (pid) => {
            console.log(`pid: ${pid}`);
        })
        .on('destination', (destination) => {
            console.log(`destination: ${destination}`);
        })
        .on('hop', (hop) => {
            console.log(`hop: ${JSON.stringify(hop)}`);
        })
        .on('close', (code) => {
            console.log(`close: code ${code}`);
        });

    tracer.trace(host);
} catch (ex) {
    console.log(ex);
}
}

//执行tracert命令
traceroute(args[0]);
