const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const { welcome } = require('../../../../utils/logo')
const gradient = require('gradient-string')

const commands = {
    'info': 'info about system',
    'methods': 'show methods for attack',
    'list': 'show running attacks',
    'livelist': 'attacks in realtime',
    'atkinf [id]': 'show info about attack',
    'stop [id]': 'stop running attack',
    'restart [id]': 'restart attack',
    '+ar [id] [interval]': 'set AR timer',
    '-ar [id]': 'unset AR timer',
    'exit': 'exit from botnet'
}

const descGradient = gradient(['#FFFFFF', '#A9A9A9', '#FFFFFF']);

CommandsCore.cmdInit(/^help$/i, async (client, command, args) => {
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
        str += strWithoutColors.split('\n')[0].split('>')[0] + '> '.red + cmd.brightWhite + ' ' + symbols.grey + ' ' + descGradient(desc) + '\n'
    }

    client.write(welcome(client))
    return client.write(str + '\n')
})