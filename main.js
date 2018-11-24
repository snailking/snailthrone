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
var n_account = "";

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
}

//Current ETH address in use
function updateEthAccount(){
	m_account = web3.eth.accounts[0];
	n_account = m_account.substring(2);
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
		if(god_roundover === false) {
			if(a_pharaoh === n_account) {
				pharaohdoc.innerHTML = "YOU<br>Will Ascend to Godhood in";
			} else {
			pharaohdoc.innerHTML = "0x" + a_pharaoh + "<br>Will Ascend to Godhood in";
			}
		}
		else {
			if(a_pharaoh === n_account) {
				pharaohdoc.innerHTML = "YOU ARE THE SNAILGOD!<br>Claim your winnings by starting a new round.";
			} else {
			pharaohdoc.innerHTML = "0x" + a_pharaoh + " is the SnailGod!<br>To the victor the spoils. Start a new round to be next in line!";
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
		a_tokenPrice = formatEthValue2(web3.fromWei(req,'ether'));
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

/* NETWORK CHECK */


/*
    if (typeof web3 !== "undefined") {
        web3 = new Web3(web3.currentProvider);
        web3.version.getNetwork(function(error, result) {
            if (!error) {
                if (result == "3") {
                    setup(true);
					console.log("Worked!");
                } else {
                    console.log("Error: you must be on Ropsten Network to use this website.");
                }
            }
        });
    } else {
        console.log("Error: web3 library not found. Please install the <a class="text-warning" href="https://metamask.io/">MetaMask</a> plugin to use this website.");
        $("#error").toggle(true);
        web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/2tXmBfvMC1sfg10iQAm4"));
        setup(false);
    }

/*
//New Metamask privacy change
window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});
//Check if user is on proper network
web3.version.getNetwork((err, netId) => {
    if(netId!="3"){
        console.log('Wrong network. Switch to Ropsten.');
    }
    /*
  switch (netId) {
    case "1":
      console.log('This is mainnet')
      break
    case "2":
      console.log('This is the deprecated Morden test network.')
      break
    case "3":
      console.log('This is the ropsten test network.')
      break
    default:
      console.log('This is an unknown network.')
      
  }*//*
})
*/