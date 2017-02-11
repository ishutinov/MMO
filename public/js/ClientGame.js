


(function () {
	
	ClientGame = function () {
		this.setupNetChannel();
		return this;
	};

	ClientGame.prototype = {
		
        gameClockReal: 0,											// Actual time via "new Date().getTime();"
        gameClock: 0,											// Seconds since start
        gameTick: 0,		
        
        isRunning: true,
        speedFactor: 1,		
        intervalGameTick: null,											// Setinterval for gametick
        intervalFramerate: 60,											// Try to call our tick function this often, intervalFramerate, is used to determin how often to call settimeout - we can set to lower numbers for slower computers
        intervalTargetDelta: NaN,	// this.targetDelta, milliseconds between frames. Normally it is 16ms or 60FPS. The framerate the game is designed against - used to create framerate independent motion
        gameDuration: Number.MAX_VALUE,								// Gameduration

        netChannel: null,

        setupNetChannel: function () {
        	
        	this.netChannel = new ClientNetChannel(this);
        },


        tick: function () {
        	var oldTime = this.gameClockReal;
        	this.gameClockReal = new Date().getTime();

            var delta = this.gameClockReal - oldTime;
            this.gameClock += delta;
            this.gameTick++;

            this.speedFactor = delta / ( this.intervalTargetDelta );
            if (this.speedFactor <= 0) this.speedFactor = 1;


            this.netChannel.tick();
        },

        netChannelDidConnect: function (messageData) {

            console.log("DemoClientGame: Joining Game");
            //this.joinGame("Player" + this.netChannel.getClientid()); // Automatically join the game with some name

            // Sync time with server
            this.gameClock = messageData.payload.gameClock;
        },

        netChannelDidReceiveMessage: function (messageData) {
            // OVERRIDE
        },

        netChannelDidDisconnect: function () {
            this.isRunning = false;
            //this.stopGameClock();
            console.log("DemoClientGame: netChannelDidDisconnect");
        },

        dealloc: function () {

        },

        log: function () {
            console.log();
        },

        ///// Accessors
        getGameClock: function () {
            return this.gameClock;
        },
        getGameTick: function () {
            return this.gameTick;
        }

	};


})();