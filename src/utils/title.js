const center = require('./center')

module.exports = (str) => {
    return `\x1b]0;${str}\x07`
}