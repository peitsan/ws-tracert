import events from 'events';
import readline from 'readline';
import validator from 'validator';
import { spawn } from 'child_process';

// 定义 Hop 接口，表示每一跳的信息
export interface Hop {
    hop: number;     // 跳数
    ip: string;      // IP 地址
    rtt1: string;    // 往返时间1
    rtt2?: string;   // 往返时间2
    rtt3?: string;   // 往返时间3
}

// 抽象类 Process 继承自 EventEmitter 类
export abstract class Process extends events.EventEmitter {
    // 构造函数，接受命令和参数
    constructor(private command: string, private args: string[]) {
        super();
    }

    // 开始 trace 的方法，接受域名作为参数
    public trace(domainName: string): void {
        // 如果是本机地址，抛出异常
        if (domainName == "localhost" || domainName =="127.0.0.1")
            throw "It's a local host";
        // 如果域名不合法，抛出异常
        else if (!this.isValidDomainName(domainName)) {
            throw "Invalid domain name or IP address";
        }

        // 将域名添加到参数列表中
        this.args.push(domainName);

        // 使用 spawn 创建子进程
        const process = spawn(this.command, this.args);
        // 监听进程关闭事件
        process.on('close', (code) => {
            this.emit('close', code);
        });

        // 发送进程ID事件
        this.emit('pid', process.pid);

        let isDestinationCaptured = false;
        if (process.pid) {
            // 使用 readline 逐行读取子进程的标准输出
            readline.createInterface({
                    input: process.stdout,
                    terminal: false
                })
                .on('line', (line) => {
                    if (!isDestinationCaptured) {
                        // 如果目标地址未捕获，尝试解析目标地址
                        const destination = this.parseDestination(line);
                        if (destination !== null) {
                            // 发送目标地址事件
                            this.emit('destination', destination);
                            isDestinationCaptured = true;
                        }
                    }

                    // 尝试解析每一跳的信息
                    const hop = this.parseHop(line);
                    if (hop !== null) {
                        // 发送每一跳的信息事件
                        this.emit('hop', hop);
                    }
                });
        }
    }

    // 判断域名是否合法的私有方法
    private isValidDomainName(domainName: string): boolean {
        return validator.isFQDN(domainName + '') || validator.isIP(domainName + '');
    }

    // 抽象方法，解析目标地址信息
    abstract parseDestination(data: string): string | null;
    
    // 抽象方法，解析每一跳的信息
    abstract parseHop(hopData: string): Hop | null;
}
