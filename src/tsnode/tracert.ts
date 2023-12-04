// 导入需要的模块
import { Flag } from './flag';
import { Hop, Process } from './process';

// Tracert 类继承自 Process 类
export class Tracert extends Process {
    // 构造函数，接受 IP 版本作为参数
    constructor(ipVersion = '') {
        // 设置 tracert 命令的参数
        const args = ['-d'];

        // 获取 IP 版本对应的标志并添加到参数列表中
        const ipFlag = Flag.getIpFlag(ipVersion);
        if (ipFlag) {
            args.push(ipFlag);
        }

        // 调用父类的构造函数，传递命令名称和参数
        super('tracert', args);
    }

    // 解析目标地址信息的方法，接受原始数据字符串，返回解析后的目标地址或 null
    public parseDestination(data: string): string | null {
        // 使用正则表达式匹配 tracert 输出中的目标地址信息
        const regex = /^Tracing\sroute\sto\s([a-zA-Z0-9:.]+)\s(?:\[([a-zA-Z0-9:.]+)\])?/;
        const parsedData = new RegExp(regex, '').exec(data);

        let result = null;
        // 如果匹配成功，提取目标地址信息
        if (parsedData !== null) {
            // 确定目标地址是否包含在方括号中
            if (parsedData[2] !== undefined) {
                result = parsedData[2];
            }
            else {
                result = parsedData[1];
            }
        }

        return result;
    }

    // 解析每一跳信息的方法，接受原始数据字符串，返回解析后的 Hop 对象或 null
    public parseHop(hopData: string): Hop | null {
        // 使用正则表达式匹配 tracert 输出中的每一跳信息
        const regex = /^\s*(\d*)\s*(<?\d+\sms|\*)\s*(<?\d+\sms|\*)\s*(<?\d+\sms|\*)\s*([a-zA-Z0-9:.\s]+)/;
        const parsedData = new RegExp(regex, '').exec(hopData);

        let result: Hop | null = null;
        // 如果匹配成功，提取每一跳的信息
        if (parsedData !== null) {
            result = {
                hop: parseInt(parsedData[1], 10),
                rtt1: parsedData[2],
                rtt2: parsedData[3],
                rtt3: parsedData[4],
                ip: parsedData[5].trim()
            };
        }

        return result;
    }
}
