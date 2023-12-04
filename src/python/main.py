import socket
import struct
import sys

def create_icmp_socket():
    icmp = socket.getprotobyname("icmp")
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_RAW, icmp)
    except socket.error as e:
        if e.errno == 1:
            raise socket.error("ICMP messages can only be sent from processes running as root.")
        raise
    return s

def send_icmp_request(s, host, ttl):
    if sys.platform.startswith('win'):
        # On Windows, use IPPROTO_IP for setting IP_TTL
        s.setsockopt(socket.IPPROTO_IP, socket.IP_TTL, ttl)
    else:
        # On Unix-like systems, use SOL_IP for setting IP_TTL
        s.setsockopt(socket.SOL_IP, socket.IP_TTL, ttl)

    s.sendto(b"", (host, 1))

def receive_icmp_reply(s, timeout):
    s.settimeout(timeout)
    try:
        data, addr = s.recvfrom(1024)
        return addr[0]
    except socket.timeout:
        return None

def traceroute(destination, max_hops=30, timeout=1):
    destination_ip = socket.gethostbyname(destination)
    print(f"Traceroute to {destination} ({destination_ip}), max hops: {max_hops}")

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
    destination_host = "example.com" if len(sys.argv) < 2 else sys.argv[1]
    max_hops = 30 if len(sys.argv) < 3 else int(sys.argv[2])
    traceroute(destination_host, max_hops)
