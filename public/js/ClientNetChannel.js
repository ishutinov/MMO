(function () {


    const BUFFER_MASK = 64;

    ClientNetChannel = function (aDelegate) {
        this.setDelegate(aDelegate);
        this.setupSocketIO();

    };

    ClientNetChannel.prototype = {
        _delegate: null,				// Object informed when ClientNetChannel does interesting stuff
        _socketio: null,				// Reference to singluar Socket.IO instance
        _clientid: null,				// A client id is set by the server on first connect
        // Settings
        _cl_updateRate:33,
        // _connection info
        _latency: 1000,				// Current _latency time from server
        _lastSentTime: -1,				// Time of last sent message
        _lastRecievedTime: -1,				// Time of last recieved message
        // Data
        _messageBuffer: [],				// Store last N messages to be sent
        _outgoingSequenceNumber: 0,
        _incomingWorldUpdateBuffer: [],				// Store last N received WorldDescriptions
        _reliableBuffer: null,				// We sent a 'reliable' message and are waiting for acknowledgement that it was sent

        setupSocketIO: function () {
            this._socketio = io.connect("http://localhost:6666",{transports: ['websocket', 'xhr-polling', 'jsonp-polling'], reconnect: false, rememberTransport: false});
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

        onSocketConnect: function () {
            console.log("(ClientNetChannel):onSocketConnect", arguments, this._socketio);
        },

        /**
            aNetChannelMessage 中的数据是： 服务器的游戏时钟
        */
        onSocketDidAcceptConnection: function (aNetChannelMessage) {
            //设置自己的Client ID，同时通知游戏服务器 运行 log 函数
            this._clientid = aNetChannelMessage.id;
            this._delegate.log("(ClientNetChannel)::ClientID - " + this._clientid);
            //通知游戏服务器 运行 netChannelDidConnect 函数
            this._delegate.netChannelDidConnect(aNetChannelMessage);
        },

        onSocketDisconnect: function () {
            //通知游戏服务器 运行 netChannelDidDisconnect 函数
            this._delegate.netChannelDidDisconnect();
            this._connection = null;
            this._socketio = null;
            console.log("(ClientNetChannel)::onSocketDisconnect", arguments);
        },

        onSocketMessage: function (aNetChannelMessage) {

            // aNetChannelMessage.data.forEach(function (messageContent) {
            //     console.log(messageContent._gameClock+" ("+messageContent._gameTick+"): "+messageContent._entities);
            // });
            //console.log(aNetChannelMessage.data);
            //console.log(this._latency);

            this._lastRecievedTime = this._delegate.getGameClock();
            this.adjustRate(aNetChannelMessage);

            //console.log(this._incomingWorldUpdateBuffer);

            // if (aNetChannelMessage.id == this._clientid) // We sent this, clear our reliable buffer que
            // {
            //
            //     //I got it!
            //     var messageIndex = aNetChannelMessage.seq & BUFFER_MASK;
            //     var message = this._messageBuffer[messageIndex];
            //
            //     // Free up reliable buffer to allow for new message to be sent
            //     if (this._reliableBuffer === message) {
            //         this._reliableBuffer = null;
            //     }
            //
            //     // Remove from memory
            //     this._messageBuffer[messageIndex] = null;
            //     delete message;
            //
            //     return;
            // }

            this.onServerWorldUpdate(aNetChannelMessage);

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
            
            aMessageInstance.messageTime = this._delegate.getGameClock(); // Store to determine _latency
            
            this._lastSentTime = this._delegate.getGameClock();
            
            if (aMessageInstance.isReliable) {
                this._reliableBuffer = aMessageInstance; // Block new connections
            }
            
            this._socketio.emit('message',aMessageInstance);
            

        },

        addMessageToQueue: function (isReliable, payload) {
            // Create a NetChannelMessage
            var message = new RealtimeMultiplayerGame.model.NetChannelMessage(this._outgoingSequenceNumber, this._clientid, isReliable, payload);

            // Add to array the queue using bitmask to wrap values
            this._messageBuffer[ this._outgoingSequenceNumber & BUFFER_MASK ] = message;

            if (!isReliable) {
                this._nextUnreliable = message;
            }

            ++this._outgoingSequenceNumber;

        },

        /**
         *
         * @param aNetChannelMessage
         */
        onServerWorldUpdate: function (aNetChannelMessage) {
            var len = aNetChannelMessage.data.length;
            var i = -1;

            // Store all world updates contained in the message.
            while (++i < len) // Want to parse through them in correct order, so no fancy --len
            {
                var singleWorldUpdate = aNetChannelMessage.data[i];
                //this is a stored-look-up date
                var worldEntityDescription = this.createWorldEntityDescriptionFromString(singleWorldUpdate);

                // Add it to the incommingCmdBuffer and drop oldest element
                this._incomingWorldUpdateBuffer.push(worldEntityDescription);
                if (this._incomingWorldUpdateBuffer.length > BUFFER_MASK)
                    this._incomingWorldUpdateBuffer.shift();

            }
        },
        /**
         * Takes a WorldUpdateMessage that contains the information about all the elements inside of a string
         * and creates SortedLookupTable out of it with the entityid's as the keys
         * @param {String} aWorldUpdateMessage
         */
        createWorldEntityDescriptionFromString: function (aWorldUpdateMessage) {
            // Create a new WorldEntityDescription and store the clock and gametick in it
            var worldDescription = new SortedLookupTable();
            worldDescription.gameTick = aWorldUpdateMessage._gameTick;
            worldDescription.gameClock = aWorldUpdateMessage._gameClock;


            var allEntities = aWorldUpdateMessage._entities.split('|'),
                allEntitiesLen = allEntities.length;

            // Loop through each entity
            while (--allEntitiesLen)   // _allEntities[0] is garbage, so by using prefix we avoid it
            {
                // Loop through the string representing the _entities properties
                var entityDescAsArray = allEntities[allEntitiesLen].split(',');
                var entityDescription = this._delegate.parseEntityDescriptionArray(entityDescAsArray);

                // Store the final result using the entityid
                worldDescription.setObjectForKey(entityDescription, entityDescription._eventId);
            }


            return worldDescription;
        },

        /**
         * Adjust the message chokerate based on _latency
         * @param serverMessage
         */
        adjustRate: function (serverMessage) {

            var deltaTime = serverMessage._gameClock - this._delegate.getGameClock();
            this._latency = deltaTime;

            if (this._latency > 100){
                this._delegate.setGameClock(serverMessage._gameClock);
            }


            //console.log(this._latency);
        },

        ///// Memory
        /**
         * Clear memory
         */
        dealloc: function () {
            this._connection.close();
            delete this._connection;
            delete this._messageBuffer;
            delete this._incomingWorldUpdateBuffer;
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
            this._delegate = aDelegate;
        },

        /**
         * Determines if it's ok for the client to send a unreliable new message yet
         */
        canSendMessage: function () {
            var isReady = (this._delegate.getGameClock() > this._lastSentTime + this._cl_updateRate);
            return isReady;
        },
        getClientid: function () {
            return this._clientid
        },
        getIncomingWorldUpdateBuffer: function () {
            return this._incomingWorldUpdateBuffer
        },
        getLatency: function () {
            return this._latency
        },

        ClientNetChannelDelegateProtocol:{
            getGameClock:function () {},
            netChannelDidConnect:function(data) {},
            netChannelDidDisconnect:function() {},
            parseEntityDescriptionArray:function () {},
            log:function (data) {}
        }

    };

//-----------------------------------The End---------------------------------------
})();