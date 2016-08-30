/*	This is the program for the game of Pig 
	Breeana Nikaido August 2015 	
*/
/*********** Global Variables **********/
theDice = new Dice();
allPlayers = new AllPlayers();
theGame = new Game();
waitTime = 0;
ctext = "";
noDelay = false;

var faceImg = ["<img src='img/dice_1.png' height='100%'/>",
			"<img src='img/dice_2.png' height='100%'/>",
			"<img src='img/dice_3.png' height='100%'/>",
			"<img src='img/dice_4.png' height='100%'/>",
			"<img src='img/dice_5.png' height='100%'/>",
			"<img src='img/dice_6.png' height='100%'/>"];

/*********** Global Functions **********/
function callback( afunction, delay ) {
	if( !hasValue(delay) ) {
		delay = 0;
	}
	setTimeout(afunction(), delay);
	return delay + 1;
}

function checkWait() {
	if(noDelay) {
		waitTime = 0;
		noDelay = false;
	}
}

function hasValue (data) {
	return (data !== undefined) && (data !== null) && (data !== "");
}

function addText( text, htmlBool, callback ) {
	checkWait();
	
	ctext = ctext + text + "<br />";
    var nextText = ctext.length - (text.length + 6);
	var delayInterval = 50;
	var lineDelay = 10;
	
	if( hasValue(htmlBool) && htmlBool ) {
		setTimeout( addHtmlAt( text ), waitTime );
		//console.log("Table Wait Time: " + waitTime + "\nText Length: " + ctext.length);
		waitTime += lineDelay * delayInterval;
	}
	else {
		setTimeout( addTextAt( ctext, nextText), waitTime );
		//console.log("Wait Time: " + waitTime + "\nText Length: " + ctext.length);
		waitTime += (text.length + lineDelay) * delayInterval;
	}
	if( typeof(callback) === "function" ) {
		setTimeout( callback(), waitTime+=1000 );
	}
	
	return waitTime;
}

function addHtmlAt ( text ) {
	return function() {
		logbox.innerHTML += text;
		logbox.scrollTop = logbox.scrollHeight;
	};
}

function addTextAt( text, index ) {
	return function() {
		var currentText = logbox.innerHTML;
		var interval = 25;	//speed
        var htmlCode = "";

		if( index < text.length ) {
            if( text[index] === "<" ) {
                htmlCode += text[index];
                for( var codeIndex = 1; text[index + codeIndex - 1] !== ">"; codeIndex++) {
                    htmlCode += text[index + codeIndex];
                }
                index += htmlCode.length;
            }
			if( index < text.length) {
				logbox.innerHTML = currentText + text[index++] + htmlCode;
				setTimeout( addTextAt( text, index ), interval );
			}
			else {
                logbox.innerHTML = currentText + htmlCode;
				if( index === ctext.length ) {
					noDelay = true;
				}
            }                
		}
		logbox.scrollTop = logbox.scrollHeight;
	};
}

function rollButton( element ) {
	//setTimeout(allPlayers.current().play(), 0);
	if( waitTime === 0 || noDelay) {
		element.disabled = true; 
		allPlayers.current().play();
		setTimeout(function() {element.disabled = false;}, waitTime);
	}
}

function holdButton( element ) {
	//setTimeout(allPlayers.current().hold(), 0);
	if( waitTime === 0 || noDelay) {
		element.disabled = true; 
		allPlayers.current().hold();
		setTimeout(function() {element.disabled = false;}, waitTime);
	}
}

function restartButton ( element ) {
	/* Confirmation */
	/* Cancel Callbacks */
	theGame.start();
}

/*	Old Function
function addText( text, index ) {
	return function() {
		var ctext = logbox.innerHTML;
		var interval = 25;
		if ( !hasValue(index) ) {
			index = 0;
		}
		if( index < text.length ) {
			if( index === 0 ) {
				ctext += "<br />";
			}
			logbox.innerHTML = ctext + text[index++];
			setTimeout( addText( text, index ), interval );
		}
		logbox.scrollTop = logbox.scrollHeight;
	}
}*/

/* Not In Use.
function getNum( inquiry ) {
	var troll = 0;
	var value = parseInt( prompt(inquiry), 10 );
	
	while( isNaN(value) && troll < 3 ) {
		addText(value + " is not a valid number.");
		value = parseInt( prompt("Invalid value.<br />Please enter a number:"), 10 );
		troll++;
	}
	if( isNaN(value) ) {
		alert("Error Code: Mushroom<br />Cannot compute.");
		return -1;
	}
	else if( !hasValue(value) ) {
		alert("Error Code: Sugar\nPlease reopen in a new tab.");
		return -2;
	}
	else {
		return value;
	}
}
*/

/*********** Game Objects **********/
function Die() {
	var face = 6;
	this.getValue = function() {
		return face;
	};
	this.getFace = function() {
		return faceImg[face - 1];
	};
	this.roll = function() {
		face = Math.floor(Math.random() * 6 + 1);
		return face;
	};
}

function Player( name, bot, htmlId, index ) {
	if( typeof(bot) == "boolean" ) {
		this.bot = bot;
	}
	else {
		alert("Error Code: Blue Bunny\nCannot make player '" + name + "'");
		return -1;
	}
	
	this.name = String(name);
	this.htmlId = htmlId;
	this.seatNum = index;
	var points = 0;
	var turnPoints = 0;
	var turnNum = 0;
	
	this.getPoints = function() {
		return points;
	};
	this.resetTurn = function() {
		turnPoints = 0;
		turnNum++;
	};
	this.play = function(currentThis) {
		if( !hasValue(currentThis) ) {
			currentThis = allPlayers.current();
		}
		theDice.rollAll();
		var rollNum = theDice.getTotal();
		console.log(rollNum);
		//addText(this.name + "'s Roll: ");
		//addText(theDice.getString(), true);
		if( theDice.deadRoll() ) {
			//addText( "Oh no! " + currentThis.name + " rolled a '1!'" );
			callback( popNotify("Oh no! " + currentThis.name + " rolled a 1!") );
			turnPoints = 0;
			currentThis.hold(currentThis);
		}
		else {
			if( theDice.bonusRoll() && theDice.doublesRoll() ) {
				addText( "Snake Eyes! Bonus 25 points!! <br /> " +
						 "Doubles! Get twice the roll!! <br /> " +
						 "Roll: " + rollNum );
				callback( popNotify("Big Hog!!! +25 and x2 <br />" +
						 "Roll: " + rollNum ) );
				turnPoints += (rollNum * 2);
				turnPoints += 25;
			}
			else if( theDice.bonusRoll() ) {
				addText( "Snake Eyes! Bonus 25 points!! <br /> " +
						 "Roll: " + rollNum );
				callback( popNotify("Big Pig! +25 <br />" +
						 "Roll: " + rollNum ) );
				turnPoints += 25;
			}
			else if( theDice.doublesRoll() ) {
				addText( "Doubles! Get twice the roll!! <br /> " +
						 "Roll: " + rollNum );
				callback( popNotify( "Hog! x2 <br />" +
						 "Roll: " + rollNum ) );
				turnPoints += (rollNum * 2);
			}
			else {
				callback( popNotify( "Roll: " + rollNum ) );
				turnPoints += rollNum;
			}
			checkWait();
			setTimeout( updateVisual( currentThis.htmlId ), waitTime );
			//addText("Points this turn: " + turnPoints);
			//addText(this.name + ", will you Roll or Hold?");
			if( bot ) {
				currentThis.autoTurn();
			}
		}
		return;
	};
	this.hold = function(currentThis) {	//tempName
		if( !hasValue(currentThis) ) {
			currentThis = allPlayers.current();
		}
		
		points += turnPoints;
		callback( popNotify( "+" + turnPoints + " Points" ) );
		addText(currentThis.name + "'s turn ends.");
		addText("Turn Number: " + turnNum + "     Turn Points: " + turnPoints);
		addText(currentThis.name + "'s Total Points: " + points);
		turnPoints = 0;
		checkWait();
		setTimeout( updateVisual( currentThis.htmlId ), waitTime );
		if( points >= theGame.getGoal() ) {
			addText(currentThis.name + " won!!");
			theGame.end();			
		}
		else {
			allPlayers.nextTurn();
		}
		return;
	};
	this.autoTurn = function() {
		var choice = Math.floor(Math.random() * 2);
		var delay = Math.floor(Math.random() * 1000 + 500); // speed;
		var playThis = this.play;
		var holdThis = this.hold;
		checkWait();
		waitTime += delay;
		
		if( choice == 1 ) {
			setTimeout( function() {playThis(this.object);}, waitTime);
		}
		else {
			setTimeout( function() {holdThis(this.object);}, waitTime);
		}
		//console.log("autoTurn: " + (waitTime));
		return;
	};
	
	this.setVisual = function( id, name) {
		var pElem = document.getElementById( id );
		if( !hasValue(pElem) ) {
			alert("Error Code: Sugar Snap\nWeb Page broken! Cannot find player cards.");
		}
		else {
			pElem.style.display = "inline-block";
			var elemTable = pElem.getElementsByTagName("TABLE")[0];
			
			if( hasValue( elemTable ) ) {
				var elementName = elemTable.getElementsByTagName("TH")[0];
				var elementData = elemTable.getElementsByTagName("TD");
				
				if( hasValue( elementName ) ) {
					elementName.innerHTML = name;
				}
				else {
					alert("Error Code: Sugar Cube\nWeb Page broken! Cannot make player cards.");
				}
				
				if( hasValue( elementData ) ) {
					elementData[0].innerHTML = points;
					elementData[1].innerHTML = turnPoints;
				}
				else {
					alert("Error Code: Sugar Plum\nWeb Page broken! Player cards have corrupted data.");
				}
			}
			else {
				alert("Error Code: Sugar Cube\nWeb Page broken! Cannot make player cards.");
			}
		}
	};
	
	function updateVisual( id ) {
		return function() {
			var pElem = document.getElementById( id );
			if( !hasValue(pElem) ) {
				alert("Error Code: Sugar Snap\nWeb Page broken! Cannot find player cards.");
			}
			else {
				var elemTable = pElem.getElementsByTagName("TABLE")[0];
				
				if( hasValue( elemTable ) ) {
					var elementData = elemTable.getElementsByTagName("TD");
					if( hasValue( elementData ) ) {
						elementData[0].innerHTML = points;
						elementData[1].innerHTML = turnPoints;
					}
					else {
						alert("Error Code: Suger Plum\nWeb Page broken! Player cards have corrupted data.");
					}
				}
				else {
					alert("Error Code: Suger Cube\nWeb Page broken! Cannot access player cards.");
				}
			}
		};
	}
	
	this.setVisual( this.htmlId, this.name );
}

function Dice() {
	var dice = [];
	var dead = false;
	var bonus = false;
	var total = 0;
	
	this.getNumber = function() {
		return dice.length;
	};
	this.setNumber = function(number) {
		var newDice = [];
		var elemDie;
		for( var i = 0; i < number; i++ ) {
			newDice[i] = new Die();
			elemDie = document.getElementById("d" + i);
			if( hasValue(elemDie) ) {
				elemDie.innerHTML = newDice[i].getFace();
				elemDie.style.display = "block";
			}
			else {
				alert("Error Code: Chocolate Strawberries\nDice missing.");
			}
		}
		for( var j = number; j < 10; j++) {
			elemDie = document.getElementById("d" + j);
			if( hasValue(elemDie) ) {
				elemDie.style.display = "none";
			}
			else {
				alert("Error Code: Chocolate Strawberries\nDice missing.");
			}
		}
		dice = newDice;
	};
	this.getString = function() {
		var string = "<table>";
		for( var i in dice ) {
			string += "<tr><td>Die: " + (i*1+1) + "</td><td>Face: " + dice[i].getValue() + "</td></tr>";
		}
		string += "</table>";
		return string;
	};
	this.getValueFor = function( dieNumber ) {
		return dice[dieNumber].getValue();
	};
	this.getTotal = function() {
		return total;
	};
	this.rollAt = function( dieNumber ) {
		var thisDie = dice[dieNumber];
		checkWait();
		var delay = callback( function() {thisDie.roll();}, waitTime );
		setTimeout( updateImg(thisDie.getFace(), dieNumber), delay );
		return dice[dieNumber].getValue();
	};
	this.rollAll = function() {
		total = 0;
		dead = false;
		bonus = false;
		
		for( var i in dice ) {
			if( dice[i].roll() == 1 ) {
				if( !dead && !bonus ) {
					dead = true;
				}
				else {
					dead = false;
					bonus = true;
				}
			}
			checkWait();
			setTimeout( updateImg(dice[i].getFace(), i), waitTime );
			total += dice[i].getValue();
		}
		return total;
	};
	/* Dead roll if at least one of the dice rolls 1 */
	this.deadRoll = function() {
		return dead;
	};
	
	/* Bonus if at least two 1's rolled	*/
	this.bonusRoll = function() {
		return bonus;
	};
	
	/* Check if doubles were rolled (not including 1's)	*/
	this.doublesRoll = function() {
		for( var i in dice ) {
			for( var j in dice) {
				if( dice[i].getValue() === dice[j].getValue() ) {
					if( i !== j && dice[i].getValue() !== 1 ) {
							return true;
					}
				}
			}
		}
		return false;
	};
	function updateImg( die, number ) {
		return function() {
			var elemDie = document.getElementById("d" + number);
			if( hasValue(elemDie) ) {
				if( typeof(die) === "string" ) {
					elemDie.innerHTML = die;
				}
				else if( typeof(die) === "object" ) {
					elemDie.innerHTML = die.getFace();
				}
			}
			else {
				alert("Error Code: Strawberry Shortcake\nDice missing.");
			}
		};
	}
}
function AllPlayers() {
	var players = [];
	var index = 0;
	
	this.getPlayers = function() {
		return players.length;
	};
	this.getString = function() {
		var string = "<table>";
		for( var i in players ) {
			string += "<tr><th>Player " + (i*1+1) + "</th><td>" + 
				players[i].name + "</td><td>Points:" + 
				players[i].getPoints() + "</td></tr>";
		}
		string += "</table>";
		return string;
	};
	this.addPlayer = function( player, bot, htmlId ) {
		if( typeof(player) == "object" ) {
			player.seatNum = players.length;
			players.push( player );
		}
		else {
			var newPlayer = new Player( player, bot, htmlId, players.length );
			players.push( newPlayer );
		}
	};
	this.turnOrder = function() {
		theDice.setNumber( players.length );
		addText("Rolling die to determine order of turns... ");
		players = rollSort(players, theDice);
		addText("Player order has been determined...");
		var delay = addText(this.getString(), true);
		addText(players[index].name + " goes first!");
		setTimeout(function() { resetVisual(); }, delay);
		return;
	};
	this.current = function() {
		return players[index];
	};
	this.next = function() {
		return players[index + 1];
	};
	this.nextTurn = function() {
		index++;
		if( index >= players.length ) {
			index = 0;
		}
		players[index].resetTurn();
		addText(players[index].name + "'s turn!");
		if( players[index].bot ) {
			var currentBot = players[index];
			setTimeout( function() {currentBot.play(currentBot);}, waitTime);
		}
	};
	this.clear = function() {
		players = [];
		index = 0;
	};

	function rollSort(rollers, sortingDice) {
		var dieValues = [[],[],[],[],[],[]];
		var newOrder = [];
		var rollValue;
		var delay = 0;
		var strings = [];
		
		for( var i in rollers ) {
			sortingDice.rollAt(rollers[i].seatNum);
			rollValue = sortingDice.getValueFor(rollers[i].seatNum);
			strings[i] = rollers[i].name + " rolled " + rollValue + "!";
			checkWait();
			delay = waitTime;
			addText(strings[i]);
			setTimeout(popNotify(strings[i]), delay);
			//console.log(delay);
			dieValues[rollValue - 1].push(rollers[i]);
		}
		for( i = 5; i >= 0; i-- ) {
			if( dieValues[i] === null ){}	//skip null references
			else if( dieValues[i].length == 1 ) {
				newOrder.push(dieValues[i][0]);
			}
			else if( dieValues[i].length > 1 ) {
				var playerString = "";
				for( var j = 0; j < dieValues[i].length - 1; j++ ) {
					playerString += dieValues[i][j].name + " and ";
				}
				playerString += dieValues[i][dieValues[i].length - 1].name;
				addText(playerString + " tied!<br /> Rerolling... ");
				newOrder = newOrder.concat( rollSort(dieValues[i], sortingDice) );
			}
		}
		return newOrder;
	}

	function resetVisual() {
		for( var i in players ) {
			players[i].htmlId = "player" + i;
			players[i].setVisual( players[i].htmlId, players[i].name );
		}
	}
}
function Game(win, numDice, numPlay, numBot) {
	var goal = -1;
	var nDice = -1;
	var nPlayers = -1;
	var nBots = -1;

	if( hasValue(win) && hasValue(numDice) && hasValue(numPlay) ) {
		if( !isNaN(win) ) {
			goal = parseInt(win, 10);
		}
		if( !isNaN(numDice) ) {
			nDice = parseInt(numDice, 10);
		}
		if( !isNaN(numPlay) ) {
			nPlayers = parseInt(numPlay, 10);
		}
		if( hasValue(numBot) && !isNaN(numBot) ) {
			nBots = parseInt(numBot, 10);
		}
	}
	this.playerNames = [];
	this.botNames = [ "Siri", "Android", "Data", "R2D2", "Bender", "GLaDOS", "Hal 9000", "Wall-E", "EVE" ];
	
	this.getGoal = function() {
		if( goal <= 0 ) {
			alert("Error Code: Cookie\nGame hasn't started!");
		}
		return goal;
	};
	this.getDice = function() {
		if( nDice <= 0 ) {
			alert("Error Code: Ice Cream\nGame hasn't started!");
		}
		return nDice;
	};
	this.start = function() {
		/* If default values */
		if( goal == -1 ) {
			goal = 100;
		}
		if( nDice == -1 ) {
			nDice = 1;
		}
		if( nPlayers == -1 ) {
			nPlayers = 1;
		}
		if( nBots == -1) {
			nBots = 1;
		}
			
		if ( goal > 0 && nDice > 0 && nPlayers > 0 ) {
			if( (nPlayers + nBots) > 10 ) {
				alert("Too many players! Maximum is 10.");
				return -1;
			}

			allPlayers.clear();
			for( var i = 0; i < nPlayers; i++) {
				var codeName = "";
				if( i > this.playerNames.length || !hasValue(this.playerNames[i]) ) {
					codeName = "Player " + (i+1);
				}
				else {
					codeName = this.playerNames[i];
				}
				allPlayers.addPlayer( codeName, false, "player" + i );
			}

			for( i = 0; i < nBots; i++) {
				allPlayers.addPlayer( this.botNames[i], true, "player" + (nPlayers*1 + i*1));
			}

			addText("Starting game with a goal of " + 
					goal + ", " + 
					nDice + " dice, and " + 
					allPlayers.getPlayers() + " players.");
					
			allPlayers.turnOrder();

			checkWait();
			setTimeout( function(){
					theDice.setNumber(nDice);
				}, waitTime );

			if( allPlayers.current().bot ) {
				var currentBot = allPlayers.current();
				setTimeout( function() {currentBot.play(currentBot);}, waitTime);
			}
			return 0;
		}
		else {
			var errString = "";
			if ( goal <= 0 || !hasValue(goal) ) {
				errString += "Goal is too low!\n";
			}
			if ( nDice <= 0 || !hasValue(nDice) ) {
				errString += "Need at least one die.\n";
			}
			if ( nPlayers <= 0 || !hasValue(nPlayers) ) {
				errString += "No players. No game.\n";
			}
			if( errString === "" ) {
				errString = "Error Code: Banana\nEnter a value.";
			}
			alert( String(errString) );
			return -2;
		}
	};
	this.end = function() {
		/* Make the Start button visible again. Disable game buttons. */
		/* Graphics */
	};
}