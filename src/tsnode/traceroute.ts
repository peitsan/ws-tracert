// 导入需要的模块
import { Flag } from './flag';
import { Hop, Process } from './process';

// Traceroute 类继承自 Process 类
export class Traceroute extends Process {
    // 构造函数，接受 IP 版本和发送等待时间作为参数
    constructor(ipVersion = '', sendwait = 0) {
        // 设置 traceroute 命令的参数
        const args = ['-q', '1', '-z', `${sendwait}`, '-n'];

        // 获取 IP 版本对应的标志并添加到参数列表中
        const ipFlag = Flag.getIpFlag(ipVersion);
        if (ipFlag) {
            args.push(ipFlag);
        }

        // 调用父类的构造函数，传递命令名称和参数
        super('traceroute', args);
    }

    // 解析目标地址信息的方法，接受原始数据字符串，返回解析后的目标地址或 null
    public parseDestination(data: string): string | null {
        // 使用正则表达式匹配 traceroute 输出中的目标地址信息
        const regex = /^traceroute\sto\s(?:[a-zA-Z0-9:.]+)\s\(([a-zA-Z0-9:.]+)\)/;
        const parsedData = new RegExp(regex, '').exec(data);

        let result = null;
        // 如果匹配成功，提取目标地址信息
        if (parsedData !== null) {
            result = parsedData[1];
        }

        return result;
    }

    // 解析每一跳信息的方法，接受原始数据字符串，返回解析后的 Hop 对象或 null
    public parseHop(hopData: string): Hop | null {
        // 使用正则表达式匹配 traceroute 输出中的每一跳信息
        const regex = /^\s*(\d+)\s+(?:([a-zA-Z0-9:.]+)\s+([0-9.]+\s+ms)|(\*))/;
        const parsedData = new RegExp(regex, '').exec(hopData);

        let result: Hop | null = null;
        // 如果匹配成功，提取每一跳的信息
        if (parsedData !== null) {
            // 根据匹配的组数确定是否为星号（*）表示的数据
            if (parsedData[4] === undefined) {
                result = {
                    hop: parseInt(parsedData[1], 10),
                    ip: parsedData[2],
                    rtt1: parsedData[3]
                };
            }
            else {
                result = {
                    hop: parseInt(parsedData[1], 10),
                    ip: parsedData[4],
                    rtt1: parsedData[4]
                };
            }
        }

        return result;
    }
}
