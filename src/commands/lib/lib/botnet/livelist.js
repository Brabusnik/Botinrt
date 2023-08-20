const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')

CommandsCore.cmdInit(/^livelist(?:\s(all)|)$/i, async (client, command, args) => {
    let all = false;
    if(args[1] === "all") {
        if(!client.user.admin) {
            return client.write(center('У вас нет прав.'.red.italic, client.getWidth()) + '\n\n')
        } else all = true;
    }

    client.livelist = all ? 2 : 1
    return client.write(`\tАктивация...`.bgBlue.brightWhite + '\n\n')
})