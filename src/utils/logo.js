const center = require('./center')
const assets = require('../tools/assets')

module.exports = {
    clearWithLogo: (client) => {
        return '\x1Bc\n\n' + center(assets.getAsset('MistNet'), client.getWidth()).red + '\n\n'
    },
    welcome: (client) => {
        const centeredWelcome = center('<-- Welcome to MistNet! -->', client.getWidth())
        return centeredWelcome.split('<')[0] + '<-- Welcome to MistNet! -->'.bgRed.brightWhite + centeredWelcome.split('>')[1] + '\n\n'
    },
    clearWithAuthLogo: (client) => {
        return '\x1Bc\n\n' + center(assets.getAsset(client.username === '' ? 'login': 'pass'), client.getWidth()).brightBlue + '\n\n'
    },
    clear: () => {
        return '\x1Bc\n\n'
    }
}