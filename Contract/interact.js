require('dotenv').config();
const Web3 = require('web3');

// Setup web3 with Infura
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

// ABI and deployed contract address
const contractABI = [ /* Your contract ABI here */ ];
const contractAddress = "0xYourDeployedContractAddress"; // Replace with your deployed address

const marketplace = new web3.eth.Contract(contractABI, contractAddress);

// Set up your wallet and account
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

const getProductDetails = async () => {
    const details = await marketplace.methods.getProductDetails().call();
    console.log(`Product: ${details[0]}, Price: ${details[1]}`);
};

const updateProduct = async (newProduct, newPrice) => {
    const gasEstimate = await marketplace.methods.updateProduct(newProduct, newPrice).estimateGas();
    await marketplace.methods.updateProduct(newProduct, newPrice).send({
        from: account.address,
        gas: gasEstimate,
    });
    console.log("Product updated successfully!");
};

// Example usage
getProductDetails();
updateProduct("New Product", 1500);