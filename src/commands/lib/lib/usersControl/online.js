const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const { welcome } = require('../../../../utils/logo')
const gradient = require('gradient-string')
const { adminPromtGradient } = require('../../../../utils/gradients')
const Table = require('cli-table')

const green = gradient(['#36D917', '#36D917'])

CommandsCore.cmdInit(/^online$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    const table = new Table({
        head: [adminPromtGradient('Admins'), green('Users')],
    });

    // for(const tmpClient of CommonData.clients) {
    //     if(tmpClient.user.admin) table.push([tmpClient.user.username.brightWhite, ''])
    //     else table.push(['', tmpClient.user.username.white])
    // }

    const arr1 = CommonData.clients.filter(x => x.user.admin)
    const arr2 = CommonData.clients.filter(x => !x.user.admin)

    for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
        if(!arr1[i] && !arr2[i]) continue
        table.push([arr1[i]?.user?.username.brightWhite || '', arr2[i]?.user?.username || '']);
    }
    
    return client.write(`   Онлайн (${CommonData.clients.length}):   `.bgBlue.brightWhite + '\n' + table.toString() + '\n')
})