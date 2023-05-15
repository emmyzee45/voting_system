const Web3 = require('web3');
const data = require('../build/contracts/Contest.json');
const contract = require("@truffle/contract");

const web3 = new Web3("http://localhost:7545");

const provider = new Web3.providers.HttpProvider("http://localhost:7545");

const ContestContract = contract(data);

ContestContract.setProvider(provider);

module.exports = { ContestContract, web3};

