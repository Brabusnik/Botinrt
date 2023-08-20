const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')

CommandsCore.cmdInit(/^stop all$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let success = 0;
    let errors = 0;
    let internalErrors = 0;

    for(const server of CommonData.servers[client.user.network]) {
        const serverNum = Number(CommonData.servers[client.user.network].indexOf(server))
        let status = "OK".brightGreen
        const res = await Botnet.stopAll(server);
        if(!res) {
            status = "ERROR".brightRed
            errors++;
        } else if(!res.success) {
            status = "INTERNAL ERROR".brightRed
            internalErrors++;
        } else success++;
        client.write(`Сервер №${serverNum + 1} `.brightWhite.bold + '.'.gray.repeat(client.getWidth() / 2 - serverNum.toString().length) + " " + status + '\n')
    }

    CommonData.attacks = []

    client.write(clearWithLogo(client))
    client.write(`\tВсе атаки остановлены.`.bgRed.brightWhite + '\n\n'
    + '\tSuccess: '.white + success.toString().green + '\n'
    + '\tErrors: '.white + errors.toString().red + '\n'
    + '\tInternalErrors: '.white + internalErrors.toString().red + '\n\n')
})