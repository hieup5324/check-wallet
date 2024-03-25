const fs = require('fs')
const ethers = require('ethers')

const provider = new ethers.providers.WebSocketProvider(
    'wss://mainnet.infura.io/ws/v3/99083a636d9d4866bca41b3d58d0c4fa'
)

const addresses = fs
    .readFileSync('hits.txt', 'utf8')
    .split('\n')
    .map((val) => {
        return val.split(',')
    })

;(async () => {
    for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i][0]
        const balance = await provider.getBalance(address)

        if (balance.gt(0)) {
            console.log(address, balance.toString())
            console.log('Private Key: ', addresses[i][1])

            // Lưu vào tệp pri.txt
            const dataToWrite = `${address},${addresses[i][1]}\n`
            fs.appendFile('private-keys.txt', dataToWrite, (err) => {
                if (err) {
                    console.error('Error writing to file:', err)
                } else {
                    console.log('Address and private key saved to pri.txt')
                }
            })
        } else {
            console.log(address, 0)
        }
    }
})()
