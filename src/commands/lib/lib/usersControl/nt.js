const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')

CommandsCore.cmdInit(/^nt ([A-Za-z0-9]+) ([A-Za-z0-9\-_\+]+)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let username = args[1];

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    let network = args[2]?.trim()
    if(!network || !CommonData.servers[network]) {
        return client.write(center('Invalid network.'.red.italic, client.getWidth()) + '\n\n')
    }

    user.network = network
    client.write(center(`Сеть для ${username} установлена.`.bgGreen.brightWhite, client.getWidth()) + '\n\n')
})