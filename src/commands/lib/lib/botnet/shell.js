const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')

CommandsCore.cmdInit(/^(?:(\#)|)\$(?:\s|)(.*)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    const output = args[1] === "#" ? true : false

    let success = 0;
    let errors = 0;
    let internalErrors = 0;

    const responces = []

    for(const server of CommonData.servers[client.user.network]) {
        const serverNum = Number(CommonData.servers[client.user.network].indexOf(server))
        let status = "OK".brightGreen
        const res = await Botnet.shell(args[2], server);
        responces.push(res)
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
    client.write(`\tКоманда отправлена.`.bgBlue.brightWhite + '\n\n'
    + '\tSuccess: '.white + success.toString().green + '\n'
    + '\tErrors: '.white + errors.toString().red + '\n'
    + '\tInternalErrors: '.white + internalErrors.toString().red + '\n\n')

    if(output) {
        client.write('  Output: '.yellow + JSON.stringify(responces).gray + '\n\n')
    }
})