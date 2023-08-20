const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')
const Table = require('cli-table')
const gradient = require('gradient-string')
const blue = gradient(['#1f75ff', '#1f75ff'])
const moment = require('moment')

CommandsCore.cmdInit(/^cll (.*)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    delete user.lastOnline

    return client.write(`\tИнформация о последнем онлайне ${user.username} очищена.`.bgBlue.brightWhite + '\n\n')
})