const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const config = require('../../../../../config')
const getDays = require('../../../../utils/getDays')
const { adminGradient } = require('../../../../utils/gradients')
const gradient = require('gradient-string')

CommandsCore.cmdInit(/^info$/i, async (client, command, args) => {
    const slots = CommonData.attacks.filter(x => (x.network === client.user.network || client.user.network === config.GlobalNetworkName)).length
    const maxSlots = client.user.network === config.GlobalNetworkName ? config.maxConcs * (Object.keys(CommonData.servers).length - 1) : config.maxConcs
    
    return client.write(' ' + (client.user.admin ? adminGradient(`[Admin] ${client.username}`) : `[User] ${client.username}`.brightGreen.bold) + '\n\n'
    + '  Online: '.brightWhite + CommonData.clients.length.toString() + '\n'
    + '  Slots: '.brightWhite + `${slots}/${maxSlots}` + '\n'
    + '  Days: '.brightWhite + Math.round(getDays(client.user.endUnix)).toString() + '\n\n'
    + '  Network: '.brightWhite + client.user.network + '\n\n'
    + '  Bot: '.brightWhite + bot.user + '\n\n'
    + ' ' + gradient.vice('All commands: help') + '\n\n'
)
})