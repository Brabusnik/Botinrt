const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')

CommandsCore.cmdInit(/^\+arc (.*)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let username = args[1];

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    if(user.autorestart) {
        return client.write(center(`User already has access to autorestart.`.red.italic, client.getWidth()) + '\n\n')
    }

    user.autorestart = true
    client.write(center(`${username} теперь имеет доступ к авторестарту.`.bgGreen.brightWhite, client.getWidth()) + '\n\n')
})

CommandsCore.cmdInit(/^\-arc (.*)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let username = args[1];

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    if(!user.autorestart) {
        return client.write(center(`User doesn't have access to autorestart.`.red.italic, client.getWidth()) + '\n\n')
    }

    user.autorestart = false
    client.write(center(`${username} больше не имеет доступ к авторестарту.`.bgRed.brightWhite, client.getWidth()) + '\n\n')
})