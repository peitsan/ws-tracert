import ws from 'ws';
import Traceroute from '../tsnode/index';

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    ws.on('message', (host) => {
    console.log('Host(Domain/IP): %s', host);
    traceroute(host);
    });
   
    ws.send('something');
   });



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
