const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const { clearWithLogo } = require('../../../../utils/logo')
const sp = require('../../../../utils/sp')
const Table = require('cli-table');
const config = require('../../../../../config')

CommandsCore.cmdInit(/^list(?:\s(all)|)$/i, async (client, command, args) => {
    let all = false;
    if(args[1] === "all") {
        if(!client.user.admin) {
            return client.write(center('У вас нет прав.'.red.italic, client.getWidth()) + '\n\n')
        } else all = true;
    }

    let attacks = CommonData.attacks.filter(attack => attack.end >= Date.now() && (attack.network === client.user.network || client.user.network === config.GlobalNetworkName))
    if(!all) attacks = attacks.filter(attack => attack.sender === client.username)

    // создаем новую таблицу
    //const colWidth = Math.floor(client.getWidth() * 0.7 / 8) + 1
    const table = new Table({
        head: ['ID', 'URL', 'Method', 'Threads', 'Time', 'AR'],
        //colWidths: [colWidth, colWidth, colWidth, colWidth, colWidth]
    });

    //client.write(center(all ? 'Активные атаки всех пользователей:'.bgCyan.brightWhite : 'Активные атаки:'.bgCyan.brightWhite, client.getWidth()) + '\n\n')

    for(const attack of attacks) {
        const autorestart = CommonData.autorestart.find(x => x.uuid === attack.uuid);
        table.push(
            [
                attack.id,
                attack.url,
                attack.method,
                attack.threads,
                sp(Math.round((attack.end - Date.now()) / 1000)),
                autorestart?.interval || '-'
            ]
        );

    }

    if(table.length < 1) {
        table.push(
            [ '-', '-', '-', '-', '-', '-' ]
        );
    }

    client.write(`   ${all ? 'Все' : 'Ваши'} атаки:   `.bgBlue.brightWhite + '\n' + table.toString() + '\n\n')

    return;
})