const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')

CommandsCore.cmdInit(/^\+csg ([A-Za-z0-9]+) (#[A-Za-z0-9]+) (#[A-Za-z0-9]+)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let username = args[1];
    let hex1 = args[2].trim();
    let hex2 = args[3].trim();

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    if(hex1.length !== 7 || hex2.length !== 7) return client.write(center('Valid hex length - 6'.red.italic, client.getWidth()) + '\n\n')

    user.csg = [hex1, hex2]

    client.write(center(`Promt's color ${username} setted.`.bgGreen.brightWhite, client.getWidth()) + '\n\n')
})

CommandsCore.cmdInit(/^\-csg ([A-Za-z0-9]+)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let username = args[1];

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    if(!user.csg || user.csg.length < 1) {
        return client.write(center(`User doesn't have promt's gradient.`.red.italic, client.getWidth()) + '\n\n')
    }

    user.csg = []

    client.write(center(`Promt's gradient ${username} deleted.`.bgRed.brightWhite, client.getWidth()) + '\n\n')
})