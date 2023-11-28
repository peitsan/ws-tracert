interface HopData {
    hop: number;
    rtt1: string;
    rtt2: string;
    rtt3: string;
    ip: string;
  }
  
  interface TracerouteResult {
    pid: number;
    hop: HopData[];
    code: number;
  }
  
  export function parseTraceOutput(output: string): TracerouteResult {
    const lines = output.trim().split('\n');
    const result: TracerouteResult = { pid: 0, hop: [] , code: 0};
  
    for (const line of lines) {
      const matchPid = line.match(/^pid: (\d+)/);
      if (matchPid) {
        result.pid = parseInt(matchPid[1], 10);
      }
  
      const matchHop = line.match(/^hop: (.+)$/);
      if (matchHop) {
        try {
          const hopData = JSON.parse(matchHop[1]);
          result.hop.push(hopData);
        } catch (error) {
          console.error(`Error parsing hop data: ${error}`);
        }
      }
  
      const matchClose = line.match(/^close: code (\d+)/);
      if (matchClose) {
        result.code = parseInt(matchClose[1], 10);
        // Handle close event if needed
      }
    }
  
    return result;
  }