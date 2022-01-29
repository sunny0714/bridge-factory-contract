const Web3 = require('web3');
const { bytecode, abi } = require('./build/contracts/UniswapV2Factory.json');

// Initialization
const web3 = new Web3('https://rpc.api.moonbase.moonbeam.network');
const walletPrivateKey = process.env.MNEMONIC;
const walletAddress = 0xc6fa133f3290e14Ad91C7449f8D8101A6f894E25;

// Deploy contract
const deploy = async () => {
	console.log('⏳ Attempting to deploy from account:', walletAddress);

	const contract = new web3.eth.Contract(abi);

	const contractTx = contract.deploy({
		data: bytecode,
		// arguments: [], // if constructor needs arguments put it in array here like this [5, '0x...', 'Hello World']
	});

	const createTransaction = await web3.eth.accounts.signTransaction(
		{
			from: walletAddress,
			data: contractTx.encodeABI(),
			gas: '4294967295',
		},
		walletPrivateKey
	);

	const createReceipt = await web3.eth.sendSignedTransaction(
		createTransaction.rawTransaction
	);

	console.info(`- Amount of Gas Used: ${createReceipt.gasUsed}`);
	console.info(`- More transaction details at: http://8.9.36.141:4000/tx/${createReceipt.transactionHash}`);
	console.log('✅ Contract deployed at address', createReceipt.contractAddress);
};

deploy();