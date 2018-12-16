//var contractAddress="0x0888E6ec5b053Bc7FA3244ED58af25883f742C70" // ROPSTEN 1
//var contractAddress="0x0b4f4F98457e6A9431EdDD8f8c4fD731Ef2fA5f6" // ROPSTEN 2
//var contractAddress="0xFaF0263bDB5556d3013eB67Db2cfe6f9545a1c48" // ROPSTEN 3
//var contractAddress="0x3Fb1D4075C12611293D583E79CD3A62993ec974E" // ROPSTEN 4
//var contractAddress="0x8BECf05666D536c82aA72565dD9BaD4bC31F3bec" // ROPSTEN 5
//var contractAddress="0x486e218E8029eFCc096DbE8a8E4C7f1a20aF8ddF" // ROPSTEN 6

var contractAddress="0x2A185c995373a766979E645D0912d30E27aa56f6" // MAINNET

/* WEB3 DETECTION */

//var modal2 = document.getElementById("modal2");

var web3;

window.addEventListener("load", function() {
	if (typeof web3 !== "undefined") {
        web3 = new Web3(web3.currentProvider);
        web3.version.getNetwork(function(error, result) {
            if (!error) {
                if (result == "1") {
					console.log("Mainnet successfully loaded!");
                } else {
                    console.log("You must be on the Mainnet to play SnailFarm 3!");
					web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/f423492af8504d94979d522c3fbf3794"));
					//modal2.style.display = "block";
                }
            }
        });
    } else {
        console.log("Web3 library not found.");
		//modal2.style.display = "block";
        web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/f423492af8504d94979d522c3fbf3794"));
    }
});
/*
// Get the <span> element that closes the modal
var span2 = document.getElementById("close2");

// When the user clicks on <span> (x), close the modal
span2.onclick = function() {
    modal2.style.display = "none";
}

/* MODAL */
/*
// Get the modal
var modal = document.getElementById("modal");

// Close modal on game info
function CloseModal() {
	modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal || event.target == modal2) {
        modal.style.display = "none";
    }
}
*/
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
	return adr.substring(0, 10);
}

//Conversion of Date to hh:mm:ss
var datetext;

function date24() {
	d = new Date();
	datetext = d.toTimeString();
	datetext = datetext.split(' ')[0];
}

/* VARIABLES */

var a_gameActive = false;
var a_downtime = 0;
var a_round = 0;
var a_contractBalance = 0;

var playereggdoc;

var c_snailmaster = "";
var c_spiderowner = "";
var c_squirrelowner = "";
var c_tadpoleowner = "";

var a_marketEgg = 0; 
var a_tokenPrice = 0;
var a_tokenSellPrice = 0;
var a_maxAcorn = 0;
var a_acornCost = 0; 

var a_roundPot = 0; 
var a_eggPot = 0; 
var a_snailPot = 0; 
var a_thronePot = 0; 

var a_leaderSnail = 0;

var a_harvestCost = 0;
var a_lettuceReq = 0;
var a_tadpoleReq = 0; 

var a_playerRound = 0;
var a_playerSnail = 0; 
var a_playerEgg = 0; 
var a_playerBoost = 0; 
var a_playerProd = 0;
var a_playerRed = 0; 
var a_playerAcorn = 0;

var o_playerEgg = 0;
var s_playerEgg = 0;
var z_playerEgg = 0;

var f_buy = 0;
var f_prince = 0;
var f_tree = 0;
var f_redhatch = 0;

var m_account = "waiting for web3";
var l_account;

//Leaderboard Array

var d_leaderboard = [
	{ address: "0x0000000022223333444455556666777788889999", hatchery: 0, egg: 0, red: 0, rank: 1, boost1: false, boost2: false, boost3: false, boost4: false, boost5: false, boost6: false },
	{ address: "0x0000111122223333444455556666777788889999", hatchery: 0, egg: 0, red: 0, rank: 2, boost1: false, boost2: false, boost3: false, boost4: false, boost5: false, boost6: false },
	{ address: "0x0000222222223333444455556666777788889999", hatchery: 0, egg: 0, red: 0, rank: 3, boost1: false, boost2: false, boost3: false, boost4: false, boost5: false, boost6: false },
	{ address: "0x0000333322223333444455556666777788889999", hatchery: 0, egg: 0, red: 0, rank: 4, boost1: false, boost2: false, boost3: false, boost4: false, boost5: false, boost6: false },
	{ address: "0x0000444422223333444455556666777788889999", hatchery: 0, egg: 0, red: 0, rank: 5, boost1: false, boost2: false, boost3: false, boost4: false, boost5: false, boost6: false }
];	

/* GLOBAL LOOP */

//Initiates loops
function main(){
    console.log('Main loop started.');
    controlLoop();
	controlLoopFast();
	controlLoopSlow();
	controlLoopEgg();
}

//Main loop on 4 seconds
function controlLoop(){
    refreshData();
    setTimeout(controlLoop,4000);
}

//Secondary loop on 200ms for actions that need faster refresh
function controlLoopFast(){
	refreshDataFast();
	setTimeout(controlLoopFast,200);
}

//Another loop on 1 minute for a slow, heavy leaderboard update
function controlLoopSlow(){
	refreshDataSlow();
	////console.log("slow loop");
	setTimeout(controlLoopSlow,60000);
}

//Super fast 100ms loop for eggs approximation
function controlLoopEgg(){
	fastPlayerEgg();
	setTimeout(controlLoopEgg,100);
}

/* STATE UPDATES */

//Refreshes game data
function refreshData(){
	updateEthAccount();
	updateContractBalance();
	updateGameActive();
	updateRound();
	
	updateEggPot();
	updateRoundPot();
	updateSnailPot();
	updateThronePot();
	
	updateMarketEgg();
	updateMaxEggBuy();
	updateMaxAcorn();
	updateAcornCost();
	
	updateHarvestCost();
	
	updateLeader();
	updateLeaderSnail();
	
	updatePlayerStatus();
	updatePlayerRound();
	
	updatePlayerSnail();
	updatePlayerEgg();
	updatePlayerRed();
	updatePlayerProd();
	updatePlayerBoost();
	
	updatePlayerBalance();
	updatePlayerAcorn();
	updatePlayerShare();

	checkPotato();
	checkSnailmaster();
	checkSpiderOwner();
	checkSquirrelOwner();
	checkTadpoleOwner();
	checkOwnsLettuce();
	checkOwnsCarrot();
	checkOwnsSlug();
	
	updateSnailmasterReq();
	updateSpiderReq();
	updateSquirrelReq();
	updateTadpoleReq();
	updateLettuceReq();
	
	updateHatchEstimate();
}

//Refreshes some game data faster
function refreshDataFast(){
	updateFieldBuy2();
	updateBuyEstimate();
	updateFieldPrince2();
	updateSellEstimate();
	updateFieldTree2();
	updateTreeEstimate();
	updateRedHatch2();
	updateRedEstimate();
	fastupdateDowntime();
}

//Refreshes leaderboard
function refreshDataSlow(){
	checkLeaderboard0();
	checkLeaderboard1();
	checkLeaderboard2();
	checkLeaderboard3();
	checkLeaderboard4();
	
	checkLeaderEgg0();
	checkLeaderEgg1();
	checkLeaderEgg2();
	checkLeaderEgg3();
	checkLeaderEgg4();
	
	checkLeaderRed0();
	checkLeaderRed1();
	checkLeaderRed2();
	checkLeaderRed3();
	checkLeaderRed4();
	
	checkLeaderLettuce0();
	checkLeaderLettuce1();
	checkLeaderLettuce2();
	checkLeaderLettuce3();
	checkLeaderLettuce4();
	
	checkLeaderCarrot0();
	checkLeaderCarrot1();
	checkLeaderCarrot2();
	checkLeaderCarrot3();
	checkLeaderCarrot4();
	
	checkLeaderSlug0();
	checkLeaderSlug1();
	checkLeaderSlug2();
	checkLeaderSlug3();
	checkLeaderSlug4();
	
	slowupdateLeaderboard();
	showLeaderboard();
	
	slowupdatePlayerEgg();
	////console.log("refreshed leaderboard fully");
}

var gameactivedoc = document.getElementById('gameactive');

//Current state of the game
function updateGameActive(){
	gameActive(function(result) {
		if(result == true) {
			a_gameActive = true;
			gameactive.innerHTML = "The game is active!";
		} else {
			a_gameActive = false;
			nextRoundStart(function(result2) {
				var blocktime = Math.round((new Date()).getTime() / 1000); //current blocktime should be Unix timestamp
				a_downtime = parseFloat(result2) - parseFloat(blocktime);
				if(a_downtime < 0) {
					a_downtime = 0;
				}
			});
		}
	});
}

//Player status (if game is active, get starting snails if needed, else join round if needed, else nothing)
function updatePlayerStatus(){
	var playerstatusdoc = document.getElementById('playerstatus')
	if(a_gameActive == true){
		if(a_playerRound == 0){
			playerstatusdoc.innerHTML = '<button class="btn btn-success" onclick="webGetStarter()">Get Starting Snails!</button><br><p class="black-shadow">(will let you play every round, 0.004 ETH cost)</p>';
		} else if(a_playerRound != a_round){
			playerstatusdoc.innerHTML = '<button class="btn btn-success" onclick="webJoinRound()">Join New Round!</button><br><p class="black-shadow">(will give you red eggs for your previous performance)</p>';
		} else {
			playerstatusdoc.innerHTML = '<img height="64" src="img/snail.png">';
		}
	} else {
		playerstatusdoc.innerHTML = '<button class="btn btn-success" onclick="webBeginRound()">Begin New Round!</button><br><p class="black-shadow">(will only work if countdown timer is at 0)</p>';
	}
}
		

//Check player round
function updatePlayerRound() {
	GetMyRound( function(result) {
		a_playerRound = result;	
	});
}
		
//Fast update for Downtime if round is unactive
function fastupdateDowntime(){
	if(a_gameActive != true) {
		a_downtime = a_downtime - 0.2;
		
		downtime_hours = Math.floor(a_downtime / 3600);
		if(downtime_hours < 10) { downtime_hours = "0" + downtime_hours }
		downtime_minutes = Math.floor((a_downtime % 3600) / 60);
		if(downtime_minutes < 10) { downtime_minutes = "0" + downtime_minutes }
		downtime_seconds = parseFloat((a_downtime % 3600) % 60).toFixed(0);
		if(downtime_seconds < 10) { downtime_seconds = "0" + downtime_seconds }
		
		if(a_downtime > 0) {
			gameactive.innerHTML = "ROUND " + a_round + " IS OVER! <br>Next round starts in " + downtime_hours + ":" + downtime_minutes + ":" + downtime_seconds;
		} else {
			gameactive.innerHTML = "The next round is ready to start!";
		}
	}	
}

//Show Leaderboard

function showLeaderboard() {
	var leaderboarddoc = document.getElementById('leaderboard');
	leaderboarddoc.innerHTML = "";
	for(i = 1; i < 6; i++) {
		for(j = 0; j < 5; j++) {
			if(d_leaderboard[j].rank == i) {
				leaderboarddoc.innerHTML += "#" + d_leaderboard[j].rank + " | " + formatEthAdr(d_leaderboard[j].address) + " | " + d_leaderboard[j].hatchery + " Snails | " + d_leaderboard[j].egg + " Eggs | " + d_leaderboard[j].red + " Reds | ";
				////console.log("updated rank " + i + " with index " + j);
				if(d_leaderboard[j].boost1 == true) {
					leaderboarddoc.innerHTML += "<img src='img/spider.png' height='32'>";
					////console.log(d_leaderboard[j] + " has spidersqueen");
				}
				if(d_leaderboard[j].boost2 == true) {
					leaderboarddoc.innerHTML += "<img src='img/squirrel.png' height='32'>";
					////console.log(d_leaderboard[j] + " has squirrel");
				}
				if(d_leaderboard[j].boost3 == true) {
					leaderboarddoc.innerHTML += "<img src='img/tadpole.png' height='32'>";
					////console.log(d_leaderboard[j] + " has tadpole");
				}
				if(d_leaderboard[j].boost4 == true) {
					leaderboarddoc.innerHTML += "<img src='img/lettuce.png' height='32'>";
					//console.log(d_leaderboard[j] + " has lettuce");
				}
				if(d_leaderboard[j].boost5 == true) {
					leaderboarddoc.innerHTML += "<img src='img/carrot.png' height='32'>";
					////console.log(d_leaderboard[j] + " has carrot");
				}
				if(d_leaderboard[j].boost6 == true) {
					leaderboarddoc.innerHTML += "<img src='img/slug.png' height='32'>";
					////console.log(d_leaderboard[j] + " has slug");
				}
				leaderboarddoc.innerHTML += "<br>";
			}
		}
	}
}

//Update for Leaderboard checking every address
function slowupdateLeaderboard() {
	for(i = 0; i < 5; i++) {
		var lead = d_leaderboard[i];
		////console.log(lead);
		var _boost4 = false;
		var _boost5 = false;
		var _boost6 = false;
		var _hatchery = 0;
		if(lead.address == c_spiderowner) {
			d_leaderboard[i].boost1 = true;
		} else {
			d_leaderboard[i].boost1 = false;
		}
		////console.log("checked spiderowner for " + i);
		if(lead.address == c_squirrelowner) {
			d_leaderboard[i].boost2 = true;
		}  else {
			d_leaderboard[i].boost2 = false;
		}
		////console.log("checked squirrelowner for " + i);
		if(lead.address == c_tadpoleowner) {
			d_leaderboard[i].boost3 = true;
		}  else {
			d_leaderboard[i].boost3 = false;
		}
	}
	
	//Loop through hatcheries and store top ones to assign ranks
	var avoidNext = [0, 0, 0, 0, 0];
	for(k = 1; k < 6; k++) {
		var topHatch = 1;
		var topGuy = 0;
		for(j = 0; j < 5; j++) {
			if(avoidNext[j] != 1){
				console.log("avoidNext[" + j + "] evaluated to != 1");
				if(d_leaderboard[j].hatchery > topHatch){
					topHatch = d_leaderboard[j].hatchery;
					topGuy = j;
				}
			}
		}
		d_leaderboard[topGuy].rank = k;
		console.log("New rank " + k + " : " + d_leaderboard[topGuy].address);
		avoidNext[topGuy] = 1;
		console.log("Next time, avoid indice " + topGuy);
	}
	
	showLeaderboard();
}

//Ugly Leaderboard updates. Can't seem to get a loop working for these web3 calls due to delays
function checkLeaderboard0(){
	GetSnail(d_leaderboard[0].address, function(result) {
		d_leaderboard[0].hatchery = result;
		//console.log(result);
		//console.log("hatchery of " + d_leaderboard[0].address + " = " + d_leaderboard[0].hatchery);
	});
}

function checkLeaderboard1(){
	GetSnail(d_leaderboard[1].address, function(result) {
		d_leaderboard[1].hatchery = result;
	});
}

function checkLeaderboard2(){
	GetSnail(d_leaderboard[2].address, function(result) {
		d_leaderboard[2].hatchery = result;
	});
}

function checkLeaderboard3(){
	GetSnail(d_leaderboard[3].address, function(result) {
		d_leaderboard[3].hatchery = result;
	});
}

function checkLeaderboard4(){
	GetSnail(d_leaderboard[4].address, function(result) {
		d_leaderboard[4].hatchery = result;
	});
}

function checkLeaderEgg0(){
	ComputeMyEgg(d_leaderboard[0].address, function(result) {
		d_leaderboard[0].egg = result;
	});
}

function checkLeaderEgg1(){
	ComputeMyEgg(d_leaderboard[1].address, function(result) {
		d_leaderboard[1].egg = result;
	});
}

function checkLeaderEgg2(){
	ComputeMyEgg(d_leaderboard[2].address, function(result) {
		d_leaderboard[2].egg = result;
	});
}

function checkLeaderEgg3(){
	ComputeMyEgg(d_leaderboard[3].address, function(result) {
		d_leaderboard[3].egg = result;
	});
}

function checkLeaderEgg4(){
	ComputeMyEgg(d_leaderboard[4].address, function(result) {
		d_leaderboard[4].egg = result;
	});
}

function checkLeaderRed0(){
	GetRed(d_leaderboard[0].address, function(result) {
		d_leaderboard[0].red = result;
	});
}

function checkLeaderRed1(){
	GetRed(d_leaderboard[1].address, function(result) {
		d_leaderboard[1].red = result;
	});
}

function checkLeaderRed2(){
	GetRed(d_leaderboard[2].address, function(result) {
		d_leaderboard[2].red = result;
	});
}

function checkLeaderRed3(){
	GetRed(d_leaderboard[3].address, function(result) {
		d_leaderboard[3].red = result;
	});
}

function checkLeaderRed4(){
	GetRed(d_leaderboard[4].address, function(result) {
		d_leaderboard[4].red = result;
	});
}

function checkLeaderLettuce0(){
	GetLettuce(d_leaderboard[0].address, function(result) {
		//console.log(d_leaderboard[0].address + " lettuce result is " + result);
		if(result > 0) {
			d_leaderboard[0].boost4 = true;
			//console.log("We have a lettuce!");
		} else {
			d_leaderboard[0].boost4 = false;
			//console.log("No lettuce here.");
		}
	});
}

function checkLeaderLettuce1(){
	GetLettuce(d_leaderboard[1].address, function(result) {
		if(result > 0) {
			d_leaderboard[1].boost4 = true;
		} else {
			d_leaderboard[1].boost4 = false;
		}
	});
}

function checkLeaderLettuce2(){
	GetLettuce(d_leaderboard[2].address, function(result) {
		if(result > 0) {
			d_leaderboard[2].boost4 = true;
		} else {
			d_leaderboard[2].boost4 = false;
		}
	});
}

function checkLeaderLettuce3(){
	GetLettuce(d_leaderboard[3].address, function(result) {
		if(result > 0) {
			d_leaderboard[3].boost4 = true;
		} else {
			d_leaderboard[3].boost4 = false;
		}
	});
}

function checkLeaderLettuce4(){
	GetLettuce(d_leaderboard[4].address, function(result) {
		if(result > 0) {
			d_leaderboard[4].boost4 = true;
		} else {
			d_leaderboard[4].boost4 = false;
		}
	});
}

function checkLeaderCarrot0(){
	GetCarrot(d_leaderboard[0].address, function(result) {
		if(result > 0) {
			d_leaderboard[0].boost5 = true;
		} else {
			d_leaderboard[0].boost5 = false;
		}
	});
}

function checkLeaderCarrot1(){
	GetCarrot(d_leaderboard[1].address, function(result) {
		if(result > 0) {
			d_leaderboard[1].boost5 = true;
		} else {
			d_leaderboard[1].boost5 = false;
		}
	});
}

function checkLeaderCarrot2(){
	GetCarrot(d_leaderboard[2].address, function(result) {
		if(result > 0) {
			d_leaderboard[2].boost5 = true;
		} else {
			d_leaderboard[2].boost5 = false;
		}
	});
}

function checkLeaderCarrot3(){
	GetCarrot(d_leaderboard[3].address, function(result) {
		if(result > 0) {
			d_leaderboard[3].boost5 = true;
		} else {
			d_leaderboard[3].boost5 = false;
		}
	});
}

function checkLeaderCarrot4(){
	GetCarrot(d_leaderboard[4].address, function(result) {
		if(result > 0) {
			d_leaderboard[4].boost5 = true;
		} else {
			d_leaderboard[4].boost5 = false;
		}
	});
}

function checkLeaderSlug0(){
	GetSlug(d_leaderboard[0].address, function(result) {
		if(result > 0) {
			d_leaderboard[0].boost6 = true;
		} else {
			d_leaderboard[0].boost6 = false;
		}
	});
}

function checkLeaderSlug1(){
	GetSlug(d_leaderboard[1].address, function(result) {
		if(result > 0) {
			d_leaderboard[1].boost6 = true;
		} else {
			d_leaderboard[1].boost6 = false;
		}
	});
}

function checkLeaderSlug2(){
	GetSlug(d_leaderboard[2].address, function(result) {
		if(result > 0) {
			d_leaderboard[2].boost6 = true;
		} else {
			d_leaderboard[2].boost6 = false;
		}
	});
}

function checkLeaderSlug3(){
	GetSlug(d_leaderboard[3].address, function(result) {
		if(result > 0) {
			d_leaderboard[3].boost6 = true;
		} else {
			d_leaderboard[3].boost6 = false;
		}
	});
}

function checkLeaderSlug4(){
	GetSlug(d_leaderboard[4].address, function(result) {
		if(result > 0) {
			d_leaderboard[4].boost6 = true;
		} else {
			d_leaderboard[4].boost6 = false;
		}
	});
}

//Check Snailmaster
function checkSnailmaster(){
	var snailmasterdoc = document.getElementById('snailmaster');
	currentSnailmaster(function(req) {
		c_snailmaster = "0x" + req.substring(26, 66);
		if(c_snailmaster == m_account) {
			snailmasterdoc.textContent = "YOU!";
		} else {
		snailmasterdoc.textContent = formatEthAdr(c_snailmaster);
		}
	});
}

//Current Snailmaster req
function updateSnailmasterReq(){
	var snailmasterreqdoc = document.getElementById('snailmasterreq');
	snailmasterReq(function(req) {
		snailmasterreqdoc.textContent = req;
	});
}
	
//Check SpiderQueen owner
function checkSpiderOwner(){
	var spiderownerdoc = document.getElementById('spiderowner');
	currentSpiderOwner(function(req) {
		c_spiderowner = "0x" + req.substring(26, 66);
		if(c_spiderowner == m_account) {
			spiderownerdoc.textContent = "YOU!";
		} else {
		spiderownerdoc.textContent = formatEthAdr(c_spiderowner);
		}
	});
}

//Current SpiderQueen req
function updateSpiderReq(){
	var spiderreqdoc = document.getElementById('spiderreq');
	spiderReq(function(req) {
		spiderreqdoc.textContent = req;
	});
}

//Check SquirrelDuke owner
function checkSquirrelOwner(){
	var squirrelownerdoc = document.getElementById('squirrelowner');
	currentSquirrelOwner(function(req) {
		c_squirrelowner = "0x" + req.substring(26, 66);
		if(c_squirrelowner == m_account) {
			squirrelownerdoc.textContent = "YOU!";
		} else {
		squirrelownerdoc.textContent = formatEthAdr(c_squirrelowner);
		}
	});
}

//Current SquirrelDuke req
function updateSquirrelReq(){
	var squirrelreqdoc = document.getElementById('squirrelreq');
	squirrelReq(function(req) {
		squirrelreqdoc.textContent = req;
	});
}

//Check TadpolePrince owner
function checkTadpoleOwner(){
	var tadpoleownerdoc = document.getElementById('tadpoleowner');
	currentTadpoleOwner(function(req) {
		c_tadpoleowner = "0x" + req.substring(26, 66);
		if(c_tadpoleowner == m_account) {
			tadpoleownerdoc.textContent = "YOU!";
		} else {
			tadpoleownerdoc.textContent = formatEthAdr(c_tadpoleowner);
		}
	});
}

//Current TadpolePrince req
function updateTadpoleReq(){
	var tadpolereqdoc = document.getElementById('tadpolereq');
	tadpoleReq(function(req) {
		a_tadpoleReq = formatEthValue2(web3.fromWei(req, 'ether'));
		a_tadpoleReq = (parseFloat(a_tadpoleReq) + parseFloat(0.0001)).toFixed(6);
		tadpolereqdoc.textContent = a_tadpoleReq;
	});
}

//If player owns hot potatoes, display appropriate boosts
function checkPotato(){
	if(c_spiderowner == m_account){
		document.getElementById('spider_yes').style.display = 'inline';
		document.getElementById('spider_no').style.display = 'none';
	} else {
		document.getElementById('spider_yes').style.display = 'none';
		document.getElementById('spider_no').style.display = 'inline';
	}
	if(c_squirrelowner == m_account){
		document.getElementById('squirrel_yes').style.display = 'inline';
		document.getElementById('squirrel_no').style.display = 'none';
	} else {
		document.getElementById('squirrel_yes').style.display = 'none';
		document.getElementById('squirrel_no').style.display = 'inline';
	}
	if(c_tadpoleowner == m_account){
		document.getElementById('tadpole_yes').style.display = 'inline';
		document.getElementById('tadpole_no').style.display = 'none';
	} else {
		document.getElementById('tadpole_yes').style.display = 'none';
		document.getElementById('tadpole_no').style.display = 'inline';
	}
}

//Current harvest cost
function updateHarvestCost(){
	var harvestcostdoc = document.getElementById('harvestcost');
	ComputeHarvest(function(req) {
		a_harvestCost = formatEthValue2(web3.fromWei(req,'ether'));
		a_harvestCost = (parseFloat(a_harvestCost) + parseFloat(0.0001)).toFixed(6);
		harvestcostdoc.textContent = a_harvestCost;
	});
}

//Current lettuce req
function updateLettuceReq(){
	var lettucereqdoc = document.getElementById('lettucereq');
	lettuceReq(function(result) {
		a_lettuceReq = result;
		lettucereqdoc.textContent = a_lettuceReq;
	});
}

//Check if player owns lettuce
function checkOwnsLettuce(){
	var haslettucedoc = document.getElementById('haslettuce');
	GetLettuce(m_account, function(req) {
		if(req > 0) {
			haslettuce.innerHTML = "You already own a Lettuce.";
			document.getElementById('lettuce_yes').style.display = 'inline';
			document.getElementById('lettuce_no').style.display = 'none';
			document.getElementById('yeslettuce').style.display = 'inline';
			document.getElementById('nolettuce').style.display = 'none';
		} else {
			haslettuce.innerHTML = "Lettuces last 1 Round.";
			document.getElementById('lettuce_no').style.display = 'inline';
			document.getElementById('lettuce_yes').style.display = 'none';
			document.getElementById('nolettuce').style.display = 'inline';
			document.getElementById('yeslettuce').style.display = 'none';
		}
	});
}

//Check if player owns carrot
function checkOwnsCarrot(){
	var hascarrotdoc = document.getElementById('hascarrot');
	GetCarrot(m_account, function(req) {
		if(req > 0) {
			hascarrot.innerHTML = "You already own a Carrot.";
			document.getElementById('carrot_yes').style.display = 'inline';
			document.getElementById('carrot_no').style.display = 'none';
			document.getElementById('yescarrot').style.display = 'inline';
			document.getElementById('nocarrot').style.display = 'none';
			carrottime.innerHTML = req + " more round(s)";
		} else {
			hascarrot.innerHTML = "Carrots last 3 Rounds.";
			document.getElementById('carrot_no').style.display = 'inline';
			document.getElementById('carrot_yes').style.display = 'none';
			document.getElementById('nocarrot').style.display = 'inline';
			document.getElementById('yescarrot').style.display = 'none';
		}
	});
}

//Check if player owns slug
function checkOwnsSlug(){
	var hasslugdoc = document.getElementById('hasslug');
	GetSlug(m_account, function(req) {
		if(req > 0) {
			hasslug.innerHTML = "You already own a Slug.";
			document.getElementById('slug_yes').style.display = 'inline';
			document.getElementById('slug_no').style.display = 'none';
			document.getElementById('yesslug').style.display = 'inline';
			document.getElementById('noslug').style.display = 'none';
		} else {
			hasslug.innerHTML = "Slugs are permanent.";
			document.getElementById('slug_no').style.display = 'inline';
			document.getElementById('slug_yes').style.display = 'none';
			document.getElementById('noslug').style.display = 'inline';
			document.getElementById('yesslug').style.display = 'none';
		}
	});
}

//Current ETH address in use
function updateEthAccount(){
	m_account = web3.eth.accounts[0];
}

//Current leader
function updateLeader(){
	var leaderdoc = document.getElementById('leader');
	currentLeader(function(result) {
		l_account = "0x" + result.substring(26,66);
		if(l_account != m_account) {
			leaderdoc.textContent = formatEthAdr(l_account) + " is ";
		}
		else {
			leaderdoc.textContent = "YOU are ";
		}
	});
}

//Current leader snail count
function updateLeaderSnail(){
	var leadersnaildoc = document.getElementById('leadersnail');
	GetSnail(l_account, function(result) {
		a_leaderSnail = result;
		leadersnaildoc.textContent = a_leaderSnail;		
	});
}

//Current player snail count
function updatePlayerSnail(){
	var playersnaildoc = document.getElementById('playersnail');
	GetSnail(m_account, function(req) {
		a_playerSnail = req;
		playersnaildoc.textContent = a_playerSnail;
	});
}

//Current ETH balance in contract
function updateContractBalance(){
	var contractbalancedoc = document.getElementById('contractbalance');
	web3.eth.getBalance(contractAddress, function(error, result) {
		if(!error) {
			////////console.log(result);
			a_contractBalance = formatEthValue(web3.fromWei(result, 'ether'))
			contractbalancedoc.textContent = a_contractBalance; 
		} else {
			//////console.log("didn't work");
		}
	});
}

//Current round
function updateRound(){
	var rounddoc = document.getElementById('round');
	round(function(req) {
		a_round = req;
		rounddoc.textContent = a_round;
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

//Current round pot (10% of snailpot at start of round)
function updateRoundPot(){
	var roundpotdoc = document.getElementById('roundpot');
	roundPot(function(req) {
		a_roundPot = formatEthValue(web3.fromWei(req,'ether'));
		roundpotdoc.textContent = a_roundPot;
	});
}

//Current eggpot
function updateEggPot(){
	var eggpotdoc = document.getElementById('eggpot');
	eggPot(function(req) {
		a_eggPot = formatEthValue(web3.fromWei(req,'ether'));
		eggpotdoc.textContent = a_eggPot;
	});
}

//Current throne pot
function updateThronePot(){
	var thronepotdoc = document.getElementById('thronepot');
	thronePot(function(req) {
		a_thronePot = formatEthValue(web3.fromWei(req,'ether'));
		thronepotdoc.textContent = a_thronePot;
	});
}

//Current number of eggs on the market
function updateMarketEgg(){
	var marketeggdoc = document.getElementById('marketegg');
	marketEgg(function(req) {
		a_marketEgg = req;
		marketeggdoc.textContent = a_marketEgg;
	});
}

//Maximum eggs that can be bought
function updateMaxEggBuy(){
	var maxeggbuydoc = document.getElementById('maxeggbuy');
	maxeggbuydoc.innerHTML = a_marketEgg / 5;
}

//Current number of acorns
function updateMaxAcorn(){
	var maxacorndoc = document.getElementById('maxacorn');
	maxAcorn(function(req) {
		a_maxAcorn = req;
		maxacorndoc.textContent = a_maxAcorn;
	});
}

//Current acorn cost
function updateAcornCost(){
	var acorncostdoc = document.getElementById('acorncost');
	ComputeAcornCost(function(req) {
		a_acornCost = formatEthValue2(web3.fromWei(req,'ether'));
		acorncostdoc.textContent = a_acornCost;
	});
}

//Eggs
var playereggdoc = document.getElementById('playeregg');

//Check if player eggs are above player snails, and stop local timer if needed
function slowupdatePlayerEgg(){
	if(a_playerEgg >= a_playerSnail) {
		ComputeMyEgg(m_account, function(result) {
			if(result == s_playerEgg) {
				z_playerEgg += 1;
			} else {
				z_playerEgg = 0;
			}
			s_playerEgg = formatEthValue(result);
			a_playerEgg = s_playerEgg;
			playereggdoc.textContent = a_playerEgg + ".000";
		});
	}
	else {
		z_playerEgg = 0;
	}
}

//Current player eggs
function updatePlayerEgg(){
	ComputeMyEgg(m_account, function(result) {
		_result = formatEthValue(result);
		if(_result != o_playerEgg) {
			a_playerEgg = _result;
			o_playerEgg = _result;
			playereggdoc.textContent = a_playerEgg + ".000";
		}
	});
}

//Fast player egg update
function fastPlayerEgg(){
	if(z_playerEgg < 2) {
		_prod = parseFloat(a_playerProd / 36000).toFixed(6); //hour prod divided to 100ms intervals
		a_playerEgg = (parseFloat(a_playerEgg) + parseFloat(_prod)).toFixed(3);
		playereggdoc.textContent = a_playerEgg;
	}
}

//Current player red eggs
function updatePlayerRed(){
	var playerreddoc = document.getElementById('playerred');
	GetRed(m_account, function(req) {
		a_playerRed = req;
		playerreddoc.textContent = a_playerRed;
	});
}

//Current player hatch size
function updatePlayerBoost(){
	var hatchboostdoc = document.getElementById('hatchboost');
	GetProd(m_account, function(req) {
		a_playerBoost = req;
		hatchboostdoc.textContent = a_playerBoost;
	});
}

//Current player prod
function updatePlayerProd(){
	var playerproddoc = document.getElementById('playerprod');
	a_playerProd = parseFloat(a_playerSnail / 24).toFixed(3); //100% per day, divided by 24 hours
	playerproddoc.textContent = a_playerProd;
}

//Current balance for player
function updatePlayerBalance(){
	var playerbalancedoc = document.getElementById('playerbalance');
	GetMyBalance(function(req) {
		playerbalancedoc.textContent = formatEthValue2(web3.fromWei(req,'ether'));
	});
}	

//Current acorns for player
function updatePlayerAcorn(){
	var playeracorndoc = document.getElementById('playeracorn');
	GetAcorn(m_account, function(result) {
		a_playerAcorn = result;
		playeracorndoc.textContent = a_playerAcorn;
	});
}

//Current unclaimed share for player
function updatePlayerShare(){
	var playersharedoc = document.getElementById('playershare');
	ComputeMyShare(function(req) {
		playersharedoc.textContent = formatEthValue2(web3.fromWei(req,'ether'));
	});
}

/* LOCAL FIELD INPUT */

//Player input on buy
function updateFieldBuy2(){
	f_buy = document.getElementById('fieldBuy').value;
	var fieldbuy2doc = document.getElementById('fieldBuy2');
	fieldbuy2doc.textContent = f_buy;
}

//Player input on TadpolePrince
function updateFieldPrince2(){
	var fieldprincedoc = document.getElementById('fieldPrince');
	f_prince = fieldprincedoc.value;
	if(f_prince < a_tadpoleReq) {
		fieldprincedoc.value = a_tadpoleReq; 
	}	
}


//Player input on Acorn buy
function updateFieldTree2(){
	f_tree = document.getElementById('fieldTree').value;
	var fieldtree2doc = document.getElementById('fieldTree2');
	fieldtree2doc.textContent = f_tree;
}

//Player input on Red Egg Hatch
function updateRedHatch2(){
	f_redhatch = document.getElementById('fieldRed').value;
	if(f_redhatch > a_playerRed) {
		f_redhatch = a_playerRed;
	}
	var fieldred2doc = document.getElementById('fieldRed2');
	fieldred2doc.textContent = f_redhatch;
}

//Buy estimate
function updateBuyEstimate(){
	var buyEstimatedoc = document.getElementById('buyestimate');
	var weitospend = web3.toWei(f_buy,'ether');
	ComputeBuy(weitospend, function(req) {
		buyEstimatedoc.textContent = req;
	});	
}

//Sell estimate
function updateSellEstimate(){
	var sellEstimatedoc = document.getElementById('sellestimate');
	ComputeSell(a_playerEgg, function(req) {
		sellEstimatedoc.textContent = formatEthValue2(web3.fromWei(req,'ether'));
	});
}

//Acorn estimate
function updateTreeEstimate(){
	var treeEstimatedoc = document.getElementById('treeestimate');
	treeEstimatedoc.innerHTML = (f_tree / a_acornCost).toFixed(0);
}

//Hatch estimate
function updateHatchEstimate(){
	var hatchEstimatedoc = document.getElementById('hatchestimate');
	hatchEstimatedoc.innerHTML = (a_playerEgg * a_playerBoost).toFixed(0);
}

//Red estimate
function updateRedEstimate(){
	var redEstimatedoc = document.getElementById('redestimate');
	redEstimatedoc.innerHTML = f_redhatch * a_playerBoost;
}

/* WEB3 TRANSACTIONS */

//Begin round
function webBeginRound(){
	BeginRound(function(){
	});
}

//Join round
function webJoinRound(){
	JoinRound(function(){
	});
}

//Fund tree
function webFundTree(){
    var weitospend = web3.toWei(f_tree,'ether');
    FundTree(weitospend, function(){
    });
}

//Claim share
function webClaimShare(){
	ClaimAcornShare(function(){
	});
}

//Buy starting snails
function webGetStarter(){
    var weitospend = web3.toWei(0.004,'ether');
	BuyStartingSnail(weitospend, function(){
	});
}

//Hatch eggs
function webHatchEgg(){
	var weitospend = web3.toWei(0.0008,'ether');
	HatchEgg(weitospend, function(){
	});
}

//Buy eggs
function webBuyEgg(){
    var weitospend = web3.toWei(f_buy,'ether');
    BuyEgg(weitospend, function(){
    });
}	

//Sell eggs
function webSellEgg(){
	SellEgg(function(){
	});
}

//Withdraw balance
function webWithdrawBalance(){
	WithdrawBalance(function(){
	});
}

//Become Snailmaster
function webBecomeSnailmaster(){
	BecomeSnailmaster(function(){
	});
}

//Become Snailmaster
function webBecomeSnailmaster(){
	BecomeSnailmaster(function(){
	});
}

//Become SpiderQueen
function webBecomeSpiderQueen(){
	BecomeSpiderQueen(function(){
	});
}

//Become SquirrelDuke
function webBecomeSquirrelDuke(){
	BecomeSquirrelDuke(function(){
	});
}

//Become TadpolePrince
function webBecomeTadpolePrince(){
	var weitospend = web3.toWei(f_prince,'ether');
	BecomeTadpolePrince(weitospend, function(){
	});
}

//Claim Red Harvest
function webClaimRedHarvest(){
	var weitospend = web3.toWei(a_harvestCost,'ether');
	GrabRedHarvest(weitospend, function(){
	});
}

//Hatch Red Eggs
function webHatchRed(){
	UseRedEgg(f_redhatch, function(){
	});
}
	
//Find Lettuce
function webFindLettuce(){
	FindLettuce(function(){
	});
}

//Find Carrot
function webFindCarrot(){
	var weitospend = web3.toWei(0.02,'ether');
	FindCarrot(weitospend, function(){
	});
}

//Find Slug
function webFindSlug(){
	FindSlug(function(){
	});
}

//Pay Thronepot to SnailThrone
function webPayThrone(){
	PayThrone(function(){
	});
}
/*


//Sacrifice snail tokens
function webSacrificeSnail(){
	BecomePharaoh(f_sacrifice, function(){
	});
}







//Claim divs
function webClaimDiv(){
	ClaimDivs(function(){
	});
}



//Start a new round
function webAscendGod(){
	AscendGod(function(){
	});
}

/* CONTRACT ABI */
 
abiDefinition=[{"constant": true,"inputs": [],"name": "ACORN_PRICE","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "GetMyBalance","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "LETTUCE_BASE_REQ","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "SPIDER_BASE_REQ","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "adr","type": "address"}],"name": "GetAcorn","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "gotCarrot","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "ComputeHarvest","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "playerRound","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "round","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "adr","type": "address"}],"name": "GetRed","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "ClaimAcornShare","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [],"name": "JoinRound","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [],"name": "BuyStartingSnail","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "hatcherySnail","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "hasSlug","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "divPerAcorn","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_redAmount","type": "uint256"}],"name": "UseRedEgg","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "HARVEST_MIN_COST","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "hasStartingSnail","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "base","type": "uint256"}],"name": "ComputeSquare","outputs": [{"name": "squareRoot","type": "uint256"}],"payable": false,"stateMutability": "pure","type": "function"},{"constant": false,"inputs": [],"name": "FundTree","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": true,"inputs": [{"name": "_ether","type": "uint256"}],"name": "ComputeAcornBuy","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "redEgg","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "ComputeAcornCost","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "TADPOLE_BASE_REQ","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "roundPot","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "eggspent","type": "uint256"}],"name": "ComputeSell","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "adr","type": "address"}],"name": "GetSnail","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "lastHatch","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "SNAILTHRONE","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "PayThrone","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "playerBalance","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "ACORN_MULT","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "adr","type": "address"}],"name": "ComputeMyEgg","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "acorn","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "FindLettuce","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [],"name": "SellEgg","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "adr","type": "address"}],"name": "GetLettuce","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "BecomeSpiderQueen","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "snailPot","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "BuyEgg","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": true,"inputs": [{"name": "adr","type": "address"}],"name": "GetProd","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "SQUIRREL_BASE_REQ","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "GetMyEgg","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "ROUND_DOWNTIME","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "GrabRedHarvest","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": true,"inputs": [],"name": "HATCHING_COST","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "adr","type": "address"}],"name": "GetSlug","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "snailmasterReq","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "STARTING_SNAIL_COST","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "harvestStartTime","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "currentSpiderOwner","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "SLUG_MIN_REQ","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "eggPot","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "HatchEgg","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": true,"inputs": [],"name": "FROGKING_REQ","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "BeginRound","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "marketEgg","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "BecomeTadpolePrince","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": true,"inputs": [],"name": "SNAILMASTER_REQ","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "dev","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "prodBoost","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "FindCarrot","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": true,"inputs": [],"name": "harvestStartCost","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "WithdrawBalance","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "STARTING_SNAIL","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "ComputeMyShare","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "currentLeader","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "currentSnailmaster","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "HARVEST_COUNT","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "tadpoleReq","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "claimedShare","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "thronePot","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "ethspent","type": "uint256"}],"name": "ComputeBuy","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "maxAcorn","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "spiderReq","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "TIME_TO_HATCH_1SNAIL","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "CARROT_COST","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "BecomeSquirrelDuke","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "adr","type": "address"}],"name": "GetCarrot","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "hasLettuce","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "nextRoundStart","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "HARVEST_DURATION","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "BecomeSnailmaster","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "GetMyRound","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "claimedEgg","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "HARVEST_DUR_ROOT","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "lettuceReq","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "FindSlug","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "squirrelReq","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "gameActive","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "currentSquirrelOwner","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "currentTadpoleOwner","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"inputs": [{"name": "_hoursToLaunch","type": "uint256"}],"payable": false,"stateMutability": "nonpayable","type": "constructor"},{"payable": true,"stateMutability": "payable","type": "fallback"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "eth","type": "uint256"},{"indexed": false,"name": "acorns","type": "uint256"}],"name": "FundedTree","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "eth","type": "uint256"},{"indexed": false,"name": "acorns","type": "uint256"}],"name": "ClaimedShare","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": true,"name": "round","type": "uint256"}],"name": "BecameMaster","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "eth","type": "uint256"}],"name": "WithdrewBalance","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "eggs","type": "uint256"},{"indexed": false,"name": "snails","type": "uint256"},{"indexed": false,"name": "hatchery","type": "uint256"}],"name": "Hatched","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "eggs","type": "uint256"},{"indexed": false,"name": "eth","type": "uint256"}],"name": "SoldEgg","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "eggs","type": "uint256"},{"indexed": false,"name": "eth","type": "uint256"},{"indexed": false,"name": "playereggs","type": "uint256"}],"name": "BoughtEgg","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": true,"name": "round","type": "uint256"}],"name": "StartedSnailing","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": true,"name": "round","type": "uint256"},{"indexed": false,"name": "spiderreq","type": "uint256"},{"indexed": false,"name": "hatchery","type": "uint256"}],"name": "BecameQueen","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": true,"name": "round","type": "uint256"},{"indexed": false,"name": "squirrelreq","type": "uint256"},{"indexed": false,"name": "playerreds","type": "uint256"}],"name": "BecameDuke","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": true,"name": "round","type": "uint256"},{"indexed": false,"name": "tadpolereq","type": "uint256"}],"name": "BecamePrince","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "roundwinner","type": "address"},{"indexed": true,"name": "round","type": "uint256"},{"indexed": false,"name": "eth","type": "uint256"}],"name": "WonRound","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "round","type": "uint256"}],"name": "BeganRound","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": true,"name": "round","type": "uint256"},{"indexed": false,"name": "playerreds","type": "uint256"}],"name": "JoinedRound","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": true,"name": "round","type": "uint256"},{"indexed": false,"name": "eth","type": "uint256"},{"indexed": false,"name": "playerreds","type": "uint256"}],"name": "GrabbedHarvest","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "eggs","type": "uint256"},{"indexed": false,"name": "snails","type": "uint256"},{"indexed": false,"name": "hatchery","type": "uint256"}],"name": "UsedRed","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": true,"name": "round","type": "uint256"},{"indexed": false,"name": "snails","type": "uint256"}],"name": "FoundSlug","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": true,"name": "round","type": "uint256"},{"indexed": false,"name": "lettucereq","type": "uint256"},{"indexed": false,"name": "playerreds","type": "uint256"}],"name": "FoundLettuce","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": true,"name": "round","type": "uint256"}],"name": "FoundCarrot","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "eth","type": "uint256"}],"name": "PaidThrone","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "eth","type": "uint256"}],"name": "BoostedPot","type": "event"}]

var contractAbi = web3.eth.contract(abiDefinition);
var myContract = contractAbi.at(contractAddress);

function ACORN_PRICE(callback){

    var outputData = myContract.ACORN_PRICE.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('ACORN_PRICE ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function GetMyBalance(callback){
    
   
    var outputData = myContract.GetMyBalance.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('GetMyBalance ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function LETTUCE_BASE_REQ(callback){
    
   
    var outputData = myContract.LETTUCE_BASE_REQ.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('LETTUCE_BASE_REQ ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function SPIDER_BASE_REQ(callback){
    
   
    var outputData = myContract.SPIDER_BASE_REQ.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('SPIDER_BASE_REQ ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function GetAcorn(adr,callback){
    
   
    var outputData = myContract.GetAcorn.getData(adr);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('GetAcorn ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function gotCarrot(callback){
    
   
    var outputData = myContract.gotCarrot.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('gotCarrot ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeHarvest(callback){
    
   
    var outputData = myContract.ComputeHarvest.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('ComputeHarvest ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function playerRound(callback){
    
   
    var outputData = myContract.playerRound.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('playerRound ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function round(callback){
    
   
    var outputData = myContract.round.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('round ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function GetRed(adr,callback){
    
   
    var outputData = myContract.GetRed.getData(adr);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('GetRed ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function ClaimAcornShare(callback){
    
   
    var outputData = myContract.ClaimAcornShare.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('ClaimAcornShare ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function JoinRound(callback){
    
   
    var outputData = myContract.JoinRound.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('JoinRound ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function BuyStartingSnail(eth,callback){
    
   
    var outputData = myContract.BuyStartingSnail.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData,value: eth},
    function(error,result){
        if(!error){
            ////console.log('BuyStartingSnail ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function hatcherySnail(callback){
    
   
    var outputData = myContract.hatcherySnail.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('hatcherySnail ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function hasSlug(callback){
    
   
    var outputData = myContract.hasSlug.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('hasSlug ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function divPerAcorn(callback){
    
   
    var outputData = myContract.divPerAcorn.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('divPerAcorn ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function UseRedEgg(_redAmount,callback){
    
   
    var outputData = myContract.UseRedEgg.getData(_redAmount);
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('UseRedEgg ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function HARVEST_MIN_COST(callback){
    
   
    var outputData = myContract.HARVEST_MIN_COST.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('HARVEST_MIN_COST ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function hasStartingSnail(callback){
    
   
    var outputData = myContract.hasStartingSnail.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('hasStartingSnail ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeSquare(base,callback){
    
   
    var outputData = myContract.ComputeSquare.getData(base);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('ComputeSquare ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function FundTree(eth,callback){
    
   
    var outputData = myContract.FundTree.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData,value: eth},
    function(error,result){
        if(!error){
            ////console.log('FundTree ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeAcornBuy(_ether,callback){
    
   
    var outputData = myContract.ComputeAcornBuy.getData(_ether);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('ComputeAcornBuy ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function redEgg(callback){
    
   
    var outputData = myContract.redEgg.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('redEgg ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeAcornCost(callback){
    
   
    var outputData = myContract.ComputeAcornCost.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('ComputeAcornCost ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function TADPOLE_BASE_REQ(callback){
    
   
    var outputData = myContract.TADPOLE_BASE_REQ.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('TADPOLE_BASE_REQ ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function roundPot(callback){
    
   
    var outputData = myContract.roundPot.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('roundPot ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeSell(eggspent,callback){
    
   
    var outputData = myContract.ComputeSell.getData(eggspent);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('ComputeSell ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function GetSnail(adr,callback){
    
   
    var outputData = myContract.GetSnail.getData(adr);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('GetSnail ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function lastHatch(callback){
    
   
    var outputData = myContract.lastHatch.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('lastHatch ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function SNAILTHRONE(callback){
    
   
    var outputData = myContract.SNAILTHRONE.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('SNAILTHRONE ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function PayThrone(callback){
    
   
    var outputData = myContract.PayThrone.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('PayThrone ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function playerBalance(callback){
    
   
    var outputData = myContract.playerBalance.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('playerBalance ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function ACORN_MULT(callback){
    
   
    var outputData = myContract.ACORN_MULT.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('ACORN_MULT ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeMyEgg(adr,callback){
    
   
    var outputData = myContract.ComputeMyEgg.getData(adr);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('ComputeMyEgg ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function acorn(callback){
    
   
    var outputData = myContract.acorn.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('acorn ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function FindLettuce(callback){
    
   
    var outputData = myContract.FindLettuce.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('FindLettuce ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function SellEgg(callback){
    
   
    var outputData = myContract.SellEgg.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('SellEgg ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function GetLettuce(adr,callback){
    
   
    var outputData = myContract.GetLettuce.getData(adr);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('GetLettuce ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function BecomeSpiderQueen(callback){
    
   
    var outputData = myContract.BecomeSpiderQueen.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('BecomeSpiderQueen ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function snailPot(callback){
    
   
    var outputData = myContract.snailPot.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('snailPot ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function BuyEgg(eth,callback){
    
   
    var outputData = myContract.BuyEgg.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData,value: eth},
    function(error,result){
        if(!error){
            ////console.log('BuyEgg ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function GetProd(adr,callback){
    
   
    var outputData = myContract.GetProd.getData(adr);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('GetProd ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function SQUIRREL_BASE_REQ(callback){
    
   
    var outputData = myContract.SQUIRREL_BASE_REQ.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('SQUIRREL_BASE_REQ ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function GetMyEgg(callback){
    
   
    var outputData = myContract.GetMyEgg.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('GetMyEgg ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function ROUND_DOWNTIME(callback){
    
   
    var outputData = myContract.ROUND_DOWNTIME.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('ROUND_DOWNTIME ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function GrabRedHarvest(eth,callback){
    
   
    var outputData = myContract.GrabRedHarvest.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData,value: eth},
    function(error,result){
        if(!error){
            ////console.log('GrabRedHarvest ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function HATCHING_COST(callback){
    
   
    var outputData = myContract.HATCHING_COST.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('HATCHING_COST ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function GetSlug(adr,callback){
    
   
    var outputData = myContract.GetSlug.getData(adr);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('GetSlug ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function snailmasterReq(callback){
    
   
    var outputData = myContract.snailmasterReq.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('snailmasterReq ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function STARTING_SNAIL_COST(callback){
    
   
    var outputData = myContract.STARTING_SNAIL_COST.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('STARTING_SNAIL_COST ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function harvestStartTime(callback){
    
   
    var outputData = myContract.harvestStartTime.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('harvestStartTime ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function currentSpiderOwner(callback){
    
   
    var outputData = myContract.currentSpiderOwner.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('currentSpiderOwner ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function SLUG_MIN_REQ(callback){
    
   
    var outputData = myContract.SLUG_MIN_REQ.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('SLUG_MIN_REQ ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function eggPot(callback){
    
   
    var outputData = myContract.eggPot.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('eggPot ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function HatchEgg(eth,callback){
    
   
    var outputData = myContract.HatchEgg.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData,value: eth},
    function(error,result){
        if(!error){
            ////console.log('HatchEgg ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function FROGKING_REQ(callback){
    
   
    var outputData = myContract.FROGKING_REQ.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('FROGKING_REQ ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function BeginRound(callback){
    
   
    var outputData = myContract.BeginRound.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('BeginRound ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function marketEgg(callback){
    
   
    var outputData = myContract.marketEgg.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('marketEgg ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function BecomeTadpolePrince(eth,callback){
    
   
    var outputData = myContract.BecomeTadpolePrince.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData,value: eth},
    function(error,result){
        if(!error){
            ////console.log('BecomeTadpolePrince ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function SNAILMASTER_REQ(callback){
    
   
    var outputData = myContract.SNAILMASTER_REQ.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('SNAILMASTER_REQ ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function dev(callback){
    
   
    var outputData = myContract.dev.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('dev ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function prodBoost(callback){
    
   
    var outputData = myContract.prodBoost.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('prodBoost ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function FindCarrot(eth,callback){
    
   
    var outputData = myContract.FindCarrot.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData,value: eth},
    function(error,result){
        if(!error){
            ////console.log('FindCarrot ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function harvestStartCost(callback){
    
   
    var outputData = myContract.harvestStartCost.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('harvestStartCost ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function WithdrawBalance(callback){
    
   
    var outputData = myContract.WithdrawBalance.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('WithdrawBalance ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function STARTING_SNAIL(callback){
    
   
    var outputData = myContract.STARTING_SNAIL.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('STARTING_SNAIL ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeMyShare(callback){
    
   
    var outputData = myContract.ComputeMyShare.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('ComputeMyShare ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function currentLeader(callback){
    
   
    var outputData = myContract.currentLeader.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('currentLeader ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function currentSnailmaster(callback){
    
   
    var outputData = myContract.currentSnailmaster.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('currentSnailmaster ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function HARVEST_COUNT(callback){
    
   
    var outputData = myContract.HARVEST_COUNT.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('HARVEST_COUNT ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function tadpoleReq(callback){
    
   
    var outputData = myContract.tadpoleReq.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('tadpoleReq ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function claimedShare(callback){
    
   
    var outputData = myContract.claimedShare.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('claimedShare ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function thronePot(callback){
    
   
    var outputData = myContract.thronePot.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('thronePot ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeBuy(ethspent,callback){
    
   
    var outputData = myContract.ComputeBuy.getData(ethspent);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('ComputeBuy ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function maxAcorn(callback){
    
   
    var outputData = myContract.maxAcorn.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('maxAcorn ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function spiderReq(callback){
    
   
    var outputData = myContract.spiderReq.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('spiderReq ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function TIME_TO_HATCH_1SNAIL(callback){
    
   
    var outputData = myContract.TIME_TO_HATCH_1SNAIL.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('TIME_TO_HATCH_1SNAIL ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function CARROT_COST(callback){
    
   
    var outputData = myContract.CARROT_COST.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('CARROT_COST ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function BecomeSquirrelDuke(callback){
    
   
    var outputData = myContract.BecomeSquirrelDuke.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('BecomeSquirrelDuke ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function GetCarrot(adr,callback){
    
   
    var outputData = myContract.GetCarrot.getData(adr);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('GetCarrot ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function hasLettuce(callback){
    
   
    var outputData = myContract.hasLettuce.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('hasLettuce ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function nextRoundStart(callback){
    
   
    var outputData = myContract.nextRoundStart.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('nextRoundStart ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function HARVEST_DURATION(callback){
    
   
    var outputData = myContract.HARVEST_DURATION.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('HARVEST_DURATION ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function BecomeSnailmaster(callback){
    
   
    var outputData = myContract.BecomeSnailmaster.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('BecomeSnailmaster ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function GetMyRound(callback){
    
   
    var outputData = myContract.GetMyRound.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('GetMyRound ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function claimedEgg(callback){
    
   
    var outputData = myContract.claimedEgg.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('claimedEgg ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function HARVEST_DUR_ROOT(callback){
    
   
    var outputData = myContract.HARVEST_DUR_ROOT.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('HARVEST_DUR_ROOT ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function lettuceReq(callback){
    
   
    var outputData = myContract.lettuceReq.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('lettuceReq ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function FindSlug(callback){
    
   
    var outputData = myContract.FindSlug.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('FindSlug ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function squirrelReq(callback){
    
   
    var outputData = myContract.squirrelReq.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('squirrelReq ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function gameActive(callback){
    
   
    var outputData = myContract.gameActive.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('gameActive ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function currentSquirrelOwner(callback){
    
   
    var outputData = myContract.currentSquirrelOwner.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('currentSquirrelOwner ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}


function currentTadpoleOwner(callback){
    
   
    var outputData = myContract.currentTadpoleOwner.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            ////console.log('currentTadpoleOwner ',result);
            callback(result)
        }
        else{
            ////console.log('transaction failed with ',error.message)
        }
    });
}



/* EVENT WATCH */
/*
var logboxscroll = document.getElementById('logboxscroll');
var eventdoc = document.getElementById("event");
*/
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

		
//Compute Leaderboard

function computeLeaderboard() {
	var lowest = d_leaderboard[0].hatchery;
	//////console.log("lowest: " + lowest);
	var position = 0; 
	//////console.log("position: " + position);
	
	//Check lowest leader
	var i = 0;
	for(i = 0; i < 5; i++) {
		//////console.log("loop i " + i);
		if(d_leaderboard[i].hatchery < lowest) {
			lowest = d_leaderboard[i].hatchery;
			//////console.log("lowest: " + lowest);
			position = i;
			//////console.log("position: " + position);
		}
	}
	
	//Check if hatcher is already on leaderboard, then check if hatcher can replace lowest
	var notLeader = true;
	for(k = 0; k < 5; k++) {
		if(e_hatched.address == d_leaderboard[k].address) {
			d_leaderboard[k].address = e_hatched.address;
			d_leaderboard[k].hatchery = e_hatched.hatchery;
			//////console.log("e_hatched already on leaderboard, replace previous entry");
			notLeader = false;
		}
	}

	var newEntry = false;
	if(notLeader == true && e_hatched.hatchery > lowest) {
		//////console.log("e_hatched is above lowest");
		d_leaderboard[position].address = e_hatched.address;
		d_leaderboard[position].hatchery = e_hatched.hatchery;
		//////console.log("d_leaderboard[" + position + "].hatchery = " + d_leaderboard[position].hatchery);
		//////console.log("d_leaderboard[" + position + "].rank = " + d_leaderboard[position].rank);
		newEntry = true;
	}
	/*
	//Go through remaining positions to see hatcher rank and adjust other ranks
	var j = 0;
	var previousRank = d_leaderboard[position].rank
	for(j = 0; j < 5; j++) {
		//////console.log("loop j " + j);
		if(d_leaderboard[position].hatchery > d_leaderboard[j].hatchery) {
			//////console.log("d_leaderboard hatchery is greater than d_leaderboard[" + j + "]hatchery");		
			if(previousRank > d_leaderboard[j].rank) {
				//////console.log("d_l rank is under d_l[" + j + "]rank");
				d_leaderboard[position].rank = d_leaderboard[j].rank;
				//////console.log("new d_l rank: " + d_leaderboard[position].rank);
				d_leaderboard[j].rank += 1;
				//////console.log("new d_l[" + j + "]rank: " + d_leaderboard[j].rank);
			}
		}
	}
	/*
	//Update boosts if needed
	if(newEntry == true) {
		slowupdateLeaderboard();
	}
	*/
	//Update leaderboard
	//////console.log("time to update leaderboard");
	showLeaderboard();
}

/* EVENTS */

var logboxscroll = document.getElementById('logboxscroll');
var eventlogdoc = document.getElementById("eventlog");

var e_hatched = { address: "", hatchery: 0 };
var hatchEvent = myContract.Hatched();

hatchEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " hatched " + result.args.eggs + " Eggs into " + result.args.snails + " Snails, and has " + result.args.hatchery + " Snails in total.";
			e_hatched.address = result.args.player;
			e_hatched.hatchery = parseInt(result.args.hatchery); //seems to return an array/object
			////console.log("e_hatch is " + e_hatched.hatchery);
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
			computeLeaderboard();
		}
	}
});

var usedredEvent = myContract.UsedRed();

usedredEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " hatched " + result.args.eggs + " Reds into " + result.args.snails + " Snails, and has a total of " + result.args.hatchery + " Snails.";
			e_hatched.address = result.args.player;
			e_hatched.hatchery = result.args.hatchery; //seems to return an array/object
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
			computeLeaderboard();
		}
	}
});

var fundedtreeEvent = myContract.FundedTree();

fundedtreeEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " funded the EtherTree with " + formatEthValue2(web3.fromWei(result.args.eth,'ether')) + " ETH and receives " + result.args.acorns + " Acorns.";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});


var claimedshareEvent = myContract.ClaimedShare();

claimedshareEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " claimed " + formatEthValue2(web3.fromWei(result.args.eth,'ether')) + " ETH thanks to his " + result.args.acorns + " Acorns.";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});


var becamemasterEvent = myContract.BecameMaster();

becamemasterEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] Bow down to " + formatEthAdr(result.args.player) + ", your new Snailmaster!";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var withdrewbalanceEvent = myContract.WithdrewBalance();

withdrewbalanceEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " withdrew " + formatEthValue2(web3.fromWei(result.args.eth,'ether')) + " ETH from his balance.";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});


var soldeggEvent = myContract.SoldEgg();

soldeggEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " sold " + result.args.eggs + " Eggs for " + formatEthValue2(web3.fromWei(result.args.eth,'ether')) + " ETH.";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var boughteggEvent = myContract.BoughtEgg();

boughteggEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " bought " + result.args.eggs + " Eggs for " + formatEthValue2(web3.fromWei(result.args.eth,'ether')) + " ETH."; //inverted eggs and ETH in contract event
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var startedsnailingEvent = myContract.StartedSnailing();

startedsnailingEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] Welcome to our newest SnailFarmer, " + formatEthAdr(result.args.player) + "!";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var becamequeenEvent = myContract.BecameQueen();

becamequeenEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " becomes the SpiderQueen!";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var becamedukeEvent = myContract.BecameDuke();

becamequeenEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " becomes the SquirrelDuke!";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var becameprinceEvent = myContract.BecamePrince();

becameprinceEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " becomes the TadpolePrince!";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var wonroundEvent = myContract.WonRound();

wonroundEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		//if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " WINS ROUND " + result.args.round + " AND EARNS " + formatEthValue2(web3.fromWei(result.args.eth,'ether')) + " ETH!";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		//}
	}
});

var beganroundEvent = myContract.BeganRound();

beganroundEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] Round " + result.args.round + " has started!";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var joinedroundEvent = myContract.JoinedRound();

joinedroundEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " joins the fray, with " + result.args.playerreds + " Red Eggs.";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var grabbedharvestEvent = myContract.GrabbedHarvest();

grabbedharvestEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " grabbed the Red Harvest by spending " + formatEthValue2(web3.fromWei(result.args.eth,'ether')) + " ETH.";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var foundslugEvent = myContract.FoundSlug();

foundslugEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " sacrifices a colossal " + result.args.snails + " Snails and finds the Slug.";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var foundlettuceEvent = myContract.FoundLettuce();

foundlettuceEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " spent " + a_lettuceReq + " Red Eggs to find a Lettuce.";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var foundcarrotEvent = myContract.FoundCarrot();

foundcarrotEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " found a Carrot for 0.02 ETH.";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var paidthroneEvent = myContract.PaidThrone();

paidthroneEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " paid tribute to the SnailThrone! " + formatEthValue2(web3.fromWei(result.args.eth,'ether')) + " ETH have been sent.";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

var boostedpotEvent = myContract.BoostedPot();

boostedpotEvent.watch(function(error, result){
    if(!error){
		//////console.log(result);
		if(checkHash(storetxhash, result.transactionHash) != 0) {
			date24();
			eventlogdoc.innerHTML += "<br>[" + datetext + "] " + formatEthAdr(result.args.player) + " makes a generous " + formatEthValue2(web3.fromWei(result.args.eth,'ether')) + " ETH donation to the SnailPot. Next round is going to be sweet!";
			logboxscroll.scrollTop = logboxscroll.scrollHeight;
		}
	}
});

//--


