class CommonData {
    constructor() {
        this.clients = []
        this.attacks = []
        this.servers = {}
        this.users = []
        this.autorestart = []
    }
}

module.exports = new CommonData()