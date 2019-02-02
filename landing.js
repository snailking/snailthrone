contractAddress="0x261d650a521103428C6827a11fc0CBCe96D74DBc" // MAINNET

/* WEB3 DETECTION */

var web3;

var modal2 = document.getElementById("modal2");
/* OLD 
window.addEventListener("load", function() {
	if (typeof web3 !== "undefined") {
        web3 = new Web3(web3.currentProvider);
        web3.version.getNetwork(function(error, result) {
            if (!error) {
                if (result == "1") {
					console.log("Web3 Testnet successfully loaded!");
                } else {
                    console.log("Error: you must be on the Mainnet to use this website.");
					web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/f423492af8504d94979d522c3fbf3794"));
					modal2.style.display = "block";
                }
            }
        });
    } else {
        console.log("Web3 library not found.");
		modal2.style.display = "block";
        web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/f423492af8504d94979d522c3fbf3794"));
    }
});
*/

/* NEW */

window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            //web3.eth.sendTransaction({/* ... */});
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        //web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});

/* PAST EVENT LOG */

var timeLaunch = 1546099245;
var launchBlock = 6974738;

var twoDaysBlock = 0;
var ranLog = 0;

function checkBlock(){
	web3.eth.getBlockNumber(function (error, result){
		twoDaysBlock = result - 24000; //4 days
	});
}

checkBlock();

//Get timestamp for log
function dateLog(_blockNumber) {
	d = new Date((timeLaunch + ((_blockNumber - launchBlock) * 14.5)) * 1000);
	console.log(d);
	datetext = d.toTimeString();
	datetext = datetext.split(' ')[0];
}

/* VARIABLES */

var m_account = "waiting for web3";
var a_contractBalance = 0;
var a_maxSnail = 0;
var e_snailBought = 0;
var e_snailHatched = 0;
var e_snailSold = 0;
var e_snailSacrificed = 0;
var e_ethSpent = 0;
var e_ethWon = 0;
var e_ethOtherGame = 0;

/* MODAL */

/* GLOBAL LOOP */

//Started once, to trigger the main loop and the egg loop
function main(){
    console.log('Main loop started.');
    controlLoop();
	controlLoopFast();
}

//Main loop
function controlLoop(){
    refreshData();
    setTimeout(controlLoop,4000);
}

//Secondary loop for actions that need faster refresh
function controlLoopFast(){
	refreshDataFast();
	setTimeout(controlLoopFast,200);
}

/* UTILITIES */

//Truncates ETH value to 3 decimals
function formatEthValue(ethstr){
    return parseFloat(parseFloat(ethstr).toFixed(3));
}

//Truncates ETH value to 6 decimals
function formatEthValue2(ethstr){
	return parseFloat(parseFloat(ethstr).toFixed(6));
}

//Truncates ETH address to first 8 numbers
function formatEthAdr(adr){
	var _smallAdr = adr.substring(0, 10);
	var _stringLink = '<a href="https://etherscan.io/address/' + adr + '" target="_blank">' + _smallAdr + '</a>';
	return _stringLink;
}

//Conversion of Date to hh:mm:ss
var datetext;

function date24() {
	d = new Date();
	datetext = d.toTimeString();
	datetext = datetext.split(' ')[0];
}
/*
//Referrals
function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function copyRef() {
  var copyText = document.getElementById("copytextthing");
  copyText.style.display="block"
  copyText.select();
  document.execCommand("Copy");
  copyText.style.display="none"
  //displayModalMessage("copied link to clipboard")
  //alert("Copied the text: " + copyText.value);
}

var playerreflinkdoc = document.getElementById('playerreflink'); 
var a_refLink = window.location.protocol + '//' + window.location.host + window.location.pathname + "?ref=" + web3.eth.accounts[0];
var copyText = "no" //document.getElementById("copytextthing"); 
copyText.value = playerreflinkdoc.textContent;
*/
/* STATE UPDATES */
		
var doc_snailBought = document.getElementById("snailbought");
var doc_snailHatched = document.getElementById("snailhatched");
var doc_snailSacrificed = document.getElementById("snailsacrificed");
var doc_snailSold = document.getElementById("snailsold");
var doc_ethContract = document.getElementById("contract_eth");
var doc_ethIn = document.getElementById("eth_in");
var doc_ethOut = document.getElementById("eth_out");
var doc_ethOtherGame = document.getElementById("eth_game");

//Refreshes game data
function refreshData(){
	updateEthAccount();
	updateMaxSnail();
	updateContractBalance();
	//updateText();
}

//Refreshes some game data faster
function refreshDataFast(){
	
}

//Current ETH address in use
function updateEthAccount(){
	m_account = web3.eth.accounts[0];
}

//Current max supply of snails
function updateMaxSnail(){
	var maxsnaildoc = document.getElementById('maxsnail');
	maxSnail(function(req) {
		a_maxSnail = req;
		maxsnaildoc.textContent = a_maxSnail;
	});
}

//Current ETH balance in contract
function updateContractBalance(){
	var contractbalancedoc = document.getElementById('contractbalance');
	GetContractBalance(function(result) {
		a_contractBalance = result;
		doc_ethContract.textContent = formatEthValue2(web3.fromWei(result,'ether'));
	});
}

//Update text
function updateText(){
	doc_snailBought.innerHTML = e_snailBought;
	doc_snailHatched.innerHTML = e_snailHatched;
	doc_snailSold.innerHTML = e_snailSold;
	doc_snailSacrificed.innerHTML = parseInt(e_snailBought) + parseInt(e_snailHatched) - parseInt(e_snailSold) - parseInt(a_maxSnail);
	doc_ethIn.innerHTML = e_ethSpent;
	doc_ethOut.innerHTML = e_ethWon;
	doc_ethOtherGame.innerHTML = e_ethOtherGame;
}

/*
1271535 Snails bought
633247 Snails hatched
1545276 Snails sacrificed // obviously wrong calculation missing snails sold and not adding max snail
359506 Snails sold // wrong because many events are ignored due to claim divs

13.199216 ETH IN CONTRACT

42.450363000000046 ETH invested
37.901999 ETH redistributed

4.251707000000001 ETH from Snail games
*/	

/* CONTRACT ABI */

abiDefinition=[{"constant": false,"inputs": [],"name": "ClaimDivs","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "ComputeMyDivs","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "AscendGod","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "godTimer","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_snails","type": "uint256"}],"name": "BecomePharaoh","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "hatcherySnail","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "FeedEgg","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "PHARAOH_REQ_START","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "GetMySnails","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "lastHatch","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "TOKEN_MAX_BUY","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "frogPot","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "claimedDivs","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "SNAIL_REQ_REF","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_ref","type": "address"}],"name": "BuySnail","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": true,"inputs": [],"name": "gameStarted","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "pharaoh","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "playerEarnings","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "snailPot","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "GOD_TIMER_START","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "TOKEN_PRICE_FLOOR","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "pharaohReq","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "HatchEgg","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": true,"inputs": [],"name": "godPot","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "StartGame","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": true,"inputs": [],"name": "lastClaim","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "WithdrawEarnings","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "_ether","type": "uint256"}],"name": "ComputeBuy","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_tokensSold","type": "uint256"}],"name": "SellSnail","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "TIME_TO_HATCH_1SNAIL","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "ComputePharaohReq","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "ComputeTokenPrice","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "godRound","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "TOKEN_PRICE_MULT","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "divsPerSnail","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "GOD_TIMER_BOOST","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "GOD_TIMER_INTERVAL","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "GetMyEarnings","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "adr","type": "address"}],"name": "ComputeMyEggs","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "gameOwner","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "GetContractBalance","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "maxSnail","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"inputs": [],"payable": false,"stateMutability": "nonpayable","type": "constructor"},{"payable": true,"stateMutability": "payable","type": "fallback"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "ethreward","type": "uint256"}],"name": "WithdrewEarnings","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "ethreward","type": "uint256"}],"name": "ClaimedDivs","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "ethspent","type": "uint256"},{"indexed": false,"name": "snail","type": "uint256"}],"name": "BoughtSnail","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "ethreward","type": "uint256"},{"indexed": false,"name": "snail","type": "uint256"}],"name": "SoldSnail","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "ethspent","type": "uint256"},{"indexed": false,"name": "snail","type": "uint256"}],"name": "HatchedSnail","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "ethreward","type": "uint256"},{"indexed": false,"name": "egg","type": "uint256"}],"name": "FedFrogking","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "ethreward","type": "uint256"},{"indexed": true,"name": "round","type": "uint256"}],"name": "Ascended","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": true,"name": "round","type": "uint256"}],"name": "BecamePharaoh","type": "event"},{"anonymous": false,"inputs": [{"indexed": false,"name": "ethreward","type": "uint256"}],"name": "NewDivs","type": "event"}]

var contractAbi = web3.eth.contract(abiDefinition);
var myContract = contractAbi.at(contractAddress);

	
function AscendGod(callback){
    var outputData = myContract.AscendGod.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('AscendGod ',result);
            callback(result)
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function BecomePharaoh(_snails,callback){
    var outputData = myContract.BecomePharaoh.getData(_snails);
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('BecomePharaoh ',result);
            callback(result)
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function BuySnail(_ref,eth,callback){
    var outputData = myContract.BuySnail.getData(_ref);
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData,value: eth},
    function(error,result){
        if(!error){
            //console.log('BuySnail ',result);
            callback(result)
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function ClaimDivs(callback){
    var outputData = myContract.ClaimDivs.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('ClaimDivs ',result);
            callback(result)
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function FeedEgg(callback){
    var outputData = myContract.FeedEgg.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('FeedEgg ',result);
            callback(result)
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function HatchEgg(eth,callback){
    var outputData = myContract.HatchEgg.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData,value: eth},
    function(error,result){
        if(!error){
            //console.log('HatchEgg ',result);
            callback(result)
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function SellSnail(_tokensSold,callback){
    var outputData = myContract.SellSnail.getData(_tokensSold);
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('SellSnail ',result);
            callback(result)
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function StartGame(eth,callback){
    var outputData = myContract.StartGame.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData,value: eth},
    function(error,result){
        if(!error){
            //console.log('StartGame ',result);
            callback(result)
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function WithdrawEarnings(callback){
    var outputData = myContract.WithdrawEarnings.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('WithdrawEarnings ',result);
            callback(result)
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function claimedDivs(callback){
    var outputData = myContract.claimedDivs.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('claimedDivs ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeBuy(_ether,callback){
    var outputData = myContract.ComputeBuy.getData(_ether);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('ComputeBuy ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeMyDivs(callback){
    var outputData = myContract.ComputeMyDivs.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('ComputeMyDivs ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeMyEggs(adr,callback){
    var outputData = myContract.ComputeMyEggs.getData(adr);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('ComputeMyEggs ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function ComputePharaohReq(callback){
    var outputData = myContract.ComputePharaohReq.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('ComputePharaohReq ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeTokenPrice(callback){
    var outputData = myContract.ComputeTokenPrice.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('ComputeTokenPrice ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function divsPerSnail(callback){
    var outputData = myContract.divsPerSnail.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('divsPerSnail ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function frogPot(callback){
    var outputData = myContract.frogPot.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('frogPot ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function gameOwner(callback){
    var outputData = myContract.gameOwner.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('gameOwner ',result);
            callback(result)
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function gameStarted(callback){
    var outputData = myContract.gameStarted.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('gameStarted ',result);
            callback(result)
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function GetContractBalance(callback){
    var outputData = myContract.GetContractBalance.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('GetContractBalance ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function GetMyEarnings(callback){
    var outputData = myContract.GetMyEarnings.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('GetMyEarnings ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function GetMySnails(callback){
    var outputData = myContract.GetMySnails.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('GetMySnails ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function GOD_TIMER_BOOST(callback){
    var outputData = myContract.GOD_TIMER_BOOST.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('GOD_TIMER_BOOST ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function GOD_TIMER_INTERVAL(callback){
    var outputData = myContract.GOD_TIMER_INTERVAL.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('GOD_TIMER_INTERVAL ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function GOD_TIMER_START(callback){
    var outputData = myContract.GOD_TIMER_START.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('GOD_TIMER_START ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function godPot(callback){
    var outputData = myContract.godPot.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('godPot ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function godRound(callback){
    var outputData = myContract.godRound.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('godRound ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function godTimer(callback){
    var outputData = myContract.godTimer.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('godTimer ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function hatcherySnail(callback){
    var outputData = myContract.hatcherySnail.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('hatcherySnail ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function lastClaim(callback){
    var outputData = myContract.lastClaim.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('lastClaim ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function lastHatch(callback){
    var outputData = myContract.lastHatch.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('lastHatch ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function maxSnail(callback){
    var outputData = myContract.maxSnail.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('maxSnail ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function pharaoh(callback){
    var outputData = myContract.pharaoh.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('pharaoh ',result);
            callback(result)
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function PHARAOH_REQ_START(callback){
    var outputData = myContract.PHARAOH_REQ_START.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('PHARAOH_REQ_START ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function pharaohReq(callback){
    var outputData = myContract.pharaohReq.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('pharaohReq ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function playerEarnings(callback){
    var outputData = myContract.playerEarnings.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('playerEarnings ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function SNAIL_REQ_REF(callback){
    var outputData = myContract.SNAIL_REQ_REF.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('SNAIL_REQ_REF ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function snailPot(callback){
    var outputData = myContract.snailPot.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('snailPot ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function TIME_TO_HATCH_1SNAIL(callback){
    var outputData = myContract.TIME_TO_HATCH_1SNAIL.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('TIME_TO_HATCH_1SNAIL ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function TOKEN_MAX_BUY(callback){
    var outputData = myContract.TOKEN_MAX_BUY.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('TOKEN_MAX_BUY ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function TOKEN_PRICE_FLOOR(callback){
    var outputData = myContract.TOKEN_PRICE_FLOOR.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('TOKEN_PRICE_FLOOR ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}


function TOKEN_PRICE_MULT(callback){
    var outputData = myContract.TOKEN_PRICE_MULT.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            //console.log('TOKEN_PRICE_MULT ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            //console.log('transaction failed with ',error.message)
        }
    });
}

/* EVENT WATCH */

var logboxscroll = document.getElementById('logboxscroll');
var eventdoc = document.getElementById("event");

//Store transaction hash for each event, and check before executing result, as web3 events fire twice
var storetxhash = [];

//Check equivalency
function checkHash(txarray, txhash) {
	var i = 0;
	do {
		if(txarray[i] == txhash) {
			return 0;
		}
		i++;
	}
	while(i < txarray.length);
	//Add new tx hash
	txarray.push(txhash);
	//Remove first tx hash if there's more than 16 hashes saved
	if(txarray.length > 16) {
		txarray.shift();
	}
}
			
//Events
//6763682
//Doesn't work if we parse from that long ago... How do other people do it?
//Maybe we'll run logs 40k blocks per 40k blocks?...

var blockStart = 6764000;
var blockEnd = 6804000;

function runLog(){
	console.log("Running log...");
	if(ranLog < 10){
		console.log("Logging starts");
		myContract.allEvents({ fromBlock: blockStart, toBlock: blockEnd }).get(function(error, result){
			if(!error){
				console.log(result);
				var i = 0;
				for(i = 0; i < result.length; i++){
					if(checkHash(storetxhash, result[i].transactionHash) != 0) {
						//dateLog(result[i].blockNumber);
						if(result[i].event == "HatchedSnail"){
							e_snailHatched = parseInt(e_snailHatched) + parseInt(result[i].args.snail);
							e_ethSpent = parseFloat(e_ethSpent) + parseFloat(formatEthValue2(web3.fromWei(result[i].args.ethspent,'ether')));
							console.log("Hatch total: " + e_snailHatched);
						} else if(result[i].event == "SoldSnail"){
							e_snailSold = parseInt(e_snailSold) + parseInt(result[i].args.snail);							
						} else if(result[i].event == "BoughtSnail"){
							e_snailBought = parseInt(e_snailBought) + parseInt(result[i].args.snail);
							e_ethSpent = parseFloat(e_ethSpent) + parseFloat(formatEthValue2(web3.fromWei(result[i].args.ethspent,'ether')));
						} else if(result[i].event == "WithdrewEarnings"){
							e_ethWon = parseFloat(e_ethWon) + parseFloat(formatEthValue2(web3.fromWei(result[i].args.ethreward)));
						} else if(result[i].event == "NewDivs"){
							e_ethWon = parseFloat(e_ethWon) + parseFloat(formatEthValue2(web3.fromWei(result[i].args.ethreward)));
							e_ethOtherGame = parseFloat(e_ethOtherGame) + parseFloat(formatEthValue2(web3.fromWei(result[i].args.ethreward)));
						}
					}
				}
			}
			else{
				console.log("problem!");
			}
		});
		ranLog++;
		blockStart = blockEnd;
		blockEnd = parseInt(blockEnd) + parseInt(40000);
	} else {
		console.log("condition failed");
	}
}


function runLogOrig(){
	if(ranLog < 10 && twoDaysBlock > 0){
		myContract.allEvents({ fromBlock: twoDaysBlock, toBlock: 'latest' }).get(function(error, result){
			if(!error){
				console.log(result);
				var i = 0;
				for(i = 0; i < result.length; i++){
					if(checkHash(storetxhash, result[i].transactionHash) != 0) {
						dateLog(result[i].blockNumber);
						if(result[i].event == "HatchedSnail"){
							eventdoc.innerHTML += "<br>[~" + datetext + "] " + formatEthAdr(result[i].args.player) + " hatched " + result[i].args.snail + " snails for " + formatEthValue2(web3.fromWei(result[i].args.ethspent,'ether')) + " ETH." ;
							
						} else if(result[i].event == "SoldSnail"){
							eventdoc.innerHTML += "<br>[~" + datetext + "] " + formatEthAdr(result[i].args.player) + " sold " + result[i].args.snail + " snails for " + formatEthValue2(web3.fromWei(result[i].args.ethreward,'ether')) + " ETH." ;
							
						} else if(result[i].event == "BoughtSnail"){
							eventdoc.innerHTML += "<br>[~" + datetext + "] " + formatEthAdr(result[i].args.player) + " bought " + result[i].args.snail + " snails for " + formatEthValue2(web3.fromWei(result[i].args.ethspent,'ether')) + " ETH." ;

						} else if(result[i].event == "BecamePharaoh"){
							eventdoc.innerHTML += "<br>[~" + datetext + "] " + formatEthAdr(result[i].args.player) + " sacrifices snails and claims the throne!" ;
	
						} else if(result[i].event == "WithdrewEarnings"){
							eventdoc.innerHTML += "<br>[~" + datetext + "] " + formatEthAdr(result[i].args.player) + " withdrew " + formatEthValue2(web3.fromWei(result[i].args.ethreward,'ether')) + " ETH." ;

						} else if(result[i].event == "ClaimedDivs"){
							eventdoc.innerHTML += "<br>[~" + datetext + "] " + formatEthAdr(result[i].args.player) + " claimed " + formatEthValue2(web3.fromWei(result[i].args.ethreward,'ether')) + " ETH in divs." ;

						} else if(result[i].event == "FedFrogking"){
							eventdoc.innerHTML += "<br>[~" + datetext + "] " + formatEthAdr(result[i].args.player) + " fed the Frogking " + result[i].args.egg + " eggs and won " + formatEthValue2(web3.fromWei(result[i].args.ethreward,'ether')) + " ETH." ;

						} else if(result[i].event == "Ascended"){
							var _roundwon = result[i].args.round - 1;
							eventdoc.innerHTML += "<br>[~" + datetext + "] " + formatEthAdr(result[i].args.player) + " ASCENDS!<br>The new SnailGod wins Round " + _roundwon + " and claims " + formatEthValue2(web3.fromWei(result[i].args.ethreward,'ether')) + " ETH." ;

						} else if(result[i].event == "NewDivs"){
							eventdoc.innerHTML += "<br>[~" + datetext + "] Another snail game just paid out " + formatEthValue2(web3.fromWei(result[i].args.ethreward,'ether')) + " ETH in divs to all holders!" ;
						}
						logboxscroll.scrollTop = logboxscroll.scrollHeight;
					}
				}
			}
			else{
				console.log("problem!");
			}
		});
	}
}


var hatchEvent = myContract.HatchedSnail();

hatchEvent.watch(function(error, result){
    if(!error){
		//console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " hatched " + result.args.snail + " snails for " + formatEthValue2(web3.fromWei(result.args.ethspent,'ether')) + " ETH." ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var soldEvent = myContract.SoldSnail();

soldEvent.watch(function(error, result){
    if(!error){
		//console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " sold " + result.args.snail + " snails for " + formatEthValue2(web3.fromWei(result.args.ethreward,'ether')) + " ETH." ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var boughtEvent = myContract.BoughtSnail();

boughtEvent.watch(function(error, result){
    if(!error){
		//console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " bought " + result.args.snail + " snails for " + formatEthValue2(web3.fromWei(result.args.ethspent,'ether')) + " ETH." ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var newpharaohEvent = myContract.BecamePharaoh();

newpharaohEvent.watch(function(error, result){
    if(!error){
		//console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " sacrifices snails and claims the throne!" ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var withdrewEvent = myContract.WithdrewEarnings();

withdrewEvent.watch(function(error, result){
    if(!error){
		//console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " withdrew " + formatEthValue2(web3.fromWei(result.args.ethreward,'ether')) + " ETH." ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var claimedEvent = myContract.ClaimedDivs();

claimedEvent.watch(function(error, result){
    if(!error){
		//console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " claimed " + formatEthValue2(web3.fromWei(result.args.ethreward,'ether')) + " ETH in divs." ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var fedEvent = myContract.FedFrogking();

fedEvent.watch(function(error, result){
    if(!error){
		//console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " fed the Frogking " + result.args.egg + " eggs and won " + formatEthValue2(web3.fromWei(result.args.ethreward,'ether')) + " ETH." ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var ascendedEvent = myContract.Ascended();

ascendedEvent.watch(function(error, result){
    if(!error){
		//console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			var _roundwon = result.args.round - 1;
			eventdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " ASCENDS!<br>The new SnailGod wins Round " + _roundwon + " and claims " + formatEthValue2(web3.fromWei(result.args.ethreward,'ether')) + " ETH." ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var divEvent = myContract.NewDivs();

divEvent.watch(function(error, result){
    if(!error){
		//console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventdoc.innerHTML += "<br>[" + datetext + "] Another snail game just paid out " + formatEthValue2(web3.fromWei(result.args.ethreward,'ether')) + " ETH in divs to all holders!" ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});
