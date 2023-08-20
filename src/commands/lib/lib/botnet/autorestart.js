const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const { clearWithLogo } = require('../../../../utils/logo')
const sp = require('../../../../utils/sp')
const Table = require('cli-table');

CommandsCore.cmdInit(/^\+ar ([0-9]+) ([0-9]+)$/i, async (client, command, args) => {
    if(!client.user.admin && !client.user.autorestart) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }
    const id = Number(args[1]);
    const interval = Number(args[2]);

    const attack = CommonData.attacks.find(x => x.id === id);

    if(!attack) {
        return client.write(center('Атака не найдена.'.red.italic, client.getWidth()) + '\n\n')
    }
    if(attack.sender !== client.username && !client.user.admin) {
        return client.write(center('Это не ваша атака.'.red.italic, client.getWidth()) + '\n\n')
    }

    if(CommonData.autorestart.find(x => x.uuid === attack.uuid)){
        return client.write(center('Правило для этой атаки уже установлено.'.red.italic, client.getWidth()) + '\n\n')
    }

    CommonData.autorestart.push({
        uuid: attack.uuid,
        interval,
        waiting: 0
    })

    client.write(center(`Авто-рестарт атаки №${attack.id} установлен на ${sp(interval)} сек.`.bgBlue.brightWhite, client.getWidth()) + '\n\n')
})

CommandsCore.cmdInit(/^\-ar ([0-9]+)$/i, async (client, command, args) => {
    if(!client.user.admin && !client.user.autorestart) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }
    const id = Number(args[1]);

    const attack = CommonData.attacks.find(x => x.id === id);

    if(!attack) {
        return client.write(center('Атака не найдена.'.red.italic, client.getWidth()) + '\n\n')
    }
    if(attack.sender !== client.username && !client.user.admin) {
        return client.write(center('Это не ваша атака.'.red.italic, client.getWidth()) + '\n\n')
    }

    const rule = CommonData.autorestart.find(x => x.uuid === attack.uuid)

    if(!rule){
        return client.write(center('Правило не найдено.'.red.italic, client.getWidth()) + '\n\n')
    }

    CommonData.autorestart.splice(CommonData.autorestart.indexOf(rule), 1);

    return client.write(center(`Авто-рестарт атаки №${attack.id} отключён.`.bgRed.brightWhite, client.getWidth()) + '\n\n')
})