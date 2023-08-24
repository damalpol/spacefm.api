var MAX_SUPPLY = null
var MAX_PRESALE_SUPPLY = null
var INITIAL_PRICE = 0
var CURRENT_PRICE=0
var TOTAL_SUPPLY = 0
var SALE_ACTIVE=""
var PRESALE_ACTIVE=""

// CHANGE ************************************************************
const CONTRACT_ADDRESS = "0xC56190E204C1c77Fd887d9E711938fbA05830e76";
const URL_PROVIDER = "https://rpc-mumbai.maticvigil.com";							
const NFT_DESCRIPTION = "This Raiders NFT collection includes a chance to win access to a luxury suite at the 2024 Super Bowl.";
const NFT_IMAGE = "https://ipfs.io/ipfs/QmRwowxzxKSpbBfxBywA7opysymy54nYzJcQ2eApdmYtyv";
const ACTIVE_NETWORK = "mumbai";
// *******************************************************************

const PORT = 3000
const IS_REVEALED = true
const CONTRACT_NAME = "SuperBowl NFT raffle ticket"
const UNREVEALED_METADATA = {
  "name":"NFT ???",
  "description":"???",
  "image":"https://ipfs.io/ipfs/QmRwowxzxKSpbBfxBywA7opysymy54nYzJcQ2eApdmYtyv",
  "id":"0",
  "price":"0.0",
  "attributes":[{"???":"???"}]
}


const fs = require('fs')
const express = require('express')
const ethers = require('ethers')
var cors = require('cors');
require('dotenv').config()
const abi = require('./Contract.json')
const axios = require('axios')
//const Contract = require('web3-eth-contract')
//Contract.setProvider(process.env.GANACHE_RPC_URL)
//const contract = new Contract(abi, CONTRACT_ADDRESS)

let signer = null;
let provider;
let contract;
let wallet;

const app = express()

app.use(express.static(__dirname + 'public'))
app.use('/unrevealed', express.static(__dirname + '/unrevealed'));
app.use(cors());

async function initAPI() {
 // MAX_SUPPLY = parseInt(await contract.methods.MAX_SUPPLY().call())
 // console.log("MAX_SUPPLY is: " + MAX_SUPPLY)
  try {
	  provider = new ethers.providers.JsonRpcProvider(URL_PROVIDER);
	  const signer = provider.getSigner();

	  // Create contract instance by default superbowl
	  contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
	  // Call contract 
	  MAX_SUPPLY = await contract.MAX_SUPPLY();
	  MAX_PRESALE_SUPPLY = await contract.MAX_PRESALE_SUPPLY();
	  INITIAL_PRICE = ethers.utils.formatEther(await contract.initial_price());
	  CURRENT_PRICE = ethers.utils.formatEther(await contract.price());
	  TOTAL_SUPPLY = await contract.totalSupply();
	  SALE_ACTIVE = await contract.saleActive();
	  PRESALE_ACTIVE = await contract.presaleActive();

	  console.log("");
	  console.log("----- Smart Contract Info -----" );
	  console.log("MAX_SUPPLY is: " + MAX_SUPPLY);
	  console.log("MAX_PRESALE_SUPPLY is: " + MAX_PRESALE_SUPPLY);
	  console.log("INITIAL_PRICE is: " + INITIAL_PRICE);
	  console.log("CURRENT_PRICE is: " + CURRENT_PRICE);
	  console.log("TOTAL_SUPPLY is: " +  TOTAL_SUPPLY);
	  console.log("SALE_ACTIVE is: " +  SALE_ACTIVE);
	  console.log("PRESALE_ACTIVE is: " +  PRESALE_ACTIVE);
	  console.log("-------------------------------" );
	  console.log("");
	} catch(e) {
	  console.log("");
	  console.log("----- Smart Contract Error -----" );
	  console.log(e);
	}

  app.listen(PORT, () => {
    console.log(`SPACEFM smart contract API listening on port ${PORT}`)
  })
}


async function serveMetadata(res, nft_id,_network,_contract) {
var url = "http://127.0.0.1:8545";
 var sym = "ganache";
  var net = "";

  try {
    
    switch (_network) {
      case "80001":
        url = "https://rpc-mumbai.maticvigil.com";
        sym = "matic";
        net = "mumbai";
        break;
      case "56":  //MAINNET
        url = "https://bsc-dataseed.binance.org/";
        sym = "bnb";
        net = sym;
        break;
      case "137": //MAINNET
        url="https://polygon.llamarpc.com";
        sym = "matic";
        net = sym;
        break;
      case "1":  //MAINNET 
        url = "https://eth.llamarpc.com";
        sym="eth";
        net = sym;
        break;     

    }

if ( net==ACTIVE_NETWORK) { 
  	provider = new ethers.providers.JsonRpcProvider(url);
    signer = provider.getSigner();
    contract = new ethers.Contract(_contract, abi, provider);  

	  var token_count = parseInt(await contract.totalSupply())
	  CURRENT_PRICE = ethers.utils.formatEther(await contract.price());
	  let return_value 
	  if(nft_id < 0)
	  {
	    return_value = {error: "NFT ID must be greater than 0"}
	  }else if (nft_id >= token_count)
	  {
	    return_value = {error: "NFT ID must be not minted yet"}
	  }else
	  {
	    //let rawdata = fs.readFileSync("./metadata/" + nft_id)
		
	  let sc ='{'
		  sc+='"name":"'+CONTRACT_NAME+' #'+nft_id+'"'
		  sc+=',"description":"'+NFT_DESCRIPTION+'"'
		  sc+=',"image":"'+NFT_IMAGE+'"'
		  sc+='}'

	    return_value = JSON.parse(sc)
	    return_value.id = nft_id;
	    return_value.price = CURRENT_PRICE;
	  }
	  console.log(return_value.name);
	  res.send(return_value)

} else {
		  sc ='{'
		  sc+='"error":"'+"network id not correct"+'"'
		  sc+='}'
		  var myObj = JSON.parse(sc);
  		  res.send(myObj)
}


 } catch(e) {
    console.log(e)
    res.send(e)
  }

}


async function tokensOfOwner(res, owner_address,_network,_contract) {
var url = "http://127.0.0.1:8545";
 var sym = "ganache";
 var net = "";

  try {
    
    switch (_network) {
      case "80001":
        url = "https://rpc-mumbai.maticvigil.com";
        sym = "matic";
        net = "mumbai";
        break;
      case "56":  //MAINNET
        url = "https://bsc-dataseed.binance.org/";
        sym = "bnb";
        net = sym;
        break;
      case "137": //MAINNET
        url="https://polygon.llamarpc.com";
        sym = "matic";
        net = sym;
        break;
      case "1":  //MAINNET 
        url = "https://eth.llamarpc.com";
        sym="eth";
        net = sym;
        break;      


    }

	if ( net==ACTIVE_NETWORK) {   

  	provider = new ethers.providers.JsonRpcProvider(url);
    signer = provider.getSigner();
    contract = new ethers.Contract(_contract, abi, provider);   
	  var return_new = [] 
	  var return_value = await contract.tokensOfOwner(owner_address);   
	  return_value.forEach(element => {
	    //var rawdata = fs.readFileSync("./metadata/" + element);
	   	  let sc ='{'
			  sc+='"name":"'+CONTRACT_NAME+' #'+element+'"'
			  sc+=',"description":"'+NFT_DESCRIPTION+'"'
			  sc+=',"image":"'+NFT_IMAGE+'"'
			  sc+='}'
	    var nft = JSON.parse(sc);
	    nft.id = element.toString();
	    return_new.push(nft);    
	  });

	  res.send(return_new)

	} else {
		  sc ='{'
		  sc+='"error":"'+"network id not correct"+'"'
		  sc+='}'
		  var myObj = JSON.parse(sc);
  		  res.send(myObj)
	}

	} catch(e) {
    console.log(e)
    res.send(e)
  }	  
}


async function contractInfo(res,_network,_contract) {
 var sc = "" 
  
 var url = "http://127.0.0.1:8545";
 var sym = "ganache";
  var net = "";

  try {
    
    switch (_network) {
      case "80001":
        url = "https://rpc-mumbai.maticvigil.com";
        sym = "matic";
        net = "mumbai";
        break;
      case "56":  //MAINNET
        url = "https://bsc-dataseed.binance.org/";
        sym = "bnb";
        net = sym;
        break;
      case "137": //MAINNET
        url="https://polygon.llamarpc.com";
        sym = "matic";
        net = sym;
        break;
      case "1":  //MAINNET 
        url = "https://eth.llamarpc.com";
        sym="eth";
        net = sym;
        break;      


    }
    
if ( net==ACTIVE_NETWORK) {  

    provider = new ethers.providers.JsonRpcProvider(url);
    signer = provider.getSigner();
    // Create contract instance
    contract = new ethers.Contract(_contract, abi, provider);

    MAX_SUPPLY = await contract.MAX_SUPPLY();
    MAX_PRESALE_SUPPLY = await contract.MAX_PRESALE_SUPPLY();
    INITIAL_PRICE = ethers.utils.formatEther(await contract.initial_price());
    TOTAL_SUPPLY = await contract.totalSupply();
    const contract_bal = ethers.utils.formatEther(await provider.getBalance(CONTRACT_ADDRESS)) 

  var eth_rate = 0;

     await axios.get('https://min-api.cryptocompare.com/data/price?fsym='+sym+'&tsyms=usdt')
      .then(function (response) {
        // handle success
        console.log(response.data.USDT);
        eth_rate = response.data.USDT;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  
  sc ='{'
  sc+='"name":"'+CONTRACT_NAME+'"'
  sc+=',"address":"'+CONTRACT_ADDRESS+'"'
  sc+=',"max_supply":"'+MAX_SUPPLY+'"'
  sc+=',"total_supply":"'+TOTAL_SUPPLY+'"'  
  sc+=',"max_presale_supply":"'+MAX_PRESALE_SUPPLY+'"'
  sc+=',"initial_price":"'+INITIAL_PRICE+'"'  
  sc+=',"current_price":"'+CURRENT_PRICE+'"'    
  sc+=',"sale_active":"'+SALE_ACTIVE+'"'
  sc+=',"presale_active":"'+PRESALE_ACTIVE+'"'  
  sc+=',"contract_eth":"'+contract_bal+'"'  
  sc+=',"contract_value":"'+(eth_rate*contract_bal)+'"' 
  sc+='}'

} else {
  sc ='{'
  sc+='"name":"'+"no contract found"+'"'
  sc+=',"address":"'+"0x"+'"'
  sc+=',"max_supply":"'+"10"+'"'
  sc+=',"total_supply":"'+"0"+'"'  
  sc+=',"max_presale_supply":"'+"10"+'"'
  sc+=',"initial_price":"'+"0"+'"'  
  sc+=',"current_price":"'+"0"+'"'    
  sc+=',"sale_active":"'+"false"+'"'
  sc+=',"presale_active":"'+"false"+'"'  
  sc+=',"contract_eth":"'+"0"+'"'  
  sc+=',"contract_value":"'+"0"+'"' 
  sc+='}'
}

  var myObj = JSON.parse(sc);
  res.send(myObj)
} catch (e) {
  console.log(e)
  res.send(e)
}

}



async function assetsOfWallet(res,wallet,_network,_contract) {
 var sc = "" 
 var url = "http://127.0.0.1:8545";
 var sym = "eth";
 var net = "";

  try {
    
    switch (_network) {
      case "80001":
        url = "https://rpc-mumbai.maticvigil.com";
        sym = "matic";
        net = "mumbai";
        break;
      case "56":  //MAINNET
        url = "https://bsc-dataseed.binance.org/";
        sym = "bnb";
        net = sym;
        break;
      case "137": //MAINNET
        url="https://polygon.llamarpc.com";
        sym = "matic";
        net = sym;
        break;
      case "1":  //MAINNET 
        url = "https://eth.llamarpc.com";
        sym="eth";
        net = sym;
        break;      


    }
    

    provider = new ethers.providers.JsonRpcProvider(url);
    signer = provider.getSigner();
    contract = new ethers.Contract(_contract, abi, provider);
    const eth_bal = ethers.utils.formatEther(await provider.getBalance(wallet))  
    var nft_bal;

	if ( net==ACTIVE_NETWORK) { 
	    nft_bal = await contract.tokensOfOwner(wallet) 
	} else {
		nft_bal = [];
	}

	// BRONCE :
	// SILVER :
	// GOLD :
	// DIAMONT :

    var user_level = "";
	const _level = Number(nft_bal.length);
		switch (true) {
	    case (_level >16): //>=250
	        user_level="diamont";
	        break;			
	    case (_level >8): //>=100
	        user_level="gold";
	        break;
	    case (_level >4): //>=75
	        user_level="silver";
	        break;
	    case (_level >=1): //>=75
	        user_level="bronze";
	        break;
	    default:
	        user_level="none";
	}

    
    var eth_rate = 0;

     await axios.get('https://min-api.cryptocompare.com/data/price?fsym='+sym+'&tsyms=usdt')
      .then(function (response) {
        // handle success
        console.log(response.data.USDT);
        eth_rate = response.data.USDT;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });

    //const response = await fetch("https://min-api.cryptocompare.com/data/price?fsym=eth&tsyms=usdt");
    
      sc ='{'
      sc+='"eth_balance":"'+eth_bal+'"'
      sc+=',"nft_balance":"'+nft_bal.length+'"'
      sc+=',"eth_rate":"'+eth_rate+'"'
      sc+=',"eth_value":"'+(eth_rate*eth_bal)+'"'
 	  sc+=',"user_level":"'+(user_level)+'"'      
      sc+='}'    
      var myObj = JSON.parse(sc);
      res.send(myObj) 

  } catch(e) {
    console.log(e)
    if (net=="") { // network not found
 		sc ='{'
      	sc+='"eth_balance":"0"'
      	sc+=',"nft_balance":"0"'
      	sc+=',"eth_rate":"0"'
      	sc+=',"eth_value":"0"'
 	  	sc+=',"user_level":"none"'      
      	sc+='}'    
      var myObj = JSON.parse(sc);
      res.send(myObj) 

    } else {
    	res.send(e)
    }
    
  }
}
 



async function getGasPrice() {
    let feeData = (await provider.getGasPrice()).toNumber()
    return feeData
}

async function getNonce(signer) {
    let nonce = await provider.getTransactionCount(wallet.address)
    return nonce
}


///////////////////////////////////////////////////////////////////
// API endpoint calls
///////////////////////////////////////////////////////////////////


app.get('/superbowl/nft/:id/:network', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if(isNaN(req.params.id))//in not number
  {
    res.send(UNREVEALED_METADATA)    
  }
  else if(!IS_REVEALED)
  {
    res.send()
  }else
  {
    serveMetadata(res, req.params.id,req.params.network,CONTRACT_ADDRESS)
  }
})



app.get('/wallet/balances/:address/:network', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if(req.params.address && req.params.network)//in not number
  {
    assetsOfWallet(res, req.params.address, req.params.network, CONTRACT_ADDRESS)    
  }
  else 
  {
    res.send()
  }
})


app.get('/superbowl/nfts/:address/:network', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if(req.params.address && req.params.network)//in not number
  {
    tokensOfOwner(res, req.params.address, req.params.network,CONTRACT_ADDRESS)    
  }
  else 
  {
    res.send()
  }
})



app.get('/info', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var s = "SPACE.FM smart contract API V1.21\n\n"
  s += "EVM network ID supported (80001:MUMBAI, 56:BNB, 137:POLYGON, 1:ETH )\n"
  s += "User level based on NFT (none:=0, bronze:<=4, silver>4, gold:>8, diamont:>16 )\n\n"


  s += "/superbowl/nfts/<wallet address>/<network id>\n"
  s += "description: returns NFT collection associated with wallet address and network id\n"
  s += "input: EVM wallet address, network ID \n"
  s += "output: array of nft objects [{name,description,image,id}] or empty if none\n"
  s += "\n"
  s += "/superbowl/nft/<num>/<network id>\n"
  s += "description: returns NFT associated with number num\n"
  s += "input: number of NFT, network ID\n"
  s += "output: nft object {name,description,image,id,price} based on num \n"
  s += "\n"
  s += "/superbowl/contract/<network id>\n"
  s += "description: returns NFT smart contract data in network id\n"
  s += "input: network ID \n"
  s += "output: smart contract object {name,address,max_supply,total_supply,max_presale_supply,initial_price,current_price,sale_active,presale_active,contract_eth,contract_value} \n"
  s += "\n"
  s += "/wallet/balances/<address>/<network id>\n"
  s += "description: (SPACEFM global use) returns eth balance and space.fm nfts based on wallet address and network id\n"
  s += "input: wallet address, network ID \n"
  s += "output: balance object {eth_balance,nft_balance,eth_rate,eth_value,user_level} \n"
  s += "\n"  
  res.send(s)
  
})


app.get('/superbowl/contract/:network', (req, res) => {
  res.setHeader('Content-Type', 'application/json'); 
  if(req.params.network)//in not number
  {
    contractInfo(res,req.params.network,CONTRACT_ADDRESS); 
  }  
})


initAPI()

