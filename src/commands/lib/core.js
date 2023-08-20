class CommandsCore {
    constructor() {
        this.commands = [];
    }
    cmdInit(regexp, action) {
        this.commands.push({
            regexp, action
        })
    }
    getCommand(command) {
        const cmd = this.commands.find(x => x.regexp.test(command))
        return cmd;
    }
}

module.exports = new CommandsCore()