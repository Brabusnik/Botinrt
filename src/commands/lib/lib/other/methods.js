const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const { welcome } = require('../../../../utils/logo')
const gradient = require('gradient-string')
const colors = require('colors');

const yellow = gradient(['#ffff00', '#ffff00'])

const methods = {
    'raw': { desc: 'HTTP high r/s raw flood', symbol: '!'.brightGreen },
    'hget': { desc: 'HTTP/1 flood for one page', symbol: yellow('!') },
    'hgetV2': { desc: 'HTTP/2 flood for one page', symbol: yellow('!') },
    'spider': { desc: 'HTTP/1 flood with crawler', symbol: yellow('!') },
    'spiderV2': { desc: 'HTTP/2 flood with crawler', symbol: yellow('!') },
    'browser': { desc: 'HTTP browser emulation', symbol: '!'.brightRed },
    'browserV2': { desc: 'HTTP browser alternative', symbol: '!'.brightRed },
}

const method = {
    'ovh-tcp': { desc: 'L4 high r/s raw flood', symbol: '!'.brightGreen },
}

const descGradient = gradient(['#FFFFFF', '#A9A9A9', '#FFFFFF', '#A9A9A9', '#FFFFFF']);
const pGradient = gradient(['#FF033E', '#FF033E'])

CommandsCore.cmdInit(/^(?:|method(?:s|)|atk|attack)$/i, async (client, command, args) => {
    let str = ''
    // let str = ' Preset'.brightWhite + ': '.red + '!method '.brightWhite
    // + '<'.red + 'url'.brightWhite + '> '.red
    // + '<'.red + 'time'.brightWhite + '> '.red
    // + '<'.red + 'threads'.brightWhite + '>'.red
    // + '\n' + ' Example'.brightWhite + ': '.red + '!spider https://google.com 60 2'.brightWhite + '\n\n'

    let beforeFirstP = Math.floor(client.getWidth() * 0.17)

    let strWithoutColors = ''

    for(const method in methods) {
        const desc = methods[method].desc
        let nowBeforeFirstP = Math.abs(beforeFirstP - method.length)
        let doters = Math.abs(Math.floor(client.getWidth() - method.length - 10 - nowBeforeFirstP - desc.length))
        strWithoutColors = '!.' + method + ' '.repeat(nowBeforeFirstP) + '"' + ' ' + desc + '.'.repeat(doters) + '.!' + '\n'
    }

    strWithoutColors = center(strWithoutColors, client.getWidth()).split('\n')[0]

    for(const method in methods) {
        const desc = methods[method].desc
        const symbol = methods[method].symbol
        let nowBeforeFirstP = Math.abs(beforeFirstP - method.length)
        let doters = Math.abs(Math.floor(client.getWidth() - method.length - 10 - nowBeforeFirstP - desc.length))
        str += strWithoutColors.split('!.')[0] + symbol + method.brightWhite + ' ' + ' '.repeat(nowBeforeFirstP) + pGradient('"') + ' ' + descGradient(desc + '.'.repeat(doters)) + ' ' + pGradient('"') + '\n'
    }

    str += '\n' + strWithoutColors.split('!.')[0] + 'Usage'.brightWhite + ': '.red + '!method '.brightWhite
    + '<'.red + 'url'.brightWhite + '> '.red
    + '<'.red + 'time'.brightWhite + '> '.red
    + '<'.red + 'threads'.brightWhite + '> '.red
    + '['.red + 'autorestart'.brightWhite + ']'.red
    + '\n'

    client.write(welcome(client))
    return client.write(str + '\n')
})