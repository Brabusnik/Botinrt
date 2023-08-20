const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const { clearWithLogo } = require('../../../../utils/logo')
const sp = require('../../../../utils/sp')
const Table = require('cli-table');
const getDays = require('../../../../utils/getDays')
const { adminGradient } = require('../../../../utils/gradients')
const assets = require('../../../../tools/assets')
const gradient = require('gradient-string')
const green = gradient(['#36D917', '#36D917'])
const moment = require('moment')
const descGradient = gradient(['#FFFFFF', '#A9A9A9', '#FFFFFF', '#A9A9A9', '#FFFFFF']);

CommandsCore.cmdInit(/^getuser (.*)$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    const user = CommonData.users.find(x => x.username === args[1])
    if(!user) {
        return client.write(center('Пользователь не найден.'.red.italic, client.getWidth()) + '\n\n')
    }

    if(!user.ips) user.ips = []
    const lastOnline = user.lastOnline ? moment.unix(user.lastOnline / 1000).format("DD.MM.YYYY, HH:mm") : 'No data'
    const IPFindRes = user.ips.find(x => x.lastUnix === user.lastOnline)
    const ipForLastOnline = lastOnline !== 'No data' && IPFindRes ? IPFindRes.ip : 'No data'

    const userClient = CommonData.clients.find(x => x.user?.username === user.username)

    const days = Math.round(getDays(user.endUnix))

    let str = ' ' + (user.admin ? adminGradient(`[Admin] ${user.username}`) : `[User] ${user.username}`.brightGreen.bold) + '\n'
    + '  Days: '.brightWhite + (days < 0 ? `[Expired ${Math.abs(days)} days ago]`.red : Math.round(getDays(user.endUnix)).toString()) + '\n'
    + '  Password: '.brightWhite + user.password + '\n'
    + '  Promt: '.brightWhite + "'" + assets.getPromt(user) + "'" + '\n\n'
    + '  ' + `${userClient ? green('Online!') + `${!user.ipLoggerBypass ? ' - ' + descGradient(userClient.ip) : ''}` : 'Last online: '.brightWhite + lastOnline}` + '\n'
    + (!userClient && !user.ipLoggerBypass ? '  Last IP: '.brightWhite + `${ipForLastOnline === 'No data' ? ipForLastOnline : descGradient(ipForLastOnline)}` : '') + '\n'
    + '  IP Logger Bypass: '.brightWhite + (user.ipLoggerBypass ? 'Yes' : 'No') + '\n\n'
    + '  Network: '.brightWhite + user.network + '\n\n'
    + '  Auto-Restart: '.brightWhite + `${user.autorestart ? "Yes" : "No"}` + '\n'
    + '  Max Time: '.brightWhite + `${user.limits?.maxTime || "No"}` + '\n'
    + '  Max Concs: '.brightWhite + `${user.limits?.maxConcs || "No"}` + '\n'
    + '\n'

    if(user.limits?.methods && Object.keys(user.limits.methods)?.length > 0) {
        const head = [""]
        const leftHead = []
        const body = []

        for(const i of Object.keys(user.limits.methods)) {
            const method = user.limits.methods[i]
            if(!head.find(x => x === i)) head.push(i)
            Object.keys(method).forEach(key => {
                if(!leftHead.find(x => x === key)) leftHead.push(key)
            })
        }
        
        for(const key of leftHead) {
            const toPush = {}
            toPush[key] = []
            for(const i of Object.keys(user.limits.methods)) {
                const method = user.limits.methods[i]
                toPush[key].push(method[key] || "-")
            }
            body.push(toPush)
        }

        const table = new Table({ head });
        body.forEach(obj => table.push(obj))
        str += '\n   Limits:   '.bgBlue.brightWhite + '\n'
        str += table.toString() + '\n'
    }

    return client.write(str)
})