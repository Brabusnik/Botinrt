const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')
const Table = require('cli-table')
const gradient = require('gradient-string')
const blue = gradient(['#1f75ff', '#1f75ff'])
const moment = require('moment')

CommandsCore.cmdInit(/^ips (.*)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let username = args[1];

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    const table = new Table({
        head: [blue('IP-адрес'), blue('Last Unix')],
    });

    if(!user.ips) user.ips = []

    let sortedIps = user.ips.slice().sort((a, b) => b.lastUnix - a.lastUnix);

    for(const ipObj of sortedIps) {
        table.push([ ipObj.ip, moment.unix(ipObj.lastUnix / 1000).format("DD.MM.YYYY, HH:mm") ])
    }

    return client.write(table.toString() + '\n')
})