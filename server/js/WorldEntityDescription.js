


(function () {


    WorldEntityDescription = function (aGameInstance, allEntities) {
        this._gameClock = aGameInstance.getGameClock();
        this._gameTick = aGameInstance.getGameTick();
        this._allEntities = allEntities;

        // Ask each entity to create it's EntityDescriptionString
        this._entities = [];

        return this;
    };

    WorldEntityDescription.prototype = {
        _entities: null,
        _gameClock: 0,
        _gameTick: 0,

        /**
         * Ask each entity to create it's entity description
         * Returns a single snapshot of the worlds current state as a '|' delimited string
         * @return {String} A '|' delmited string of the current world state
         */
        getEntityDescriptionAsString: function () {
            //var len = this._allEntities.length;
            var fullDescriptionString = '';
            //console.log("wait, somebody is calling me");
            this._allEntities.forEach(function (game_character) {
                if (game_character){
                    var entityDescriptionString = game_character.constructEntityDescription(this._gameTick);
                    fullDescriptionString += "|" + entityDescriptionString;
                }
            },this);
            //console.log(fullDescriptionString);
            return fullDescriptionString;
        }
    };

//-------------------------------------The End ----------------------------------------------------------
})();