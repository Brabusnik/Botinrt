const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')
const config = require('../../../../../config')

CommandsCore.cmdInit(/^\+user ([A-Za-z0-9]+) ([A-Za-z0-9]+) ([0-9]+)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let username = args[1];
    let password = args[2];
    const endUnix = Number(args[3]);

    if(!username)  return client.write(center('Username is incorrect.'.red.italic, client.getWidth()) + '\n\n')
    if(!password) return client.write(center('Password is incorrect.'.red.italic, client.getWidth()) + '\n\n')
    if(!endUnix) return client.write(center('EndUnix is incorrect.'.red.italic, client.getWidth()) + '\n\n')

    username = username.trim()
    password = password.trim()

    if(username.length < 2) return client.write(center('Min username length - 2'.red.italic, client.getWidth()) + '\n\n')
    if(username.length > 15) return client.write(center('Max username length - 15'.red.italic, client.getWidth()) + '\n\n')

    if(password.length < 1) return client.write(center('Min password length - 1'.red.italic, client.getWidth()) + '\n\n')
    if(password.length > 30) return client.write(center('Max password length - 30'.red.italic, client.getWidth()) + '\n\n')

    if(CommonData.users.find(user => user.username === username)) {
        return client.write(center('User already exists.'.red.italic, client.getWidth()) + '\n\n')
    }

    CommonData.users.push({
        username,
        password,
        admin: false,
        autorestart: false,
        endUnix,
        network: config.DefaultNetworkname,
        limits: {
            maxTime: 0,
            maxConcs: 0,
            methods: {}
        }
    })

    return client.write(center(`Пользователь ${username} добавлен.`.bgGreen.brightWhite, client.getWidth()) + '\n\n')
})

CommandsCore.cmdInit(/^\-user (.*)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let username = args[1];

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    CommonData.users.splice(CommonData.users.indexOf(user), 1)

    return client.write(center(`Пользователь ${username} удалён.`.bgRed.brightWhite, client.getWidth()) + '\n\n')
})