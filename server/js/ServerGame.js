

(function() {

    //requires
    require("./ServerNetChannel");
	require("./lib/JsExtensions.js");
	require("./WorldEntityDescription.js");
	require("./ServerObjects.js");

    /**
     * Initialize for Server Game object
     * @returns {ServerGame}
     * @constructor
     */
	ServerGame = function () {
        //init
        DataManager.loadDatabase();
        DataManager.setupNewGame();
        //setup net channel
		this.setupNetChannel();
        //setup game map
        //temp set up map 2
        DataManager.getGameMaps().setup(2);

		return this;
	};

	ServerGame.prototype = {

		// the new Date().getTime();
		_gameClockReal: 0,
		_intervalTargetDelta: NaN,
		_intervalGameTick:null,
		_intervalFramerate: 60,
		// Seconds since start
		_gameClock:0,
		//tick 执行了几次
		_gameTick:0,
		//Net Channel
		_netChannel:null,

        //rpg_contents
        _gameMaps : null,



		setupNetChannel:function () {
            // create a ServerNetChannel object
			this._netChannel = new ServerNetChannel(this);
		},

		startGameClock: function() {
			var self = this;
		    this._gameClockReal = new Date().getTime();
		    this._intervalTargetDelta = Math.floor(1000 / this._intervalFramerate);
		    //start the interval
		    this._intervalGameTick = setInterval(function () {
		        self.tick();
		    }, this._intervalTargetDelta);
		},

		tick: function() {
		    // Store previous time and update current
		    var oldTime = this._gameClockReal;
		    this._gameClockReal = new Date().getTime();

		    // Our clock is zero based, so if for example it says 10,000 - that means the game started 10 seconds ago
		    var delta = this._gameClockReal - oldTime;
		    //console.log(delta);
		    this._gameClock += delta;
		    this._gameTick++;

		    // Framerate Independent Motion -
		    // 1.0 means running at exactly the correct speed, 0.5 means half-framerate. (otherwise faster machines which can update themselves more accurately will have an advantage)
		    var speedFactor = delta /  this._intervalTargetDelta ;
		    if (speedFactor <= 0) speedFactor = 1;
		    //console.log(speedFactor);

            // Allow all _entities to update their position
			var gameMap = DataManager.getGameMaps();
            gameMap.update();

            // Create a new world-entity-description,
            var worldEntityDescription = new WorldEntityDescription(this, gameMap._events);
		    this._netChannel.tick(this._gameClock,worldEntityDescription);


            // if (this._gameClock > this._gameDuration) {
            //     //this.shouldEndGame();
            // }

		},

        //assesors
        getGameTick:function () {
		    return this._gameTick;
        },

		//protocols
        shouldUpdatePlayer: function (clientID, data) {

        },
        shouldAddPlayer: function (clientID, data) {

        },
        shouldRemovePlayer: function (clientID) {

        },
        getNextEntityID: function () {

        },
        getGameClock: function () {
        	return this._gameClock;
        },
        log: function () {

        }




	};


    /**
     * Construct an entity description for this object, it is essentually a CSV so you have to know how to read it on the receiving end
     * @param wantsFullUpdate    If true, certain things that are only sent when changed are always sent
     */
    Game_CharacterBase.prototype.constructEntityDescription = function (gameTick, wantsFullUpdate) {
        // Note: "~~" is just a way to round the value without the Math.round function call
        //var returnString = this._mapId;//this.entityid;
        //returnString += "," + this._eventId;
        var returnString = this._realX;
        returnString += "," + this._realY;

        return returnString;
    };
    Game_Event.prototype.constructEntityDescription = function (gameTick, wantsFullUpdate) {
        var returnString = Game_CharacterBase.prototype.constructEntityDescription.call(this,gameTick, wantsFullUpdate);
        returnString += "," + this._eventId;
        return returnString;
    };

//---------------------------------The End--------------------------------------------------------
})();