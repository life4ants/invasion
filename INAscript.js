/* 
 TODO: 
 */
var toolsOn = false;
var statsOn = false;
var labelsOn = false;
var numOfCountries = 90;
var attack1Sound, attack2Sound, attack3Sound;
var troops1Sound, troops2Sound, conquerSound;
var viewCardsSound, startTurnSound, gameOverSound;
var selectedCountry = [];
var isOdd = true;
var gameOver = false;
var attackLine = "";
var countryInfo = initializeCountryInfo();
var sortedCards = initializeCards();
var redDice, whiteDice;
var players = JSON.parse(sessionStorage.getItem("players"));
var playerInfo = JSON.parse(sessionStorage.getItem("playerInfo"));
var settings = JSON.parse(localStorage.getItem("settings"));
var gameLog = JSON.parse(sessionStorage.getItem("gameLog"));
var round = Number(sessionStorage.round);
var nextCard = Number(sessionStorage.nextCard);
var numOfPasses = Number(sessionStorage.numOfPasses);
var shuffledCards = JSON.parse(sessionStorage.getItem("shuffledCards"));
var temp = [];

                            // game starts here:
function load()
{
    
    
    if (!settings) 
    {
        try 
        {
            localStorage.setItem("test", 1);
            localStorage.removeItem("test");
        }
        catch (error)
        {
            alert("Sorry, your browser does not support local storage. Try with another browser.");
        }
            setDefaultSettings();
    }
        
    if (sessionStorage.gamePhase === "selectCountries")
    {
        createCountries();
        setupCountriesToSelect();
    }
    else if (!sessionStorage.gamePhase) // html for the initial view on first opening the game
    {
        mainMenu();
    }
    else
    {
        toolsOn = false;
        showCountries();
        gameLog = JSON.parse(sessionStorage.getItem("gameLog"));
        if (sessionStorage.gamePhase === "passMenu")
            passTroopsMenu();
        else if (sessionStorage.gamePhase === "turnInCards")
            cardsMenu();
        else 
        {
            if (sessionStorage.gamePhase === "attack2" || sessionStorage.gamePhase === "attack3")
                 sessionStorage.gamePhase = "attack1";
            else if (sessionStorage.gamePhase === "pass2")
                sessionStorage.gamePhase = "pass1";
            if (temp !== "no alert")
            {
            document.getElementById("showBox").innerHTML =
                    "<div id='cardMenu'>" + sessionStorage.alert + "<br><button type='button' \n\
            onclick='document.getElementById(\"showBox\").innerHTML = \"\"'>OK</button></div>";
            }
        }
    }    
}
function createCountries()
{
     document.getElementById("menuBox").innerHTML =
        "<button type='button' onclick='mainMenu()'><strong>Main Menu</strong></button>\n\
        <button type='button' onclick='endTurn()'><strong>End Turn</strong></button>\n\
        <button type='button' onclick='showCards(\"show\")'><strong>See Your Cards</strong></button>\n\
        <button type='button' onclick='turnInCards()'><strong>Turn In Cards</strong></button><br>\n\
        <button type='button' id='toolsButton' onclick='tools()'>Tools ►</button><span id='reservesButton'></span>\n\
        <div id='tools'></div>";
    if (settings.autoReserves === "true")
        document.getElementById('reservesButton').innerHTML = "";
    else
    {
        document.getElementById('reservesButton').innerHTML =
        "<button type='button' onclick='getReserves()'><strong>Get Reserves</strong></button><br><br>";
    }
    var _show = "";
    
    for (var i=0; i<numOfCountries; i++)
    {
      
        _show += "<div class='countrybox' id='country"+i+"' onclick='countryClick("+i+
        ")'><div class='icon' id='icon"+i+"'></div><div id='label"+i+
        "' class='label'></div></div>"; 
    }
    document.getElementById("showBox").innerHTML = "";
    document.getElementById("titleBox").innerHTML = "";
    document.getElementById("gameview").innerHTML = 
    _show + "<img id='gameBoard' src='pics/game map.png' alt='game board'>";
}
function showCountries()
{
    createCountries();
    for (var i=0; i<numOfCountries; i++)
    {
      document.getElementById("icon"+i).innerHTML = getIcon(Number(sessionStorage.getItem("countryOwners"+i)), 1);
      document.getElementById("label"+i).innerHTML = sessionStorage.getItem("countryReserves"+i);
    }
    show();
}
function loadAudio()
{
attack1Sound = new Audio("pics/attack1.mp3");
attack2Sound = new Audio("pics/attack2.mp3");
attack3Sound = new Audio("pics/attack3.mp3");
troops1Sound = new Audio("pics/troops1.mp3");
troops2Sound = new Audio("pics/troops2.mp3");
conquerSound = new Audio("pics/conquer.mp3");
viewCardsSound = new Audio("pics/viewcards.mp3");
startTurnSound = new Audio("pics/startTurn.mp3");
gameOverSound = new Audio("pics/gameOver.mp3");
}
function mainMenu()
{
    document.getElementById("titleBox").innerHTML = "<h1 class='center'>Welcome to Invasion!</h1>";
    document.getElementById("menuBox").innerHTML = "";
    document.getElementById("infoBox").innerHTML = "";
    document.getElementById("diceBox").innerHTML = "";
    document.getElementById("showBox").innerHTML = "<div id='mainMenu'>\n\
        <h1 class='center'>Main Menu</h1><div id ='left'></div></div>";
    var _show = "";
    if (sessionStorage.gamePhase){
        temp = "no alert";
        _show += "<button type='button' onclick='load()'><strong>Back to Game</strong></button><br><br>\n\
        <button type='button' onclick='saveGameMenu()'><strong>Save Game</strong></button><br><br>";
    }
    _show += "<button type='button' onclick='newGameMenu()'><strong>New Game</strong></button><br><br>";
    if (localStorage.savedGames)
        _show += "<button type='button' onclick='loadGameMenu()'><strong>Load Saved Game</strong></button><br><br>";
    else
        _show += "<button type='button' onclick='loadGameFromFile()'><strong>Load Saved Game from File</strong></button><br><br>";
    _show += "<button type='button' onclick='settingsMenu()'><strong>Change Settings</strong></button><br><br>";
    document.getElementById("left").innerHTML = _show;
}
function newGameMenu()
{
    document.getElementById('showBox').innerHTML = 
     "<div id='gameMenu'><div style='float: right'>\n\
    <input type='checkbox' id='color1'><img src='pics/icon_red_small.png'> <input type='text' id='name1' value='Red'><input type='checkbox' id='com1'>Computer<br><br>\n\
    <input type='checkbox' id='color2'><img src='pics/icon_blue_small.png'> <input type='text' id='name2' value='Blue'><input type='checkbox' id='com2'>Computer<br><br>\n\
    <input type='checkbox' id='color3'><img src='pics/icon_green_small.png'> <input type='text' id='name3' value='Green'><input type='checkbox' id='com3'>Computer<br><br>\n\
    <input type='checkbox' id='color4'><img src='pics/icon_yellow_small.png'> <input type='text' id='name4' value='Yellow'><input type='checkbox' id='com4'>Computer<br><br>\n\
    <input type='checkbox' id='color5'><img src='pics/icon_orange_small.png'> <input type='text' id='name5' value='Orange'><input type='checkbox' id='com5'>Computer<br><br>\n\
    <input type='checkbox' id='color6'><img src='pics/icon_purple_small.png'> <input type='text' id='name6' value='Purple'><input type='checkbox' id='com6'>Computer<br><br>\n\
    <input type='checkbox' id='color7'><img src='pics/icon_brown_small.png'> <input type='text' id='name7' value='Brown'><input type='checkbox' id='com7'>Computer<br><br>\n\
    <input type='checkbox' id='color8'><img src='pics/icon_white_small.png'> <input type='text' id='name8' value='White'><input type='checkbox' id='com8'>Computer</div>\n\
    <h1 class='center'>New Game</h1>\n\
    <p class='center'><b>Select the players you wish to play and name them -\></b></p>\n\
    <button type='button' onclick='mainMenu()'>Cancel</button>\n\
    <button type='button' onclick='newGame()'>OK</button></div>";
    
}
function settingsMenu()
{
    if (!localStorage.settings)
        setDefaultSettings();
    
    document.getElementById('showBox').innerHTML = 
    "<div id='settingsBox'><div style='width: 200px; float: left'>\n\
    Method of choosing countries:<br>\n\
    <input type='radio' name='choose1' id='selectable'>Selectable  <input type='radio' name='choose1' id='random' checked>Random<br><br>\n\
    Rules for passing troops at the end of the turn:<br>\n\
    <input type='radio' name='pass' id='onePass' CHECKED=''>One pass to bordering country <br>\n\
    <input type='radio' name='pass' id='oneAnywhere'>One pass anywhere <br>\n\
    <input type='radio' name='pass' id='threeAnywhere'>Three passes anywhere <br>\n\
    <input type='radio' name='pass' id='unlimitedPass'>Unlimited <br><br>\n\
    <button type='button' onclick='resetSettings()'>Set to Default</button>\n\
    </div><div style='width: 200px; float: right'>\n\
    Maximum number of cards allowed:<br>\n\
    <input type='radio' name='card' id='fiveCards' CHECKED=''>5 \n\
    <input type='radio' name='card' id='tenCards'>10 \n\
    <input type='radio' name='card' id='fifteenCards'>15 \n\
    <input type='radio' name='card' id='unlimitedCards'>Unlimited<br><br>\n\
    Number of sets allowed to be turned in at one time:<br>\n\
    <input type='radio' name='sets' id='oneSet' CHECKED=''>1  \n\
    <input type='radio' name='sets' id='twoSets'>2  \n\
    <input type='radio' name='sets' id='threeSets'>3  \n\
    <input type='radio' name='sets' id='unlimitedSets'>Unlimited<br><br>\n\
    <input type='checkbox' id='auto_reserves' CHECKED=''>Automatically get reserves<br>\n\
    <input type='checkbox' id='tiedRoll' >Defense always wins a tie<br><br>\n\
    <button type='button' onclick='mainMenu()'>Cancel</button>\n\
    <button type='button' onclick='changeSettings()'>OK</button>\n\
    </div></div>";
    
    if (settings.autoReserves === "false")  
        document.getElementById('auto_reserves').checked = false;
    
    if (settings.defenseWinsTie === "true")  
        document.getElementById('tiedRoll').checked = true;
    
    if (settings.randomSelect === "false")
        document.getElementById('selectable').checked = true;
    
    if (settings.passing === "oneAnywhere")
        document.getElementById('oneAnywhere').checked = true;
    else if (settings.passing === "threeAnywhere")
        document.getElementById('threeAnywhere').checked = true;
    else if (settings.passing === "unlimited")
        document.getElementById('unlimitedPass').checked = true;
    
    if (settings.numOfCards === "10")
        document.getElementById('tenCards').checked = true;
    else if (settings.numOfCards === "15")
        document.getElementById('fifteenCards').checked = true;
    else if (settings.numOfCards === "unlimited")
        document.getElementById('unlimitedCards').checked = true;
        
    if (settings.numOfSets === "2")
        document.getElementById('twoSets').checked = true;
    else if (settings.numOfSets === "3")
        document.getElementById('threeSets').checked = true;
    else if (settings.numOfSets === "unlimited")
        document.getElementById('unlimitedSets').checked = true;
    
}
function changeSettings()
{
    if (document.getElementById('auto_reserves').checked)  
        settings.autoReserves = "true";
    else
        settings.autoReserves = "false";

    if (document.getElementById('tiedRoll').checked)  
        settings.defenseWinsTie = "true";
    else
        settings.defenseWinsTie = "false";

    if (document.getElementById('random').checked)
        settings.randomSelect = "true";
    else 
        settings.randomSelect = "false";

    if (document.getElementById('oneAnywhere').checked)
        settings.passing = "oneAnywhere";
    else if (document.getElementById('threeAnywhere').checked)
        settings.passing = "threeAnywhere";
    else if (document.getElementById('unlimitedPass').checked)
        settings.passing = "unlimited";
    else 
        settings.passing = "one";

    if (document.getElementById('tenCards').checked)
        settings.numOfCards = "10";
    else if (document.getElementById('fifteenCards').checked)
        settings.numOfCards = "15";
    else if (document.getElementById('unlimitedCards').checked)
        settings.numOfCards = "unlimited";
    else 
        settings.numOfCards = "5";

    if (document.getElementById('twoSets').checked)
        settings.numOfSets = "2";
    else if (document.getElementById('threeSets').checked)
        settings.numOfSets = "3";
    else if (document.getElementById('unlimitedSets').checked)
        settings.numOfSets = "unlimited";
    else 
        settings.numOfSets = "1";
    
    localStorage.setItem("settings", JSON.stringify(settings));
      
    mainMenu();
}
function saveGameMenu()
{
    var names = [];
    var _show = "";
    for (var i = 0; i<5; i++)
    {
        if (localStorage.getItem("game"+i))
        {
            var game = JSON.parse(localStorage.getItem("game"+i));
            names[i] = game.name;
        }
        else
            names[i] = "-empty-";
    }
    for (var i = 0; i<5; i++)
    {
        _show += 
                "<input type='radio' name='name' id='game"+i+"'><input type='text' id='name"+
                i+"' value='"+names[i]+"'><br>";
    }
    
    document.getElementById("showBox").innerHTML = 
    "<div id='mainMenu'><h3 class='center'>Save Game</h3>\n\
    <button type='button' onclick='saveToFile()'>Save to File</button><br><br>\n\
    Or choose a spot for your game and name it:<br><br>" + _show +
    "<br><button type='button' onclick='mainMenu()'>Cancel</button>\n\
    <button type='button' onclick='saveGame()'>OK</button></div>";
}
function saveGame()
{
    var name, num;
    for (var i = 0; i<5; i++)
    {
       if (document.getElementById("game"+i).checked)  {
            name = document.getElementById('name'+i).value; 
            num=i; }
    }
    if (!name)
    {
        alert("Please check one");
        return;
    }
    
    var _playerReserves = [];
    var _playerTempReserves = [];
    var _countryOwners = [];
    var _countryReserves = [];
    var game = {};
    
    for (var i = 0; i<players.length; i++)
    {
        _playerReserves[i] = sessionStorage.getItem("playerReserves"+i);
    }
     for (var i = 0; i<players.length; i++)
    {
        _playerTempReserves[i] = sessionStorage.getItem("playerTempReserves"+i);
    }
     for (var i = 0; i<numOfCountries; i++)
    {
        _countryOwners[i] = sessionStorage.getItem("countryOwners"+i);
    }
    for (var i = 0; i<numOfCountries; i++)
    {
        _countryReserves[i] = sessionStorage.getItem("countryReserves"+i);
    }
    game = {
    "name": name,
    "alert": sessionStorage.alert,
    "cardSetValue": sessionStorage.cardSetValue,   
    "countryOwners": _countryOwners,
    "countryReserves": _countryReserves,
    "countryStats": sessionStorage.countryStats,
    "firstTime": sessionStorage.firstTime,
    "gameLog": sessionStorage.gameLog,
    "gamePhase": sessionStorage.gamePhase,
    "gameStarted": sessionStorage.gameStarted,
    "getCard": sessionStorage.getCard,
    "mustTurnInCards": sessionStorage.mustTurnInCards,
    "nextCard": sessionStorage.nextCard,
    "numOfPasses": sessionStorage.numOfPasses,
    "players": sessionStorage.players,
    "playerInfo": sessionStorage.playerInfo,
    "playerReserves": _playerReserves,
    "playerTempReserves": _playerTempReserves,
    "playStarted": sessionStorage.playStarted,
    "reserves": sessionStorage.reserves,
    "round": sessionStorage.round,
    "setsOfCards": sessionStorage.setsOfCards,
    "shuffledCards": sessionStorage.shuffledCards,
    "savedData": sessionStorage.savedData,
    "settings": localStorage.settings,
    "turnInCards": sessionStorage.turnInCards,
    "turnIndex": sessionStorage.turnIndex
    };
    localStorage.setItem("game"+num, JSON.stringify(game));
    localStorage.savedGames = "true";
    alert(name+" was saved.");
    mainMenu();
}
function saveToFile()
{
    var _playerReserves = [];
    var _playerTempReserves = [];
    var _countryOwners = [];
    var _countryReserves = [];
    var game = {};
    
    for (var i = 0; i<players.length; i++)
    {
        _playerReserves[i] = sessionStorage.getItem("playerReserves"+i);
    }
     for (var i = 0; i<players.length; i++)
    {
        _playerTempReserves[i] = sessionStorage.getItem("playerTempReserves"+i);
    }
     for (var i = 0; i<numOfCountries; i++)
    {
        _countryOwners[i] = sessionStorage.getItem("countryOwners"+i);
    }
    for (var i = 0; i<numOfCountries; i++)
    {
        _countryReserves[i] = sessionStorage.getItem("countryReserves"+i);
    }
    var _name = prompt("Please enter a name for your game:");
    if (_name)
    {
        game = {
        "name": _name,
        "alert": sessionStorage.alert,
        "cardSetValue": sessionStorage.cardSetValue,   
        "countryOwners": _countryOwners,
        "countryReserves": _countryReserves,
        "countryStats": sessionStorage.countryStats,
        "firstTime": sessionStorage.firstTime,
        "gameLog": sessionStorage.gameLog,
        "gamePhase": sessionStorage.gamePhase,
        "gameStarted": sessionStorage.gameStarted,
        "getCard": sessionStorage.getCard,
        "mustTurnInCards": sessionStorage.mustTurnInCards,
        "nextCard": sessionStorage.nextCard,
        "numOfPasses": sessionStorage.numOfPasses,
        "players": sessionStorage.players,
        "playerInfo": sessionStorage.playerInfo,
        "playerReserves": _playerReserves,
        "playerTempReserves": _playerTempReserves,
        "playStarted": sessionStorage.playStarted,
        "reserves": sessionStorage.reserves,
        "round": sessionStorage.round,
        "setsOfCards": sessionStorage.setsOfCards,
        "shuffledCards": sessionStorage.shuffledCards,
        "savedData": sessionStorage.savedData,
        "settings": localStorage.settings,
        "turnInCards": sessionStorage.turnInCards,
        "turnIndex": sessionStorage.turnIndex
        };
        var _show = JSON.stringify(game);
        document.getElementById("showBox").innerHTML = "";
        document.getElementById("gameview").innerHTML = 
                "<br>Please copy the following text and \n\
            save it to a text file: (make sure you get everything between the { and } )<br><br>"+_show+"<br><br>\n\
        <button type='button' onclick='load()'>Done</button>";
    }
    
}
function loadGameMenu()
{
    var games = [];
    var _show = "";
    var x = 0;
    temp = [];
    for (var i = 0; i<5; i++)
    {
        if (localStorage.getItem("game"+i)){
            games[x] = JSON.parse(localStorage.getItem("game"+i));
            temp[x] = i;
            x++;
        }
    }
    document.getElementById("showBox").innerHTML = 
    "<div id='mainMenu'><h3 class='center'>Load Saved Game</h3>\n\
    Select a game to load:<br><br><div id='this'></div><br>\n\
    <button type='button' onclick='deleteGame()'>Delete Selected Game</button><br>\n\
    <button type='button' onclick='loadGameFromFile()'>Load Game from File</button><br><br>\n\
    <button type='button' onclick='mainMenu()'>Cancel</button>\n\
    <button type='button' onclick='loadGame(1)'>OK</button></div></div>";
    for (var i = 0; i<x; i++)
    {
        _show += "<input type='radio' name='games' id='game"+i+"'> "+games[i].name+"<br>";
    }
    document.getElementById("this").innerHTML = _show;
}
function loadGameFromFile()
{
    document.getElementById("showBox").innerHTML = 
            "<div id='popup'>Paste the game data text here in the box below. \n\
        Make sure it starts with a { and ends with a }.<br>Paste here: <input type='text' id='input'><br>\n\
        <button type='button' onclick='loadGame(2)'>OK</button>\n\
        <button type='button' onclick='mainMenu()'>Cancel</button></div>";
}
function loadGame(index)
{
    var game;
    if (index === 1)
    {
        for (var i = 0; i<temp.length; i++)
        {
            if(document.getElementById("game"+i).checked)
                game = JSON.parse(localStorage.getItem("game"+temp[i]));
        }
    }
    else if (index === 2)
    {
        game = JSON.parse(document.getElementById("input").value);
    }
    sessionStorage.alert = game.alert;
    sessionStorage.cardSetValue = game.cardSetValue;
    var _countryOwners = game.countryOwners;
    var _countryReserves = game.countryReserves;
    sessionStorage.countryStats = game.countryStats;
    sessionStorage.firstTime = game.firstTime;
    sessionStorage.gameLog = game.gameLog;
    sessionStorage.gamePhase = game.gamePhase;
    sessionStorage.gameStarted = game.gameStarted;
    sessionStorage.getCard = game.getCard;
    sessionStorage.mustTurnInCards = game.mustTurnInCards;
    sessionStorage.nextCard = game.nextCard;
    sessionStorage.numOfPasses = game.numOfPasses;
    sessionStorage.players = game.players;
    sessionStorage.playerInfo = game.playerInfo;
    var _playerReserves = game.playerReserves;
    var _playerTempReserves = game.playerTempReserves;
    sessionStorage.playStarted = game.playStarted;
    sessionStorage.reserves = game.reserves;
    sessionStorage.round = game.round;
    sessionStorage.setsOfCards = game.setsOfCards;
    sessionStorage.shuffledCards = game.shuffledCards;
    sessionStorage.turnInCards = game.turnInCards;
    sessionStorage.turnIndex = game.turnIndex;
    sessionStorage.savedData = game.savedData;
    localStorage.settings = game.settings;
    
    players = JSON.parse(sessionStorage.getItem("players"));
    playerInfo = JSON.parse(sessionStorage.getItem("playerInfo"));
    settings = JSON.parse(localStorage.getItem("settings"));
    round = Number(sessionStorage.round);
    gameLog = JSON.parse(sessionStorage.getItem("gameLog"));
    nextCard = Number(sessionStorage.nextCard);
    numOfPasses = Number(sessionStorage.numOfPasses);
    shuffledCards = JSON.parse(sessionStorage.getItem("shuffledCards"));
    
    for (var i = 0; i<players.length; i++)
    {
        sessionStorage.setItem("playerReserves"+i, _playerReserves[i]);
    }
     for (var i = 0; i<players.length; i++)
    {
        sessionStorage.setItem("playerTempReserves"+i, _playerTempReserves[i]);
    }
     for (var i = 0; i<numOfCountries; i++)
    {
        sessionStorage.setItem("countryOwners"+i, _countryOwners[i]);
    }
    for (var i = 0; i<numOfCountries; i++)
    {
        sessionStorage.setItem("countryReserves"+i, _countryReserves[i]);
    }
     
    alert(game.name+" was loaded.");
    load();
}
function deleteGame()
{
    if (confirm("Are you sure you want to delete the selected game?"))
    {
    for (var i = 0; i<temp.length; i++)
    {
        if(document.getElementById("game"+i).checked)
            localStorage.removeItem("game"+temp[i]);
    }
    if (temp.length === 1){
        localStorage.removeItem("savedGames");
        mainMenu();
    }
    else
        loadGameMenu();
    }
}
function newGame()
{
    var _players = [];    
    for (var i = 1, x = 0; i < 9; i++)  //asign a name and color number to as many 
                                        //elements of the array as there are players.
    {
        if (document.getElementById('color' + i).checked) 
        {
            var name = document.getElementById('name' + i).value;
            var isComputer = document.getElementById('com'+i).checked;
            _players[x] = {"name": name, "color": i, "cards": [], "isComputer": isComputer};
            x++;
        }
    }
    _players = shufflePlayers(_players);
    var show = "";
    for (var i = 0; i < _players.length; i++) {
        show += "Player " + (i + 1) + ": " + _players[i].name + " (" + getcolor(_players[i].color) + ")\n";
    }
    if (_players.length < 2) { alert("You did not select enough players!"); } 
    else 
    {
        if (sessionStorage.gameStarted === "true")
        {
        if (confirm("Do you want to start a new game? Your current game will not be saved!")){}
        else
            return;
        }
        if (settings.randomSelect === "false")
        {
            for (var i =0; i<_players.length; i++)
            {
                if (_players[i].isComputer)
                {
                    alert("The country selection settings are set to selectable. The computer players are not programmed to \nselect their own countries. Please change the settings or play without computer players.");
                    return;
                }
            }
        }
        if (confirm(show))
        {
            sessionStorage.gameStarted = "true";
            sessionStorage.firstTime = "true";
            sessionStorage.playStarted = "false";
            sessionStorage.cardSetValue = 4;
            sessionStorage.round = 1;
            sessionStorage.nextCard = 0;
            gameLog = {"lastTime": [], "round": []};
            sessionStorage.setItem("gameLog", JSON.stringify(gameLog));
            nextCard = 0;
            round = 1;
            players = _players;
            sessionStorage.setItem("players", JSON.stringify(players));
            setupPlayerInfo();
            shuffledCards = shuffleArray(initializeCards());
            sessionStorage.setItem("shuffledCards", JSON.stringify(shuffledCards));
            createCountries();
            startGame();
        }
    }
    
}
function setupPlayerInfo()
{
    playerInfo = [];
    for (var i = 1; i<9; i++)
    {
        var _name;
    
        if (document.getElementById('color' + i).checked) 
            _name = document.getElementById('name' + i).value;
        else 
            _name = getcolor(i) + " (did not play)";
        
        playerInfo[i] = {"name": _name, "troopsLost": 0};
    }
    sessionStorage.setItem("playerInfo", JSON.stringify(playerInfo));
}
function startGame()
{
    sessionStorage.turnIndex = 0;
    
    if (settings.randomSelect === "true")
        randomSelectCountries();
    else 
    {
        for (var i = 0; i<numOfCountries; i++)
            sessionStorage.setItem("countryOwners"+i, 15);
        setupCountriesToSelect();
        alert("Each player in turn will select a country.");
        sessionStorage.alert = "Each player in turn will select a country.";
    }
        
    
}
function setupCountriesToSelect()
{
    sessionStorage.gamePhase = "selectCountries";     
        for (var i = 0; i<players.length; i++){
            sessionStorage.setItem("playerReserves"+i, 0);
        }
        for (var i = 0; i<numOfCountries; i++)
        {
            var owner = Number(sessionStorage.getItem("countryOwners"+i));
            if (owner !== 15)
                document.getElementById("icon"+i).innerHTML = getIcon(owner, 1);
            else
                document.getElementById('icon' + i).innerHTML = "<img src='pics/icon_star.png'>";
        }
        show();
}
function randomSelectCountries()
{    
    var countryArray = [];
    var countryStats = [];
    for (var i = 0; i < numOfCountries; i++) //fill the countryArray with values 0-89
    {
        countryArray[i] = i;
        countryStats[i] = {"originalOwner": 0, "timesConquered": 0};
    }
    var array = shuffleArray(countryArray); //shuffle up the countryArray

    for (var i = 0; i < numOfCountries; )
    {       //loop thru the players and asign the shuffled countries to them
         for (var j = players.length - 1; j >= 0; j--) 
        {
            if (i === numOfCountries)
                break;
            else 
            {
                document.getElementById("icon" + array[i]).innerHTML = getIcon(players[j].color, 1);
                sessionStorage.setItem("countryOwners" + array[i], players[j].color);
                countryStats[array[i]].originalOwner = players[j].color;
            }
            i++;
        }
    }
    for (var i = 0; i < numOfCountries; i++)
    {
        sessionStorage.setItem("countryReserves" + i, 1);
        document.getElementById("label" + i).innerHTML = 1;
    }
    sessionStorage.setItem("countryStats", JSON.stringify(countryStats));
    sessionStorage.gamePhase = "initialReserves";
    asignReserves();
    show();
    if (players[sessionStorage.turnIndex].isComputer)
    {
        computerInitialReserves();
    }
    else
    {
        var _name = players[sessionStorage.turnIndex].name;
        var temp_reserves = sessionStorage.getItem("playerTempReserves"+[sessionStorage.turnIndex]);
        alert("The countries have been randomly selected.\nEach player in turn will add troops. " 
                + _name + ", start by adding " + temp_reserves + " troops.\n");
        sessionStorage.alert = _name +", it is your turn to add " + temp_reserves + " troops.\n";
    }
}
function asignReserves()
{
    var _players = players.length;
    if (_players === 2) 
    {
        sessionStorage.playerReserves0 = 58; //
        sessionStorage.playerReserves1 = 58; //
        sessionStorage.playerTempReserves0 = 10;
    }
    else if (_players === 3) 
    {
        sessionStorage.playerReserves0 = 42; //
        sessionStorage.playerReserves1 = 42; //
        sessionStorage.playerReserves2 = 42; 
        sessionStorage.playerTempReserves0 = 10;
    }
    else if (_players === 4) 
    {
        sessionStorage.playerReserves0 = 36; //36
        sessionStorage.playerReserves1 = 36; //36
        sessionStorage.playerReserves2 = 35; //35
        sessionStorage.playerReserves3 = 35; //35
        sessionStorage.playerTempReserves0 = 8;
    }
    else if (_players === 5) 
    {
        sessionStorage.playerReserves0 = 32; //
        sessionStorage.playerReserves1 = 32; //
        sessionStorage.playerReserves2 = 32; //
        sessionStorage.playerReserves3 = 32; //
        sessionStorage.playerReserves4 = 32; //
        sessionStorage.playerTempReserves0 = 8;
    }
    else if (_players === 6) 
    {
        sessionStorage.playerReserves0 = 30; //
        sessionStorage.playerReserves1 = 30; //
        sessionStorage.playerReserves2 = 30; //
        sessionStorage.playerReserves3 = 30; //
        sessionStorage.playerReserves4 = 30; //
        sessionStorage.playerReserves5 = 30; //
        sessionStorage.playerTempReserves0 = 8;
    }
    else if (_players === 7) 
    {
        sessionStorage.playerReserves0 = 28; //28
        sessionStorage.playerReserves1 = 27; //27
        sessionStorage.playerReserves2 = 27; //27
        sessionStorage.playerReserves3 = 27; //27
        sessionStorage.playerReserves4 = 27; //27
        sessionStorage.playerReserves5 = 27; //27
        sessionStorage.playerReserves6 = 27; //27
        sessionStorage.playerTempReserves0 = 5;
    }
    else if (_players === 8) 
    {
        sessionStorage.playerReserves0 = 25; //25
        sessionStorage.playerReserves1 = 25; //25
        sessionStorage.playerReserves2 = 25; //25
        sessionStorage.playerReserves3 = 25; //25
        sessionStorage.playerReserves4 = 25; //25
        sessionStorage.playerReserves5 = 25; //25
        sessionStorage.playerReserves6 = 24; //24
        sessionStorage.playerReserves7 = 24; //24
        sessionStorage.playerTempReserves0 = 5;
    }
}
function assignTempReserves()
{
    nextPlayer();
    var _playerReserves = Number(sessionStorage.getItem("playerReserves"+sessionStorage.turnIndex));
    var _playerTempReserves = Number(sessionStorage.getItem("playerTempReserves"+sessionStorage.turnIndex));
    if (_playerReserves > 41)
    {
        _playerTempReserves = 10;
        if (!players[sessionStorage.turnIndex].isComputer)
        {alert(players[sessionStorage.turnIndex].name + ", now it is your turn to add 10 troops");
        sessionStorage.alert = players[sessionStorage.turnIndex].name + ", it is your turn to add 10 troops";
        }
    }
    else if (_playerReserves < 42 && _playerReserves > 28)
    {
        _playerTempReserves = 8;
        if (!players[sessionStorage.turnIndex].isComputer){
        alert(players[sessionStorage.turnIndex].name + ", now it is your turn to add 8 troops");
        sessionStorage.alert = players[sessionStorage.turnIndex].name + ", it is your turn to add 8 troops";
        }
    }
    else if (_playerReserves < 29 && _playerReserves > 8)
    {
        _playerTempReserves = 5;
        if (!players[sessionStorage.turnIndex].isComputer){
        alert(players[sessionStorage.turnIndex].name + ", now it is your turn to add 5 troops");
        sessionStorage.alert = players[sessionStorage.turnIndex].name + ", it is your turn to add 5 troops";
        }
    }
    else if (_playerReserves < 9 && _playerReserves > 2)
    {
        _playerTempReserves = 3;
        if (!players[sessionStorage.turnIndex].isComputer){
        alert(players[sessionStorage.turnIndex].name + ", now it is your turn to add 3 troops");
        sessionStorage.alert = players[sessionStorage.turnIndex].name + ", it is your turn to add 3 troops";
        }
    }
    else if (_playerReserves < 3 && _playerReserves > 0)
    {
        _playerTempReserves = 1;
        if (sessionStorage.firstTime === "true")
        {
            alert("Now each player will add 1 troop at a time");
            sessionStorage.alert = "Each player in turn will add 1 troop";
            sessionStorage.firstTime = "false";
        }
    }
    sessionStorage.setItem("playerTempReserves"+sessionStorage.turnIndex, _playerTempReserves);
    show();
    if (players[sessionStorage.turnIndex].isComputer)
        computerInitialReserves();
}
function countryClick(index)
{
    var _player = players[sessionStorage.turnIndex].color; // the color of the current player
    var _country = Number(sessionStorage.getItem("countryOwners"+index)); // the country's owner's color
    var _name = players[sessionStorage.turnIndex].name;
    
    if (sessionStorage.gamePhase === 'initialReserves')
    {
        if (_country === _player)
        {
            if (isOdd)
                {
                    if (troops1Sound.currentTime < troops1Sound.duration)
                    {
                        troops1Sound.currentTime = 0;
                        troops1Sound.play();
                    }
                    else
                        troops1Sound.play();
                    isOdd = false;
                }
            else
                {
                    if (troops2Sound.currentTime < troops2Sound.duration)
                        {
                        troops2Sound.currentTime = 0;
                        troops2Sound.play();
                    }
                    else
                        troops2Sound.play();
                    isOdd = true;
                }
            var _playerReserves = Number(sessionStorage.getItem("playerReserves"+sessionStorage.turnIndex));
            _playerReserves--;
            sessionStorage.setItem("playerReserves"+sessionStorage.turnIndex, _playerReserves);
            
            var _playerTempReserves = Number(sessionStorage.getItem("playerTempReserves"+sessionStorage.turnIndex));
            _playerTempReserves--;
            sessionStorage.setItem("playerTempReserves"+sessionStorage.turnIndex, _playerTempReserves);
            
            var _countryReserves = Number(sessionStorage.getItem("countryReserves"+index));
            _countryReserves++;
            sessionStorage.setItem("countryReserves"+index, _countryReserves);
            
            document.getElementById("label" + index).innerHTML = _countryReserves;
            show();
            
            if (_playerTempReserves <= 0)
            {
                assignTempReserves();
            }
            _playerReserves = Number(sessionStorage.getItem("playerReserves"+sessionStorage.turnIndex));
            if (_playerReserves <= 0) {
                sessionStorage.playStarted = "true";
                shiftPlayers(Number(sessionStorage.turnIndex));
                sessionStorage.turnIndex = 0;
                initializeGameLog();
                startTurn();
            }
        } else
        {
            alert("That country does not belong to you!");
        }
    }
    else if (sessionStorage.gamePhase === "selectCountries")
    {   
        manuallySelectCountries(index);
    }
    else if (sessionStorage.gamePhase === 'addTroops')
    {
        if (_country === _player)
        {
            if (isOdd)
                {
                    if (troops1Sound.currentTime < troops1Sound.duration)
                    {
                        troops1Sound.currentTime = 0;
                        troops1Sound.play();
                    }
                    else
                        troops1Sound.play();
                    isOdd = false;
                }
            else
                {
                    if (troops2Sound.currentTime < troops2Sound.duration)
                        {
                        troops2Sound.currentTime = 0;
                        troops2Sound.play();
                    }
                    else
                        troops2Sound.play();
                    isOdd = true;
                }
            var _playerReserves = Number(sessionStorage.getItem("playerReserves"+sessionStorage.turnIndex));
            var _countryReserves = Number(sessionStorage.getItem("countryReserves"+index));
            if (_playerReserves > 0)
            {
            _playerReserves--;
            _countryReserves++;
            document.getElementById("label" + index).innerHTML = _countryReserves;
            sessionStorage.setItem("playerReserves"+sessionStorage.turnIndex, _playerReserves);
            sessionStorage.setItem("countryReserves"+index, _countryReserves);
            show();
            }
            if (_playerReserves === 0)
            {
                sessionStorage.gamePhase = 'attack1';
                sessionStorage.turnInCards = "false";
                saveGameLog("distribute");
                alert("Distribution of troops is complete. You can now start your turn.\n\
Click on an attacking country, then click on an opponent's country to attack.");
                sessionStorage.alert = _name + ", continue your turn for round " + round + ".";
            }
        } 
        else
        {
            alert("that country does not belong to you!");
        }
    }
    else if (sessionStorage.gamePhase === 'attack1')
    {   
        sessionStorage.turnInCards = "false";
        sessionStorage.reserves = "false";
        if (_country === _player)
        {
            var _reserves = Number(sessionStorage.getItem("countryReserves"+index));
            if (_reserves > 1)
            {
                attack1Sound.currentTime = 0;
                attack1Sound.play();
                selectCountry(index);
                selectedCountry[0] = index;
                attackLine = countryInfo[index].name + " vs ";
                show();
                sessionStorage.gamePhase = 'attack2';
            }
            else if (_reserves === 2)
            {
                if (_name === "SuperPower")
                alert("There is not enough troops on that country to attack!");
            }
            else
                alert("There is not enough troops on that country to attack!");
        }
        else
            alert("That country does not belong to you!");
    }
    else if (sessionStorage.gamePhase === 'attack2')
    {
        if (_country === _player)
        {
            var _reserves = Number(sessionStorage.getItem("countryReserves"+index));
            if (_reserves > 1)
            {
                deSelectCountry(selectedCountry[0]);
                selectCountry(index);
                selectedCountry[0] = index;
                attackLine = countryInfo[index].name + " vs ";
                show();
            }
            else
                alert("There is not enough troops on that country to attack!");
        }
        else
        {
           if (canFight(selectedCountry[0], index))
           {
               attack2Sound.currentTime = 0;
               attack2Sound.play();
               selectCountry(index);
               selectedCountry[1] = index;
               attackLine += countryInfo[index].name;
               show();
               sessionStorage.gamePhase = "attack3";
               attackMenu();
           }
           else
               alert("Those countries do not border!");
        }
    }
    else if (sessionStorage.gamePhase === 'pass1')
    {
    if (_country === _player)
        {
            if (Number(sessionStorage.getItem("countryReserves"+index)) > 1)
            {
                selectCountry(index);
                selectedCountry[0] = index;
                sessionStorage.gamePhase = 'pass2';
            }
            else
                alert("There is not any extra troops on that country to pass!");
        }
        else
            alert("that country does not belong to you!");
    }
    else if (sessionStorage.gamePhase === 'pass2')
    {
        if (_country === _player)
        {
            if (settings.passing === "one")
            {
                if (canFight(selectedCountry[0], index))
               {
                   selectCountry(index);
                   selectedCountry[1] = index;
                   passMenu();
               }
               else
                    alert("Those countries don't border!");
            }
            else
            {
                if (index !== selectedCountry[0]) // you can't pass troops to the same country you took them from
                {
                    selectCountry(index);
                    selectedCountry[1] = index;
                    passMenu();
                }
            }
        }
        else
            alert("That country does not belong to you!");
    }
}
function manuallySelectCountries(index)
{
    var owner = Number(sessionStorage.getItem("countryOwners"+index));
    
    if (owner === 15)
        {
           attack1Sound.currentTime = 0;
           attack1Sound.play();
           var _player = players[sessionStorage.turnIndex].color;

           document.getElementById("icon" + index).innerHTML = getIcon(_player, 1);
           sessionStorage.setItem("countryOwners"+index, _player);
            
           nextPlayer();
           show();
        }
        else
        {
            alert("That country is already taken!");
        }
    var x = 0;
    for (var i = 0; i<numOfCountries; i++)
    {
       var _owner = Number(sessionStorage.getItem("countryOwners"+i));
       if (_owner !== 15)
       {
           x++;
       }
    }
    if (x === numOfCountries){
        var countryStats = [];
        for (var j = 0; j < numOfCountries; j++)
       {
           sessionStorage.setItem("countryReserves"+j,1);
           countryStats[j] = {"orginialOwner": sessionStorage.getItem("countryOwners"+j), 
               "timesConquered": 0};
           document.getElementById("label" + j).innerHTML = 1;
       }
       sessionStorage.setItem("countryStats", JSON.stringify(countryStats));
       swapPlayers();
       sessionStorage.turnIndex = 0;
       sessionStorage.gamePhase = "initialReserves";
       asignReserves();
       show();
       
       var temp_reserves = sessionStorage.getItem("playerTempReserves"+sessionStorage.turnIndex);
       alert("All the countries have been choosen.\nEach player in turn will add troops. "
       + players[sessionStorage.turnIndex].name + ", start by adding " + temp_reserves + " troops.\n");
   } 
    
}
function startTurn()
{
    var _playerColor = players[sessionStorage.turnIndex].color;
    gameLog.round[round].push(  {"playerColor": _playerColor, "troopsGot": 0, 
        "afterDistributing": [], "afterAttacking": [], "afterPassing": []});
    sessionStorage.setItem("gameLog", JSON.stringify(gameLog));
    var _name = players[sessionStorage.turnIndex].name;
    
    sessionStorage.gamePhase = 'attack1';
    sessionStorage.reserves = "true";
    sessionStorage.turnInCards = "true";
    sessionStorage.setsOfCards = 0;
    if (troops1Sound.currentTime < troops1Sound.duration)
    {
        troops1Sound.currentTime = 0;
        troops1Sound.pause();
    }
    if (troops2Sound.currentTime < troops2Sound.duration)
    {
        troops2Sound.currentTime = 0;
        troops2Sound.pause();
    }
    startTurnSound.currentTime = 0;
    startTurnSound.play();
    if (players[sessionStorage.turnIndex].isComputer)
    {
        getReserves();
        computerTurnInCards();
        computerTurnInCards();
        computerReserves();
        saveGameLog("distribute");
        var C = false;
        while (!C && !gameOver){
            C = computerFindToAttack();
        }
        
        if (!gameOver)
        {
            computerPassTroops();
            showCards();
            nextPlayer();
            show();
            startTurn();
        }
    }
    else
    {
        if (settings.autoReserves === "true")
        {
            alert(_name + ", it is your turn. Distribute your troops and begin your turn for round " + round + ".");
            getReserves();
            checkCards();
        }
        else
        {
            alert(_name + ", it is your turn. Get your reserves and begin your turn for round " + round + ".");
            sessionStorage.alert = _name + ", it is your turn. Get your reserves and begin your turn for round " + round + ".";
            checkCards();
        }
    }
}
function getReserves()
{
    if (sessionStorage.reserves === "true")
    {   
        var _name = players[sessionStorage.turnIndex].name;
        var _countries = getCountries();
        var _countryPoints;
        if (_countries[players[sessionStorage.turnIndex].color] > 11) 
        {
            if (round === 1)
                _countryPoints = Math.floor(_countries[players[sessionStorage.turnIndex].color] / 4);
            else
                _countryPoints = Math.floor(_countries[players[sessionStorage.turnIndex].color] / 3);
        } 
        else
            _countryPoints = 3;
        var continents = reservesFromContinents();
        var _reserves = Number(sessionStorage.getItem("playerReserves"+sessionStorage.turnIndex));
        _reserves += _countryPoints + continents.reserves;
        sessionStorage.setItem("playerReserves"+sessionStorage.turnIndex, _reserves);
        var T = gameLog.round[round].length;
        gameLog.round[round][T-1].troopsGot = _reserves;
        sessionStorage.setItem("gameLog", JSON.stringify(gameLog));
        sessionStorage.alert = _name + ", it is your turn. Distribute your troops and begin your turn for round " + round + ".";
        sessionStorage.gamePhase = "addTroops";
        sessionStorage.reserves = "false";
        show();
        if (!players[sessionStorage.turnIndex].isComputer)
        {
            alert(_name + ", you have " + _countries[players[sessionStorage.turnIndex].color] + 
                " countries. This gives you " + _countryPoints + " troops.");
            if (continents.show !== "") {
            alert(_name+", you get "+continents.reserves+
                " troops for owning "+continents.num+" Regions:\n"+continents.show);
            }
            alert(_name + ", you have " +  _reserves + " troops to distribute.");
        }
    }
    else
        alert("You cannot get troops at this time!");
}
function reservesFromContinents()
{
    var _continents = (checkForContinent(players[sessionStorage.turnIndex].color));
    var output = {"reserves": 0, "show": "", "num": 0};
    if (_continents[0])
    {
        output.num++;
        output.show += "8 troops for owning Canada\n";
        output.reserves += 8;
    }
    if (_continents[1])
    {
        output.num++;
        output.show += "7 troops for owning Northeastern US\n";
        output.reserves += 7;
    }
    if (_continents[2])
    {
        output.num++;
        output.show += "4 troops for owning Southeastern US\n";
        output.reserves += 4;
    }
    if (_continents[3])
    {
        output.num++;
        output.show += "9 troops for owning Central US\n";
        output.reserves += 9;
    }
    if (_continents[4])
    {
        output.num++;
        output.show += "5 troops for owning Western US\n";
        output.reserves += 5;
    }
    if (_continents[5])
    {
        output.num++;
        output.show += "7 troops for owning Northern Mexico\n";
        output.reserves += 7;
    }
    if (_continents[6])
    {
        output.num++;
        output.show += "7 troops for owning Southern Mexico\n";
        output.reserves += 7;
    }
    if (_continents[7])
    {
        output.num++;
        output.show += "3 troops for owning Central America\n";
        output.reserves += 3;
    }
    if (_continents[8])
    {
        output.num++;
        output.show += "2 troops for owning the Caribbean\n";
        output.reserves += 2;
    }
    return output;
}
function attackMenu()
{
    var _attacker_name = players[sessionStorage.turnIndex].name;
    var _defender = findPlayerByColor(Number(sessionStorage.getItem("countryOwners"+selectedCountry[1])));
    var _defender_name = players[_defender].name;
    var _attacker_reserves = Number(sessionStorage.getItem("countryReserves"+selectedCountry[0]));
    var _defender_reserves = Number(sessionStorage.getItem("countryReserves"+selectedCountry[1]));
    var show = "";
    redDice = 0;
    whiteDice = 0;
    
    if (_attacker_reserves === 2 && _defender_reserves === 1)
    {
        redDice = 1;
        whiteDice = 1;
        return attack();
    }
    else
    { 
        document.getElementById("showBox").innerHTML = "<div id='popup'></div>";
        
        if (_attacker_reserves > 2)
        {
            if (players[sessionStorage.turnIndex].isComputer)
                redDice = 2;
            else
            {
                show += _attacker_name + ", please choose how many dice to roll: <br>\n\
                <input type='radio' name='redDice' id='red1'> one \n\
                <input type='radio' name='redDice' id='red2' checked> two ";
            }
        }
        if (_attacker_reserves > 3)
        {
            if (players[sessionStorage.turnIndex].isComputer)
                redDice = 3;
            else
                show += "<input type='radio' name='redDice' id='red3' checked> three";
        }
        else if (_attacker_reserves === 2)
            redDice = 1;
        if (_defender_reserves > 1)
        {
            if (players[_defender].isComputer)
                whiteDice = 2;
            else
            {
                show += "<br><br>" + _defender_name + ", please choose how many dice to roll: <br>\n\
                <input type='radio' name='whiteDice' id='white1'> one \n\
                <input type='radio' name='whiteDice' id='white2' checked> two ";
            }
        }
        else
            whiteDice = 1;
        if (show === "")
            return getDice();
        else
        {
            if (players[sessionStorage.turnIndex].isComputer)
            {
                document.getElementById("showBox").innerHTML = "";
                return computerWait();                
            }
            document.getElementById("popup").innerHTML = show + 
            "<br><br><button type='button' onclick='getDice()'>OK</button>\n\
            <button type='button' onclick='cancelAttack()'>Cancel</button></div>";
        }
    }
}
function computerWait()
{
    var attacker_name = players[sessionStorage.turnIndex].name;
    var defender = findPlayerByColor(Number(sessionStorage.getItem("countryOwners"+selectedCountry[1])));
    var defender_name = players[defender].name;
    var attackingCountry = countryInfo[selectedCountry[0]].name;
    var defendingCountry = countryInfo[selectedCountry[1]].name;
    if (confirm(attacker_name+" in "+attackingCountry+" is attacking "
      +defender_name+" in "+defendingCountry+".\n"+defender_name+
      ", how many dice do you want to roll?\nClick Ok for 2 dice or Cancel for 1 die"))
    {
        whiteDice = 2;
    }
    else
        whiteDice = 1;
    return attack();
}
function cancelAttack()
{      
    document.getElementById("showBox").innerHTML = '';
    deSelectCountry(selectedCountry[0]);
    deSelectCountry(selectedCountry[1]);
    selectedCountry = [];
    sessionStorage.gamePhase = "attack1";
}
function getDice()
{
    var _attacker_reserves = Number(sessionStorage.getItem("countryReserves"+selectedCountry[0]));
    var _defender = findPlayerByColor(Number(sessionStorage.getItem("countryOwners"+selectedCountry[1])));
     
    if (redDice === 0)
    {
        var red2 = document.getElementById("red2").checked;
        var red3 = false;
        if (_attacker_reserves >3){
        red3 = document.getElementById("red3").checked; 
        }
        if (red2) {
            redDice = 2;
        }
        else if (red3){
            redDice = 3;
        }
        else {
            redDice = 1;
        }
    }
    
    if (!(whiteDice === 1)) 
    {
        if (!players[_defender].isComputer)
        {
            var white2 = document.getElementById("white2").checked;
            if (white2){
                whiteDice = 2;
            }
            else {
                whiteDice = 1;
            }
        }
    }
    document.getElementById("showBox").innerHTML = "";
    return attack();
    
}
function attack()
{
    var W = whiteDice;
    var R = redDice;
    
    var diceW = [Math.floor(Math.random() * (6)+1), Math.floor(Math.random() * (6)+1)];
    var diceR = [Math.floor(Math.random() * (6)+1), Math.floor(Math.random() * (6)+1), Math.floor(Math.random() * (6)+1)];
    var white_high, white_low;
    var red_high, red_low;
    var whiteLose = 0;
    var redLose = 0;
    var tie = 0;
    var whiteName = players[findPlayerByColor(Number(sessionStorage.getItem("countryOwners"+selectedCountry[1])))].name;
    var redName = players[findPlayerByColor(Number(sessionStorage.getItem("countryOwners"+selectedCountry[0])))].name;
    var _attacker_reserves = Number(sessionStorage.getItem("countryReserves"+selectedCountry[0]));
    var _defender_reserves = Number(sessionStorage.getItem("countryReserves"+selectedCountry[1]));
    
    if (redName === "SuperPower")
    {
        if (_defender_reserves > 1)
        {
            redLose = 1;
            whiteLose = 2; 
            showDice(2,[5,4],3,[5,5,6]);
        }
        else {  
            whiteLose++; 
            showDice(2,[5,4],3,[5,5,6]); }
    }
    else if (whiteName === "SuperPower")
    {
        if (_attacker_reserves === 5)
            redDice = 2;
        else if (_attacker_reserves === 4)
            redDice = 1;
        if (_attacker_reserves > 3){
        redLose +=2;
        whiteLose++;
        showDice(2,[5,4],3,[5,5,6]); }
        else {  redLose++;    }
    }
    else
    {
        showDice(W, diceW, R, diceR);
        if (W === 2)
        {
            if (diceW[0] > diceW[1]){
                white_high = diceW[0];
                white_low = diceW[1];
            }
            else    {
                white_high = diceW[1];
                white_low = diceW[0];
            }
        }
        else
        {
            white_high = diceW[0];
            white_low = 0;
        }

        if (R === 1)
        {
            red_high = diceR[0];
            red_low = 0;
        }
        else if (R === 2)
        {
            if (diceR[0] > diceR[1]){
                red_high = diceR[0];
                red_low = diceR[1];
            }
            else 
            {
                red_high = diceR[1];
                red_low = diceR[0];
            }
        }
        else if (R === 3)
        {
            if (diceR[0] >= diceR[1] && diceR[0] > diceR[2]) //diceR[0] is the biggest, or tied for biggest
            {
                red_high = diceR[0];
                if (diceR[1] > diceR[2])
                    red_low = diceR[1];
                else 
                    red_low = diceR[2];
            }
            else if (diceR[1] > diceR[0] && diceR[1] > diceR[2]) //diceR[1] is biggest
            {
                red_high = diceR[1];
                if (diceR[0] > diceR[2])
                    red_low = diceR[0];
                else
                    red_low = diceR[2];
            }
            else
            {
                red_high = diceR[2];
                if (diceR[0] > diceR[1])
                    red_low = diceR[0];
                else
                    red_low = diceR[1];
            }
        }

        if (red_high > white_high)
            whiteLose++;
        else if (red_high === white_high)
        {
            if (settings.defenseWinsTie === "true")
                redLose++;
            else
                tie += 0.5;
        }
        else 
            redLose++;

        if (white_low === 0 || red_low === 0)    { }
        else if (red_low > white_low)
            whiteLose++;
        else if (red_low === white_low)
        {
            if (settings.defenseWinsTie === "true")
                redLose++;
            else
                tie += 0.5;
        }
        else
            redLose++;

        if (tie === 1)
        {
            whiteLose++;
            redLose++;
        }
        else if (tie > 0)
        {
            if (isOdd)
            { redLose++; isOdd = false;}
            else {whiteLose++; isOdd = true;}
        }
    }
    return finishAttack(whiteLose, redLose);
}
function finishAttack(whiteLose, redLose)
{
    if (attack2Sound.currentTime < attack2Sound.duration)
    {
        attack2Sound.currrentTime = 0;
        attack2Sound.pause();
    }
    attack3Sound.currentTime = 0;
    attack3Sound.play();
    var whiteName = players[findPlayerByColor(Number(sessionStorage.getItem("countryOwners"+selectedCountry[1])))].name;
    var redName = players[findPlayerByColor(Number(sessionStorage.getItem("countryOwners"+selectedCountry[0])))].name;
    var redReserves = Number(sessionStorage.getItem("countryReserves"+selectedCountry[0]));
    var whiteReserves = Number(sessionStorage.getItem("countryReserves"+selectedCountry[1]));
    deSelectCountry(selectedCountry[0]);
    deSelectCountry(selectedCountry[1]);
    redReserves -= redLose;
    whiteReserves -= whiteLose;
    playerInfo[Number(sessionStorage.getItem("countryOwners"+selectedCountry[0]))].troopsLost +=redLose;
    playerInfo[Number(sessionStorage.getItem("countryOwners"+selectedCountry[1]))].troopsLost +=whiteLose;
    if (!players[sessionStorage.turnIndex].isComputer)
        alert(redName + ", you lost " + redLose + " troops.\n" + whiteName + " lost " + whiteLose + " troops.");
    document.getElementById("label" + selectedCountry[0]).innerHTML = redReserves;
    sessionStorage.setItem("countryReserves"+selectedCountry[0], redReserves);
    sessionStorage.setItem("countryReserves"+selectedCountry[1], whiteReserves);
    sessionStorage.setItem("playerInfo", JSON.stringify(playerInfo));
    
    if (whiteReserves < 1)    {
        return conquerCountry();
    }
    else  {
        document.getElementById("label" + selectedCountry[1]).innerHTML = whiteReserves;
        sessionStorage.gamePhase = "attack1";
        //temp.push({"from": selectedCountry[0], "to": selectedCountry[1], "status": "failed"});
        return false;
    }
}
function conquerCountry()
{
    sessionStorage.setItem("countryOwners"+selectedCountry[1], sessionStorage.getItem("countryOwners"+selectedCountry[0]));
    var countryStats = JSON.parse(sessionStorage.countryStats);
    countryStats[selectedCountry[1]].timesConquered++;
    sessionStorage.setItem("countryStats", JSON.stringify(countryStats));
    deSelectCountry(selectedCountry[1]);
    document.getElementById("label" + selectedCountry[1]).innerHTML = "";
    sessionStorage.getCard = "true";
    var max = Number(sessionStorage.getItem("countryReserves"+selectedCountry[0]))-1;
    var min = redDice;
    if (players[sessionStorage.turnIndex].isComputer)
    {
        redDice = max;
        moveTroops();
        return true;
    }
    else if (min === max)
    {
        moveTroops();
    }
    else
    {
        var savedData = {"selected0": selectedCountry[0], "selected1": selectedCountry[1], "max": max, "min": min};
        sessionStorage.setItem("savedData", JSON.stringify(savedData));
        sessionStorage.gamePhase = "passMenu";
        var _show = "Select number of Troops to pass: <br>\n\
         <input type='number' id='troopsToPass' value='" + max + "' min='"+min+"' \n\
         max='"+max+"'><br><button type='button'\n\
         onclick='moveTroops()'>OK</button>";
        document.getElementById("showBox").innerHTML = "<div id='popup'></div>";
        document.getElementById('popup').innerHTML = _show;
     }
}
function passTroopsMenu() 
// displays pass Menu if page was refreshed after country was conquered but before troops were passed
{
    var savedData = JSON.parse(sessionStorage.savedData);
    selectedCountry[0] = savedData.selected0;
    selectedCountry[1] = savedData.selected1;
    var min = savedData.min;
    var max = savedData.max;
    redDice = min;
    var _show = "Select number of Troops to pass: <br>\n\
         <input type='number' id='troopsToPass' value='" + max + "' min='"+min+"' \n\
         max='"+max+"'><br><button type='button'\n\
         onclick='moveTroops()'>OK</button>";
        document.getElementById("showBox").innerHTML = "<div id='popup'></div>";
        document.getElementById('popup').innerHTML = _show;
}
function moveTroops()  //moves troops after conquering a country 
{
    var max = Number(sessionStorage.getItem("countryReserves"+selectedCountry[0]))-1;
    var min = redDice;
    var value;
    if (min === max)
        value = min;
    else
        value = Number(document.getElementById("troopsToPass").value);
    
    if (value > max || value < min || isNaN(value))
    {
        alert("That is an unallowed number of Troops to pass.\n\
\n Please enter a number between " + min + " and " + max + ".");
    }
    else
    {
        conquerSound.currentTime = 0;
        conquerSound.play();
        document.getElementById("showBox").innerHTML = "";
        var attackerReserves = Number(sessionStorage.getItem("countryReserves"+selectedCountry[0]));
        attackerReserves -= value;
        var defenderReserves = value;
        document.getElementById("label" + selectedCountry[1]).innerHTML = defenderReserves;
        document.getElementById("label" + selectedCountry[0]).innerHTML = attackerReserves;
        
        sessionStorage.setItem("countryReserves"+selectedCountry[0], attackerReserves);
        sessionStorage.setItem("countryReserves"+selectedCountry[1], defenderReserves);
        //temp.push({"from": selectedCountry[0], "to": selectedCountry[1], "status": "conquered"});
        saveGameLogSingle(selectedCountry);
        saveGameLog("attack");
        selectedCountry = [];
        whiteDice = 0;
        redDice = 0;
        sessionStorage.gamePhase = "attack1";
        attackLine = "";
        show();
        if (checkForEliminatedPlayers())
        {
            if (!gameOver)
                checkCards(); 
        }
    }
}
function setupPassing()   //sets up rules for passing troops at the end of the turn
{
    if (sessionStorage.gamePhase === "attack1" || sessionStorage.gamePhase === "addTroops") //the turn just ended
    {
        if (settings.passing === "one" || settings.passing === "oneAnywhere")
        {
            alert("Click a passing country, then click a country to pass to.");
            sessionStorage.gamePhase = "pass1";
        }
        else if (settings.passing === "threeAnywhere" || settings.passing === "unlimited")
        {
            alert("Click a passing country, then click a country to pass to.\nClick End Turn when you are done.");
            sessionStorage.gamePhase = "pass1";
            sessionStorage.numOfPasses = 0;
            numOfPasses = 0;
        }
    sessionStorage.alert = players[sessionStorage.turnIndex].name + 
    ", Click a passing country, then click a country to pass to.\nClick End Turn when you are done.";
    }
    else if (sessionStorage.gamePhase === "pass2") //troops were just passed
    {
        if (settings.passing === "one" || settings.passing === "oneAnywhere")
        {
            showCards();
            nextPlayer();
            show();
            startTurn();
            return;
        }
        else if (settings.passing === "threeAnywhere")
        {
            if (numOfPasses < 3)
            {
                sessionStorage.gamePhase = "pass1";
            }
            else
            {
                numOfPasses = 0;
                showCards();
                nextPlayer();
                show();
                startTurn();
                return;
            }
        }
        else if (settings.passing === "unlimited")
        {
            sessionStorage.gamePhase = "pass1";
        }
    }
    
}
function passMenu()     //menu for passing troops at the end of the turn
{
    var min = 1;
    var max = Number(sessionStorage.getItem("countryReserves"+selectedCountry[0]))-1;
    document.getElementById("showBox").innerHTML = "<div id='popup'></div>";
    document.getElementById('popup').innerHTML = "Select number of Troops to pass: <br>\n\
         <input type='number' id='troopsToPass' value='" + max + "' min='"+min+"' \n\
         max='"+max+"'><br><button type='button' onclick='passTroops()'>OK</button>\n\
        <button type='button' onclick='cancelPass()'>Cancel</button>";    
}
function cancelPass()
{
    document.getElementById('showBox').innerHTML = "";
    deSelectCountry(selectedCountry[0]);
    deSelectCountry(selectedCountry[1]);
    selectedCountry = [];
    sessionStorage.gamePhase = "pass1";
}
function passTroops()   //sets the passed troops at the end of the turn
{
    var min = 1;
    var max = Number(sessionStorage.getItem("countryReserves"+selectedCountry[0]))-1;
    var value = Number(document.getElementById("troopsToPass").value);
    
    if (value > max || value < min || isNaN(value))
    {
        alert("That is an unallowed number of Troops to pass.\n\
\n Please enter a number between " + min + " and " + max + ".");
    }
    else
    {
        document.getElementById("showBox").innerHTML = "";
        var attackerReserves = Number(sessionStorage.getItem("countryReserves"+selectedCountry[0]));
        var defenderReserves = Number(sessionStorage.getItem("countryReserves"+selectedCountry[1]));
        attackerReserves -= value;
        defenderReserves += value;
        document.getElementById("label" + selectedCountry[1]).innerHTML = defenderReserves;
        document.getElementById("label" + selectedCountry[0]).innerHTML = attackerReserves;
        
        sessionStorage.setItem("countryReserves"+selectedCountry[0], attackerReserves);
        sessionStorage.setItem("countryReserves"+selectedCountry[1], defenderReserves);
        
        deSelectCountry(selectedCountry[0]);
        deSelectCountry(selectedCountry[1]);
        selectedCountry = [];
        numOfPasses++;
        sessionStorage.numOfPasses = numOfPasses;
        setupPassing();
    }
}
function endTurn()
{
    if (sessionStorage.gamePhase === "attack1" || 
        sessionStorage.gamePhase === "attack2" || 
        sessionStorage.gamePhase === "addTroops")
    {
        attackLine = "";
        if (sessionStorage.gamePhase === "attack2"){
            deSelectCountry(selectedCountry[0]);
            selectedCountry = [];
            sessionStorage.gamePhase = "attack1";
        }
        var name = players[sessionStorage.turnIndex].name;
        if (confirm(name + ", do you want to end your Turn?"))
        {
            if (confirm("Do you want to pass troops from one country to another?"))
                setupPassing();
            else
            {
                showCards();
                nextPlayer();
                show();
                startTurn();
                return;
            }
        }
    }
    else if (sessionStorage.gamePhase === "pass1" || sessionStorage.gamePhase === "pass2")
    {
        if (sessionStorage.gamePhase === "pass2")
        {
            if (selectedCountry)
                deSelectCountry(selectedCountry[0]);
            selectedCountry = [];
        }
        numOfPasses = 0;
        sessionStorage.numOfPasses = numOfPasses;
        showCards();
        nextPlayer();
        show();
        startTurn();
    }
}
function showCards(index)
{
    var name = players[sessionStorage.turnIndex].name;
    var playerCards = players[sessionStorage.turnIndex].cards;
    if (index === "show")
    {
        if (playerCards.length === 0)
            alert(name + ", you do not have any cards!");
        else
        {
        alert(name + ", about to view cards, make sure no one is watching!");
            for (var i = 0; i<playerCards.length; i++)
            {
                document.getElementById('cardBox').innerHTML = 
            "<img src='pics/CNA ("+ (shuffledCards[playerCards[i]].number +1) + 
            ").png'><div id='words'>"+ shuffledCards[playerCards[i]].name +"</div>";
            alert("Card " + (i+1));
            }
            document.getElementById('cardBox').innerHTML = "";
        }
    }
    else
    {
        if (sessionStorage.getCard === "true")
        {
            playerCards.push(nextCard);
            nextCard++;
            sessionStorage.nextCard = nextCard;
            sessionStorage.setItem("players", JSON.stringify(players));
            sessionStorage.getCard = "false";
            viewCardsSound.currentTime = 0;
            viewCardsSound.play();
            if (!players[sessionStorage.turnIndex].isComputer)
            {
                alert(name + ", about to view cards, make sure no one is watching!");
                for (var i = 0; i<playerCards.length; i++)
                {
                    document.getElementById('cardBox').innerHTML = 
                "<img src='pics/CNA ("+ (shuffledCards[playerCards[i]].number +1) + 
                ").png'><div id='words'>"+ shuffledCards[playerCards[i]].name +"</div>";
                alert("Card " + (i+1));
                }
                document.getElementById('cardBox').innerHTML = "";
            }
        }
        else
        {
            if (!players[sessionStorage.turnIndex].isComputer)
                alert("No card can be drawn because no countries were conquered!");
        }
        saveGameLog("passing");
    }
    
}
function checkCards()
{
   var _cards = players[sessionStorage.turnIndex].cards.length;
   var _name = players[sessionStorage.turnIndex].name;
   sessionStorage.turnInCards = "true";
   if (settings.numOfCards !== "unlimited")
   {
        if (_cards >= Number(settings.numOfCards))
        {
            alert(_name + ", you must turn in cards now.");
            sessionStorage.mustTurnInCards = "true";
            sessionStorage.setsOfCards = 0;
            cardsMenu();
        }
   }
}
function turnInCards()
{
    if (sessionStorage.turnInCards === "true")
    {
        if (haveSetOfCards())
            cardsMenu();
        else
            alert("You do not have a set of cards to turn in!");
    }
    else
        alert("You can only turn in cards at the beginning of your turn or after eliminating a player!");
}
function cardsMenu()
{
    sessionStorage.gamePhase = "turnInCards";
    document.getElementById('showBox').innerHTML = 
            "<div id='cardMenu'>Select three cards to turn in:\n\
            <div id='cards'></div><button type='button' onclick='turnInCards2()'>OK</button>\n\
            <button type='button' onclick='cancelCards()'>Cancel</button></div>";
    var show = "";
    for (var i = 0; i<players[sessionStorage.turnIndex].cards.length; i++)
    {
        show += "<input type='checkbox' id='card"+i+"'>Card "+(i+1)+"      <button type='button' onclick='showCard("+i+")'>show</button><br>";
    }
    document.getElementById('cards').innerHTML = show;
}
function cancelCards()
{
    if (sessionStorage.mustTurnInCards === "true")
        alert("You cannot cancel. You MUST turn in your cards.");
    else
    {
        document.getElementById('showBox').innerHTML = "";
        document.getElementById('cardBox').innerHTML = "";
        sessionStorage.gamePhase = "addTroops";
    }
}
function showCard(index)
{
    var playerCards = players[sessionStorage.turnIndex].cards;    
    document.getElementById('cardBox').innerHTML = 
            "<img src='pics/CNA ("+ (shuffledCards[playerCards[index]].number +1) + 
            ").png'><div id='words'>"+ shuffledCards[playerCards[index]].name +"</div>";
}
function turnInCards2()
{
    var _cards = [];
    var _cardsToDelete = [];
    var x = 0;
    for (var i = 0; i<players[sessionStorage.turnIndex].cards.length; i++)
    {
        if (document.getElementById('card' + i).checked)
        {
            _cards[x] = players[sessionStorage.turnIndex].cards[i];
            _cardsToDelete[x] = i;
            x++;
        }
    }
    if (x === 3)
    {
        if (checkSetOfCards(_cards))
        {
            document.getElementById('showBox').innerHTML = "";
            document.getElementById('cardBox').innerHTML = "";

            for (var i=0; i<3; i++)
            {
                players[sessionStorage.turnIndex].cards[_cardsToDelete[i]] = "no";
            }
            var end = players[sessionStorage.turnIndex].cards.length;
            for (var i = 0; i<end; i++)
            {
                if (players[sessionStorage.turnIndex].cards[i]=== "no")
                {
                    players[sessionStorage.turnIndex].cards.splice(i,1);
                    i--;
                }
            }
            sessionStorage.setItem("players", JSON.stringify(players));
            turnInCards3(_cards);
        }
        else
            alert("Those cards don't match!");
    }
    else
        alert("You must select exactly three cards!");
}
function turnInCards3(_cards)
{
    var _name = players[sessionStorage.turnIndex].name;
    var card_names = [];
    for (var i = 0; i<3; i++)
    {
       card_names[i] = shuffledCards[_cards[i]].name;
    }
    for (var i = 0; i<3; i++)
    {
        for (var j = 0; j <numOfCountries; j++) 
        {
            if (countryInfo[j].name === card_names[i])
            {
                if (Number(sessionStorage.getItem("countryOwners"+j)) === players[sessionStorage.turnIndex].color) // the current player owns the current card
                {
                    if (!players[sessionStorage.turnIndex].isComputer)
                        alert("You get 2 troops for owning " + card_names[i]);
                    var R = Number(sessionStorage.getItem("countryReserves"+j));
                    R+=2;
                    sessionStorage.setItem("countryReserves"+j, R);
                    document.getElementById("label"+j).innerHTML = R;
                }
            }
        }
    }
    if (!players[sessionStorage.turnIndex].isComputer)
        alert(_name + ", you get " + sessionStorage.cardSetValue + " more troops to distribute.");
    sessionStorage.mustTurnInCards = "false";
    sessionStorage.gamePhase = "addTroops";
    var PR = Number(sessionStorage.getItem("playerReserves"+sessionStorage.turnIndex));
    PR += Number(sessionStorage.cardSetValue);
    sessionStorage.setItem("playerReserves"+sessionStorage.turnIndex, PR);
    upSetsOfCards();
    upCardSetValue();
    show();
    
}
function haveSetOfCards()
{
    var _cards = players[sessionStorage.turnIndex].cards;
    if (_cards.length <3)
        return false;
    else
       return checkSetOfCards(_cards);
    
}
function checkSetOfCards(_cards)
{
    var _card_values = [];
    for (var i = 0; i<_cards.length; i++)
    {
        _card_values[i] = shuffledCards[_cards[i]].case;
        if (_card_values[i] === 3) // if one is wild, you will have a match
            return true;
    }
    var man = 0, horse = 0, cannon = 0;
    for (var i = 0; i<_card_values.length; i++)
    {
        if (_card_values[i] === 0)
            man++;
        else if (_card_values[i] === 1)
            horse++;
        else if (_card_values[i] === 2)
            cannon++;
    }
    if (    (cannon >= 3 || man >= 3 || horse >= 3) ||
            (cannon >= 1 && man >= 1 && horse >= 1)      )
    {
        return true;
    }
    else
        return false;
}
function upCardSetValue()
{
    var _value = Number(sessionStorage.cardSetValue);
    if (_value < 12)
        _value += 2;
    else if (_value < 15)
        _value += 3;
    else
        _value +=5;
    sessionStorage.cardSetValue = _value;
}
function upSetsOfCards()
{
    var _sets = Number(sessionStorage.setsOfCards);
    _sets++;
    sessionStorage.setsOfCards = _sets;
    if (settings.numOfSets !== "unlimited")
    {
        if (_sets >= Number(settings.numOfSets))
            sessionStorage.turnInCards = "false";
    }
    
}
function checkForEliminatedPlayers()
{
    var _countries = getCountries();
    for (var i=0; i<players.length; i++)
    {
        if (_countries[players[i].color] === 0)
        {
            deletePlayer(i);
            return true;
        }
    }
    return false;
}
function deletePlayer(index)
{   
    var loserName = players[index].name;
    var winnerName = players[sessionStorage.turnIndex].name;
    var losersCards = players[index].cards;
    var winnersCards = players[sessionStorage.turnIndex].cards;
    var winnersColor = players[sessionStorage.turnIndex].color;
    for (var i = 0; i<losersCards.length; i++)
    {
        winnersCards.push(losersCards[i]);        
    }
    players[sessionStorage.turnIndex].cards = winnersCards;
    alert(winnerName + " just eliminated " + loserName);
    players.splice(index, 1); 
    if (players.length === 1)
    {
        gameOver = true;
        gameOverSound.currentTime = 0;
        gameOverSound.play();
        alert(winnerName + " just won the game");
        var _show = winnerName + " is the winner in " + round + " rounds.\nNumber of troops who died in this game:";
        for (var i = 1; i<9; i++)
        {
            _show += "\n" + playerInfo[i].name + ": " + playerInfo[i].troopsLost;
        }
        alert(_show);
        sessionStorage.gamePhase = "gameOver";
        sessionStorage.turnIndex = 0;
        showCountryStats();
        return;
    }
    sessionStorage.setItem("players", JSON.stringify(players));
            
    for (var i = 0; i<players.length; i++)
    {
        if (players[i].color === winnersColor)
            sessionStorage.turnIndex = i;
    }
}
                            // functions for getting and setting:
function getcolor(index)
{
    if (index === 1) 
        return "red";
    else if (index === 2) 
        return "blue";
    else if (index === 3) 
        return "green";
    else if (index === 4) 
        return "yellow";
    else if (index === 5) 
        return "orange";
    else if (index === 6) 
        return "purple";
    else if (index === 7) 
        return "brown";
    else if (index === 8) 
        return "white";
}
function getIcon(color, size)
{
    if (color === 1)
    {
        if (size === 0)
            return "<img src='pics/icon_red_small.png'>";
        else if (size === 1)
            return "<img src='pics/icon_red.png'>";
        else if (size === 2)
            return "<img src='pics/icon_red_sec.png'>";
    }
    else if (color === 2)
    {
        if (size === 0)
            return "<img src='pics/icon_blue_small.png'>";
        else if (size === 1)
            return  "<img src='pics/icon_blue.png'>";
        else if (size === 2)
            return "<img src='pics/icon_blue_sec.png'>";
    }
    else if (color === 3)
    {
        if (size === 0)
            return "<img src='pics/icon_green_small.png'>";
        else if (size === 1)
            return "<img src='pics/icon_green.png'>";
        else if (size === 2)
            return "<img src='pics/icon_green_sec.png'>";
    }
    else if (color === 4)
    {
        if (size === 0)
            return "<img src='pics/icon_yellow_small.png'>";
        else if (size === 1)
            return "<img src='pics/icon_yellow.png'>";
        else if (size === 2)
            return "<img src='pics/icon_yellow_sec.png'>";
    }
    else if (color === 5)
    {
        if (size === 0)
            return "<img src='pics/icon_orange_small.png'>";
        else if (size === 1)
            return  "<img src='pics/icon_orange.png'>";
        else if (size === 2)
            return "<img src='pics/icon_orange_sec.png'>";
    }
    else if (color === 6)
    {
        if (size === 0)
            return "<img src='pics/icon_purple_small.png'>";
        else if (size === 1)
            return  "<img src='pics/icon_purple.png'>";
        else if (size === 2)
            return "<img src='pics/icon_purple_sec.png'>";
    }
    else if (color === 7)
    {
        if (size === 0)
            return "<img src='pics/icon_brown_small.png'>";
        else if (size === 1)
            return  "<img src='pics/icon_brown.png'>";
        else if (size === 2)
            return "<img src='pics/icon_brown_sec.png'>";
    }
    else if (color === 8)
    {
        if (size === 0)
            return "<img src='pics/icon_white_small.png'>";
        else if (size === 1)
            return  "<img src='pics/icon_white.png'>";
        else if (size === 2)
            return "<img src='pics/icon_white_sec.png'>";
    }
}
function nextPlayer()
{
    var turnIndex = Number(sessionStorage.turnIndex);
    turnIndex++;
    if (turnIndex === players.length)
    {
        turnIndex = 0;
        if (sessionStorage.playStarted === "true")
        {
            round++;
            sessionStorage.round = round;
            gameLog.round[round] = [];
        }
    }
    sessionStorage.turnIndex = turnIndex;
}
function show()
{
    var name = players[sessionStorage.turnIndex].name;
    var reserves = sessionStorage.getItem("playerReserves"+[sessionStorage.turnIndex]);
    var _countries = getCountries();
    var _icon = getIcon(players[sessionStorage.turnIndex].color, 0);
    var _tempReserves = sessionStorage.getItem("playerTempReserves"+[sessionStorage.turnIndex]);
    var output;
    if (sessionStorage.gamePhase === "initialReserves")
    {
        output = "Player: " + _icon + " " + name + "<br>Countries: " + 
        _countries[players[sessionStorage.turnIndex].color] + "<br>Reserves: " + _tempReserves + 
        "<br>Total Reserves: " + reserves;
    }
    else
    {
        output = "Player: " + _icon + " " + name + "<br>Countries: " + 
        _countries[players[sessionStorage.turnIndex].color] + "<br>Reserves: " + reserves + "<br>" + attackLine;
    }
    document.getElementById("infoBox").innerHTML = output;
}
function getCountries()
{
    var _countries = [];
    for (var i = 1; i <9; i++)
    {
        _countries[i] = 0;
    }
    for (var i = 0; i < numOfCountries; i++)
    {
       for (var j = 1; j<9; j++)
       {
           if (Number(sessionStorage.getItem("countryOwners"+i)) === j)
        {
            _countries[j]++;
        }
       }
    }
    
    return _countries;
}
function shufflePlayers(_players)
{
        
    var start = Math.floor(Math.random() * (_players.length * 2));

    for (var i = 1; i <= start; i++)
    {
        var temp = _players[0];
        for (var j = 1; j < _players.length; j++)
        {
            _players[j - 1] = _players[j];
        }
        _players[_players.length - 1] = temp;
    }
    return _players;
}
function shiftPlayers(index)
{
    for (var i = 0; i<index; i++)
    {
        var temp = players[0];
        for (var j=1; j<players.length; j++)
        {
            players[j-1] = players[j];
        }
        players[players.length -1] = temp;
    }
    sessionStorage.setItem("players", JSON.stringify(players));
}
function swapPlayers()
{
    var end = players.length -1;
    
    var temp = players[0];      //swap the first and last for all sizes
    players[0] = players[end];
    players[end] = temp;
    
    if (end > 2)                //if it's bigger that 3, swap second and second to last
    {
        var temp = players[1];
        players[1] = players[end-1];
        players[end-1] = temp;
    }
    if (end === 5)      // if it's 6, swamp third and forth also
    {
        var temp = players[2];
        players[2] = players[3];
        players[3] = temp;
    }
    sessionStorage.setItem("players", JSON.stringify(players));
}
function shuffleArray(array)
{
    var ran = Math.floor(Math.random() * array.length);
    var temp = array[0];
    array[0] = array[ran];
    array[ran] = temp;
    for (var k = 0; k<3; k++)
    {
        for (var i = array.length - 1; i > 0; i--)
        {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    return array;
}
function setDefaultSettings()
{
    settings = {
        "autoReserves": "true",
        "defenseWinsTie": "false",
        "randomSelect": "true",
        "passing": "threeAnywhere",
        "numOfCards": "5",
        "numOfSets": "1"
    };
    window.localStorage.setItem("settings", JSON.stringify(settings));
}
function resetSettings()
{
    localStorage.removeItem("settings");
    settingsMenu();
}
function canFight(country1, country2)
{
    
    for (var i = 0; i<countryInfo[country1].borders.length; i++)
    {
        if (countryInfo[country1].borders[i] === country2){
           return true;
        }
    }
    return false;
}
function checkForContinent(_player)
{
    var _continents = [];
    for (var i=0; i<9; i++)
        _continents[i] = true;
    
    for (var i = 0; i<14;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            continue; 
        else
            _continents[0] = false;
        break;
    }
    for (var i = 14; i<26;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            continue; 
        else
            _continents[1] = false;
        break;
    }
    for (var i = 26; i<33;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            continue; 
        else
            _continents[2] = false;
        break;
    }
    for (var i = 33; i<48;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            continue; 
        else
            _continents[3] = false;
        break;
    }
    for (var i = 48; i<55;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            continue; 
        else
            _continents[4] = false;
        break;
    }
    for (var i = 55; i<67;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            continue; 
        else
            _continents[5] = false;
        break;
    }
    for (var i = 67; i<78;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            continue; 
        else
            _continents[6] = false;
        break;
    }
    for (var i = 78; i<85;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            continue; 
        else
            _continents[7] = false;
        break;
    }
    for (var i = 85; i<90;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            continue; 
        else
            _continents[8] = false;
        break;
    }
    
    return _continents;
} 
function selectCountry(_index)
{
    var _player = Number(sessionStorage.getItem("countryOwners"+_index));
    document.getElementById('icon' + _index).innerHTML = getIcon(_player, 2);
            
}
function deSelectCountry(_index)
{
    var _player = Number(sessionStorage.getItem("countryOwners"+_index));
   document.getElementById('icon' + _index).innerHTML = getIcon(_player, 1);
           
            
}
function findPlayerByColor(index)
{
    for (var i = 0; i < players.length; i++)
    {
        if (players[i].color === index)
        {
            return i;
        }
    }
}
function showDice(W, diceW, R, diceR)
{
    var output = "";
    for (var i = 0; i<R; i++)
    {
        switch (diceR[i])
        {
            case 1:
                output += "<img src='pics/dice_red1.png'>";
                break;
            case 2:
                output += "<img src='pics/dice_red2.png'>";
                break;
            case 3:
                output += "<img src='pics/dice_red3.png'>";
                break;
            case 4:
                output += "<img src='pics/dice_red4.png'>";
                break;
            case 5:
                output += "<img src='pics/dice_red5.png'>";
                break;
            case 6:
                output += "<img src='pics/dice_red6.png'>";
        }
         
    }
    for (var i = 0; i<W; i++)
    {
        switch (diceW[i])
        {
            case 1:
                output += "<img src='pics/dice_white1.png'>";
                break;
            case 2:
                output += "<img src='pics/dice_white2.png'>";
                break;
            case 3:
                output += "<img src='pics/dice_white3.png'>";
                break;
            case 4:
                output += "<img src='pics/dice_white4.png'>";
                break;
            case 5:
                output += "<img src='pics/dice_white5.png'>";
                break;
            case 6:
                output += "<img src='pics/dice_white6.png'>";
        }
         
    }
    document.getElementById("diceBox").innerHTML = output;
}
                    // functions for tools menu:
function tools()
{
    if (toolsOn)
    {
    document.getElementById('tools').innerHTML =  "";
    document.getElementById('toolsButton').innerHTML =  "Tools ►";
    toolsOn = false;
    }
    else
    {
        document.getElementById('tools').innerHTML = 
        "<button type='button' onclick='info()'>info</button><br>\n\
        <button type='button' onclick='showAllCards()'>See all Cards</button><br>\n\
        <button type='button' onclick='changePlayerNames()'>Change Player Names</button><br>\n\
        <button type='button' id='statButton' onclick='showCountryStats()'>Statistics</button><br>\n\
        <button type='button' id='labelButton' onclick='showLabels()'>Labels</button><br>\n\
        <button type='button' onclick='showLog()'>Game Log</button><br>";
        document.getElementById('toolsButton').innerHTML =  "Tools ▼";
        toolsOn = true;
    }
}
function showLabels()
{
     if (labelsOn)
    {
        for (var i = 0; i<numOfCountries; i++)
        {
            document.getElementById("label"+i).innerHTML = sessionStorage.getItem("countryReserves"+i);
        }
        document.getElementById("labelButton").innerHTML = "Labels";
        labelsOn = false;
    }
    else 
    {
        for (var i = 0; i<numOfCountries; i++)
        {
            document.getElementById("label"+i).innerHTML = i;
        }
        document.getElementById("labelButton").innerHTML = "Labels ◄";
        labelsOn = true;
    }
}
function showCountryStats()
{
    if (statsOn)
    {
        for (var i = 0; i<numOfCountries; i++)
        {
            document.getElementById("label"+i).innerHTML = sessionStorage.getItem("countryReserves"+i);
            document.getElementById("icon"+i).innerHTML = getIcon(Number(sessionStorage.getItem("countryOwners"+i)), 1);
        }
        document.getElementById("diceBox").innerHTML = "";
        document.getElementById("statButton").innerHTML = "Statistics";
        statsOn = false;
    }
    else 
    {
    var countryStats = JSON.parse(sessionStorage.countryStats);
        for (var i = 0; i<numOfCountries; i++)
        {
            document.getElementById("label"+i).innerHTML = countryStats[i].timesConquered;
            document.getElementById("icon"+i).innerHTML = getIcon(countryStats[i].originalOwner, 1);
        }
    document.getElementById("diceBox").innerHTML = "Key: the icon on each country is the color of the original owner. \n\
    <br>The number is the number of times the country was conquered.";
        document.getElementById("statButton").innerHTML = "Statistics ◄";
        statsOn = true;
    }
}
function info()
{
        var _show = "";
        var countries = getCountries();
         _show+= "It is round " + round + ".\nA set of cards is worth " + Number(sessionStorage.cardSetValue) + 
                 " troops.\n\n";
        
        for (var i = 0; i < players.length; i++) {
            _show += "   " + players[i].name + ":\n" +
                    countries[players[i].color] + " countries\t" + players[i].cards.length + " cards\n";
        }
        alert(_show);
    
}
function changePlayerNames()
{
    var _show = "";
    for (var i = 0; i<players.length; i++)
    {
        _show += "Player "+(i+1)+": <input type='text' id='name"+i+"' value='"+ players[i].name +"'><br><br>";
    }
    document.getElementById('showBox').innerHTML = "<div id='mainMenu'>" + _show +
    "<button type='button' onclick='document.getElementById(\"showBox\").innerHTML =\"\" '>Cancel</button>\n\
    <button type='button' onclick='changeNames()'>OK</button></div>";
}
function changeNames()
{
    for (var i= 0; i<players.length; i++)
    {
        players[i].name = document.getElementById("name"+i).value;
    }
    sessionStorage.setItem("players", JSON.stringify(players));
    document.getElementById('showBox').innerHTML = "";
    var _show = "";
    for (var i = 0; i < players.length; i++) {
        _show += "Player " + (i + 1) + ": " + players[i].name + " (" + getcolor(players[i].color) + ")\n";
    }
    alert(_show);
    show();
}
function showAllCards()
{
    for (var i = 0; i<numOfCountries +2; i++)
    {
    document.getElementById('cardBox').innerHTML = 
    "<img src='pics/CNA ("+ (i+1) + ").png' alt='Card "+i+"'><div id='words'>"+ sortedCards[i].name +"</div>";
    if (confirm("card "+(i+1))){document.getElementById('cardBox').innerHTML = "";}
    else {break; }
    
    }
    
    document.getElementById('cardBox').innerHTML = "";
}
function saveGameLog(index)
{
    if (index === "distribute")
    {
        for (var i=0; i<90; i++)
        {
            var reserves = Number(sessionStorage.getItem("countryReserves"+i));
            if (reserves !== gameLog.lastTime[i].reserves)
            {
                gameLog.round[round][sessionStorage.turnIndex].afterDistributing.
                        push({"index": i, "reserves": reserves});
                gameLog.lastTime[i].reserves = reserves;
            }
        }
        sessionStorage.setItem("gameLog", JSON.stringify(gameLog));
    }
    else if (index === "attack")
    {
        var place = gameLog.round[round][sessionStorage.turnIndex].afterAttacking.length-1;
        if (place === -1 ||
            gameLog.round[round][sessionStorage.turnIndex].afterAttacking[place].length !== 0)
            { 
                if (place === -1) 
                    place = 0;
                gameLog.round[round][sessionStorage.turnIndex].afterAttacking.push([]);
            }
        for (var i=0; i<90; i++)
        {
            var reserves = Number(sessionStorage.getItem("countryReserves"+i));
            var owner = Number(sessionStorage.getItem("countryOwners"+i));
            if (owner !== gameLog.lastTime[i].owner || 
                    reserves !== gameLog.lastTime[i].reserves)
            {
                gameLog.round[round][sessionStorage.turnIndex].afterAttacking[place].
                        push({"index": i, "reserves": reserves, "owner": owner});
                gameLog.lastTime[i] = {"owner": owner, "reserves": reserves};
            }
        }
        sessionStorage.setItem("gameLog", JSON.stringify(gameLog));
    }
    else if (index === "passing")
    {
        for (var i=0; i<90; i++)
        {
            var reserves = Number(sessionStorage.getItem("countryReserves"+i));
            if (reserves !== gameLog.lastTime[i].reserves)
            {
                gameLog.round[round][sessionStorage.turnIndex].afterPassing.
                        push({"index": i, "reserves": reserves});
                gameLog.lastTime[i].reserves = reserves;
            }
        }
        sessionStorage.setItem("gameLog", JSON.stringify(gameLog));
    }
}
function saveGameLogSingle(indexes)
{
   var place = gameLog.round[round][sessionStorage.turnIndex].afterAttacking.length-1;
        if (place === -1 ||
         gameLog.round[round][sessionStorage.turnIndex].afterAttacking[place].length !== 0)
            { 
                if (place === -1) 
                    place = 0;
                gameLog.round[round][sessionStorage.turnIndex].afterAttacking.push([]);
            }
     for (var i=0; i<2; i++)
    {
        var reserves = Number(sessionStorage.getItem("countryReserves"+indexes[i]));
        var owner = Number(sessionStorage.getItem("countryOwners"+indexes[i]));
        gameLog.round[round][sessionStorage.turnIndex].afterAttacking[place].
                    push({"index": indexes[i], "reserves": reserves, "owner": owner});
        gameLog.lastTime[indexes[i]] = {"owner": owner, "reserves": reserves};
    }
}
function showLog()
{
    for (var i=0; i<gameLog.round[0].length; i++)
    {
       document.getElementById("label"+i).innerHTML = gameLog.round[0][i].reserves;
       var size = 1;
       if (gameLog.round[0][i].reserves > 1)
           size = 2;
       document.getElementById("icon"+i).innerHTML = getIcon(gameLog.round[0][i].owner, size);
    }
    gameLog.lastTime = gameLog.round[0];
    document.getElementById('menuBox').innerHTML =  
        "<button type='button' onclick='lastRound()'>< Last Round</button>\n\
        <button type='button' onclick='logEntry(-1)'><< Back</button>\n\
        <button type='button' onclick='logEntry(1)'>Next >></button>\n\
        <button type='button' onclick='nextRound()'>Next Round ></button>\n\
        <button type='button' onclick='load()'>Done</button>";
    document.getElementById("infoBox").innerHTML = 
           "Beginning of Game<div style='font-weight: normal'>The highlighted territories \n\
            are where <br>reserves were placed at the beginning.</div>";
    toolsOn = false;
    temp = {"round": 1, "player": 0, "state": "distribute", "attackRound": 0};
   
}
function logEntry(direction)
{
    if (direction === -1)
    {
        if (moveLog(-1))
        {
            executeLogEntry(false);
            var indexes = getPreviousLog();
            selectChangedTerritories(indexes);
        }
    }
    else if (direction === 1)
    {
        if (isOutOfRange())
            document.getElementById("infoBox").innerHTML = "End of List";
        else
        {
            executeLogEntry(true);
            moveLog(1);
        }
        
    }
}
function isOutOfRange()
{
    if (temp.state === "distribute")
    {
        if (gameLog.round[temp.round][temp.player].afterDistributing.length === 0)
            return true;
    }
    else if (temp.state === "attack")
    {
        if (temp.attackRound >= gameLog.round[temp.round][temp.player].afterAttacking.length)
            return true;
    }
    else if (temp.state === "pass")
    {
        if (gameLog.round[temp.round][temp.player].afterPassing.length === 0)
            return true;
    }
    return false;
}
function moveLog(direction)
{
    if (temp.state === "distribute")
    {
        if (direction === 1)
        {
            temp.attackRound = 0;
            temp.state = "attack";
        }
        else if (direction === -1)
        {
            if (temp.round === 1 && temp.player === 0)
            {
                document.getElementById("infoBox").innerHTML = "Beginning of Game";
                return false;
            }
            temp.player--;
            if (temp.player < 0)
            {
                temp.round--;
                temp.player += gameLog.round[temp.round].length;
            }
            temp.state = "pass";
            return true;
        }
    }
    else if (temp.state === "attack")
    {
        if (direction === 1)
        {
            temp.attackRound++;
            if (temp.attackRound >= gameLog.round[temp.round][temp.player].
                    afterAttacking.length)
            {
                temp.attackRound = 0;
                temp.state = "pass";
            }
        }
        else if (direction === -1)
        {
            temp.attackRound--;
            if (temp.attackRound < 0)
            {
                temp.attackRound = 0;
                temp.state = "distribute";
            }
            return true;
        }
    }
    else if (temp.state === "pass")
    {
        if (direction === 1)
        {
            temp.state = "distribute";
            temp.player++;
            if (temp.player >= gameLog.round[temp.round].length)
            {
                temp.player = 0;
                temp.round++;
            }        
        }
        else if (direction === -1)
        {
            temp.state = "attack";
            temp.attackRound = gameLog.round[temp.round]
            [temp.player].afterAttacking.length-1;
            return true;
        }
    }
}
function executeLogEntry(show)
{
    if (temp.state === "distribute")
    {
        logShowRefresh();
        for (var i=0; i<gameLog.round[temp.round][temp.player].
                afterDistributing.length; i++)
        {
            var index = gameLog.round[temp.round][temp.player].afterDistributing[i].index;
            var reserves = gameLog.round[temp.round][temp.player].afterDistributing[i].reserves;
            var owner = gameLog.lastTime[index].owner;
            gameLog.round[temp.round][temp.player].afterDistributing[i].
                    reserves = gameLog.lastTime[index].reserves;
            gameLog.lastTime[index].reserves = reserves;
            selectHelper(index,reserves,owner,show);
        }
        showLogInfo("Distributed Troops", 0, temp.round);
    }
    else if (temp.state === "attack")
    {
        logShowRefresh();
        for (var i=0; i<gameLog.round[temp.round][temp.player].
                afterAttacking[temp.attackRound].length; i++)
        {
            var index = gameLog.round[temp.round][temp.player].afterAttacking[temp.attackRound][i].index;
            var reserves = gameLog.round[temp.round][temp.player].afterAttacking[temp.attackRound][i].reserves;
            var owner = gameLog.round[temp.round][temp.player].afterAttacking[temp.attackRound][i].owner;
            gameLog.round[temp.round][temp.player].afterAttacking[temp.attackRound]
                [i].reserves = gameLog.lastTime[index].reserves;
            gameLog.round[temp.round][temp.player].afterAttacking[temp.attackRound]
                [i].owner = gameLog.lastTime[index].owner;
            gameLog.lastTime[index].reserves = reserves;
            gameLog.lastTime[index].owner = owner;
            selectHelper(index,reserves,owner,show);
        }
        showLogInfo("Attacked", 0, temp.round);
    }
    else if (temp.state === "pass")
    {
        logShowRefresh();
        for (var i=0; i<gameLog.round[temp.round][temp.player].
                afterPassing.length; i++)
        {
            var index = gameLog.round[temp.round][temp.player].afterPassing[i].index;
            var reserves = gameLog.round[temp.round][temp.player].afterPassing[i].reserves;
            var owner = gameLog.lastTime[index].owner;
            gameLog.round[temp.round][temp.player].afterPassing[i].reserves =
                    gameLog.lastTime[index].reserves;
            gameLog.lastTime[index].reserves = reserves;
            selectHelper(index,reserves,owner,show);
        }
        showLogInfo("Passed Troops", 0, temp.round);
    }
}
function logShowRefresh()
{
    for (var i=0; i<gameLog.lastTime.length; i++)
   {
       document.getElementById("label"+i).innerHTML = gameLog.lastTime[i].reserves;
       document.getElementById("icon"+i).innerHTML = getIcon(gameLog.lastTime[i].owner, 1);
   }
}
function selectHelper(index, reserves, owner, show)
{
    var size = 1;
    if (show)
        size = 2;
    document.getElementById("label"+index).innerHTML = reserves;
    document.getElementById("icon"+index).innerHTML = getIcon(owner, size);
}
function selectChangedTerritories(indexes)
{
    if (indexes === "initial state")
        showLog();
    else
    {
        for (var i=0; i<indexes.length; i++)
        {
            var owner = gameLog.lastTime[indexes[i].index].owner;
            var reserves = gameLog.lastTime[indexes[i].index].reserves;
            document.getElementById("label"+indexes[i].index).innerHTML = reserves;
            document.getElementById("icon"+indexes[i].index).innerHTML = getIcon(owner, 2);
        }
    }
}
function showLogInfo(index, nameOffSet, round)
{
    var playerColor = gameLog.round[temp.round][temp.player].playerColor;
    if (nameOffSet !== 0)
        playerColor = nameOffSet;
    var name = playerInfo[playerColor].name;
    var reserves = gameLog.round[temp.round][temp.player].troopsGot;
    var _countries = getLogCountries();
    var _icon = getIcon(playerColor, 0);
    document.getElementById("infoBox").innerHTML = "Player: " + _icon + " " + name + 
        "<br>Countries: " +  _countries[playerColor] + "<br>Reserves: " + reserves + 
        "<br>Round: " + round +"<div style='font-weight: normal'>" + index + "</div>";
}
function getLogCountries()
{
    var _countries = [];
    for (var i = 1; i <9; i++)
        _countries[i] = 0;
    for (var i = 0; i<90; i++)
    {
       for (var j = 1; j<9; j++)
       {
           if (gameLog.lastTime[i].owner === j)
            _countries[j]++;
       }
    }
    return _countries;
}
function getPreviousLog()
{
    if (temp.state === "distribute")
    {
        if (temp.round === 1 && temp.player === 0)
            return "initial state";
        else
        {
            
            var lastPlayer = gameLog.round[temp.round-1].length-1;
            if (temp.player === 0)
            {
                showLogInfo("Passed Troops", gameLog.round[temp.round-1][lastPlayer].playerColor, temp.round-1);
                return gameLog.round[temp.round-1][lastPlayer].afterPassing;
            }
            else
            {
                showLogInfo("Passed Troops", gameLog.round[temp.round][temp.player-1].playerColor, temp.round);
                return gameLog.round[temp.round][temp.player-1].afterPassing;
            }
        }
    }
    else if (temp.state === "attack")
    {
        if (temp.attackRound === 0)
        {
            showLogInfo("Distributed Troops", 0, temp.round);
            return gameLog.round[temp.round][temp.player].afterDistributing;
        }
        else
            return gameLog.round[temp.round][temp.player].afterAttacking[temp.attackRound-1];
    }
    else if (temp.state === "pass")
    {
        showLogInfo("Attacked", 0, temp.round);
        var last = gameLog.round[temp.round][temp.player].afterAttacking.length-1;
        return gameLog.round[temp.round][temp.player].afterAttacking[last];
    }
}
function lastRound()
{
    document.getElementById("showBox").innerHTML =
                    "<div id='cardMenu'><strong>Running...</strong></div>";
    if (temp.round === 1)
    {
        setTimeout(function(){
            while (document.getElementById("infoBox").innerHTML !== "Beginning of Game")
                logEntry(-1);
            document.getElementById("showBox").innerHTML = "";
        },1);
        
    }
    else
    {
        setTimeout(function(){
            var round = temp.round;
            while (temp.round === round)
                logEntry(-1);
            document.getElementById("showBox").innerHTML = "";
        },1);
    }
}
function nextRound()
{
    document.getElementById("showBox").innerHTML =
                    "<div id='cardMenu'><strong>Running...</strong></div>";
    if (temp.round === gameLog.round.length-1)
    {
        setTimeout(function(){
            while (document.getElementById("infoBox").innerHTML !== "End of List")
                logEntry(1);
            document.getElementById("showBox").innerHTML = "";
        },1);
    }
    else
    {
        setTimeout(function(){
            var round = temp.round;
            while (temp.round === round)
                logEntry(1);
            logEntry(1);
            document.getElementById("showBox").innerHTML = "";
        },1);
    }
}
                     // functions to intialize the data:
function initializeCountryInfo()
{
        var _countryInfo = [];
        for (var i = 0; i<numOfCountries; i++)
        {
            _countryInfo[i] = {"name": "", "borders": []};
        }
        _countryInfo[0].name = "Alaska";
        _countryInfo[0].borders = [1,2];
        _countryInfo[1].name = "Yukon Territory";
        _countryInfo[1].borders = [0,2,3];
        _countryInfo[2].name = "British Columbia";
        _countryInfo[2].borders = [0,1,3,4,47,48,49]; //7
        _countryInfo[3].name = "Northwest Territories";
        _countryInfo[3].borders = [1,2,4,5,6]; //5
        _countryInfo[4].name = "Alberta";
        _countryInfo[4].borders = [2,3,5,47]; //4
        _countryInfo[5].name = "Saskatchewan";
        _countryInfo[5].borders = [3,4,6,7,38,47]; //6
        _countryInfo[6].name = "Nunavut";
        _countryInfo[6].borders = [3,5,7,9]; 
        _countryInfo[7].name = "Manitoba";
        _countryInfo[7].borders = [5,6,8,37,38]; //5
        _countryInfo[8].name = "Ontario";
        _countryInfo[8].borders = [7,9,16,23,37]; //5
        _countryInfo[9].name = "Quebec";
        _countryInfo[9].borders = [6,8,10,11,13,14,15,16]; //8
        _countryInfo[10].name = "Labrador";
        _countryInfo[10].borders = [9,11];
        _countryInfo[11].name = "Newfoundland";
        _countryInfo[11].borders = [9,10,12];
        _countryInfo[12].name = "Nova Scotia";
        _countryInfo[12].borders = [11,13];
        _countryInfo[13].name = "New Brunswick";
        _countryInfo[13].borders = [9,12,14];
        _countryInfo[14].name = "Maine";
        _countryInfo[14].borders = [9,13,15];
        _countryInfo[15].name = "Massachusetts";
        _countryInfo[15].borders = [9,14,16];
        _countryInfo[16].name = "New York";
        _countryInfo[16].borders = [8,9,15,17]; //4
        _countryInfo[17].name = "Pennsylvania";
        _countryInfo[17].borders = [16,18,19,20];
        _countryInfo[18].name = "Virginia";
        _countryInfo[18].borders = [17,19,21,26,27]; //5
        _countryInfo[19].name = "West Virginia";
        _countryInfo[19].borders = [17,18,20,21];
        _countryInfo[20].name = "Ohio";
        _countryInfo[20].borders = [17,19,21,22,23]; //5
        _countryInfo[21].name = "Kentucy";
        _countryInfo[21].borders = [18,19,20,22,25,26,35];//7
        _countryInfo[22].name = "Indiana";
        _countryInfo[22].borders = [20,21,23,25];
        _countryInfo[23].name = "Michigan";
        _countryInfo[23].borders = [8,20,22,24];
        _countryInfo[24].name = "Wisconsin";
        _countryInfo[24].borders = [23,25,36,37];
        _countryInfo[25].name = "Illinois";
        _countryInfo[25].borders = [21,22,24,35,36];//5
        _countryInfo[26].name = "Tennessee";
        _countryInfo[26].borders = [18,21,27,29,31,32,34,35];//8
        _countryInfo[27].name = "North Carolina";
        _countryInfo[27].borders = [18,26,28,29];
        _countryInfo[28].name = "South Carolina";
        _countryInfo[28].borders = [27,29];
        _countryInfo[29].name = "Georgia";
        _countryInfo[29].borders = [26,27,28,30,31];//5
        _countryInfo[30].name = "Florida";
        _countryInfo[30].borders = [29,31,86,87];
        _countryInfo[31].name = "Alabama";
        _countryInfo[31].borders = [26,29,30,32];
        _countryInfo[32].name = "Mississippi";
        _countryInfo[32].borders = [26,31,33,34];
        _countryInfo[33].name = "Louisiana";
        _countryInfo[33].borders = [32,34,43];
        _countryInfo[34].name = "Arkansas";
        _countryInfo[34].borders = [26,32,33,35,42,43];//6
        _countryInfo[35].name = "Missouri";
        _countryInfo[35].borders = [21,25,26,34,36,40,41,42];//8
        _countryInfo[36].name = "Iowa";
        _countryInfo[36].borders = [24,25,35,37,39,40];//6
        _countryInfo[37].name = "Minnesota";
        _countryInfo[37].borders = [7,8,24,36,38,39];//6
        _countryInfo[38].name = "North Dakota";
        _countryInfo[38].borders = [5,7,37,39,47];//5
        _countryInfo[39].name = "South Dakota";
        _countryInfo[39].borders = [36,37,38,40,46,47];//6
        _countryInfo[40].name = "Nebraska";
        _countryInfo[40].borders = [35,36,39,41,45,46];//6
        _countryInfo[41].name = "Kansas";
        _countryInfo[41].borders = [35,40,42,45];
        _countryInfo[42].name = "Oklahoma";
        _countryInfo[42].borders = [34,35,41,43,44,45];//6
        _countryInfo[43].name = "Texas";
        _countryInfo[43].borders = [33,34,42,44,59,60,66];//7
        _countryInfo[44].name = "New Mexico";
        _countryInfo[44].borders = [42,43,45,54,56,59];//6
        _countryInfo[45].name = "Colorado";
        _countryInfo[45].borders = [40,41,42,44,46,53];//6
        _countryInfo[46].name = "Wyoming";
        _countryInfo[46].borders = [39,40,45,47,48,53];//6
        _countryInfo[47].name = "Montana";
        _countryInfo[47].borders = [2,4,5,38,39,46,48];//7
        _countryInfo[48].name = "Idaho";
        _countryInfo[48].borders = [2,46,47,49,50,52,53];//7
        _countryInfo[49].name = "Washington";
        _countryInfo[49].borders = [2,48,50];
        _countryInfo[50].name = "Oregon";
        _countryInfo[50].borders = [48,49,51,52];
        _countryInfo[51].name = "California";
        _countryInfo[51].borders = [50,52,54,55];
        _countryInfo[52].name = "Nevada";
        _countryInfo[52].borders = [48,50,51,53,54];//5
        _countryInfo[53].name = "Utah";
        _countryInfo[53].borders = [45,46,48,52,54];//5
        _countryInfo[54].name = "Arizona";
        _countryInfo[54].borders = [44,51,52,53,55,56];//6
        _countryInfo[55].name = "Baja California";
        _countryInfo[55].borders = [51,54,56,57];
        _countryInfo[56].name = "Sonora";
        _countryInfo[56].borders = [44,54,55,57,58,59];//6
        _countryInfo[57].name = "Baja Calif. de Sur";
        _countryInfo[57].borders = [55,56,58];
        _countryInfo[58].name = "Sinaloa";
        _countryInfo[58].borders = [56,57,59,61,62];//5
        _countryInfo[59].name = "Chihuahua";
        _countryInfo[59].borders = [43,44,56,58,60,61];//6
        _countryInfo[60].name = "Coahuila";
        _countryInfo[60].borders = [43,59,61,63,65,66];//6
        _countryInfo[61].name = "Durango";
        _countryInfo[61].borders = [58,59,60,62,63];//5
        _countryInfo[62].name = "Nayarit";
        _countryInfo[62].borders = [58,61,63,70];
        _countryInfo[63].name = "Zacatecas";
        _countryInfo[63].borders = [60,61,62,64,65,69,70];//7
        _countryInfo[64].name = "San Luis Potosi";
        _countryInfo[64].borders = [63,65,66,67,68,69];
        _countryInfo[65].name = "Nuevo Leon";
        _countryInfo[65].borders = [60,63,64,66];
        _countryInfo[66].name = "Tamaulipas";
        _countryInfo[66].borders = [43,60,64,65,67];
        _countryInfo[67].name = "Veracruz";
        _countryInfo[67].borders = [64,66,68,73,74,75];//6
        _countryInfo[68].name = "Puebla";
        _countryInfo[68].borders = [64,67,69,71,72,73];
        _countryInfo[69].name = "Guanajuato";
        _countryInfo[69].borders = [63,64,68,70,71];
        _countryInfo[70].name = "Jalisco";
        _countryInfo[70].borders = [62,63,69,71];
        _countryInfo[71].name = "Michoacan";
        _countryInfo[71].borders = [68,69,70,72];
        _countryInfo[72].name = "Guerrero";
        _countryInfo[72].borders = [68,71,73];
        _countryInfo[73].name = "Oaxaca";
        _countryInfo[73].borders = [67,68,72,74];
        _countryInfo[74].name = "Chiapas";
        _countryInfo[74].borders = [67,73,75,79];
        _countryInfo[75].name = "Campeche";
        _countryInfo[75].borders = [67,74,76,77,79];
        _countryInfo[76].name = "Yucatan";
        _countryInfo[76].borders = [75,77];
        _countryInfo[77].name = "Quintana Roo";
        _countryInfo[77].borders = [75,76,78,79,86];
        _countryInfo[78].name = "Belize";
        _countryInfo[78].borders = [77,79,81];
        _countryInfo[79].name = "Guatemala";
        _countryInfo[79].borders = [74,75,77,78,80,81];
        _countryInfo[80].name = "El Salvador";
        _countryInfo[80].borders = [79,81,82];
        _countryInfo[81].name = "Honduras";
        _countryInfo[81].borders = [78,79,80,82];
        _countryInfo[82].name = "Nicaragua";
        _countryInfo[82].borders = [80,81,83];
        _countryInfo[83].name = "Costa Rica";
        _countryInfo[83].borders = [82,84];
        _countryInfo[84].name = "Panama";
        _countryInfo[84].borders = [83];
        _countryInfo[85].name = "Jamaica";
        _countryInfo[85].borders = [86,88];
        _countryInfo[86].name = "Cuba";
        _countryInfo[86].borders = [30,77,85,87,88];
        _countryInfo[87].name = "Bahamas";
        _countryInfo[87].borders = [30,86,89];
        _countryInfo[88].name = "Haiti";
        _countryInfo[88].borders = [85,86,89];
        _countryInfo[89].name = "Dominican Republic";
        _countryInfo[89].borders = [87,88];
        
        return _countryInfo;
    
}
function initializeCards()
{
    var _cards = [];
    for (var i = 0; i<numOfCountries; i++)
    {
        _cards[i] = {"case": 0, "name": countryInfo[i].name, "number": i};
        if (i % 3 === 2)
            _cards[i].case = 2;
        else if (i % 3 === 1)
            _cards[i].case = 1;
        else
            _cards[i].case = 0;
    }
    _cards[90] = {"case": 3, "name": "Wild", "number": 90};
    _cards[91] = {"case": 3, "name": "Wild", "number": 91};
    return _cards;
}
function initializeGameLog()
{
    gameLog.round = [ [],[] ];
    for (var i=0; i<90; i++)
    {
        var reserves = Number(sessionStorage.getItem("countryReserves"+i));
        var owner = Number(sessionStorage.getItem("countryOwners"+i));
        gameLog.round[0].push({"owner": owner, "reserves": reserves});
        gameLog.lastTime.push({"owner": owner, "reserves": reserves});
    }
    sessionStorage.setItem("gameLog", JSON.stringify(gameLog));
}
                        // functions for computer players:
function myCountriesWithEnemies()
{
    var _player = players[sessionStorage.turnIndex].color;
    var countries = getCountryIndexes(_player);
    var myCounWithEnem = [];
    var x =0;
    for (var i=0; i<countries.length; i++)
    {
        for (var j = 0; j<countryInfo[countries[i]].borders.length; j++)
        {
            if (Number(sessionStorage.getItem("countryOwners"+ countryInfo[countries[i]].borders[j])) !== _player)
            {
            myCounWithEnem[x] = countries[i];
            x++;
            break;
            }
        }
    }
    return myCounWithEnem;
}
function getCountryIndexes(owner)
{
    var indexes = [];
    var x=0;
    for (var i = 0; i < numOfCountries; i++)
    {
       if (Number(sessionStorage.getItem("countryOwners"+i)) === owner)
        {
            indexes[x] = i;
            x++;
        }
    }
    
    return indexes;
}
function removeDuplicates(array)
{
    for (var i=1; i<array.length; i++)
    {
        for (var j= 0; j<i; j++)
        {
            if (array[i] === array[j])
            {
                array.splice(i, 1);
                i--;
            }
        }
    }
    return array;
}
function strengthByContinent()
{
    var _continents = [0,0,0,0,0,0,0,0,0];
    var _player = players[sessionStorage.turnIndex].color;
    for (var i = 0; i<14;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[0]+= (Number(sessionStorage.getItem("countryReserves"+i))-1);
    }
    for (var i = 14; i<26;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[1]+= (Number(sessionStorage.getItem("countryReserves"+i))-1);
    }
    for (var i = 26; i<33;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[2]+= (Number(sessionStorage.getItem("countryReserves"+i))-1);
    }
    for (var i = 33; i<48;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[3]+= (Number(sessionStorage.getItem("countryReserves"+i))-1);
    }
    for (var i = 48; i<55;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[4]+= (Number(sessionStorage.getItem("countryReserves"+i))-1);
    }
    for (var i = 55; i<67;i++)
    {
       if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[5]+= (Number(sessionStorage.getItem("countryReserves"+i))-1);
    }
    for (var i = 67; i<78;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[6]+= (Number(sessionStorage.getItem("countryReserves"+i))-1);
    }
    for (var i = 78; i<85;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[7]+= (Number(sessionStorage.getItem("countryReserves"+i))-1);
    }
    for (var i = 85; i<90;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[8]+= (Number(sessionStorage.getItem("countryReserves"+i))-1);
    }
    
    return _continents;
}
function countriesPerContinent()
{
    var _continents = [0,0,0,0,0,0,0,0,0];
    var sum = 0;
    var _player = players[sessionStorage.turnIndex].color;
    for (var i = 0; i<14;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[0]++; sum++;
    }
    for (var i = 14; i<26;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[1]++; sum++;
    }
    for (var i = 26; i<33;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[2]++; sum++;
    }
    for (var i = 33; i<48;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[3]++; sum++;
    }
    for (var i = 48; i<55;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[4]++; sum++;
    }
    for (var i = 55; i<67;i++)
    {
       if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[5]++; sum++;
    }
    for (var i = 67; i<78;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[6]++; sum++;
    }
    for (var i = 78; i<85;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[7]++; sum++;
    }
    for (var i = 85; i<90;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            _continents[8]++; sum++;
    }
    _continents[9] = sum;
    
    return _continents;
}
function enemyStrengthByContinent()
{
    var enemiesStrength = [0,0,0,0,0,0,0,0,0];
    var _player = players[sessionStorage.turnIndex].color;
    for (var i = 0; i<14;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
           enemiesStrength[0] += (Number(sessionStorage.getItem("countryReserves"+i))-1);
        }
    }
    for (var i = 14; i<26;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemiesStrength[1] += (Number(sessionStorage.getItem("countryReserves"+i))-1);
        }
    }
    for (var i = 26; i<33;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemiesStrength[2] += (Number(sessionStorage.getItem("countryReserves"+i))-1);
        }
    }
    for (var i = 33; i<48;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemiesStrength[3] += (Number(sessionStorage.getItem("countryReserves"+i))-1);
        }
    }
    for (var i = 48; i<55;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemiesStrength[4] += (Number(sessionStorage.getItem("countryReserves"+i))-1);
        }
    }
    for (var i = 55; i<67;i++)
    {
      if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemiesStrength[5] += (Number(sessionStorage.getItem("countryReserves"+i))-1);
        }
    }
    for (var i = 67; i<78;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemiesStrength[6] += (Number(sessionStorage.getItem("countryReserves"+i))-1);
        }
    }
    for (var i = 78; i<85;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemiesStrength[7] += (Number(sessionStorage.getItem("countryReserves"+i))-1);
        }
    }
    for (var i = 85; i<90;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemiesStrength[8] += (Number(sessionStorage.getItem("countryReserves"+i))-1);
        }
    }
    
    return enemiesStrength;
}
function enemiesPerContinent()
{
    var enemies = [0,0,0,0,0,0,0,0,0];
    var _player = players[sessionStorage.turnIndex].color;
    for (var i = 0; i<14;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemies[0]++; }
    }
    for (var i = 14; i<26;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemies[1]++;}
    }
    for (var i = 26; i<33;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemies[2]++;}
    }
    for (var i = 33; i<48;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemies[3]++;}
    }
    for (var i = 48; i<55;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemies[4]++;}
    }
    for (var i = 55; i<67;i++)
    {
      if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemies[5]++;}
    }
    for (var i = 67; i<78;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemies[6]++;}
    }
    for (var i = 78; i<85;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemies[7]++;}
    }
    for (var i = 85; i<90;i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) !== _player) {
            enemies[8]++;}
    }
    
    return enemies;
}
function sortArray(array)
{
    var output = [];
    for (var i = 0; i<array.length; i++)
    {
        var high = 0;
        for (var j=0; j<array.length; j++)
        {
            if (array[j] > array[high])
                high = j;
        }
        if (array[high] === 0)
            output[i] = "no";
        else
            output[i] = high;
        array[high] = -10;
    }
    for (var i = 0; i<output.length; i++)
    {
        if (output[i] === "no")
        {
            output.splice(i, 1);
            i--;
        }
    }
    return output;
}
function checkIfContinentIsSufficiant(index)
{
    var _player = players[sessionStorage.turnIndex].color;
    var key = getContinentKeys(index);
    var myStrength = 0;
    var enemyStrength = 0;
    for (var i = key[0]; i<key[1]; i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+i)) === _player)
            myStrength += (Number(sessionStorage.getItem("countryReserves"+i))-1);
        else
            enemyStrength += Number(sessionStorage.getItem("countryReserves"+i));
    }
    if (myStrength > (enemyStrength * 1.5)+5)
        return true;
    else 
        return false;
}
function getContinentKeys(continent)
{
    var output = [];
    if (continent === 0)
        output = [0, 14];
    else if (continent === 1)
        output = [14, 26];
    else if (continent === 2)
        output = [26,33];
    else if (continent === 3)
        output = [33,48];
    else if (continent === 4)
        output = [48,55];
    else if (continent === 5)
        output = [55,67];
    else if (continent === 6)
        output = [67,78];
    else if (continent === 7)
        output = [78,85];
    else if (continent === 8)
        output = [85,90];
    
    return output;
}
function inSameContinent(first, second)
{
    if (first >= 0 && second >=0 && first <14 && second <14 ||
        first >= 14 && second >=14 && first <26 && second <26 ||
        first >= 26 && second >=26 && first <33 && second <33 ||
        first >= 33 && second >=33 && first <48 && second <48 ||
        first >= 48 && second >=48 && first <55 && second <55 ||
        first >= 55 && second >=55 && first <67 && second <67 ||
        first >= 67 && second >=67 && first <78 && second <78 ||
        first >= 78 && second >=78 && first <85 && second <85 ||
        first >= 85 && second >=85 && first <90 && second <90 )
        return true;
    else
        return false;
}
function distributeComputerInitialReserves(index)
{
    var con = findEnemiesByContinent(index);
    var _playerTempReserves = Number(sessionStorage.getItem("playerTempReserves"+sessionStorage.turnIndex));
    var _playerReserves = Number(sessionStorage.getItem("playerReserves"+sessionStorage.turnIndex));
    
    for (var i=0; i<con.length; i++)
    {
        if (con[i].enemies < 2){
            con.splice(i, 1);
            i--;
        }
    }
    var y = 0;
    for (var i=0; i<con.length; i++)
    {
        if (Number(sessionStorage.getItem("countryReserves"+con[i].index)) < 
                Number(sessionStorage.getItem("countryReserves"+con[0].index))) {
            y = i;
            break;
        }
    }
    for (var i = y; _playerTempReserves>0; i++)
    {
        if (i >= con.length)
            i=0;
      _playerReserves--;
      _playerTempReserves--;
      var _countryReserves = Number(sessionStorage.getItem("countryReserves"+con[i].index));
      _countryReserves++;
      sessionStorage.setItem("countryReserves"+con[i].index, _countryReserves);
     document.getElementById("label" + con[i].index).innerHTML = _countryReserves;
    }
    sessionStorage.setItem("playerReserves"+sessionStorage.turnIndex, _playerReserves);
    sessionStorage.setItem("playerTempReserves"+sessionStorage.turnIndex, _playerTempReserves);
    assignTempReserves();
}
function findEnemiesByContinent(index)
{
    var key = getContinentKeys(index);
    var _player = players[sessionStorage.turnIndex].color;
    var con = [];
    var x = 0;
    for (var i = key[0]; i<key[1]; i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+ i)) === _player)
        {
            con[x] = {"index": i, "enemies": 0};
            for (var j = 0; j<countryInfo[i].borders.length; j++)
            {
                if (Number(sessionStorage.getItem("countryOwners"+ countryInfo[i].borders[j])) !== _player)
                {
                con[x].enemies++;
                }
            }
            x++;
        }
    } 
    return con;
}
function numOfEnemiesAllMyCountries()
{
    var output = [];
    for (var i=0; i<9; i++)
    {
        var x = findEnemiesByContinent(i);
        if (x.length !== 0)
        {
            for (var j=0; j<x.length; j++)
            {
                output.push(x[j]);
            }
        }
    }
    return output;
}
function distributeComputerTroops(index)
{
    var con = findEnemiesByContinent(index);
    var _playerReserves = Number(sessionStorage.getItem("playerReserves"+sessionStorage.turnIndex));
    
    for (var i=0; i<con.length; i++)
    {
        if (con[i].enemies === 1)
        {
            var _countryReserves = Number(sessionStorage.getItem("countryReserves"+con[i].index));
            if (_countryReserves < 3 && _playerReserves > 0)
            {
                _playerReserves--;
                _countryReserves++;
                sessionStorage.setItem("countryReserves"+con[i].index, _countryReserves);
                document.getElementById("label" + con[i].index).innerHTML = _countryReserves;
            }
           con.splice(i, 1);
           i--;     
        }
        else if (con[i].enemies === 0){
            con.splice(i, 1);
            i--;
        }
    }
    var y = 0;
    for (var i=0; i<con.length; i++)
    {
        if (Number(sessionStorage.getItem("countryReserves"+con[i].index)) < 
                Number(sessionStorage.getItem("countryReserves"+con[0].index))) {
            y = i;
            break;
        }
    }
    for (var i = y; _playerReserves>0; i++)
    { 
        if (i >= con.length)
        {
             if (!checkIfContinentIsSufficiant(index))
             {
                 sessionStorage.setItem("playerReserves"+sessionStorage.turnIndex, _playerReserves);
                 return;
             }
             else
                i=0;
        }
      _playerReserves--;
      var _countryReserves = Number(sessionStorage.getItem("countryReserves"+con[i].index));
      _countryReserves++;
      sessionStorage.setItem("countryReserves"+con[i].index, _countryReserves);
     document.getElementById("label" + con[i].index).innerHTML = _countryReserves;
    }
    sessionStorage.setItem("playerReserves"+sessionStorage.turnIndex, _playerReserves);
    sessionStorage.withinContinent = "true";
}
function computerFindToAttack()
{
    var myCounWithEnem = removeDuplicates(myCountriesWithEnemies());
     var _player = players[sessionStorage.turnIndex].color;
     for (var i=0; i<myCounWithEnem.length; i++)
     {
         for (var j=0; j<countryInfo[myCounWithEnem[i]].borders.length; j++)
         {
            var _reserves = Number(sessionStorage.getItem("countryReserves"+myCounWithEnem[i]));
            var _owner = Number(sessionStorage.getItem("countryOwners"+countryInfo[myCounWithEnem[i]].borders[j]));
            
            if ( _owner !== _player) 
            {
                if (    (sessionStorage.withinContinent === "true" &&
   inSameContinent(myCounWithEnem[i], countryInfo[myCounWithEnem[i]].borders[j]))
            || sessionStorage.withinContinent === "false")
             {
                 if (_reserves > 2)
                 {
                     if (computerAttack(myCounWithEnem[i], countryInfo[myCounWithEnem[i]].borders[j]))
                         return false;
                     else
                         j--;
                 }
             }
            }
         }
     }
  return true;
}
function computerAttack(index1, index2)
{
    selectCountry(index1);
    selectCountry(index2);
    selectedCountry[0] = index1;
    selectedCountry[1] = index2;
    sessionStorage.gamePhase = "attack3";
    return attackMenu();
}
function pickContinent()
{
    var myStrength = strengthByContinent();
    var enemyStrength = enemyStrengthByContinent(); 
    var myCountries = countriesPerContinent();
    var enemyCountries = enemiesPerContinent();
    for (var i=0; i<9; i++)
    {
        if (enemyCountries[i] > 0)
            enemyCountries[i] = 1/enemyCountries[i];
        else
            enemyCountries[i] = 2;
    }
    
    for (var i=0; i<9; i++)
    {
        myCountries[i] /= myCountries[9];
    }
    var show = [];
    for (var i =0; i<9; i++)
    {
       show[i] = (myCountries[i] * enemyCountries[i]);
    }
    show[0] *= 10;
    show[1] *= 6;
    show[2] *= 16;
    show[3] *= 4;
    show[4] *= 10;
    show[5] *= 6;
    show[6] *= 6;
    show[7] *= 22;
    show[8] *= 19;
    for (var i =0; i<9; i++)
    {
        if (show[i] !== 0)
            show[i] += ((myStrength[i]/20) - (enemyStrength[i] /20));
    }
    return sortArray(show);
}
function computerInitialReserves()
{
    var output = pickContinent();
    
    for (var i=0; i<output.length; i++)
    {
        if (!checkIfContinentIsSufficiant(output[i]))
        {
             distributeComputerInitialReserves(output[i]);
             return;
        }
    }    
}
function whichContinents()
{
    var _player = players[sessionStorage.turnIndex].color;
    var con = checkForContinent(_player);
    var output = [];
    for (var i=0; i<9; i++)
    {
        if (con[i])
            output.push(i);
    }
    if (output.length === 0)
        return false;
    else
        return output;
}
function enemyStrengthByCountry(country)
{
    var output = 0;
    var con = countryInfo[country];
    var _player = players[sessionStorage.turnIndex].color;
    var enemies = [];
    for (var i = 0; i<con.borders.length; i++)
    {
        if (Number(sessionStorage.getItem("countryOwners"+con.borders[i])) !== _player)
           enemies.push(Number(sessionStorage.getItem("countryReserves"+con.borders[i])));
    }
    if (enemies.length < 2)
    {
        output = enemies[0];
    }
    else
    {
        var x=0, y=0;
        for (var i=0; i<enemies.length; i++)
        {
            if (enemies[i] > enemies[x])
                x = i;
        }
        for (var i=0; i<enemies.length; i++)
        {
            if (i !== x)
                y+= enemies[i];
        }
        output = enemies[x] + (y/4);
    }
    return output;
}
function distributeTroopsByIndex(indexArray, num)
{
    var _playerReserves = Number(sessionStorage.getItem("playerReserves"+sessionStorage.turnIndex));
    var y = 0;
    for (var i=0; i<indexArray.length; i++)
    {
        if (Number(sessionStorage.getItem("countryReserves"+indexArray[i])) < 
                Number(sessionStorage.getItem("countryReserves"+indexArray[0]))) {
            y = i;
            break;
        }
    }
    var x = 0;
    for (var i=y; x<indexArray.length; i++)
    {
        if (i >= indexArray.length)
        {
            i = 0;
            x = 0; 
        }
        var _countryReserves = Number(sessionStorage.getItem("countryReserves"+indexArray[i]));
        if (enemyStrengthByCountry(indexArray[i])> (_countryReserves-num) && _playerReserves > 0)
        {
            _playerReserves--;
            _countryReserves++;
            sessionStorage.setItem("countryReserves"+indexArray[i], _countryReserves);
            document.getElementById("label" + indexArray[i]).innerHTML = _countryReserves;
        }
        else
            x++;
    }
    sessionStorage.setItem("playerReserves"+sessionStorage.turnIndex, _playerReserves);
    sessionStorage.withinContinent = "false";
}
function computerReserves()
{
    var con = whichContinents();
    if (con) // player has at least one region 
    {
        var picked = pickContinent();
        for (var i=0; i<con.length; i++)
        {
            for (var j=0; j<picked.length; j++) // take out regions that player owns
            {
                if (picked[j] === con[i])
                {
                    picked.splice(j, 1);
                    break;
                }
            }
        }
        var importantTer = [];
        for (var i=0; i<con.length; i++) 
    //add all territories with enemies in the regions players owns to an array
        {
           var E = findEnemiesByContinent(con[i]);
           for (var j=0; j<E.length; j++)
           {
               if (E[j].enemies > 0)
                importantTer.push(E[j].index);
           }
        }
        var _playerReserves = Number(sessionStorage.getItem("playerReserves"+sessionStorage.turnIndex));
        distributeTroopsByIndex(importantTer, 2); //put troops on all the territories in the array
        importantTer = [];
        for (var i=0; _playerReserves > 0; i++) 
        // put troops on the territories in the other regions; if any left, put them everywhere
        {
            if (i >= picked.length)
            {
                distributeTroopsByIndex(myCountriesWithEnemies(),(i-picked.length+3));
            }
           var E = findEnemiesByContinent(picked[i]);
           for (var j=0; j<E.length; j++)
           {
               if (E[j].enemies > 0)
                importantTer.push(E[j].index);
           }
           distributeTroopsByIndex(importantTer, 2);
           _playerReserves = Number(sessionStorage.getItem("playerReserves"+sessionStorage.turnIndex));
           
        }
    }
    else
    {
        var output = pickContinent();
        for (var i=0; i<output.length; i++)
        {
            if (!checkIfContinentIsSufficiant(output[i]))
            {
                distributeComputerTroops(output[i]);
            }
        }    
    }
}
function computerPassTroops()
{
    if (settings.passing !== "one")
    {
        var times;
        if (settings.passing === "oneAnywhere")
            times = 1;
        else
            times = 3;
            
        for (var i=0; i<times; i++)
        {
            var thing = numOfEnemiesAllMyCountries();
            for (var j=thing.length-1; j>=0; j--)
            {
                var reserves = 
                Number(sessionStorage.getItem("countryReserves"+thing[j].index));
                if (thing[j].enemies === 0 && reserves > 1)
                {
                    var passToIndex = findNearestToPass(thing[j].index);
                    var passToReserves = Number(sessionStorage.getItem("countryReserves"+passToIndex));
                    var pass = reserves-1;
                    reserves -= pass;
                    passToReserves += pass;
                    sessionStorage.setItem("countryReserves"+thing[j].index, reserves);
                    document.getElementById("label"+thing[j].index).innerHTML = reserves;
                    sessionStorage.setItem("countryReserves"+passToIndex, passToReserves);
                    document.getElementById("label"+passToIndex).innerHTML = passToReserves;
                    break;
                }
            }
        }
    }
}
function findNearestToPass(index)
{
    var isOdd = false;
    for (var i=1; i<46; i++)
    {
        if (isOdd)
        {
            if (index+i < 90)
            {
                if (FNTP(index+i))
                    return index+i;
            }
            else
            {
                if (FNTP(index+i-90))
                    return index+i-90;
            }
            isOdd=false;
        }
        else
        {
            if (index-i >= 0)
            {
                if (FNTP(index-i))
                    return index-i;
            }
            else
            {
                if (FNTP(index-i+90))
                    return index-i+90;
            }
            isOdd=true;
            if (i<45)
                i--;
        }
    }
}
function FNTP(index)
{
    var _player = players[sessionStorage.turnIndex].color;
    if (Number(sessionStorage.getItem("countryOwners"+(index))) === _player)
    {
        var x=0;
        for (var j = 0; j<countryInfo[index].borders.length; j++)
        {
            if (Number(sessionStorage.getItem("countryOwners"+ 
               countryInfo[index].borders[j])) !== _player)
            {   x++;   }
        }
        if (x > 0)
            return true;
    }
    return false;
}
function computerTurnInCards()
{
    if (sessionStorage.turnInCards === "true")
    {
        var _cards = players[sessionStorage.turnIndex].cards;
        if (_cards.length <3)
            return;
        else
        {
            if (checkSetOfCards(_cards))
            {
                var values = findSetOfCards(_cards);
                var turnIn = [];
                for (var i=0; i<3; i++)
                    turnIn[i] = _cards[values[i]];
                for (var i=0; i<3; i++)
                {
                    players[sessionStorage.turnIndex].cards[values[i]] = "no";
                }
                var end = players[sessionStorage.turnIndex].cards.length;
                for (var i = 0; i<end; i++)
                {
                    if (players[sessionStorage.turnIndex].cards[i]=== "no")
                    {
                        players[sessionStorage.turnIndex].cards.splice(i,1);
                        i--;
                    }
                }
                sessionStorage.setItem("players", JSON.stringify(players));
                turnInCards3(turnIn);
            }
            else
                return;
        }
    }
}
function findSetOfCards(_cards)
{
    var _card_values = [];
    var output;
    var man = 0, horse = 0, cannon = 0;
    for (var i = 0; i<_cards.length; i++)
    {
        _card_values[i] = shuffledCards[_cards[i]].case;
    }
    for (var i = 0; i<_card_values.length; i++)
    {
        if (_card_values[i] === 0)
            man++;
        else if (_card_values[i] === 1)
            horse++;
        else if (_card_values[i] === 2)
            cannon++;
    }
    if (horse >= 3)
        output = pick3ofAKind(_card_values, 1);
    else if (man >= 3)
        output = pick3ofAKind(_card_values, 0);
    else if (cannon >= 3)
        output = pick3ofAKind(_card_values, 2);
    else if ((cannon >= 1 && man >= 1 && horse >= 1))
        output = pick1ofEachKind(_card_values);
    else
        output = pickWildand2Others(_card_values);
    return output;
}
function pickWildand2Others(values)
{
    var output = [];
    var x=0;
    for (var i=0; i<values.length; i++)
    {
        if (values[i] !== 3 && x<2)
        {
            output[x] = i;
            x++;
        }
        else if (values[i] === 3)
            output[2] = i;
    }
    return output;
}
function pick1ofEachKind(values)
{
    var output = [];
    for (var i=0; i<values.length; i++)
    {
        if (values[i] === 0)
            output[0] = i;
        else if (values[i] === 1)
            output[1] = i;
        else if (values[i] === 2)
            output[2] = i;
    }
    return output;
}
function pick3ofAKind(values, kind)
{
    var output = [];
    var x = 0;
    for (var i=0; x<3; i++)
    {
        if (values[i] === kind)
        {
            output[x] = i;
            x++;
        }
    }
    return output;
}
    
                     