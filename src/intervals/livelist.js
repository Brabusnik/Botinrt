const { Interval } = require('simple-scheduler-task')
const CommonData = require('../common/data')
const Botnet = require('../botnet/core')
const handleCommand = require('../commands/handler')
const { clearWithLogo } = require('../utils/logo')

new Interval({
    intervalTimer: 1000,
    source: async function () {
        for(const client of CommonData.clients.filter(x => x.livelist)) {
            if(client.livelist === 1) {
                client.write(clearWithLogo(client))
                handleCommand(client, 'list', true)
                client.write('\tНажмите ENTER для остановки.\n\n'.bgRed.brightWhite)
            } else if(client.livelist === 2) {
                client.write(clearWithLogo(client))
                handleCommand(client, 'list all', true)
                client.write('\tНажмите ENTER для остановки.\n\n'.bgRed.brightWhite)
            }
        }
    }
});