module.exports = {
    serverPort: 3333,
    mongoURL: "mongodb://localhost:27017/EOS",
    mongoDB:  "EOS",
    chainUrl: "https://bp.cryptolions.io",
    saveRequestsMetrics: true,
    maxSkip: 500000,
    maxTimeForOperetion: 60000, // 60sec
    clearOperationsTimer: 10000, // 10sec
}
