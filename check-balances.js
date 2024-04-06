const fs = require('fs')
const ethers = require('ethers')

// Mảng các nhà cung cấp WebSocket
const providers = [
    new ethers.providers.WebSocketProvider(
        'wss://bsc-mainnet.blastapi.io/7f55407d-06f8-4c3b-b5d4-bcfcb9e41d84'
    ),
    new ethers.providers.WebSocketProvider(
        'wss://eth-mainnet.blastapi.io/7f55407d-06f8-4c3b-b5d4-bcfcb9e41d84'
    ),
    new ethers.providers.WebSocketProvider(
        'wss://zksync-mainnet.blastapi.io/7f55407d-06f8-4c3b-b5d4-bcfcb9e41d84'
    ),
    new ethers.providers.WebSocketProvider(
        'wss://arbitrum-one.blastapi.io/7f55407d-06f8-4c3b-b5d4-bcfcb9e41d84'
    ),
    new ethers.providers.WebSocketProvider(
        'wss://optimism-mainnet.blastapi.io/7f55407d-06f8-4c3b-b5d4-bcfcb9e41d84'
    ),
    new ethers.providers.WebSocketProvider(
        'wss://polygon-mainnet.blastapi.io/7f55407d-06f8-4c3b-b5d4-bcfcb9e41d84'
    ),
]

// Hàm để lựa chọn nhà cung cấp cho yêu cầu tiếp theo
function selectProvider() {
    return (
        providers.find((provider) => provider.reconnectTime === 0) ||
        providers[0]
    )
}

// Đọc địa chỉ từ tệp hits.txt
const addresses = fs
    .readFileSync('hits.txt', 'utf8')
    .split('\n')
    .map((val) => val.split(','))

// Lặp qua các địa chỉ và kiểm tra số dư cho mỗi nhà cung cấp
;(async () => {
    for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i][0]
        let balance
        let providerIndex = 0

        // Lặp qua tất cả các nhà cung cấp để kiểm tra số dư
        while (providerIndex < providers.length) {
            const selectedProvider = providers[providerIndex]

            try {
                balance = await selectedProvider.getBalance(address)
                if (balance && balance.gt(0)) {
                    console.log(
                        `${address} on ${
                            selectedProvider.connection.url
                        }: ${balance.toString()}`
                    )
                    console.log('Private Key: ', addresses[i][1])

                    // Lưu vào tệp private-keys.txt
                    const dataToWrite = `${address},${addresses[i][1]}\n`
                    fs.appendFileSync('private-keys.txt', dataToWrite)

                    break // Thoát khỏi vòng lặp nếu tìm thấy số dư lớn hơn 0
                }
            } catch (error) {}

            providerIndex++
        }

        if (!balance || balance.eq(0)) {
            console.log(address, 0)
        }
    }
})()
