require('dotenv').config();
const Web3 = require('web3');
const fs = require('fs');

// Setup web3 with Infura
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

// Read and compile the Marketplace contract ABI and bytecode
const compiledContract = JSON.parse(fs.readFileSync('./build/Marketplace.json', 'utf8'));
const contractABI = compiledContract.abi;
const contractBytecode = compiledContract.evm.bytecode.object;

// Set up your wallet and account
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

const deployContract = async () => {
    const marketplace = new web3.eth.Contract(contractABI);

    // Deploy the contract
    const deploy = marketplace.deploy({
        data: contractBytecode,
        arguments: ["Initial Product", 1000] // Constructor arguments
    });

    const gasEstimate = await deploy.estimateGas();

    const newContractInstance = await deploy.send({
        from: account.address,
        gas: gasEstimate,
    });

    console.log("Contract deployed at:", newContractInstance.options.address);
};

deployContract();