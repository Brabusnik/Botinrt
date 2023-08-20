const CommonData = require('../common/data')

module.exports = (username, password) => {
    const user = CommonData.users.find(x => x.username === username && x.password === password)
    return user;
}