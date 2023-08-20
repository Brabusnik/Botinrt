const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')

CommandsCore.cmdInit(/^cp ([A-Za-z0-9]+) (.*)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let username = args[1];
    let password = args[2]?.trim();

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    if(password.length < 1) return client.write(center('Min password length - 1'.red.italic, client.getWidth()) + '\n\n')
    if(password.length > 30) return client.write(center('Max password length - 30'.red.italic, client.getWidth()) + '\n\n')

    user.password = password

    client.write(center(`Пароль ${username} изменён.`.bgGreen.brightWhite, client.getWidth()) + '\n\n')
})