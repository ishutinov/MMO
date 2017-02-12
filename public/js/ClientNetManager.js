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
const intervalTargetDelta = Math.floor(1000.0 / 60.0); // 16

ClientNetMannager = function() {
    this.setupNetChannel();
    return this;
};

ClientNetMannager.prototype = {

	_netChannel:null,
    _connected:false,

    _gameClock : 0,
    _gameTick : 0,

	//----------game private methods---------
	setupNetChannel:function() {
		this._netChannel = new ClientNetChannel(this);
	}
	,
    getGameTick : function () {
    	return this._gameTick;
    }
    ,
    setGameClock : function (time) {
    	this._gameClock = time;
    }
    ,
    getLatency: function(){
    	return this._netChannel.getLatency();
    }
    ,
    isReady: function () {
        return this._connected;
    }
    ,
    tick:function () {
        this._gameTick++;
        this._gameClock += intervalTargetDelta;
        //console.log(this._gameTick+++" "+this._gameClock);


    }
    ,
    renderAtTime : function(renderTime){
        if (!$gameMap) return;

        var cmdBuffer = this._netChannel._incomingWorldUpdateBuffer,
            len = cmdBuffer.length;

        // Need atleast 2 updates to render between
        if (len < 2) return;
        var newPosition = new Point(0, 0);

        // if the distance between prev and next is too great - don't interpolate
        // var maxInterpolationDistance = 150,
        //     maxInterpSQ = maxInterpolationDistance * maxInterpolationDistance;

        // Store the next world-entity-description before and after the desired render time
        var nextWED = null,
            previousWED = null;

        // Loop through the points, until we find the first one that has a timeValue which is greater than our renderTime
        // Knowing that then we know that the combined with the one before it - that passed our just check - we know we want to render ourselves somehwere between these two points
        var i = 0;
        //var forceUpdate = false;
        while (++i < len) {
            var currentWED = cmdBuffer[i];
            // We fall between this "currentWorldEntityDescription", and the last one we just checked
            if (currentWED.gameClock >= renderTime) {
                previousWED = cmdBuffer[i - 1];
                nextWED = currentWED;

                this.locateUpdateFailedCount = 0;
                break;
            }

            //Have no found a matching update for a while - the client is way behind the server, set our time to the time of the last udpate we received
            // if(i === len -1) {
            //     if(++this.locateUpdateFailedCount === 3) {
            //         this._gameClock = currentWED.gameClock;
            //         this._gameTick = currentWED.gameTick;
            //         previousWED = cmdBuffer[i-1];
            //         nextWED = currentWED;
            //     }
            // }
        }

        // Could not find two points to render between
        if (nextWED == null || previousWED == null) {
            console.log("GIVE UP")
            return false;
        }

        /**
         * More info: http://www.learningiphone.com/2010/09/consicely-animate-an-object-along-a-path-sensitive-to-time/
         * Find T in the time value between the points:
         *
         * durationBetweenPoints: Amount of time between the timestamp in both points
         * offset: Figure out what our time would be if we pretended the previousBeforeTime.time was 0.00 by subtracting it from us
         * t: Now that we have a zero based offsetTime, and a maximum time that is also zero based (durationBetweenPoints)
         * we can easily figure out what offsetTime / duration.
         *
         * Example values: timeValue = 5.0f, nextPointTime = 10.0f, lastPointTime = 4.0f
         * result:
         * duration = 6.0f
         * offsetTime = 1.0f
         * t = 0.16
         */
        //var durationBetweenPoints = (nextWED.gameClock - previousWED.gameClock);
        var offsetTime = -renderTime + previousWED.gameClock;
        var activeEntities = {};

        //console.log(durationBetweenPoints);

        // T is where we fall between, as a function of these two points
        var t = offsetTime / (nextWED.gameClock - previousWED.gameClock);
        if (t > 1.0)  t = 1.0;
        else if (t < 0) t = 0.0;
        //t = 0;
        //console.log(-renderTime + previousWED.gameClock);
        //return;

        // Note: We want to render at time "B", so grab the position at time "A" (previous), and time "C"(next)
        var entityPositionPast = new Point(0, 0);
        var entityPositionFuture = new Point(0, 0);

        // Update players
        nextWED.forEach(function (key, entityDesc) {
            // Catch garbage values
            var entityid = entityDesc._eventId;
            var event = $gameMap._events[entityid];


            // We don't have this entity - create it!
            if (!event) {
                //this.createEntityFromDesc(entityDesc);

            }
            else {
                // We already have this entity - update it
                var previousEntityDescription = previousWED.objectForKey(entityid);

                // Could not find info for this entity in previous description
                // This can happen if this is this entities first frame in the game
                // Store past and future positions to compare
                entityPositionPast.set(previousEntityDescription._realX, previousEntityDescription._realY);

                entityPositionFuture.set(entityDesc._realX, entityDesc._realY);

                // if the distance between prev and next is too great - don't interpolate
                // if (entityPositionPast.getDistanceSquared(entityPositionFuture) > maxInterpSQ) {
                //     t = 1;
                // }

                // Interpolate the objects position by multiplying the Delta times T, and adding the previous position
                newPosition.x = ( (entityPositionFuture.x - entityPositionPast.x) * t ) + entityPositionPast.x;
                newPosition.y = ( (entityPositionFuture.y - entityPositionPast.y) * t ) + entityPositionPast.y;


            }
            //console.log(entityPositionFuture.x - entityPositionPast.x);
            // Update the entity with the new information, and insert it into the activeEntities array
            if (event){
            event._realX = newPosition.x;
            event._realY = newPosition.y;
            event._direction = entityDesc._direction;
            event._pattern = entityDesc._pattern;
            }

            activeEntities[entityid] = true;

        }, this);


        // Destroy removed entities, every N frames
        // if (this.gameTick % RealtimeMultiplayerGame.Constants.CLIENT_SETTING.EXPIRED_ENTITY_CHECK_RATE === 0)
        //     this.fieldController.removeExpiredEntities(activeEntities);


    }
    ,
	//----------protocols methods--------
    netChannelDidConnect:function(messageData) {
    	console.log("Client Game: Joining Game , id : "+this._netChannel.getClientid());

    	this.setGameClock(messageData.payload._gameClock);
    	console.log("*******************"+messageData.payload._gameClock+"*******************");
    	this._connected = true;
    }
    ,
    netChannelDidDisconnect:function() {
    	console.log("Disconnected from the server");
    	//alert("hehe");
    }
    ,
    getGameClock : function () {
    	return this._gameClock;
    }
    ,
    parseEntityDescriptionArray: function (entityDescAsArray) {
        var entityDescription = {};

        entityDescription._realX = entityDescAsArray[0];
        entityDescription._realY = entityDescAsArray[1];
        entityDescription._eventId = +entityDescAsArray[2];
        entityDescription._direction = entityDescAsArray[3];
        entityDescription._pattern = +entityDescAsArray[3];

        return entityDescription;
    }
    ,
    log:function (data) {
    	console.log(data);
    }

};

//-------------------------------------------------------------------
//
//                    Redefine game Clock
//
//-------------------------------------------------------------------



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
//this is equivalent to tick
SceneManager.updateMain = function() {

    var newTime = new Date().getTime();
    var delta = (newTime - this._currentTime);
    this._currentTime = newTime;


    //封顶
    if (delta > intervalTargetDelta) delta = intervalTargetDelta;

    this._accumulator += delta;
    //------------- Client Tick -------------------------------
    while (this._accumulator >= intervalTargetDelta) {
        this.updateInputData(); // While the frame accumulator is greater than the logic update delta, we keep updating the game's logic and catching input
        this.changeScene();
        this.updateScene();
        $clientMannager.tick(); // this is basically updating net scene
        this._accumulator -= intervalTargetDelta;


    }
    //-------------------------------------------------------
    $clientMannager.renderAtTime($clientMannager._gameClock - 75);
    //console.log($gameMap && $gameMap._events[1] && $gameMap._events[1]._realX);
    //render at different frame
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
    this.updatePattern();
};
//-------------------------------------The End ----------------------------------------------------------
