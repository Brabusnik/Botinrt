const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')
const Table = require('cli-table')
const sleep = require('../../../../utils/sleep')
const gradient = require('gradient-string')

const green = gradient(['#36D917', '#36D917'])
const blue = gradient(['#1f75ff', '#1f75ff'])

CommandsCore.cmdInit(/^check$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    const table = new Table({
        head: ['', 'Статус'.brightWhite, 'Мониторинг'.brightWhite],
    });

    for(const server of CommonData.servers[client.user.network]) {
        const serverNum = Number(CommonData.servers[client.user.network].indexOf(server))
        let status = "OK"
        const res = await Botnet.shell('test', server);
        if(!res) status = "ERROR".brightRed
        else if(!res.success) status = "INTERNAL ERROR".brightRed
        const toPush = {}
        const key = blue(`Сервер №${serverNum + 1}`)
        toPush[key] = [status === "OK" ? green(status) : status, `http://${server}:5555/`]
        table.push(toPush)
        if(status === "OK") status = "OK".brightGreen
        client.write(`Сервер №${serverNum + 1} `.brightWhite.bold + '.'.gray.repeat(client.getWidth() / 2 - serverNum.toString().length) + " " + status + '\n')
    }

    client.write(clearWithLogo(client))
    client.write(table.toString() + '\n\n')
})