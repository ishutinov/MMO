
(function () {
	//-------------------------------------------------------------------
	//                   ClientNetMannager
	//-------------------------------------------------------------------
	function ClientNetMannager() {
	    this.setupNetChannel();
	    return this;
	}

	ClientNetMannager.prototype = {

		_netChannel:null,

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

		//----------protocols methods--------
        netChannelDidConnect:function(messageData) {
        	console.log("Client Game: Joining Game , id : "+this._netChannel.getClientid());
        	this.setGameClock(messageData.payload.gameClock);
        	//console.error(messageData.payload.gameClock);
        	console.log("Game Clock have been set to:"+this.getGameClock());
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
	//                    Game_CharacterBase
	//
	//-------------------------------------------------------------------

    // /**
    //  * Construct an entity description for this object, it is essentually a CSV so you have to know how to read it on the receiving end
    //  * @param wantsFullUpdate    If true, certain things that are only sent when changed are always sent
    //  */
    // Game_CharacterBase.constructEntityDescription = function (gameTick, wantsFullUpdate) {
    //     // Note: "~~" is just a way to round the value without the Math.round function call
    //     var returnString = this._mapId;//this.entityid;
    //     returnString += "," + this._eventId;
    //     returnString += "," + ~~this._realX;
    //     returnString += "," + ~~this._realY;
    //
    //     return returnString;
    // },

	




	//-------------------------------------------------------------------
	// 
	//                    Redefine game Clock
	//
	//-------------------------------------------------------------------
	//gameClock is the clock time since the game starts
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
        //console.log(this._gameClock);
        this.renderScene();
        this.requestUpdate();
    };


//-------------------------------------The End ----------------------------------------------------------
})();