import socket
import struct
import sys

def create_icmp_socket():
    # 获取 ICMP 协议号
    icmp = socket.getprotobyname("icmp")
    
    try:
        # 创建原始套接字用于 ICMP 通信
        s = socket.socket(socket.AF_INET, socket.SOCK_RAW, icmp)
    except socket.error as e:
        if e.errno == 1:
            raise socket.error("只有以 root 权限运行的进程才能发送 ICMP 消息。")
        raise
    return s

def send_icmp_request(s, host, ttl):
    # 根据操作系统设置 TTL 选项
    if sys.platform.startswith('win'):
        s.setsockopt(socket.IPPROTO_IP, socket.IP_TTL, ttl)
    else:
        s.setsockopt(socket.SOL_IP, socket.IP_TTL, ttl)

    # 发送空的 ICMP 请求消息
    s.sendto(b"", (host, 1))

def receive_icmp_reply(s, timeout):
    # 设置接收超时时间
    s.settimeout(timeout)
    try:
        # 接收 ICMP 回复消息
        data, addr = s.recvfrom(1024)
        return addr[0]
    except socket.timeout:
        return None

def traceroute(destination, max_hops=30, timeout=1):
    # 获取目标主机的 IP 地址
    destination_ip = socket.gethostbyname(destination)
    print(f"Traceroute to {destination} ({destination_ip}), max hops: {max_hops}")

    # 逐跃地进行 Traceroute
    for ttl in range(1, max_hops + 1):
        s = create_icmp_socket()
        send_icmp_request(s, destination_ip, ttl)
        addr = receive_icmp_reply(s, timeout)
        s.close()

        if addr:
            print(f"{ttl}: {addr}")
            if addr == destination_ip:
                break
        else:
            print(f"{ttl}: *")

if __name__ == "__main__":
    # 从命令行参数获取目标主机和最大跃点数
    destination_host = "example.com" if len(sys.argv) < 2 else sys.argv[1]
    max_hops = 30 if len(sys.argv) < 3 else int(sys.argv[2])
    traceroute(destination_host, max_hops)