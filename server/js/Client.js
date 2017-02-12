/**
 * Created by lenovo on 2017/2/8.
 */
(function () {


    Client = function (aConnection, aClientid) {
        this._clientid = aClientid;
        this._connection = aConnection;
        if (!this._connection.id) { // No sessionId variable means we're not using socket.io - just set that property to use our _clientid
            this._connection.id = aClientid;
        }
        this._stagnantEntities = new SortedLookupTable();
        return this;

    };

    Client.prototype = {
        _connection: null,				// SocketIO _connection for this specific client
        _clientid: -1,				// UUID for this client
        // Configuration
        _cl_updateRate: Math.round(1000 / 30),		// How often we can receive messages per sec
        _outgoingMessageBuffer: [],				// Store array of incoming messages, slots are resused
        _outgoingSequenceNumber: 0,                // Number of total outgoing messages received
        _incomingMessageBuffer: [],              	// Store array of incoming messages, slots are resused
        _incomingSequenceNumber: 0,                // Number of total incoming messages received
        _entityDescriptionBuffer: [],				// Store WorldEntityDescriptions before ready to send

        // Used to track if we can send a new message to this user
        _lastSentMessageTime: -1,
        _lastReceivedMessageTime: -1,

        // Entries that have not changed since the last frame
        _stagnantEntities: null,

        /**
            
        */
        onMessage: function (messageData) {

            var messageIndex = this._incomingSequenceNumber & this._cl_updateRate;
			this._incomingMessageBuffer[messageIndex] = messageData;
            this._incomingSequenceNumber++;
        },
        /**
            release memory
        */
        dealloc: function () {
            this._outgoingMessageBuffer = null;
            this._incomingMessageBuffer = null;
            this._entityDescriptionBuffer = null;
            this._stagnantEntities.dealloc();
            this._stagnantEntities = null;
            this._connection.removeAllListeners();
            this._connection = null;
        },

        /**
         * Compares the worldDescription to the last one we sent - removes unchanged values
         * @param worldDescription A description of all the _entities currently in the world
         * @param gameClock           The current (zero-based) game clock
         */
        compressDeltaAndQueueMessage: function (worldDescription, gameClock) {
            debugger;
            var allEntities = worldDescription._entities,
                len = allEntities.length;

            var resultDescStr = '';
            while (len--) {
                if (!allEntities[len]) continue;

                var anEntityDescStr = allEntities[len],
                    anEntityDesc = anEntityDescStr.split(','),
                    entityid = +anEntityDesc[0],
                    clientid = +anEntityDesc[1];


                var hasNewData = true;
                if (clientid == RealtimeMultiplayerGame.Constants.SERVER_SETTING.CLIENT_ID) {
                    var previouslySentEntityDescription = this._stagnantEntities.objectForKey(entityid);
                    if (previouslySentEntityDescription) {
                        // hasNewData = false;
                    }
                }

                // Store for next time
                //this.stagnentEntities.setObjectForKey(anEntityDesc, entityid);

                // Only send if it has new data
                if (hasNewData) {
                    resultDescStr += "|" + anEntityDescStr;
                }
            }
            var entityDescriptionObject = {};
            entityDescriptionObject._entities = resultDescStr;
            entityDescriptionObject._gameClock = worldDescription._gameClock;
            entityDescriptionObject._gameTick = worldDescription._gameTick;

            this._entityDescriptionBuffer.push(entityDescriptionObject);
        },

        /**
            
        */
        sendQueuedCommands: function (gameClock) {
            var messageContent = {
                _gameClock: gameClock,
                id: this._clientid,
                seq: this._outgoingSequenceNumber,
                data: this._entityDescriptionBuffer
            };
            var anEncodedMessage = messageContent;	// Encode?
            //send
            this.sendMessage(anEncodedMessage, gameClock);
            //clear
            this._entityDescriptionBuffer = [];
        },
        /**
            
        */
        sendMessage: function (anEncodedMessage, gameClock) {
            this._lastSentMessageTime = gameClock;
            // Send and increment our message count
            this._connection.emit('message',anEncodedMessage);
            this._outgoingSequenceNumber++;
        },

///// ACCESSORS
        /**
         * Returns true if its ok to send this client a new message
         * @param {Number} gameClock
         */
        canSendMessage: function (gameClock) {
            return (gameClock - this._lastSentMessageTime) > this._cl_updateRate;
        },

        /**
         * Returns the sessionId as created by Socket.io for this client
         * @return {String} A hash representing the session id
         */
        getSessionId: function () {
            return this._connection.id;
        },

        /**
         * UUID given to us by ServerNetChannel
         * This is used instead of sessionid since we send this around a lot and sessionid is a 12 digit string
         */
        getClientid: function () {
            return this._clientid;
        },

        getConnection: function () {
            return this._connection;
        }

    };


    return Client;
})();