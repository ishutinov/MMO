/**
 * Created by lenovo on 2017/2/8.
 */
(function () {


    Client = function (aConnection, aClientid) {
        this.clientid = aClientid;
        this.connection = aConnection;
        if (!this.connection.id) { // No sessionId variable means we're not using socket.io - just set that property to use our clientid
            this.connection.id = aClientid;
        }
        this.stagnantEntities = new SortedLookupTable();
        return this;

    };

    Client.prototype = {
        connection: null,				// SocketIO connection for this specific client
        clientid: -1,				// UUID for this client
        // Configuration
        cl_updateRate: Math.round(1000 / 30),		// How often we can receive messages per sec
        outgoingMessageBuffer: [],				// Store array of incoming messages, slots are resused
        _outgoingSequenceNumber: 0,                // Number of total outgoing messages received
        incomingMessageBuffer: [],              	// Store array of incoming messages, slots are resused
        incomingSequenceNumber: 0,                // Number of total incoming messages received
        entityDescriptionBuffer: [],				// Store WorldEntityDescriptions before ready to send

        // Used to track if we can send a new message to this user
        lastSentMessageTime: -1,
        lastReceivedMessageTime: -1,

        // Entries that have not changed since the last frame
        stagnantEntities: null,

        /**
            
        */
        onMessage: function (messageData) {

            var messageIndex = this.incomingSequenceNumber & this.cl_updateRate;
			this.incomingMessageBuffer[messageIndex] = messageData;
            this.incomingSequenceNumber++;
        },
        /**
            release memory
        */
        dealloc: function () {
            this.outgoingMessageBuffer = null;
            this.incomingMessageBuffer = null;
            this.entityDescriptionBuffer = null;
            this.stagnantEntities.dealloc();
            this.stagnantEntities = null;
            this.connection.removeAllListeners();
            this.connection = null;
        },

        /**
         * Compares the worldDescription to the last one we sent - removes unchanged values
         * @param worldDescription A description of all the entities currently in the world
         * @param gameClock           The current (zero-based) game clock
         */
        compressDeltaAndQueueMessage: function (worldDescription, gameClock) {
            debugger;
            var allEntities = worldDescription.entities,
                len = allEntities.length;

            var resultDescStr = '';
            while (len--) {
                var anEntityDescStr = allEntities[len],
                    anEntityDesc = anEntityDescStr.split(','),
                    entityid = +anEntityDesc[0],
                    clientid = +anEntityDesc[1];


                var hasNewData = true;
                if (clientid == RealtimeMultiplayerGame.Constants.SERVER_SETTING.CLIENT_ID) {
                    var previouslySentEntityDescription = this.stagnantEntities.objectForKey(entityid);
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
            entityDescriptionObject.entities = resultDescStr;
            entityDescriptionObject.gameClock = worldDescription.gameClock;
            entityDescriptionObject.gameTick = worldDescription.gameTick;

            this.entityDescriptionBuffer.push(entityDescriptionObject);
        },

        /**
            
        */
        sendQueuedCommands: function (gameClock) {
            var messageContent = {
                gameClock: gameClock,
                id: this.clientid,
                seq: this.outgoingSequenceNumber,
                data: this.entityDescriptionBuffer
            };
            var anEncodedMessage = messageContent;	// Encode?
            //send
            this.sendMessage(anEncodedMessage, gameClock);
            //clear
            this.entityDescriptionBuffer = [];
        },
        /**
            
        */
        sendMessage: function (anEncodedMessage, gameClock) {
            this.lastSentMessageTime = gameClock;
            // Send and increment our message count
            this.connection.emit('message',anEncodedMessage);
            this.outgoingSequenceNumber++;
        },

///// ACCESSORS
        /**
         * Returns true if its ok to send this client a new message
         * @param {Number} gameClock
         */
        canSendMessage: function (gameClock) {
            return (gameClock - this.lastSentMessageTime) > this.cl_updateRate;
        },

        /**
         * Returns the sessionId as created by Socket.io for this client
         * @return {String} A hash representing the session id
         */
        getSessionId: function () {
            return this.connection.id;
        },

        /**
         * UUID given to us by ServerNetChannel
         * This is used instead of sessionid since we send this around a lot and sessionid is a 12 digit string
         */
        getClientid: function () {
            return this.clientid;
        },

        getConnection: function () {
            return this.connection;
        }

    };


    return Client;
})();