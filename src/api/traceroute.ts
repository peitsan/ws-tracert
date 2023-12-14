import Traceroute from '../tsnode/index';

const args = process.argv.slice(2); // 获取命令行参数

function traceroute(host: string) {
    try {
        const tracer = new Traceroute();
        let consecutiveStarCount = 0; // 记录连续的 * 的次数
        let hopCount = 0; // 记录 'hop' 事件执行次数

        tracer
            .on('pid', (pid) => {
                console.log(`pid: ${pid}`);
            })
            .on('destination', (destination) => {
                console.log(`destination: ${destination}`);
            })
            .on('hop', (hop) => {
                console.log(`hop: ${JSON.stringify(hop)}`);
                
                // 记录 'hop' 事件执行次数
                hopCount++;
    
                // 如果 hop 中的 IP 为 *，增加计数器
                if (hop.ip === '*') {
                    consecutiveStarCount++;
    
                    // 如果连续 * 超过四次，触发 timeout 事件并提前结束循环
                    if (consecutiveStarCount === 4) {
                        tracer.emit('timeout');
                    }
                } else {
                    // 如果不是 *，重置计数器
                    consecutiveStarCount = 0;
                }
    
                // 如果 'hop' 事件执行次数达到 15 次，提前结束循环
                if (hopCount === 15) {
                    tracer.emit('complete');
                }
            })
            .on('close', (code) => {
                console.log(`close: code ${code}`);
            })
            .once('timeout', () => {
                console.log('close: code 500');
                // 在这里可以添加循环提前结束后的逻辑
            })
            .once('complete', () => {
                console.log('close: code 0');
                // 在这里可以添加循环提前结束后的逻辑
            });

        tracer.trace(host);
    } catch (ex) {
        console.log(ex);
    }
}

// 执行 tracert 命令
traceroute(args[0]);
