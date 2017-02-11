


(function () {


    WorldEntityDescription = function (aGameInstance, allEntities) {
        this.gameClock = aGameInstance.getGameClock();
        this.gameTick = aGameInstance.getGameTick();
        this.allEntities = allEntities;

        // Ask each entity to create it's EntityDescriptionString
        this.entities = [];

        return this;
    };

    WorldEntityDescription.prototype = {
        entities: null,
        gameClock: 0,
        gameTick: 0,

        /**
         * Ask each entity to create it's entity description
         * Returns a single snapshot of the worlds current state as a '|' delimited string
         * @return {String} A '|' delmited string of the current world state
         */
        getEntityDescriptionAsString: function () {
            var len = this.allEntities.length;
            var fullDescriptionString = '';

            this.allEntities.forEach(function (key, entity) {
                var entityDescriptionString = entity.constructEntityDescription(this.gameTick);
                fullDescriptionString += "|" + entityDescriptionString;
            }, this);

            return fullDescriptionString;
        }
    };

//-------------------------------------The End ----------------------------------------------------------
})();