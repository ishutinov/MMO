(function () {


    const BUFFER_MASK = 64;

    ClientNetChannel = function (aDelegate) {
        this.setDelegate(aDelegate);
        this.setupSocketIO();
    };

    ClientNetChannel.prototype = {
        _delegate: null,				// Object informed when ClientNetChannel does interesting stuff
        _socketio: null,				// Reference to singluar Socket.IO instance
        clientid: null,				// A client id is set by the server on first connect
        // Settings
        cl_updateRate:33,
        // connection info
        latency: 1000,				// Current latency time from server
        lastSentTime: -1,				// Time of last sent message
        lastRecievedTime: -1,				// Time of last recieved message
        // Data
        messageBuffer: [],				// Store last N messages to be sent
        _outgoingSequenceNumber: 0,
        incomingWorldUpdateBuffer: [],				// Store last N received WorldDescriptions
        reliableBuffer: null,				// We sent a 'reliable' message and are waiting for acknowledgement that it was sent

        setupSocketIO: function () {
            this._socketio = io.connect("http://localhost:6666");
            var self = this;
            this._socketio.on('connect', function(){
                self.onSocketConnect();
            });
            this._socketio.on('message', function (obj) {
                self.onSocketMessage(obj);
            });
            this._socketio.on('server_connected',function (connectMessage) {
                self.onSocketDidAcceptConnection(connectMessage);
            });
            this._socketio.on('disconnect', function () {
                self.onSocketDisconnect();
            });


        },

        ///// SocketIO Callbacks
        onSocketConnect: function () {
            console.log("(ClientNetChannel):onSocketConnect", arguments, this._socketio);
        },

        /**
            aNetChannelMessage 中的数据是： 服务器的游戏时钟
        */
        onSocketDidAcceptConnection: function (aNetChannelMessage) {

            console.log("(ClientNetChannel)::onSocketDidAcceptConnection", aNetChannelMessage);
            //设置自己的Client ID，同时通知游戏服务器 运行 log 函数
            this.clientid = aNetChannelMessage.id;
            this.delegate.log("(ClientNetChannel)::ClientID - " + this.clientid);
            //通知游戏服务器 运行 netChannelDidConnect 函数
            this.delegate.netChannelDidConnect(aNetChannelMessage);

        },

        onSocketDisconnect: function () {
            //通知游戏服务器 运行 netChannelDidDisconnect 函数
            this.delegate.netChannelDidDisconnect();
            this.connection = null;
            this._socketio = null;
            console.log("(ClientNetChannel)::onSocketDisconnect", arguments);
        },

        onSocketMessage: function (aNetChannelMessage) {

            //console.log(aNetChannelMessage.gameClock);
            this.lastReceivedTime = this.delegate.getGameClock();

            this.adjustRate(aNetChannelMessage);

            if (aNetChannelMessage.id == this.clientid) // We sent this, clear our reliable buffer que
            {

                //I got it!
                var messageIndex = aNetChannelMessage.seq & BUFFER_MASK;
                var message = this.messageBuffer[messageIndex];

                // Free up reliable buffer to allow for new message to be sent
                if (this.reliableBuffer === message) {
                    this.reliableBuffer = null;
                }

                // Remove from memory
                this.messageBuffer[messageIndex] = null;
                delete message;

                return;
            }

            //$gamePlayer.locate((i++)%40,22);
            // // Call the mapped function
            // if (this.cmdMap[aNetChannelMessage.cmd])
            //     this.cmdMap[aNetChannelMessage.cmd].call(this, aNetChannelMessage);
            // else
            //console.log("(NetChannel)::onSocketMessage could not map '" + aNetChannelMessage.cmd + "' to function!");
        },

        sendMessage: function (aMessageInstance) {
            if (this._socketio == undefined) {
                console.log("(ClientNetChannel)::sendMessage - _socketio is undefined!");
                return;
            }

            if (!this._socketio.socket.connected) { // Socket.IO is not connectd, probably not ready yet
                return;      //some error here
            }
            
            aMessageInstance.messageTime = this.delegate.getGameClock(); // Store to determine latency
            
            this.lastSentTime = this.delegate.getGameClock();
            
            if (aMessageInstance.isReliable) {
                this.reliableBuffer = aMessageInstance; // Block new connections
            }
            
            this._socketio.emit('message',aMessageInstance);
            

        },

        addMessageToQueue: function (isReliable, payload) {
            // Create a NetChannelMessage
            var message = new RealtimeMultiplayerGame.model.NetChannelMessage(this.outgoingSequenceNumber, this.clientid, isReliable, payload);

            // Add to array the queue using bitmask to wrap values
            this.messageBuffer[ this.outgoingSequenceNumber & BUFFER_MASK ] = message;

            if (!isReliable) {
                this.nextUnreliable = message;
            }

            ++this.outgoingSequenceNumber;

        },

        /**
         * Takes a WorldUpdateMessage that contains the information about all the elements inside of a string
         * and creates SortedLookupTable out of it with the entityid's as the keys
         * @param {String} aWorldUpdateMessage
         */
        createWorldEntityDescriptionFromString: function (aWorldUpdateMessage) {
            // Create a new WorldEntityDescription and store the clock and gametick in it
            var worldDescription = new SortedLookupTable();
            worldDescription.gameTick = aWorldUpdateMessage.gameTick;
            worldDescription.gameClock = aWorldUpdateMessage.gameClock;


            var allEntities = aWorldUpdateMessage.entities.split('|'),
                allEntitiesLen = allEntities.length; //

            // Loop through each entity
            while (--allEntitiesLen)   // allEntities[0] is garbage, so by using prefix we avoid it
            {
                // Loop through the string representing the entities properties
                var entityDescAsArray = allEntities[allEntitiesLen].split(',');
                var entityDescription = this.delegate.parseEntityDescriptionArray(entityDescAsArray);

                // Store the final result using the entityid
                worldDescription.setObjectForKey(entityDescription, entityDescription.entityid);
            }


            return worldDescription;
        },

        /**
         * Adjust the message chokerate based on latency
         * @param serverMessage
         */
        adjustRate: function (serverMessage) {

            var deltaTime = serverMessage.gameClock - this.delegate.getGameClock();
            this.latency = deltaTime;
            //console.log(this.latency);
        },

        ///// Memory
        /**
         * Clear memory
         */
        dealloc: function () {
            this.connection.close();
            delete this.connection;
            delete this.messageBuffer;
            delete this.incomingWorldUpdateBuffer;
        },


        setDelegate: function (aDelegate) {
            var theInterface = this.ClientNetChannelDelegateProtocol;
            for (var member in theInterface) {
                if ((typeof aDelegate[member] != typeof theInterface[member])) {
                    console.error("object failed to implement interface member " + member);
                    return false;
                }
            }

            // Checks passed
            this.delegate = aDelegate;
        },

        /**
         * Determines if it's ok for the client to send a unreliable new message yet
         */
        canSendMessage: function () {
            var isReady = (this.delegate.getGameClock() > this.lastSentTime + this.cl_updateRate);
            return isReady;
        },
        getClientid: function () {
            return this.clientid
        },
        getIncomingWorldUpdateBuffer: function () {
            return this.incomingWorldUpdateBuffer
        },
        getLatency: function () {
            return this.latency
        },

        ClientNetChannelDelegateProtocol:{
            getGameClock:function () {},
            netChannelDidConnect:function(data) {},
            netChannelDidDisconnect:function() {},
            log:function (data) {}
        }

    };


    return ClientNetChannel;

})();