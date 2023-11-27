import Traceroute from '../tsnode/index';

export function test() {
try {
    const tracer = new Traceroute();
    tracer
        .on('pid', (pid) => {
            console.log(`进程号/pid: ${pid}`);
        })
        .on('destination', (destination) => {
            console.log(`Trace目标主机/destination: ${destination}`);
        })
        .on('hop', (hop) => {
            console.log(`跳数/hop: ${JSON.stringify(hop)}`);
        })
        .on('close', (code) => {
            console.log(`结束/close: code ${code}`);
        });

    tracer.trace('github.com');
} catch (ex) {
    console.log(ex);
}
}

test();

