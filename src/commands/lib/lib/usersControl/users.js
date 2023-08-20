const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const Botnet = require('../../../../botnet/core')
const { clearWithLogo } = require('../../../../utils/logo')
const gradient = require('gradient-string')
const { adminPromtGradient } = require('../../../../utils/gradients')
const getDays = require('../../../../utils/getDays')
const Table = require('cli-table')

const green = gradient(['#36D917', '#36D917'])

CommandsCore.cmdInit(/^users$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    // let users = '';
    // for(const user of CommonData.users.filter(x => !x.admin)) {
    //     users += `${user.username}, `
    // }
    // users = users.substring(0, users.length - 2).trim();

    // let admins = '';
    // for(const admin of CommonData.users.filter(x => x.admin)) {
    //     admins += `${admin.username}, `
    // }
    // admins = admins.substring(0, admins.length - 2).trim();

    // return client.write('\tСписок пользователей: '.brightGreen.bold + users + '\n\n'
    // + '\tСписок администраторов: '.brightRed.bold + admins.brightWhite + '\n\n')

    const table = new Table({
        head: [adminPromtGradient('Admins'), green('Users')],
    });

    const arr1 = CommonData.users.filter(x => x.admin)
    const arr2 = CommonData.users.filter(x => !x.admin)

    for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
        if(!arr1[i] && !arr2[i]) continue
        const str1 = arr1[i] ? `${arr1[i].username.brightWhite}${Math.round(getDays(arr1[i].endUnix)) < 0 ? '*'.red : ''}` : ''
        const str2 = arr2[i] ? `${arr2[i].username.brightWhite}${Math.round(getDays(arr2[i].endUnix)) < 0 ? '*'.red : ''}` : ''
        table.push([str1, str2]);
    }

    return client.write('   Пользователи:   '.bgBlue.brightWhite + '\n' + table.toString() + '\n')
})