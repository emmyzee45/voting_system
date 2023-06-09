module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id,
      // gas: 2100000,
      // gasPrice: 8000000000,
    },
    develop: {
      port: 8545
    }
  }
};
