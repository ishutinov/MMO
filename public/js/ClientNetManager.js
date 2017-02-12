//=============================================================================
// rpg_managers.js v1.3.4
//=============================================================================

//-----------------------------------------------------------------------------
// ClientNetMannager
//
// The static class that manages the database and game objects.
//-----------------------------------------------------------------------------
var ClientAlias = {};
var $clientMannager = null;

ClientNetMannager = function() {
    this.setupNetChannel();
    return this;
};

ClientNetMannager.prototype = {

	_netChannel:null,
    _connected:false,

	//----------game private methods---------
	setupNetChannel:function() {
		this._netChannel = new ClientNetChannel(this);
	},

    getGameTick : function () {
    	return SceneManager.getGameTick();
    },

    setGameClock : function (time) {
    	SceneManager._gameClock = time;
    },

    getLatency: function(){
    	return this._netChannel.getLatency();
    },

    isReady: function () {
        return this._connected;
    },

    parseEntityDescriptionArray: function (entityDescAsArray) {
        var entityDescription = {};

        entityDescription._realX = entityDescAsArray[0];
        entityDescription._realY = entityDescAsArray[1];
        entityDescription._eventId = +entityDescAsArray[2];
        return entityDescription;
    },

	//----------protocols methods--------
    netChannelDidConnect:function(messageData) {
    	console.log("Client Game: Joining Game , id : "+this._netChannel.getClientid());
    	this.setGameClock(messageData.payload._gameClock);
    	this._connected = true;
    },
    netChannelDidDisconnect:function() {
    	console.log("Disconnected from the server");
    	//alert("hehe");
    },
    getGameClock : function () {
    	return SceneManager.getGameClock();
    },
    log:function (data) {
    	console.log(data);
    }

};

//-------------------------------------------------------------------
//
//                    Redefine game Clock
//
//-------------------------------------------------------------------
//_gameClock is the clock time since the game starts
SceneManager._gameClock = 0;
SceneManager._gameTick = 0;

SceneManager.getGameClock = function () {
	return this._gameClock;
};
SceneManager.getGameTick = function () {
	return this._gameTick;
};

SceneManager._intervalTargetDelta = Math.floor(1000.0 / 60.0);
SceneManager._currentTime = new Date().getTime();
SceneManager._accumulator = 0.0;


SceneManager.update = function() {
    try {
        this.tickStart();
        // this.updateInputData(); REMOVED - We need to fetch input on scene update instead, in the new rewritten updateMain()
        this.updateMain();
        this.tickEnd();
    } catch (e) {
        this.catchException(e);
    }
};

SceneManager.updateMain = function() {

    var newTime = new Date().getTime();
    var delta = (newTime - this._currentTime);
    this._currentTime = newTime;

    //封顶
    if (delta > 16) delta = 16;

    this._accumulator += delta;
    while (this._accumulator >= this._intervalTargetDelta) {
        this.updateInputData(); // While the frame accumulator is greater than the logic update delta, we keep updating the game's logic and catching input
        this.changeScene();
        this.updateScene();
        this._gameTick++;
        this._accumulator -= this._intervalTargetDelta;
        this._gameClock += this._intervalTargetDelta;

    }
    this.renderScene();
    this.requestUpdate();
};

/**
 * When the Boot scene (the very first scene when game starts)
 * try to connect the Server
 * @type {*}
 */
ClientAlias.Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function() {
    //console.log("1");
    if (ClientAlias.Scene_Boot_isReady.call(this)){
        return $clientMannager.isReady();
    }else{
        return false;
    }

};
ClientAlias.Scene_Boot_create = Scene_Boot.prototype.create;
Scene_Boot.prototype.create = function() {
    ClientAlias.Scene_Boot_create.call(this);
    $clientMannager = new ClientNetMannager();
};




Game_Event.prototype.update = function() {

};
//-------------------------------------The End ----------------------------------------------------------
