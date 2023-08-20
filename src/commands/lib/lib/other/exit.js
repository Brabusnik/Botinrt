const CommandsCore = require('../../core')
const title = require('../../../../utils/title')

CommandsCore.cmdInit(/^exit$/i, async (client, command, args) => {
    client.write(title('MerusBotNet | Выход из системы.'))
    client.end()
})