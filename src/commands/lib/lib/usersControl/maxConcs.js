const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')

CommandsCore.cmdInit(/^mcs ([A-Za-z0-9]+) ([0-9]+)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let username = args[1];

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    let maxConcs = Number(args[2])
    if(!maxConcs  || maxConcs < 0) {
        if(maxConcs !== 0) return client.write(center('Invalid maxConcs.'.red.italic, client.getWidth()) + '\n\n')
    }

    if(!user.limits) user.limits = {}

    user.limits.maxConcs = maxConcs
    client.write(center(`Максимальное количество одновременных атак ${username} установлено.`.bgGreen.brightWhite, client.getWidth()) + '\n\n')
})