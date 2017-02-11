

(function() {

    //requires
    require("./ServerNetChannel");
	require("./lib/JsExtensions.js");
	require("./worldEntityDescription.js");
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

			this._netChannel = new ServerNetChannel(this);
		},

		startGameClock: function() {
			var self = this;
		    this._gameClockReal = new Date().getTime();
		    this._intervalTargetDelta = Math.floor(1000 / this.intervalFramerate);
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
		    var speedFactor = delta / ( this._intervalTargetDelta );
		    if (speedFactor <= 0) speedFactor = 1;
		    

		    //temp world description
		    var worldEntityDescription = {
		        gameClock:this._gameClock,
		        gameTick:this._gameTick
		    };


            // Allow all entities to update their position
            //$gameMap.update();
            //console.log($gameMap._events[1]._realX+", "+$gameMap._events[1]._realY);

            // Create a new world-entity-description,
            var worldEntityDescription = new WorldEntityDescription(this, this.getEntities());

		    //channel update
		    this._netChannel.tick(this._gameClock,worldEntityDescription);

            if (this._gameClock > this._gameDuration) {
                //this.shouldEndGame();
            }

		},
		//TEMP TEST
		getEntities: function () {

            return [];

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

//---------------------------------The End--------------------------------------------------------
})();