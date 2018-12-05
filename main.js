/* WEB3 DETECTION */

var modal2 = document.getElementById("modal2");

window.addEventListener("load", function() {
	if (typeof web3 !== "undefined") {
        web3 = new Web3(web3.currentProvider);
        web3.version.getNetwork(function(error, result) {
            if (!error) {
                if (result == "1") {
					console.log("Web3 Mainnet successfully loaded!");
                } else {
                    console.log("Error: you must be on the Mainnet to use this website.");
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

// Get the <span> element that closes the modal
var span2 = document.getElementById("close2");

// When the user clicks on <span> (x), close the modal
span2.onclick = function() {
    modal2.style.display = "none";
}

/* VARIABLES */

var a_godTimer = "";
var godtimer_in_seconds = 0;
var god_numhours = 0;
var god_numminutes = 0;
var god_numseconds = 0;

var god_roundover = false;

var godtimerdoc;
var playereggdoc;

var a_pharaoh = "";
var a_tokenPrice = 0;
var a_tokenSellPrice = 0;
var a_maxSnail = 0;
var a_godPot = 0;
var a_frogPot = 0;
var a_snailPot = 0;
var a_playerSnail = 0;
var a_playerEgg = 0;
var a_playerProd = 0;
var a_playerHatchCost = 0;
var a_feedReward = 0;
var a_pharaohReq = 0;
var a_pharaohReq2 = 0;
var a_removeSnailReq = 0;
var f_buy = 0;
var f_sell = 0;
var f_sacrifice = 40;
var m_account = "waiting for web3";

/* MODAL */

// Get the modal
var modal = document.getElementById("modal");

// Get the button that opens the modal
var b_helpmodal = document.getElementById("helpmodal");

// Get the <span> element that closes the modal
var span = document.getElementById("close");

// When the user clicks the button, open the modal 
b_helpmodal.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// Close modal on game info
function closeModal() {
	modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal || event.target == modal2) {
        modal.style.display = "none";
		modal2.style.display = "none";
    }
}

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

//Conversion of Date to hh:mm:ss
var datetext;

function date24() {
	d = new Date();
	datetext = d.toTimeString();
	datetext = datetext.split(' ')[0];
}

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

/* STATE UPDATES */

//Refreshes game data
function refreshData(){
	updateEthAccount();
	updateGodRound();
	updateGodPot();
	updateRoundPot();
	updatePharaoh();
	updateGodTimer();
	updatePharaohReq();
	updateMaxSnail();
	updateContractBalance();
	updateFrogPot();
	updateSnailPot();
	updatePlayerSnail();
	updateTokenPrice();
	updatePlayerSnailValue();
	updateTokenSellPrice();
	updateMaxSnailSell();
	updatePlayerEgg();
	updatePlayerProd();
	updateHatchPrice();
	updateFullHatchCost();
	updateFeedReward();
	updateFullFeedReward();
	updateUnclaimedDiv();
	updatePlayerEarning();
	updatePlayerRef();
	updateButton();
}

//Refreshes some game data faster
function refreshDataFast(){
	fastupdateGodTimer();
	//fastupdatePlayerEgg();
	updateFieldBuy2();
	updateFieldSacrifice2();
	updateFieldSell2();
	updateSellEstimate();
	updateBuyEstimate();
	updatePharaohEstimate();
}

//Current ETH address in use
function updateEthAccount(){
	m_account = web3.eth.accounts[0];
}

//Current round
function updateGodRound(){
	var godrounddoc = document.getElementById('godround');
	godRound(function(req) {
		godrounddoc.textContent = req;
	});
}

//Full godpot
function updateGodPot(){
	var godpotdoc = document.getElementById('godpot');
	godPot(function(req) {
		a_godPot = formatEthValue(web3.fromWei(req,'ether'));
		godpotdoc.textContent = a_godPot;
	});
}

//Current round pot (50% of godpot)
function updateRoundPot(){
	var roundpotdoc = document.getElementById('roundpot');
	roundpotdoc.textContent = a_godPot / 2;
}
	
//Current pharaoh
function updatePharaoh(){
	var pharaohdoc = document.getElementById('pharaoh');
	pharaoh(function(req) {
		a_pharaoh = req.substring(26, 66);
		var b_pharaoh = "0x" + a_pharaoh;
		if(god_roundover === false) {
			if(b_pharaoh === m_account) {
				pharaohdoc.innerHTML = "YOU<br>Will Ascend to Godhood in";
			} else {
			pharaohdoc.innerHTML = b_pharaoh + "<br>Will Ascend to Godhood in";
			}
		}
		else {
			if(b_pharaoh === m_account) {
				pharaohdoc.innerHTML = "YOU ARE THE SNAILGOD!<br>Claim your winnings by starting a new round.";
			} else {
			pharaohdoc.innerHTML = b_pharaoh + " is the SnailGod!<br>To the victor the spoils. Start a new round to be next in line!";
			}
		}
	});
}

//Current round timer
function updateGodTimer(){
	var blocktime = Math.round((new Date()).getTime() / 1000); //current blocktime should be Unix timestamp
	godtimerdoc = document.getElementById('godtimer');
	godTimer(function(req) {
		godtimer_in_seconds = req - blocktime; //godTimer is the planned blocktime for the end
		
		//Check if round is over
		if(godtimer_in_seconds <= 0){
			godtimerdoc.textContent = "[Round is over. Press the magic button below!]";
			god_roundover = true;
		} else {
			//Convert result to hour minute second format
			god_numhours = Math.floor(godtimer_in_seconds / 3600);
			god_numminutes = Math.floor((godtimer_in_seconds % 3600) / 60);
			god_numseconds = (godtimer_in_seconds % 3600) % 60;

			a_godTimer = god_numhours + "h " + god_numminutes + "m " + god_numseconds + "s ";
			godtimerdoc.textContent = a_godTimer;
			god_roundover = false;
		}
	});
}

//Show or hide relevant sacrifice/new round buttons
function updateButton(){
	if (god_roundover === false) {
		document.getElementById('showroundon').style.display = "block";
		document.getElementById('showroundoff').style.display = "none";
	} else {
		document.getElementById('showroundoff').style.display = "block";
		document.getElementById('showroundon').style.display = "none";
	}
}

//Fast local update for godtimer
function fastupdateGodTimer(){
	
	//Check if round is ongoing
	if(godtimer_in_seconds > 0){
		godtimer_in_seconds = godtimer_in_seconds - 0.2;
		//console.log(godtimer_in_seconds);
		god_numhours = Math.floor(godtimer_in_seconds / 3600);
		god_numminutes = Math.floor((godtimer_in_seconds % 3600) / 60);
		god_numseconds = parseFloat((godtimer_in_seconds % 3600) % 60).toFixed(0);
		
		a_godTimer = god_numhours + "h " + god_numminutes + "m " + god_numseconds + "s ";
		godtimerdoc.textContent = a_godTimer;
	}
}	
	
//Current pharaoh requirement
function updatePharaohReq(){
	var pharaohreqdoc = document.getElementById('pharaohreq');
	var pharaohreq2doc = document.getElementById('pharaohreq2');
	//Check current pharaohReq
	pharaohReq(function(req) {
		a_pharaohReq = req;
	});
	//Check number of snails to remove
	ComputePharaohReq(function(req) {
		a_removeSnailReq = req;
	});
	//Remove snails from pharaohReq
	a_pharaohReq2 = a_pharaohReq - a_removeSnailReq;
	if(a_pharaohReq2 < 40) {
		a_pharaohReq2 = 40; //minimum req
	}

	pharaohreqdoc.textContent = a_pharaohReq2;
	pharaohreq2doc.textContent = a_pharaohReq2;
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
	GetContractBalance(function(req) {
		contractbalancedoc.textContent = formatEthValue2(web3.fromWei(req,'ether'));
	});
}

//Current frog pot
function updateFrogPot(){
	var frogpotdoc = document.getElementById('frogpot');
	frogPot(function(req) {
		a_frogPot = formatEthValue(web3.fromWei(req,'ether'));
		frogpotdoc.textContent = a_frogPot;
	});
}

//Current snail pot
function updateSnailPot(){
	var snailpotdoc = document.getElementById('snailpot');
	snailPot(function(req) {
		a_snailPot = formatEthValue(web3.fromWei(req,'ether'));
		snailpotdoc.textContent = a_snailPot;
	});
}
	
//Current player snail count
function updatePlayerSnail(){
	var playersnaildoc = document.getElementById('playersnail');
	GetMySnails(function(req) {
		a_playerSnail = req;
		playersnaildoc.textContent = a_playerSnail;
	});
}

//Current token price on buys
function updateTokenPrice(){
	var tokenpricedoc = document.getElementById('tokenprice');
	ComputeTokenPrice(function(req) {
		a_tokenPrice = parseFloat(web3.fromWei(req,'ether')).toFixed(7);
		tokenpricedoc.textContent = a_tokenPrice;
	});
}

//Current token price on sells
function updateTokenSellPrice(){
	var tokensellpricedoc = document.getElementById('tokensellprice');
	a_tokenSellPrice = a_tokenPrice / 2;
	tokensellpricedoc.textContent = a_tokenSellPrice;
}

//Maximum snails that can be sold
function updateMaxSnailSell(){
	var maxsnailselldoc = document.getElementById('maxsnailsell');
	var i_snailPot = a_snailPot / 10; //the maximum obtainable in one sale is 10%
	maxsnailselldoc.textContent = parseFloat(i_snailPot / a_tokenSellPrice).toFixed(0); //divide that max by token price, round up to integer
}
	
//Current player snail ETH value
function updatePlayerSnailValue(){
	var playersnailvaluedoc = document.getElementById('playersnailvalue');
	playersnailvaluedoc.textContent = parseFloat(a_playerSnail * a_tokenSellPrice).toFixed(4);
}

//Current player eggs
function updatePlayerEgg(){
	playereggdoc = document.getElementById('playeregg');
	ComputeMyEggs(m_account, function(req) {
		a_playerEgg = formatEthValue(req);
		//a_playerEgg = parseFloat(a_playerEgg / 1080000).toFixed(0); //TIME_TO_HATCH_1SNAIL
		playereggdoc.textContent = a_playerEgg;
	});
}

//Fast local update for player eggs
/*function fastupdatePlayerEgg(){
	playereggdoc = document.getElementById('playeregg');
	var b_playerEgg = a_playerEgg + (a_playerProd / 18000); //60 minutes * 60 seconds * 5 refreshes per second = 18000
	a_playerEgg = parseFloat(b_playerEgg).toFixed(4);
	playereggdoc.textContent = a_playerEgg;
}*/

//Current player prod
function updatePlayerProd(){
	var playerproddoc = document.getElementById('playerprod');
	a_playerProd = parseFloat(a_playerSnail * 0.08 / 24).toFixed(4); //8% per day, divided by 24 hours
	playerproddoc.textContent = a_playerProd;
}

//Current hatch price per egg
function updateHatchPrice(){
	var hatchpricedoc = document.getElementById('hatchprice');
	hatchpricedoc.textContent = a_tokenSellPrice;
}

//Current hatch cost for player
function updateFullHatchCost(){
	var fullhatchcostdoc = document.getElementById('fullhatchcost');
	var roundup = 0.000004;
	a_playerHatchCost = parseFloat(a_playerEgg * a_tokenSellPrice).toFixed(6);
	a_playerHatchCost = parseFloat(a_playerHatchCost + roundup).toFixed(6);
	fullhatchcostdoc.textContent = a_playerHatchCost;
}

//Current feed reward per egg
function updateFeedReward(){
	var feedrewarddoc = document.getElementById('feedreward');
	a_feedReward = parseFloat(a_frogPot / a_maxSnail).toFixed(8);
	feedrewarddoc.textContent = a_feedReward;
}

//Current feed reward for player
function updateFullFeedReward(){
	var fullfeedrewarddoc = document.getElementById('fullfeedreward');
	fullfeedrewarddoc.textContent = parseFloat(a_playerEgg * a_feedReward).toFixed(8);
}

//Current unclaimed dividends for player
function updateUnclaimedDiv(){
	var playerdivdoc = document.getElementById('playerdiv');
	ComputeMyDivs(function(req) {
		var b_playerdiv = formatEthValue(web3.fromWei(req,'ether'));
		playerdivdoc.textContent = b_playerdiv;
	});
}
	
//Current balance for player
function updatePlayerEarning(){
	var playerearningdoc = document.getElementById('playerearning');
	GetMyEarnings(function(req) {
		playerearningdoc.textContent = formatEthValue(web3.fromWei(req,'ether'));
	});
}	

//Status of referral link for player
function updatePlayerRef(){
	if(a_playerSnail >= 300){
		playerreflinkdoc.innerHTML = "<br>" + a_refLink; //+ "<br>Any buy through this link gives you 6% of the ETH spent.";
	} else {
		playerreflinkdoc.textContent = "NOT active. You must have at least 300 snails in your hatchery.";
	}
}

//Lifetime divs - UNUSED
function updateMaxDiv(){
	var maxdivdoc = document.getElementById('maxdiv');
	divsPerSnail(function(req) {
		maxdivdoc.textContent = formatEthValue2(web3.fromWei(req,'ether'));
	});
}

/* LOCAL FIELD INPUT */

//Player input on buy
function updateFieldBuy2(){
	//var fieldbuydoc = document.getElementById('fieldBuy');
	f_buy = document.getElementById('fieldBuy').value;
	if(f_buy > 4){ 
		f_buy = 4; //max 4 ETH per buy
	}
	var fieldbuy2doc = document.getElementById('fieldBuy2');
	fieldbuy2doc.textContent = f_buy;
}

//Buy estimate
function updateBuyEstimate(){
	var buyEstimatedoc = document.getElementById('buyestimate');
	buyEstimatedoc.textContent = parseFloat(f_buy / a_tokenPrice).toFixed(0);
}
	
//Player input on sell
function updateFieldSell2(){
	//var fieldbuydoc = document.getElementById('fieldBuy');
	f_sell = document.getElementById('fieldSell').value;
	var fieldsell2doc = document.getElementById('fieldSell2');
	fieldsell2doc.textContent = f_sell;
}

//Sell estimate
function updateSellEstimate(){
	var sellEstimatedoc = document.getElementById('sellEstimate');
	sellEstimatedoc.textContent = parseFloat(f_sell * a_tokenSellPrice).toFixed(6);
}

//Player input on sacrifice
function updateFieldSacrifice2(){
	f_sacrifice = document.getElementById('fieldSacrifice').value;
	if(f_sacrifice < a_pharaohReq2){
		f_sacrifice = a_pharaohReq2;
	}
	var fieldsacrifice2doc = document.getElementById('fieldSacrifice2');
	fieldsacrifice2doc.textContent = f_sacrifice;
}

//Next requirement estimate
function updatePharaohEstimate(){
	var pharaohEstimatedoc = document.getElementById('pharaohestimate');
	pharaohEstimatedoc.innerHTML = parseInt(f_sacrifice) + parseInt(40);
}

/* WEB3 TRANSACTIONS */

//Buy snail tokens
function webBuySnail(){
	var ref = getQueryVariable('ref');
    var weitospend = web3.toWei(f_buy,'ether');
    BuySnail(ref, weitospend,function(){
    });
}

//Sacrifice snail tokens
function webSacrificeSnail(){
	BecomePharaoh(f_sacrifice, function(){
	});
}

//Sell snail tokens
function webSellSnail(){
	SellSnail(f_sell, function(){
	});
}

//Hatch eggs
function webHatchEgg(){
	var weitospend = web3.toWei(a_playerHatchCost,'ether');
	HatchEgg(weitospend, function(){
	});
}

//Feed eggs
function webFeedFrog(){
	FeedEgg(function(){
	});
}

//Claim divs
function webClaimDiv(){
	ClaimDivs(function(){
	});
}

//Withdraw earnings
function webWithdrawEarning(){
	WithdrawEarnings(function(){
	});
}

//Start a new round
function webAscendGod(){
	AscendGod(function(){
	});
}

/* CONTRACT ABI */

abiDefinition=[{"constant": false,"inputs": [],"name": "ClaimDivs","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "ComputeMyDivs","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "AscendGod","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "godTimer","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_snails","type": "uint256"}],"name": "BecomePharaoh","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "hatcherySnail","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "FeedEgg","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "PHARAOH_REQ_START","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "GetMySnails","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "lastHatch","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "TOKEN_MAX_BUY","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "frogPot","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "claimedDivs","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "SNAIL_REQ_REF","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_ref","type": "address"}],"name": "BuySnail","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": true,"inputs": [],"name": "gameStarted","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "pharaoh","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "playerEarnings","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "snailPot","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "GOD_TIMER_START","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "TOKEN_PRICE_FLOOR","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "pharaohReq","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "HatchEgg","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": true,"inputs": [],"name": "godPot","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "StartGame","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": true,"inputs": [],"name": "lastClaim","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "WithdrawEarnings","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "_ether","type": "uint256"}],"name": "ComputeBuy","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_tokensSold","type": "uint256"}],"name": "SellSnail","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "TIME_TO_HATCH_1SNAIL","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "ComputePharaohReq","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "ComputeTokenPrice","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "godRound","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "TOKEN_PRICE_MULT","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "divsPerSnail","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "GOD_TIMER_BOOST","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "GOD_TIMER_INTERVAL","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "GetMyEarnings","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "adr","type": "address"}],"name": "ComputeMyEggs","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "gameOwner","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "GetContractBalance","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "maxSnail","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"inputs": [],"payable": false,"stateMutability": "nonpayable","type": "constructor"},{"payable": true,"stateMutability": "payable","type": "fallback"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "ethreward","type": "uint256"}],"name": "WithdrewEarnings","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "ethreward","type": "uint256"}],"name": "ClaimedDivs","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "ethspent","type": "uint256"},{"indexed": false,"name": "snail","type": "uint256"}],"name": "BoughtSnail","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "ethreward","type": "uint256"},{"indexed": false,"name": "snail","type": "uint256"}],"name": "SoldSnail","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "ethspent","type": "uint256"},{"indexed": false,"name": "snail","type": "uint256"}],"name": "HatchedSnail","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "ethreward","type": "uint256"},{"indexed": false,"name": "egg","type": "uint256"}],"name": "FedFrogking","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "ethreward","type": "uint256"},{"indexed": true,"name": "round","type": "uint256"}],"name": "Ascended","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": true,"name": "round","type": "uint256"}],"name": "BecamePharaoh","type": "event"},{"anonymous": false,"inputs": [{"indexed": false,"name": "ethreward","type": "uint256"}],"name": "NewDivs","type": "event"}]

contractAddress="0x261d650a521103428C6827a11fc0CBCe96D74DBc" // MAINNET

var contractAbi = web3.eth.contract(abiDefinition);
var myContract = contractAbi.at(contractAddress);

	
function AscendGod(callback){
    var outputData = myContract.AscendGod.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('AscendGod ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function BecomePharaoh(_snails,callback){
    var outputData = myContract.BecomePharaoh.getData(_snails);
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('BecomePharaoh ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function BuySnail(_ref,eth,callback){
    var outputData = myContract.BuySnail.getData(_ref);
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData,value: eth},
    function(error,result){
        if(!error){
            console.log('BuySnail ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function ClaimDivs(callback){
    var outputData = myContract.ClaimDivs.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('ClaimDivs ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function FeedEgg(callback){
    var outputData = myContract.FeedEgg.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('FeedEgg ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function HatchEgg(eth,callback){
    var outputData = myContract.HatchEgg.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData,value: eth},
    function(error,result){
        if(!error){
            console.log('HatchEgg ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function SellSnail(_tokensSold,callback){
    var outputData = myContract.SellSnail.getData(_tokensSold);
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('SellSnail ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function StartGame(eth,callback){
    var outputData = myContract.StartGame.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData,value: eth},
    function(error,result){
        if(!error){
            console.log('StartGame ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function WithdrawEarnings(callback){
    var outputData = myContract.WithdrawEarnings.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('WithdrawEarnings ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function claimedDivs(callback){
    var outputData = myContract.claimedDivs.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('claimedDivs ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeBuy(_ether,callback){
    var outputData = myContract.ComputeBuy.getData(_ether);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('ComputeBuy ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeMyDivs(callback){
    var outputData = myContract.ComputeMyDivs.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('ComputeMyDivs ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeMyEggs(adr,callback){
    var outputData = myContract.ComputeMyEggs.getData(adr);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('ComputeMyEggs ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function ComputePharaohReq(callback){
    var outputData = myContract.ComputePharaohReq.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('ComputePharaohReq ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeTokenPrice(callback){
    var outputData = myContract.ComputeTokenPrice.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('ComputeTokenPrice ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function divsPerSnail(callback){
    var outputData = myContract.divsPerSnail.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('divsPerSnail ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function frogPot(callback){
    var outputData = myContract.frogPot.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('frogPot ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function gameOwner(callback){
    var outputData = myContract.gameOwner.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('gameOwner ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function gameStarted(callback){
    var outputData = myContract.gameStarted.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('gameStarted ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function GetContractBalance(callback){
    var outputData = myContract.GetContractBalance.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('GetContractBalance ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function GetMyEarnings(callback){
    var outputData = myContract.GetMyEarnings.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('GetMyEarnings ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function GetMySnails(callback){
    var outputData = myContract.GetMySnails.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('GetMySnails ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function GOD_TIMER_BOOST(callback){
    var outputData = myContract.GOD_TIMER_BOOST.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('GOD_TIMER_BOOST ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function GOD_TIMER_INTERVAL(callback){
    var outputData = myContract.GOD_TIMER_INTERVAL.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('GOD_TIMER_INTERVAL ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function GOD_TIMER_START(callback){
    var outputData = myContract.GOD_TIMER_START.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('GOD_TIMER_START ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function godPot(callback){
    var outputData = myContract.godPot.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('godPot ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function godRound(callback){
    var outputData = myContract.godRound.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('godRound ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function godTimer(callback){
    var outputData = myContract.godTimer.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('godTimer ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function hatcherySnail(callback){
    var outputData = myContract.hatcherySnail.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('hatcherySnail ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function lastClaim(callback){
    var outputData = myContract.lastClaim.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('lastClaim ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function lastHatch(callback){
    var outputData = myContract.lastHatch.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('lastHatch ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function maxSnail(callback){
    var outputData = myContract.maxSnail.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('maxSnail ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function pharaoh(callback){
    var outputData = myContract.pharaoh.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('pharaoh ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function PHARAOH_REQ_START(callback){
    var outputData = myContract.PHARAOH_REQ_START.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('PHARAOH_REQ_START ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function pharaohReq(callback){
    var outputData = myContract.pharaohReq.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('pharaohReq ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function playerEarnings(callback){
    var outputData = myContract.playerEarnings.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('playerEarnings ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function SNAIL_REQ_REF(callback){
    var outputData = myContract.SNAIL_REQ_REF.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('SNAIL_REQ_REF ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function snailPot(callback){
    var outputData = myContract.snailPot.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('snailPot ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function TIME_TO_HATCH_1SNAIL(callback){
    var outputData = myContract.TIME_TO_HATCH_1SNAIL.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('TIME_TO_HATCH_1SNAIL ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function TOKEN_MAX_BUY(callback){
    var outputData = myContract.TOKEN_MAX_BUY.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('TOKEN_MAX_BUY ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function TOKEN_PRICE_FLOOR(callback){
    var outputData = myContract.TOKEN_PRICE_FLOOR.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('TOKEN_PRICE_FLOOR ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function TOKEN_PRICE_MULT(callback){
    var outputData = myContract.TOKEN_PRICE_MULT.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('TOKEN_PRICE_MULT ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
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

var hatchEvent = myContract.HatchedSnail();

hatchEvent.watch(function(error, result){
    if(!error){
		console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			var _ethspent = result.args.ethspent;
			_ethspent = formatEthValue2(web3.fromWei(_ethspent,'ether'));
			eventdoc.innerHTML += "<br>[" + datetext + "] " + result.args.player + " hatched " + result.args.snail + " snails for " + _ethspent + " ETH." ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var soldEvent = myContract.SoldSnail();

soldEvent.watch(function(error, result){
    if(!error){
		console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			var _ethreward = result.args.ethreward;
			_ethreward = formatEthValue2(web3.fromWei(_ethreward,'ether'));
			eventdoc.innerHTML += "<br>[" + datetext + "] " + result.args.player + " sold " + result.args.snail + " snails for " + _ethreward + " ETH." ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var boughtEvent = myContract.BoughtSnail();

boughtEvent.watch(function(error, result){
    if(!error){
		console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			var _ethspent = result.args.ethspent;
			_ethspent = formatEthValue2(web3.fromWei(_ethspent,'ether'));
			eventdoc.innerHTML += "<br>[" + datetext + "] " + result.args.player + " bought " + result.args.snail + " snails for " + _ethspent + " ETH." ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var newpharaohEvent = myContract.BecamePharaoh();

newpharaohEvent.watch(function(error, result){
    if(!error){
		console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventdoc.innerHTML += "<br>[" + datetext + "] " + result.args.player + " sacrifices snails and claims the throne!" ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var withdrewEvent = myContract.WithdrewEarnings();

withdrewEvent.watch(function(error, result){
    if(!error){
		console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			var _ethreward = result.args.ethreward;
			_ethreward = formatEthValue2(web3.fromWei(_ethreward,'ether'));
			eventdoc.innerHTML += "<br>[" + datetext + "] " + result.args.player + " withdrew " + _ethreward + " ETH." ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var claimedEvent = myContract.ClaimedDivs();

claimedEvent.watch(function(error, result){
    if(!error){
		console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			var _ethreward = result.args.ethreward;
			_ethreward = formatEthValue2(web3.fromWei(_ethreward,'ether'));
			eventdoc.innerHTML += "<br>[" + datetext + "] " + result.args.player + " claimed " + _ethreward + " ETH in divs." ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var fedEvent = myContract.FedFrogking();

fedEvent.watch(function(error, result){
    if(!error){
		console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			var _ethreward = result.args.ethreward;
			_ethreward = formatEthValue2(web3.fromWei(_ethreward,'ether'));
			eventdoc.innerHTML += "<br>[" + datetext + "] " + result.args.player + " fed the Frogking " + result.args.egg + " eggs and won " + _ethreward + " ETH." ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var ascendedEvent = myContract.Ascended();

ascendedEvent.watch(function(error, result){
    if(!error){
		console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			var _ethreward = result.args.ethreward;
			_ethreward = formatEthValue2(web3.fromWei(_ethreward,'ether'));
			var _roundwon = result.args.round - 1;
			eventdoc.innerHTML += "<br>[" + datetext + "] " + result.args.player + " ASCENDS!<br>The new SnailGod wins Round " + _roundwon + " and claims " + _ethreward + " ETH." ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var divEvent = myContract.NewDivs();

divEvent.watch(function(error, result){
    if(!error){
		console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			var _ethreward = result.args.ethreward;
			_ethreward = formatEthValue2(web3.fromWei(_ethreward,'ether'));
			eventdoc.innerHTML += "<br>[" + datetext + "] Another snail game just paid out " + _ethreward + " ETH in divs to all holders!" ;
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});