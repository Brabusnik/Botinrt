var expression = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,9}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
var urlFormat = new RegExp(expression);

module.exports = {
    isURLValid: (url) => url.match(urlFormat)
}