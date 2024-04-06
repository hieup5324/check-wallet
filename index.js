const { fork } = require('child_process')
const devnull = require('dev-null')
const { program } = require('commander')
const colors = require('colors')
const fs = require('fs')

let tries = 0
let hits = 0
let children = []

program.option('-c, --count <number>', 'number of processes')

const options = program.parse().opts()
const count = parseInt(options.count) || 6

console.log(`Starting ${count} processes`.yellow)

for (let i = 0; i < count; i++) {
    children[i] = fork('worker.js', [], { detached: false, stdio: 'pipe' })
    children[i].stdout.setEncoding('utf8')
    children[i].stdout
        .on('data', (data) => {
            if (data === '+') {
                hits++
                tries++
                if (hits === 100000) {
                    console.log('Hits reached 100,000. Terminating processes.')
                    process.kill(process.pid, 'SIGTERM') // Send SIGTERM to main process
                }
            } else {
                tries++
            }
        })
        .pipe(devnull())
}

process.on('SIGTERM', () => {
    children.forEach((val) => {
        val.kill('SIGTERM')
    })
})

console.log('All processes started'.green)

import('log-update').then((mod) => {
    const frames = ['-', '\\', '|', '/']
    let index = 0
    setInterval(() => {
        const frame = frames[(index = ++index % frames.length)]
        mod.default(`${frame} Tries: ${tries}; Hits: ${hits} ${frame}`)
    }, 1)
})
