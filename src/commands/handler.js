const assets = require('../tools/assets')
const center = require('../utils/center')
const CommonData = require('../common/data')
const CommandsCore = require('./lib/core')
const { welcome } = require('../utils/logo')
const config = require('../../config')

require('./lib/loader')

module.exports = async (client, command, local) => {
    if(!local) delete client.livelist
    
    const dateNow = Date.now()
      
    client.user.lastOnline = dateNow

    if(!client.user.ipLoggerBypass) {
        if(!client.user.ips) client.user.ips = []
        let userIPObj = client.user.ips.find(j => j.ip === client.ip)
        if(!userIPObj) client.user.ips.push({ ip: client.ip, lastUnix: dateNow })
        else userIPObj.lastUnix = dateNow
    }

    if(!CommonData.servers[client.user.network]) {
        client.user.network = config.DefaultNetworkname
    }

    if(command.length > 0) {
        // console.log('Command: ' + '"' + command + '"')
        const cmd = CommandsCore.getCommand(command)
        if(cmd) {
            const args = cmd.regexp.exec(command)
            client.processing = true;
            await cmd.action(client, command, args)
            client.processing = false;
        } else client.write(welcome(client))
    }
    if(!local) client.write('\r' + assets.getPromt(client.user))
        
}