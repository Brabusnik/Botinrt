const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const { clearWithLogo } = require('../../../../utils/logo')
const sp = require('../../../../utils/sp')
const Table = require('cli-table');
const config = require('../../../../../config')

CommandsCore.cmdInit(/^atkinf ([0-9]+)$/i, async (client, command, args) => {
    const attack = CommonData.attacks.find(x => x.id === Number(args[1]) && (x.network === client.user.network || client.user.network === config.GlobalNetworkName))
    if(!attack) {
        return client.write(center('Атака не найдена.'.red.italic, client.getWidth()) + '\n\n')
    }
    if(attack.sender !== client.username && !client.user.admin) {
        return client.write(center('Это не ваша атака.'.red.italic, client.getWidth()) + '\n\n')
    }

    //client.write(clearWithLogo(client))

    const autorestart = CommonData.autorestart.find(x => x.uuid === attack.uuid);

    client.write(`\t   Атака №${attack.id}   `.bgCyan.brightWhite.bold + '\n\n'
    + '\tURL: '.brightBlue + attack.url.brightWhite + '\n'
    + '\tMethod: '.brightBlue + attack.method.brightWhite + '\n'
    + '\tThreads: '.brightBlue + attack.threads.toString().brightWhite + '\n'
    + '\tTime left: '.brightBlue + `${sp(Math.round((attack.end - Date.now()) / 1000))} seconds`.brightWhite + '\n'
    + '\tAuto-Restart: '.brightBlue + (autorestart ? `${sp(autorestart.interval)} seconds`.brightWhite : 'No'.brightWhite) + '\n\n'
    + '\tNetwork: '.brightBlue + attack.network.brightWhite + '\n\n'
    + '\tSuccess: '.white + attack.status.success.toString().green + '\n'
    + '\tErrors: '.white + attack.status.errors.toString().red + '\n'
    + '\tInternalErrors: '.white + attack.status.internalErrors.toString().red + '\n\n')
})